import React, { useEffect, useState } from "react";
import { Table } from "rsuite";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import AddUpdateModal from "./AddUpdateModal";
import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";

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

  const [gasStationList, setgasStationList] = useState([]);
  const [fuelTypeList, setfuelTypeList] = useState([]);

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

  const getData = () => {
    setoverlay(true);
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/hand-held-devices?page=${currentPage}&pagination=true`,
        {}
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

  useEffect(() => {
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
            <Col>
              <Button onClick={(e) => openCreateModal()}>
                <i className="fas fa-plus"></i> Add Handheld Device
              </Button>
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
              <th className="table-th blackColor" style={{ width: "120px" }}>
                <p>
                  Operating System
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
                  Installed App Version
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
                  Serial Number
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
                <p>
                  Created at
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col4_asc", "asc", "created_at")
                      }
                      className={
                        sorting_icon == "Col4_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col4_des", "des", "created_at")
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
                <p>Action</p>
              </th>
            </tr>
          </thead>

          <tbody>
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
                  <td>{item.operating_system}</td>
                  <td>{item.app_installed_vw_version}</td>
                  <td>{item.serial_no}</td>
                  <td>{helper.humanReadableDate(item.created_at)}</td>
                  <td>
                    <div>
                      <i
                        className="fa-solid fa-pen-to-square"
                        data-tip="Update"
                        style={{ fontSize: 15 }}
                        onClick={(e) => onOpenUpdateModal(item, index)}
                      />{" "}
                      {item.status === 1 ? (
                        <i
                          className="fa-solid fa-ban"
                          aria-hidden="true"
                          data-tip="Disable"
                          style={{ fontSize: 15 }}
                          onClick={(e) => onOpenDeleteModal(item, index)}
                        />
                      ) : (
                        <i
                          className="fa-solid fa-circle-check"
                          aria-hidden="true"
                          data-tip="Activate"
                          style={{ fontSize: 15 }}
                          onClick={(e) => onOpenDeleteModal(item, index)}
                        />
                      )}
                    </div>
                    <ReactTooltip />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No Records found</td>
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
