import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
import { Check, X, Edit } from "react-feather";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";

import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import { Phone } from "react-feather";
import { Card, CardBody, CardTitle, CardHeader } from "reactstrap";
import { getUserData } from "@utils";
import { useTranslation } from "react-i18next";
import AddUpdateModal from "./AddUpdateModal";

function NetworkStaff(props) {
  const [clientShow, setclientShow] = useState(true);
  const [stationShow, setstationShow] = useState(false);

  const { t } = useTranslation();

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

  const [stationsList, setstationsList] = useState([]);

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
      colsort == "employee_number" ||
      colsort == "first_name" ||
      colsort == "email" ||
      colsort == "civil_record_or_resident_permit_number"
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
    } else if (colsort == "gas_station") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            helper.isObject(a.gas_station) &&
            helper.isObject(b.gas_station) &&
            b.gas_station.name_en &&
            a.gas_station.name_en &&
            a.gas_station.name_en.toLowerCase() >
              b.gas_station.name_en.toLowerCase() &&
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

  const getStations = () => {
    setoverlay(true);
    axios
      .get(
        `${
          jwtDefaultConfig.adminBaseUrl
        }/stations?page=${currentPage}&pagination=true&gas_station_network_id=${
          getUserData().gas_station_network_id
        }`,
        {}
      )
      .then((res) => {
        // helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setoverlay(false);
          let arr = [];
          res.data.data.data.forEach((item) => {
            let obj = {
              label: item.name_en,
              id: item.gas_station_id,
            };
            arr.push(obj);
          });
          //   console.log("arrrrrrrrrrrrrrrr", arr);
          setstationsList(arr);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );

          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");

        setoverlay(false);
      });
  };

  const getData = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/network-staff?pagination=true`, {
        gas_station_network: {
          gas_station_network_id: getUserData().gas_station_network_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(
            helper.applyCountID(res.data.data.data),
            "data of gas station"
          );

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

  const create = (args) => {
    setoverlay(true);
    // console.log("creat e args", args);
    // return;
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/gas-station-staff/store`, {
        gas_station_staff: {
          gas_station_network_id: getUserData().gas_station_network_id,
          employee_number: args.employee_number,
          first_name: args.first_name,
          middle_name: args.middle_name,
          last_name: args.last_name,
          password: args.password,
          email: args.email,
          mobile: args.mobile,
          gender: args.gender,
          designation: args.designation,
          civil_record_or_resident_permit_number:
            args.civil_record_or_resident_permit_number,
          nationality: args.nationality.value,
          prefered_language: args.prefered_language,
          gas_station_id: args.gas_station ? args.gas_station.id : "",
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
          if (res.data.data.employee_number) {
            helper.toastNotification(res.data.data.employee_number[0]);
          }
          if (res.data.data.civil_record_or_resident_permit_number) {
            helper.toastNotification(
              res.data.data.civil_record_or_resident_permit_number[0]
            );
          }
          if (res.data.data.email) {
            helper.toastNotification(res.data.data.email[0]);
          }
          if (res.data.data.mobile) {
            helper.toastNotification(res.data.data.mobile[0]);
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
    // console.log("update args", args);
    // return;
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/gas-station-staff/update`, {
        gas_station_staff: {
          gas_station_network_id: getUserData().gas_station_network_id,
          staff_id: updateModalData.staff_id,
          employee_number: args.employee_number,
          first_name: args.first_name,
          middle_name: args.middle_name,
          last_name: args.last_name,
          password: args.password,
          email: args.email,
          mobile: args.mobile == updateModalData.mobile ? "" : args.mobile,
          gender: args.gender,
          designation: args.designation,
          civil_record_or_resident_permit_number:
            args.civil_record_or_resident_permit_number,
          nationality: args.nationality.value,
          prefered_language: args.prefered_language,
          gas_station_id: args.gas_station ? args.gas_station.id : "",
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);

        if (res.data.code && res.data.code === 200) {
          setshowAddUpdateModal(false);

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
      .post(`${jwtDefaultConfig.adminBaseUrl}/gas-station-staff/delete`, {
        gas_station_staff: {
          staff_id: deleteItem.staff_id,
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
    getStations();
    getData();
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
            {t("Staff")} {props.gasStationName}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Row>
            <Col lg={12}>
              <Row>
                <Col style={{ display: "flex" }}>
                  <Button onClick={(e) => openCreateModal()}>
                    <i className="fas fa-plus"></i> {t("Add Gas Station Staff")}
                  </Button>

                  <input
                    className="form-control crud-search"
                    placeholder={`${t("Search")}...`}
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
                      {t("Employee")} #
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col1_asc", "asc", "employee_number")
                          }
                          className={
                            sorting_icon == "Col1_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col1_des", "des", "employee_number")
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
                      {t("Name")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col2_asc", "asc", "first_name")
                          }
                          className={
                            sorting_icon == "Col2_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col2_des", "des", "first_name")
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
                      {t("Civil ID / Resident Permit Number")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending(
                              "Col6_asc",
                              "asc",
                              "civil_record_or_resident_permit_number"
                            )
                          }
                          className={
                            sorting_icon == "Col6_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending(
                              "Col6_des",
                              "des",
                              "civil_record_or_resident_permit_number"
                            )
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
                  <th className="table-th blackColor">Gas Station</th>
                  <th className="table-th blackColor">Designation</th>
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
                            sortAscending("Col7_des", "des", "created_at")
                          }
                          className={
                            sorting_icon == "Col7_des"
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
                        item.employee_number
                          .toLowerCase()
                          .includes(searchData.toLowerCase()) ||
                        item.first_name
                          .toLowerCase()
                          .includes(searchData.toLowerCase()) ||
                        item.mobile
                          .toLowerCase()
                          .includes(searchData.toLowerCase()) ||
                        item.civil_record_or_resident_permit_number
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
                        <td>{item.employee_number}</td>
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
                                    `${item.first_name} ${item.middle_name} ${item.last_name}`,
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
                        <td>
                          <div class="d-flex justify-content-left align-items-center">
                            <div class="avatar me-1 bg-light-success">
                              <span class="avatar-content">
                                <Phone size={13} />
                              </span>
                            </div>
                            <div class="d-flex flex-column">
                              <a class="user_name text-truncate text-body">
                                <span class="fw-bolder">{item.mobile}</span>
                              </a>
                            </div>
                          </div>
                        </td>
                        <td>{item.civil_record_or_resident_permit_number}</td>
                        <td>
                          {helper.isObject(item.gas_station)
                            ? item.gas_station.name_en
                            : ""}
                        </td>
                        <td>{item.designation}</td>
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
                    <td colSpan={7}>{t("No Records found")}</td>
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
              stationsList={stationsList}
              //   groupList={groupList}
              //   rolesList={rolesList}
              //   gasStationName={props.gasStationName}
            />
            <DeleteModal
              show={showDeleteModal}
              confirmationText={`Are you sure to ${deleteMessage} a gas station staff`}
              confirmationHeading={`${helper.uppercaseFirst(
                deleteMessage
              )} a gas station staff`}
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

export default NetworkStaff;
