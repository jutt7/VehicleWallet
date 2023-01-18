import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
import { Check, X, Edit } from "react-feather";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import AddUpdateModal from "./AddUpdateModal";
import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";

import { useTranslation } from "react-i18next";
import { getUserData } from "@utils";
import DataTableExportButton from "../../components/TableToExcel";

export default function client(props) {
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

  const [dataForTable, setDataForTable] = useState([]);

  const [searchData, setSearchData] = useState("");

  const { t } = useTranslation();

  const [gasStationList, setgasStationList] = useState([]);
  const [fuelTypeList, setfuelTypeList] = useState([]);

  const [role, setRole] = useState({
    addVehicle: false,
    updateVehicle: false,
    deleteVehicle: false,
    // viewClient: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.vehicle_type.add") {
        arr.addVehicle = true;
      } else if (roles[i].subject == "fm.vehicle_type.update") {
        arr.updateVehicle = true;
      } else if (roles[i].subject == "fm.vehicle_type.delete") {
        arr.deleteVehicle = true;
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
    if (
      colsort == "title_ar" ||
      colsort == "title_en" ||
      colsort == "title_ur"
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
    } else if (colsort == "weight") {
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
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/vehicle-types?page=${currentPage}&pagination=true`,
        {}
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log(helper.applyCountID(res.data.data.data), "data");
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
        name: item.name_en,
        weight: item.weight,

        created_at: item.created_at,
        registration_fee: item.registration_fee,
        monthly_subs_fee: item.monthly_subs_fee,

        status: item.status,
      });
    });
    setDataForTable(arr);
  };

  const getGasStation = () => {
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/stations?pagination=false&lang=ar`)
      .then(async (res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setgasStationList(res.data.data);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setgasStationList([]);
        }
      })
      .catch((error) => {
        setgasStationList([]);
      });
  };

  const getFuelType = () => {
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/fuel-types?pagination=false&lang=ar`
      )
      .then(async (res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setfuelTypeList(res.data.data);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setfuelTypeList([]);
        }
      })
      .catch((error) => {
        setfuelTypeList([]);
      });
  };

  const create = (args) => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/vehicle-type/add`, {
        vehicle_type: {
          name_en: args.name_en,
          name_ar: args.name_ar,
          name_ur: args.name_ur,
          weight: args.weight,
          registration_fee: args.registration_fee,
          monthly_subs_fee: args.monthly_subs_fee,
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
          helper.toastNotification("Something went wrong.", "FAILED_MESSAGE");
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

  const update = (args) => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/vehicle-type/update`, {
        vehicle_type: {
          id: updateModalData.id,
          name_en: args.name_en,
          name_ar: args.name_ar,
          name_ur: args.name_ur,
          weight: args.weight,
          registration_fee: args.registration_fee,
          monthly_subs_fee: args.monthly_subs_fee,
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
      .post(`${jwtDefaultConfig.adminBaseUrl}/vehicle-type/delete`, {
        vehicle_type: {
          id: deleteItem.id,
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
    setRoles();
    getData();
    getGasStation();
    getFuelType();
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

      <Row>
        <Col lg={12}>
          <Row>
            <Col style={{ display: "flex" }}>
              {role.addVehicle ? (
                <Button onClick={(e) => openCreateModal()}>
                  <i className="fas fa-plus"></i> {t("Add Vehicle Type")}
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
                  {t("Weight")}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col4_asc", "asc", "weight")
                      }
                      className={
                        sorting_icon == "Col4_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col4_des", "des", "weight")
                      }
                      className={
                        sorting_icon == "Col4_des"
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
                        sortAscending("Col5_asc", "asc", "created_at")
                      }
                      className={
                        sorting_icon == "Col5_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col5_des", "des", "created_at")
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
                <p>{t("Registration Fee")}</p>
              </th>
              <th className="table-th blackColor">
                <p>{t("Monthly Fee")}</p>
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
                    item.name_en
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
                            {helper.FirstWordFirstChar(item.name_en)}
                            {helper.SecondWordFirstChar(item.name_en)}
                          </span>
                        </div>
                        <div class="d-flex flex-column">
                          <a class="user_name text-truncate text-body">
                            <span class="fw-bolder">
                              {helper.shortTextWithDots(item.name_en, 20)}
                            </span>
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>{item.weight}</td>
                    <td>{helper.humanReadableDate(item.created_at)}</td>
                    <td>{item.registration_fee}</td>
                    <td>{item.monthly_subs_fee}</td>
                    <td>
                      {role.deleteVehicle ? (
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
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      {role.updateVehicle ? (
                        <div style={{ display: "flex" }}>
                          <Edit
                            data-tip="Update"
                            size={15}
                            onClick={(e) => onOpenUpdateModal(item, index)}
                            style={{ marginTop: "4px", marginRight: "5px" }}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <ReactTooltip />
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={5}>{t("No Records found")}</td>
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
          gasStationList={gasStationList}
          fuelTypeList={fuelTypeList}
        />
        <DeleteModal
          show={showDeleteModal}
          confirmationText={`Are you sure to ${deleteMessage} a vehicle type`}
          confirmationHeading={`${helper.uppercaseFirst(
            deleteMessage
          )} a vehicle type`}
          onHide={onCloseDeleteModal}
          submitAction={submitAction}
          disableBtn={overlay}
        />
      </div>
    </div>
  );
}
