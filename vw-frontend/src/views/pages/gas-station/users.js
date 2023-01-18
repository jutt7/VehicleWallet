import React, { useEffect, useState } from "react";
import { Table } from "rsuite";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import AddUpdateModal from "./AddUpdateUser";
import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import { Card, CardBody, CardTitle, CardHeader } from "reactstrap";

import { useTranslation } from "react-i18next";

export default function User(props) {
  const { t } = useTranslation();
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

  const [searchData, setSearchData] = useState("");

  const [rolesList, setrolesList] = useState([]);
  const [groupList, setgroupList] = useState([]);

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
      colsort == "first_name" ||
      colsort == "last_name" ||
      colsort == "email"
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
    } else if (colsort == "mobile") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            a[colsort] > b[colsort] && sortType === "asc" ? 1 : -1
          )
        )
      );
    } else if (colsort == "group") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            helper.isObject(a.group) &&
            helper.isObject(b.group) &&
            b.group.group_name_ar &&
            a.group.group_name_ar &&
            a.group.group_name_ar.toLowerCase() >
              b.group.group_name_ar.toLowerCase() &&
            sortType === "asc"
              ? 1
              : -1
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
      .post(
        `${jwtDefaultConfig.adminBaseUrl}/gas-station-users?page=${currentPage}&pagination=true`,
        {
          gas_station: {
            gas_station_id: props.stationID
              ? props.stationID
              : helper.getIDfromUrl(window.location.href),
          },
        }
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(helper.applyCountID(res.data.data.data), "data");
          setdata(helper.applyCountID(res.data.data.data));
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
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/user/store`, {
        user: {
          client_id: null,
          gas_station_id: props.stationID
            ? props.stationID
            : helper.getIDfromUrl(window.location.href),
          employee_number: args.employee_number,
          first_name: args.first_name,
          last_name: args.last_name,
          password: args.password,
          email: args.email,
          mobile: args.mobile,
          gender: args.gender,
          // designation: "gas_station_manager",
          group_id: 8,
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
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/user/update`, {
        user: {
          user_id: updateModalData.user_id,
          client_id: null,
          gas_station_id: props.stationID
            ? props.stationID
            : helper.getIDfromUrl(window.location.href),
          employee_number: args.employee_number,
          first_name: args.first_name,
          last_name: args.last_name,
          password: args.password,
          email: args.email,
          mobile: args.mobile,
          gender: args.gender,
          // designation: "gas_station_manager",
          group_id: 8,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setshowAddUpdateModal(false);
          if (res.data.code && res.data.code === 200) {
            setshowAddUpdateModal(false);
            setoverlay(false);

            if (res.data.data) {
              console.log(res.data.data, "data");
              if (res.data.data.employee_number) {
                helper.toastNotification(res.data.data.employee_number[0]);
              }
              if (res.data.data.email) {
                helper.toastNotification(res.data.data.email[0]);
              }
              if (res.data.data.mobile) {
                helper.toastNotification(res.data.data.mobile[0]);
              }
            } else {
              helper.toastNotification(
                "Request has been processed successfuly.",
                "SUCCESS_MESSAGE"
              );
              getData();
            }
          } else {
            setoverlay(false);
            helper.toastNotification(
              "Unable to process request.",
              "FAILED_MESSAGE"
            );
          }
          getData();
        } else {
          setoverlay(false);
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
            {t("Users")} {props.gasStationName}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Row>
            <Col lg={12}>
              <Row>
                <Col style={{ display: "flex" }}>
                  {window.location.pathname.split("/")[1] != "admin" ? (
                    <></>
                  ) : (
                    <Button onClick={(e) => openCreateModal()}>
                      <i className="fas fa-plus"></i> Add User
                    </Button>
                  )}

                  <input
                    className="form-control crud-search"
                    placeholder="Search ..."
                    onChange={(e) => filterData(e.target.value)}
                  />
                </Col>
                <Col>
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
                      {t("First Name")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col1_asc", "asc", "first_name")
                          }
                          className={
                            sorting_icon == "Col1_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col1_des", "des", "first_name")
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
                      {t("Last Name")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col2_asc", "asc", "last_name")
                          }
                          className={
                            sorting_icon == "Col2_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col2_des", "des", "last_name")
                          }
                          className={
                            sorting_icon == "Col2_des"
                              ? "fas fa-long-arrow-alt-down sort-color"
                              : "fas fa-long-arrow-alt-down"
                          }
                        ></i>
                      </span>
                    </p>
                  </th>

                  <th className="table-th blackColor">
                    <p>
                      {t("Email")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col3_asc", "asc", "email")
                          }
                          className={
                            sorting_icon == "Col3_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col3_des", "des", "email")
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
                    <p>
                      {t("Mobile")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col4_asc", "asc", "mobile")
                          }
                          className={
                            sorting_icon == "Col4_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col4_des", "des", "mobile")
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
                      {t("Group")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col5_asc", "asc", "group")
                          }
                          className={
                            sorting_icon == "Col5_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col5_des", "des", "group")
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
                      {t("Created at")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col7_asc", "asc", "created_at")
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
                        item.last_name
                          .toLowerCase()
                          .includes(searchData.toLowerCase()) ||
                        item.email
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
                        <td>{item.first_name}</td>
                        <td>{item.last_name}</td>
                        <td>{item.email}</td>
                        <td>{item.mobile}</td>
                        <td>
                          {helper.isObject(item.group)
                            ? item.group.group_name_en
                            : ""}
                        </td>
                        <td>{helper.humanReadableDate(item.created_at)}</td>
                        <td>
                          <div>
                            <i
                              className="fa-solid fa-pen-to-square"
                              data-tip="Update"
                              style={{ fontSize: 15 }}
                              onClick={(e) => onOpenUpdateModal(item, index)}
                            />{" "}
                            {window.location.pathname.split("/")[1] !=
                            "admin" ? (
                              <></>
                            ) : (
                              <>
                                {item.status === 1 ? (
                                  <i
                                    className="fa-solid fa-ban"
                                    aria-hidden="true"
                                    data-tip="Disable"
                                    style={{ fontSize: 15 }}
                                    onClick={(e) =>
                                      onOpenDeleteModal(item, index)
                                    }
                                  />
                                ) : (
                                  <i
                                    className="fa-solid fa-circle-check"
                                    aria-hidden="true"
                                    data-tip="Activate"
                                    style={{ fontSize: 15 }}
                                    onClick={(e) =>
                                      onOpenDeleteModal(item, index)
                                    }
                                  />
                                )}
                              </>
                            )}
                          </div>
                          <ReactTooltip />
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={7}>No Records found</td>
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
              gasStationName={props.gasStationName}
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
