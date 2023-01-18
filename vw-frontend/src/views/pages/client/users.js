import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
import { Check, X, Edit } from "react-feather";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import AddUpdateModal from "./AddUpdateUser";
import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";

import { useTranslation } from "react-i18next";
import { getUserData } from "@utils";
import DataTableExportButton from "../../components/TableToExcel";

export default function User(props) {
  const [clientShow, setclientShow] = useState(true);
  const [stationShow, setstationShow] = useState(false);
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [onSubmit, setonSubmit] = useState("");
  const [showAddUpdateModal, setshowAddUpdateModal] = useState(false);
  const [updateModalData, setupdateModalData] = useState(null);
  const [updateIndex, setupdateIndex] = useState("");
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteIndex, setdeleteIndex] = useState("");
  const [deleteItem, setdeleteItem] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [deleteMessage, setdeleteMessage] = useState("");
  const [sorting_icon, setsorting_icon] = useState();
  const [paginationStates, setpaginationStates] = useState({
    itemsCountPerPage: "",
    activePage: "",
    totalItemsCount: "",
  });

  const { t } = useTranslation();

  const [searchData, setSearchData] = useState("");
  const [dataForTable, setDataForTable] = useState([]);

  const [rolesList, setrolesList] = useState([]);
  const [groupList, setgroupList] = useState([]);

  const [role, setRole] = useState({
    addUser: false,
    updateUser: false,
    deleteUser: false,
    // viewClient: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.client.store") {
        arr.addClient = true;
      } else if (roles[i].subject == "fm.client.update") {
        arr.updateClient = true;
      } else if (roles[i].subject == "fm.client.delete") {
        arr.deleteClient = true;
      } else if (roles[i].subject == "client_detail") {
        arr.viewClient = true;
      }
    }
    // console.log("arrrrrrrrrrr", arr);
    setRole(arr);
  };

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

  const sortAscending = (icon, sortType, colsort) => {
    if (colsort == "order_number") {
      setsorting_icon(icon);
      setData(
        helper.applyCountID(
          data.sort((a, b) =>
            a[colsort] > b[colsort] && sortType === "asc" ? 1 : -1
          )
        )
      );
    } else if (colsort == "name") {
      setsorting_icon(icon);
      setData(
        helper.applyCountID(
          data.sort((a, b) =>
            a.customer.name.toLowerCase() > b.customer.name.toLowerCase() &&
            sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    } else if (colsort == "status") {
      setsorting_icon(icon);
      setData(
        helper.applyCountID(
          data.sort((a, b) =>
            helper
              .stringToJson(a.order_status.order_status_title)
              .en.toLowerCase() >
              helper
                .stringToJson(b.order_status.order_status_title)
                .en.toLowerCase() && sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    } else {
      setsorting_icon(icon);
      setData(
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

  const onCurrPageChange = async (page) => {
    await setcurrentPage(page);
    getData(page);
    console.log(page, "testing data", currentPage);
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

  const getData = () => {
    setoverlay(true);
    axios
      .post(
        `${jwtDefaultConfig.adminBaseUrl}/client-users?page=${currentPage}&pagination=true`,
        {
          client: {
            clientId: props.clientID,
          },
        }
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setdata(helper.applyCountID(res.data.data.data));
          FilterDataForTable(res.data.data.data);

          setpaginationStates({
            activePage: res.data.data.current_page,
            itemsCountPerPage: res.data.data.per_page,
            totalItemsCount: res.data.data.total,
          });
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
  const FilterDataForTable = (data) => {
    let arr = [];
    data.forEach((item) => {
      arr.push({
        name: item.first_name,
        mobile: item.mobile,
        role: helper.isObject(item.group) ? item.group.group_name_en : "",

        created_at: item.created_at,
      });
    });
    setDataForTable(arr);
  };

  const getRoles = () => {
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/roles?pagination=false&lang=en`)
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setrolesList(res.data.data);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setstationsList([]);
        }
      })
      .catch((error) => {
        setstationsList([]);
      });
  };

  const getGroups = () => {
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/groups?pagination=false&lang=en`)
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setgroupList(res.data.data);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setstationsList([]);
        }
      })
      .catch((error) => {
        setstationsList([]);
      });
  };

  const getRoleIDs = (array) => {
    let ids = [];
    for (let i = 0; i < array.length; i++) {
      ids.push(array[i].value);
    }
    return ids;
  };

  const create = (args) => {
    // console.log("create args", args);
    // return;
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/user/store`, {
        user: {
          client_id: props.clientID,
          gas_station_id: null,
          employee_number: args.employee_number,
          first_name: args.first_name,
          // last_name: args.last_name,
          password: args.password,
          email: args.email,
          mobile: args.mobile,
          gender: "",
          // designation: args.designation,
          group_id: args.group_id ? args.group_id.value : "",
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
          client_id: props.clientID,
          gas_station_id: null,
          employee_number: args.employee_number,
          first_name: args.first_name,
          last_name: args.last_name,
          password: args.password,
          email: args.email,
          mobile: args.mobile,
          gender: "",
          // designation: "client_manager",
          group_id: args.group_id ? args.group_id.value : "",
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

  const filterData = (value) => {
    if (value.length >= 3) {
      setSearchData(value);
    } else {
      setSearchData("");
    }
  };

  useEffect(() => {
    getData();
    getRoles();
    getGroups();
  }, []);

  return (
    <div>
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

      <Card>
        <CardHeader className="border-bottom">
          <CardTitle style={{ fontWeight: "bold" }} tag="h4">
            {t("Users")} {props.clientName}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Row>
            <Col lg={12}>
              <Row>
                <Col style={{ display: "flex" }}>
                  <Button onClick={(e) => openCreateModal()}>
                    <i className="fas fa-plus"></i> {t("Add User")}
                  </Button>
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
                  <DataTableExportButton
                    className={""}
                    style={""}
                    color={"primary"}
                    data={dataForTable}
                    t={t}
                  />
                  <div className={`fleetPaginator`}>
                    <Pagination
                      activePage={
                        paginationStates.activePage
                          ? parseInt(paginationStates.activePage)
                          : 1
                      }
                      itemsCountPerPage={
                        paginationStates.itemsCountPerPage
                          ? parseInt(paginationStates.itemsCountPerPage)
                          : 1
                      }
                      totalItemsCount={
                        paginationStates.totalItemsCount
                          ? parseInt(paginationStates.totalItemsCount)
                          : 1
                      }
                      pageRangeDisplayed={5}
                      prevPageText="<"
                      nextPageText=">"
                      onChange={(e) => onCurrPageChange(e)}
                      itemClassFirst={`itemClassFirst`}
                      itemClassPrev={`itemClassPrev`}
                      itemClassLast={`itemClassLast`}
                      disabledClass={`disabledClass`}
                      linkClass={`linkClass`}
                    />{" "}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th
                    className="table-th blackColor"
                    style={{ width: "120px" }}
                  >
                    <p>
                      {t("Name")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col1_asc", "asc", "order_number")
                          }
                          className={
                            sorting_icon == "Col1_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col1_des", "des", "order_number")
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
                            sortAscending("Col4_asc", "asc", "order_number")
                          }
                          className={
                            sorting_icon == "Col4_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col3_des", "des", "order_number")
                          }
                          className={
                            sorting_icon == "Col3_des"
                              ? "fas fa-long-arrow-alt-down sort-color"
                              : "fas fa-long-arrow-alt-down"
                          }
                        ></i>
                      </span>
                    </p>
                  </th>

                  <th className="table-th blackColor">
                    <p>{t("Role")}</p>
                  </th>

                  <th className="table-th blackColor">
                    <p>
                      {t("Created at")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col7_asc", "asc", "order_number")
                          }
                          className={
                            sorting_icon == "Col7_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col3_des", "des", "order_number")
                          }
                          className={
                            sorting_icon == "Col3_des"
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
                        item.first_name
                          .toLowerCase()
                          .includes(searchData.toLowerCase()) ||
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
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex" }}>
                            <Edit
                              data-tip="Update"
                              size={15}
                              onClick={(e) => onOpenUpdateModal(item, index)}
                              style={{ marginTop: "4px", marginRight: "5px" }}
                            />
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

            <AddUpdateModal
              show={showAddUpdateModal}
              updateModalData={updateModalData}
              onHide={onCloseAddUpdateModal}
              submitAction={submitAction}
              disableBtn={overlay}
              rolesList={rolesList}
              groupList={groupList}
              clientName={props.clientName}
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
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
