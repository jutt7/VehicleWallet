import React, { useEffect, useState } from "react";
import { Col, Row, Button, Input, Label, Table  } from "reactstrap";
import { Check, X, LogIn, Edit, Navigation, Trash2 } from "react-feather";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import AddUpdateModal from "./AddUpdateUser";
import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import detailIcon from "@src/assets/images/icons/details.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTranslation } from "react-i18next";
import { getUserData } from "@utils";
import DataTableExportButton from "../../components/TableToExcel";


const CustomLabel = ({ htmlFor }) => {
    return (
      <Label className="form-check-label" htmlFor={htmlFor}>
        <span className="switch-icon-left">
          <Check size={14} />
        </span>
        <span className="switch-icon-right">
          <X size={14} />
        </span>
      </Label>
    );
  };    

function Adminuser() {
    const [sorting_icon, setsorting_icon] = useState();
    const [showAddUpdateModal, setshowAddUpdateModal] = useState(false);
    const [updateModalData, setupdateModalData] = useState(null);
    const [showDeleteModal, setshowDeleteModal] = useState(false);
    const [onSubmit, setonSubmit] = useState("");
    const [data, setdata] = useState([]);
    const [updateIndex, setupdateIndex] = useState("");
    const [deleteMessage, setdeleteMessage] = useState("");
    const [overlay, setoverlay] = useState(false);
    const [groups, setGroups] = useState([])
    const [options, setOptions] = useState([])
    const [searchData, setSearchData] = useState("");
    const [deleteItem, setdeleteItem] = useState("");
    const [deleteIndex, setdeleteIndex] = useState("");
    const [rolesList, setrolesList] = useState([]);




    const [role, setRole] = useState({
        addUser: false,
        updateUser: false,
        deleteUser: false,
        viewUser: false,
      });

    const { t } = useTranslation();

    const setRoles = () => {
        let roles = getUserData().ability;
        // console.log("rolesss", roles);
        let arr = role;
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].subject == "fm.user.add") {
            arr.addUser = true;
          } else if (roles[i].subject == "fm.user.change") {
            arr.updateUser = true;
          } else if (roles[i].subject == "fm.user.remove") {
            arr.deleteUser = true;
          } else if (roles[i].subject == "fm.admin_users") {
            arr.viewUser = true;
          }
        }
        // console.log("arrrrrrrrrrr", arr);
        setRole(arr);
      };
    

    const getData = () => {
        setoverlay(true);
        axios
          .post(
            `${jwtDefaultConfig.adminBaseUrl}/admin-users`
        
          )
          .then((res) => {
            helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
            if (res.status && res.status === 200) {
              setdata(helper.applyCountID(res.data.data.data));
            //   FilterDataForTable(res.data.data.data);
    
            //   setpaginationStates({
            //     activePage: res.data.data.current_page,
            //     itemsCountPerPage: res.data.data.per_page,
            //     totalItemsCount: res.data.data.total,
            //   });
              setoverlay(false);
            } else {
              helper.toastNotification(
                "Unable to process request.",
                "FAILED_MESSAGE"
              );
              setdata([]);
              setoverlay(false);
            }
          })
          .catch((error) => {
            console.log(error, "error");
            setdata([]);
            setoverlay(false);
          });
      };
    const openCreateModal = () => {
        setupdateModalData(null);
        setonSubmit("create");
        setshowAddUpdateModal(true);
      };

      const onOpenUpdateModal = (item, index) => {
        setupdateModalData(item);
        setshowAddUpdateModal(true);
        setupdateIndex(index);
        setonSubmit("update");
      };

      const onCloseAddUpdateModal = () => {
        setshowAddUpdateModal(false);
        setupdateIndex(null);
        setonSubmit(null);
        setupdateModalData(null);
      };  

      const onOpenDeleteModal = (rowData, index) => {
        setdeleteItem(rowData);
        setdeleteIndex(index);
        setonSubmit("delete");
        setdeleteMessage(rowData.status === 1 ? "Deactivate" : "activate");
        setshowDeleteModal(true);
      };
    
      const onCloseDeleteModal = () => {
        setshowDeleteModal(false);
        setdeleteIndex("");
        setdeleteItem("");
        setonSubmit("");
      };
      
  const filterData = (value) => {
    if (value.length >= 3) {
      setSearchData(value);
    } else {
      setSearchData("");
    }
  };
    const sortAscending = (icon, sortType, colsort) => {
        if (
          colsort == "name_ar" ||
          colsort == "name_en" ||
          colsort == "name_ur" ||
          colsort == "address"
        ) {
          setsorting_icon(icon);
          setdata(
            helper.applyCountID(
              data.sort((a, b) =>
                helper.checkinteger(a[colsort]) > helper.checkinteger(b[colsort]) &&
                sortType === "asc"
                  ? 1
                  : -1
              )
            )
          );
        } else if (
          colsort == "deposited_amount" ||
          colsort == "reserved_amount" ||
          colsort == "vat_no"
        ) {
          setsorting_icon(icon);
          setdata(
            helper.applyCountID(
              data.sort((a, b) =>
                a[colsort] > b[colsort] && sortType === "asc" ? 1 : -1
              )
            )
          );
        } else {
          setsorting_icon(icon);
          setdata(
            helper.applyCountID(
              data.sort((a, b) =>
                helper.checkinteger(a[colsort]) > helper.checkinteger(b[colsort]) &&
                sortType === "asc"
                  ? 1
                  : -1
              )
            )
          );
        }
      };

     const admin_group_list = () =>{
       axios.get(`${jwtDefaultConfig.adminBaseUrl}/admin-groups`
       ).then((res)=>{
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
            setGroups(res.data.data)
        }
       })
     } 
      
     const set_group_list_options = () =>{
        let options = []
        groups.map((item)=>{
            options.push(item)
         })

        setOptions(options) 
     }
  

    

      const create = (args) => {
        // console.log("create args", args);
        // return;
        setoverlay(true);
        axios
          .post(`${jwtDefaultConfig.adminBaseUrl}/user/store`, {
            user: {
                first_name: args.first_name,
                last_name: args.last_name,
                password: args.password,
                email: args.email,
                mobile: args.mobile,
                group_id: args.group_id.value,
                designation: args.group_id.label
            },
          })
          .then((res) => {
            helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
            if (res.data.code && res.data.code === 200) {
              setshowAddUpdateModal(false);
              helper.toastNotification(
                "Request has been processed successfuly.",
                "SUCCESS_MESSAGE"
              );
              getData();
            } else {
              setoverlay(false);
              if (res.data.data.email) {
                console.log("res.data.data", res.data.data.email);
                helper.toastNotification(res.data.data.email[0]);
              } else if (res.data.data.mobile) {
                helper.toastNotification(res.data.data.mobile[0]);
              } else {
                helper.toastNotification(
                  "Some thing went wrong.",
                  "FAILED_MESSAGE"
                );
              }
            }
          })
          .catch((error) => {
            setoverlay(false);
            helper.toastNotification(
              "Unable to process request.",
              "FAILED_MESSAGE"
            );
            console.log(error, "errorrrr");
          });
      };
    
     
      const update = (args) => {
        // console.log("update args", args);
        // return;
        setoverlay(true);
        axios
          .post(`${jwtDefaultConfig.adminBaseUrl}/user/update`, {
            user: {
              user_id: updateModalData.user_id,
              gas_station_id: null,
              first_name: args.first_name,
              last_name: args.last_name,
              password: args.password,
              email: args.email,
              mobile: args.mobile,
              group_id: args.group_id.value,
              designation: args.group_id.label
            },
          })
          .then((res) => {
            helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
            if (res.data.code && res.data.code === 200) {
              setshowAddUpdateModal(false);
              helper.toastNotification(
                "Request has been processed successfuly.",
                "SUCCESS_MESSAGE"
              );
              getData();
            } else {
              setoverlay(false);
              if (res.data.data.email) {
                helper.toastNotification(res.data.data.email[0]);
              }
              if (res.data.data.mobile) {
                helper.toastNotification(res.data.data.mobile[0]);
              }
              if (res.data.data.driving_license_number) {
                helper.toastNotification(res.data.data.driving_license_number[0]);
              }
              if (res.data.data.driving_license_number) {
                helper.toastNotification(res.data.data.driving_license_number[0]);
              }
              if (res.data.data.driving_license_number) {
                helper.toastNotification(
                  res.data.data.civil_record_or_resident_permit_number[0]
                );
              }
            }
          })
          .catch((error) => {
            setoverlay(false);
            helper.toastNotification(
              "Unable to process request.",
              "FAILED_MESSAGE"
            );
          });
      };
    


      const remove = () => {
        setoverlay(true);
        axios
          .post(`${jwtDefaultConfig.adminBaseUrl}/user/delete`, {
            user: {
              user_id: deleteItem.user_id,
            },
          })
          .then((res) => {
            helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
            if (res.data.code && res.data.code === 200) {
              setshowDeleteModal(false);
              getData();
              helper.toastNotification(
                "Request has been processed successfuly.",
                "SUCCESS_MESSAGE"
              );
            } else {
              setoverlay(false);
              setshowDeleteModal(false);
              helper.toastNotification(
                "Unable to process request.",
                "FAILED_MESSAGE"
              );
            }
          })
          .catch((error) => {
            setoverlay(false);
            setshowDeleteModal(false);
            helper.toastNotification(
              "Unable to process request.",
              "FAILED_MESSAGE"
            );
          });
      };
    


      useEffect(() => {
        admin_group_list()
        getData()
        setRoles()
      }, []);

      useEffect(()=>{
        set_group_list_options()
      },[groups])
    

      
  const submitAction = (args = "") => {
    if (onSubmit == "create") {
      create(args);
    }
    if (onSubmit == "update") {
      update(args);
    }
    if (onSubmit == "delete") {
      remove();
    }
  };

  return (
    <>
     <ClipLoader
        css={`
          position: fixed;
          top: 40%;
          left: 40%;
          right: 40%;
          bottom: 20%;
          z-index: 999999;
          display: block;
        `}
        size={"200px"}
        this
        also
        works
        color={"#196633"}
        height={100}
        loading={overlay ? true : false}
      />
    <Row>
    <Col lg={12}>
        <Row>
          <Col style={{ display: "flex" }}>
            {role.addUser ? (
              <Button
                color="primary"
                // disabled={enable ? "" : "true"}
                onClick={(e) => openCreateModal()}
              >
                <i className="fas fa-plus"></i> {t("Add User")}
              </Button>
             ) : (
              ""
            )}
            <input
              className="form-control crud-search"
              placeholder={`${t("Search")}...`}
              onChange={(e) => filterData(e.target.value)}
            />
          </Col>

          <Col
            style={{
              display: "flex",
              alignItems: "center",

              justifyContent: "end",
            }}
          >
            {/* <div className={`fleetPaginator`}>
              <Pagination
                // activePage={
                //   paginationStates.activePage
                //     ? parseInt(paginationStates.activePage)
                //     : 1
                // }
                // itemsCountPerPage={
                //   paginationStates.itemsCountPerPage
                //     ? parseInt(paginationStates.itemsCountPerPage)
                //     : 1
                // }
                // totalItemsCount={
                //   paginationStates.totalItemsCount
                //     ? parseInt(paginationStates.totalItemsCount)
                //     : 1
                // }
                // pageRangeDisplayed={5}
                // prevPageText="<"
                // nextPageText=">"
                // onChange={(e) => onCurrPageChange(e)}
                // itemClassFirst={`itemClassFirst`}
                // itemClassPrev={`itemClassPrev`}
                // itemClassLast={`itemClassLast`}
                // disabledClass={`disabledClass`}
                // linkClass={`linkClass`}
              />{" "}
            </div> */}
          </Col>
        </Row>
    
    </Col>
  </Row>
    <Row>
           <div className="table-responsive">
           <table className="table">
               <thead>
               <tr>
              <th className="table-th blackColor" style={{ width: "120px" }}>
                <p>
                  {t("Name")}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col1_asc", "asc", "name_en")
                      }
                      className={
                        sorting_icon == "Col1_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col1_des", "des", "name_en")
                      }
                      className={
                        sorting_icon == "Col1_des"
                          ? "fas fa-long-arrow-alt-down sort-color"
                          : "fas fa-long-arrow-alt-down"
                      }
                    ></i>
                  </span>
                </p>
              </th>

              <th className="table-th blackColor">
                <p>
                  {t("Mobile")}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col5_asc", "asc", "deposited_amount")
                      }
                      className={
                        sorting_icon == "Col5_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col5_des", "des", "deposited_amount")
                      }
                      className={
                        sorting_icon == "Col5_des"
                          ? "fas fa-long-arrow-alt-down sort-color"
                          : "fas fa-long-arrow-alt-down"
                      }
                    ></i>
                  </span>
                </p>
              </th>

              <th className="table-th blackColor">
                <p>
                  {t("Role")}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col6_asc", "asc", "reserved_amount")
                      }
                      className={
                        sorting_icon == "Col6_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col6_des", "des", "reserved_amount")
                      }
                      className={
                        sorting_icon == "Col6_des"
                          ? "fas fa-long-arrow-alt-down sort-color"
                          : "fas fa-long-arrow-alt-down"
                      }
                    ></i>
                  </span>
                </p>
              </th>

              <th className="table-th blackColor">
                <p>
                  {t("Created at")}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col8_asc", "asc", "created_at")
                      }
                      className={
                        sorting_icon == "Col8_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col8_des", "des", "created_at")
                      }
                      className={
                        sorting_icon == "Col8_des"
                          ? "fas fa-long-arrow-alt-down sort-color"
                          : "fas fa-long-arrow-alt-down"
                      }
                    ></i>
                  </span>
                </p>
              </th>

              <th className="table-th blackColor">
                <p>{t("Status")}</p>
              </th>

              <th className="table-th blackColor">
                <p>{t("Action")}</p>
              </th>
            </tr>
               </thead>
               <tbody>
                {data.length > 0 ? (
                  data &&
                  data
                    .filter((item) => {
                      if (searchData == "") {
                        return item;
                      } else if (
                        item.first_name ? item.first_name 
                          .toLowerCase()
                          .includes(searchData.toLowerCase()) : '' ||
                        item.mobile
                          .toLowerCase()
                          .includes(searchData.toLowerCase())
                      ) {
                        return item;
                      }
                    })
                    .map((item, index) => (
                      <tr
                        key={index}
                        className={
                          helper.applyRowClass(item) === true
                            ? `evenRowColor`
                            : "oddRowColor"
                        }
                      >
                        <td>
                          <div class="d-flex justify-content-left align-items-center">
                            <div class="avatar me-1 bg-light-success">
                              <span class="avatar-content">
                                {helper.FirstWordFirstChar(item.first_name)}
                                {helper.FirstWordFirstChar(item.last_name)}
                              </span>
                            </div>
                            <div class="d-flex flex-column">
                              <a class="user_name text-truncate text-body">
                                <span class="fw-bolder">
                                  {helper.shortTextWithDots(
                                    `${item.first_name} ${
                                      item.last_name ? item.last_name : ""
                                    }`,
                                    20
                                  )}
                                </span>
                              </a>
                              <small class="text-truncate text-muted mb-0">
                                {item.email}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>{item.mobile}</td>
                        <td>
                          {helper.isObject(item.group)
                            ? item.group.group_name_en
                            : ""}
                        </td>
                        <td>{helper.humanReadableDate(item.created_at)}</td>
                        <td>
                          <div className="form-switch form-check-success">
                           {role.deleteUser ? 
                           <>
                            <Input
                              type="switch"
                              // defaultChecked={item.status === 1 ? true : false}
                              checked={item.status === 1 ? true : false}
                              id={`icon-success${index}`}
                              name={`icon-success${index}`}
                              onChange={(e) => onOpenDeleteModal(item, index)}
                              data-tip="Update Status"
                            />
                           
                            <CustomLabel htmlFor={`icon-success${index}`} />
                            </>
                            : ''}
                            
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex" }}>
                            {role.updateUser ? 
                            <Edit
                              data-tip="Update"
                              size={15}
                              onClick={(e) => onOpenUpdateModal(item, index)}
                              style={{ marginTop: "4px", marginRight: "5px" }}
                            />
                  : ''}
                          </div>
                          <ReactTooltip />
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={6}>No Records found</td>
                  </tr>
                )}
              </tbody>
               </table>

             </div>
        <AddUpdateModal
          show={showAddUpdateModal}
          updateModalData={updateModalData}
          onHide={onCloseAddUpdateModal}
          submitAction={submitAction}
          groups={groups}
          options={options}
          disableBtn={overlay}

        />
          <DeleteModal
              show={showDeleteModal}
              confirmationText={`Are you sure to ${deleteMessage} a user`}
              confirmationHeading={`${helper.uppercaseFirst(
                deleteMessage
              )} a user`}
              onHide={onCloseDeleteModal}
              submitAction={submitAction}
              disableBtn={overlay}
            />

    </Row>
    </>
  )
}

export default Adminuser