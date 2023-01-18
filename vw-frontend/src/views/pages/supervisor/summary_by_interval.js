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
import pump from "@src/assets/images/icons/fuel-pump.png";

import { kFormatter } from "@utils";
import DataTableExportButton from "../../components/TableToExcel";
import { useTranslation } from "react-i18next";

export default function client(props) {
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

  const [filter, setfilter] = useState({
    from: "",
    to: "",
  });
  const [dataForTable, setDataForTable] = useState([]);

  const [timeInterval, settimeInterval] = useState("1");
  const [held_transaction_amount, setheld_transaction_amount] = useState(0);
  const [held_transaction_count, setheld_transaction_count] = useState(0);

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
      colsort == "operating_system" ||
      colsort == "app_installed_vw_version" ||
      colsort == "serial_no"
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
  const getDateTime = (datetime) => {
    let date = datetime.split("T")[0];
    let time = datetime.split("T")[1];
    return date + " " + time;
  };

  const getData = () => {
    if (!filter.to || !filter.from) {
      helper.toastNotification(
        "Please submit filters to fetch records.",
        "FAILED_MESSAGE"
      );
      return false;
    }
    setoverlay(true);
    axios
      .post(
        `${jwtDefaultConfig.adminBaseUrl}/summary?page=${currentPage}&pagination=true`,
        {
          interval: {
            from: getDateTime(filter.from),
            to: getDateTime(filter.to),
          },
        }
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        console.log(res.data, "response");
        if (res.status && res.status === 200) {
          setdata(helper.applyCountID(res.data.data));
          FilterDataForTable(res.data.data);
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
        transaction_reference: item.reference_number,
        transaction_date: item.created_at,
        attenent_name: helper.isObject(item.gas_station_attendent)
          ? item.gas_station_attendent.first_name +
            " " +
            item.gas_station_attendent.middle_name +
            " " +
            item.gas_station_attendent.last_name
          : "",
        civil_record_or_resident_permit_number: helper.isObject(
          item.gas_station_attendent
        )
          ? item.gas_station_attendent.civil_record_or_resident_permit_number
          : "",
        liters: item.liters,
        amount: item.amount,
        client_name:
          helper.isObject(item.driver) && helper.isObject(item.driver.client)
            ? item.driver.client.name_en
            : "",
        status: item.transaction_status == 1 ? "Transaction Completed" : "",
      });
    });
    setDataForTable(arr);
  };

  const create = (args) => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/hand-held-device/add`, {
        device: {
          operating_system: args.operating_system,
          app_installed_vw_version: args.app_installed_vw_version,
          serial_no: args.serial_no,
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
      .post(`${jwtDefaultConfig.adminBaseUrl}/hand-held-device/update`, {
        device: {
          id: updateModalData.id,
          operating_system: args.operating_system,
          app_installed_vw_version: args.app_installed_vw_version,
          serial_no: args.serial_no,
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
      .post(`${jwtDefaultConfig.adminBaseUrl}/hand-held-device/delete`, {
        device: {
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

  const getStatus = (status) => {
    if (status === 1) {
      return (
        <div>
          <span class="badge bg-primary">Transaction Completed</span>
        </div>
      );
    } else if (status === 3) {
      return (
        <div>
          <span class="badge bg-secondary">Transaction Held</span>
        </div>
      );
    } else if (status === 2) {
      return (
        <div>
          <span class="badge bg-light-info">Processing</span>
        </div>
      );
    } else if (status === 4) {
      return (
        <div>
          <span class="badge bg-info">Request Initiated</span>
        </div>
      );
    }
  };

  const onChangeInput = (value, name) => {
    let search = { ...filter };
    search[name] = value;
    setfilter(search);
  };

  const setDate = () => {
    var today = new Date().toISOString().slice(0, 10) + "T00:00";
    var d = new Date(); // today!
    var x = 2; // go back 7 days!
    d.setDate(d.getDate() - x);
    var prevDate = d.toISOString().slice(0, 10) + "T00:00";

    setfilter({
      from: prevDate,
      to: today,
    });
  };

  useEffect(() => {
    setDate();
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
            {/* <Col sm={3}>
              <div className="form-group" style={{ display: "flex" }}>
                <label style={{ width: "88px", marginTop: "10px" }}>
                  {" "}
                  Select Range
                </label>
                <select
                  className="form-control"
                  style={{ width: "128px" }}
                  onChange={(e) => settimeInterval(e.target.value)}
                >
                  <option value="1">24 hours</option>
                  <option value="2">48 hours</option>
                  <option value="3">72 hours</option>
                  <option value="all">All</option>
                </select>
              </div>
            </Col> */}
            <Col>
              <label>From Date</label>
              <input
                onChange={(e) => onChangeInput(e.target.value, "from")}
                value={filter.from}
                className="form-control"
                name="from"
                type="datetime-local"
              />
            </Col>

            <Col>
              <label>To Date</label>
              <input
                onChange={(e) => onChangeInput(e.target.value, "to")}
                value={filter.to}
                className="form-control"
                name="to"
                type="datetime-local"
              />
            </Col>
            <Col sm={3}>
              <Button style={{ marginTop: "19px" }} onClick={(e) => getData()}>
                <i className="fa fa-search"></i>
              </Button>
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
                  Transaction Ref # / Transaction Date
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col1_asc", "asc", "operating_system")
                      }
                      className={
                        sorting_icon == "Col1_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col1_des", "des", "operating_system")
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
                  Attendent Name / Civil ID
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending(
                          "Col2_asc",
                          "asc",
                          "app_installed_vw_version"
                        )
                      }
                      className={
                        sorting_icon == "Col2_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending(
                          "Col2_des",
                          "des",
                          "app_installed_vw_version"
                        )
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
                  Liters / Amount
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col3_asc", "asc", "serial_no")
                      }
                      className={
                        sorting_icon == "Col3_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col3_des", "des", "serial_no")
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
                <p>Status</p>
              </th>
            </tr>
          </thead>

          <tbody>
            {!data.length ? (
              <tr>
                <td colSpan={4}>No records found.</td>
              </tr>
            ) : (
              ""
            )}

            {data.length > 0 ? (
              data &&
              data.map((item, index) => (
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
                      <div class="avatar me-1 bg-light-primary">
                        <span class="avatar-content">
                          <img src={pump} />
                        </span>
                      </div>
                      <div class="d-flex flex-column">
                        <a class="user_name text-truncate text-body">
                          <span class="fw-bolder">{item.reference_number}</span>
                        </a>
                        <small class="text-truncate text-muted mb-0">
                          <i
                            class="fa fa-clock-o"
                            style={{ color: "#2d7337", marginRight: "2px" }}
                          ></i>
                          {helper.humanReadableDate(item.created_at)}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-left align-items-center">
                      <div className="avatar me-1 bg-light-success">
                        <span className="avatar-content">
                          {helper.isObject(item.gas_station_attendent) &&
                          item.gas_station_attendent.first_name
                            ? helper.FirstWordFirstChar(
                                item.gas_station_attendent.first_name
                              )
                            : ""}
                          {helper.isObject(item.gas_station_attendent)
                            ? helper.FirstWordFirstChar(
                                item.gas_station_attendent.last_name
                              )
                            : "--"}
                        </span>
                      </div>
                      <div className="d-flex flex-column">
                        <a className="user_name text-truncate text-body">
                          <span className="fw-bolder">
                            {`${
                              item.gas_station_attendent &&
                              item.gas_station_attendent.first_name
                                ? item.gas_station_attendent.first_name
                                : ""
                            }
                             ${
                               item.gas_station_attendent &&
                               item.gas_station_attendent.middle_name
                                 ? item.gas_station_attendent.middle_name
                                 : ""
                             } 
                             ${
                               item.gas_station_attendent &&
                               item.gas_station_attendent.last_name
                                 ? item.gas_station_attendent.last_name
                                 : ""
                             }`}
                          </span>
                        </a>
                        <small class="text-truncate text-muted mb-0">
                          <i
                            class="fa fa-id-badge"
                            style={{ color: "#2d7337", marginRight: "2px" }}
                          ></i>
                          {helper.isObject(item.gas_station_attendent)
                            ? item.gas_station_attendent
                                .civil_record_or_resident_permit_number
                            : ""}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    {item.liters ? (
                      <p>
                        <i
                          class="fa fa-tint"
                          style={{ color: "#2d7337", marginRight: "2px" }}
                        ></i>{" "}
                        {item.liters}
                        {" ltr"}
                      </p>
                    ) : (
                      ""
                    )}
                    {item.amount ? (
                      <p style={{ marginTop: 0 }}>
                        <i
                          class="fa fa-money"
                          style={{ color: "#2d7337", marginRight: "2px" }}
                        ></i>{" "}
                        {item.amount}
                        {" SAR"}
                      </p>
                    ) : (
                      ""
                    )}
                  </td>

                  <td>{getStatus(item.transaction_status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}></td>
              </tr>
            )}
          </tbody>
        </table>

        <DeleteModal
          show={showDeleteModal}
          confirmationText={`Are you sure to ${deleteMessage} a handheld device`}
          confirmationHeading={`${helper.uppercaseFirst(
            deleteMessage
          )} a handheld device`}
          onHide={onCloseDeleteModal}
          submitAction={submitAction}
          disableBtn={overlay}
        />
      </div>
    </div>
  );
}
