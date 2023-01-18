import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
import { Check, X, Edit } from "react-feather";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";

import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import { getUserData } from "@utils";

import { useTranslation } from "react-i18next";
import AddSimModal from "./AddSimModal";
import DataTableExportButton from "../../components/TableToExcel";
export default function Sim(props) {
  const [clientShow, setclientShow] = useState(true);
  const [stationShow, setstationShow] = useState(false);
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [onSubmit, setonSubmit] = useState("");
  const [showAddUpdateModal, setshowAddUpdateModal] = useState(false);
  const [showSimModal, setshowSimModal] = useState(false);
  const [updateModalData, setupdateModalData] = useState(null);
  const [updateIndex, setupdateIndex] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [sorting_icon, setsorting_icon] = useState();
  const [paginationStates, setpaginationStates] = useState({
    itemsCountPerPage: "",
    activePage: "",
    totalItemsCount: "",
  });

  const { t } = useTranslation();

  const [dataForTable, setDataForTable] = useState([]);

  const [searchData, setSearchData] = useState("");

  const [loader, setLoader] = useState(false);

  const [role, setRole] = useState({
    addSim: false,
    updateSim: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.hand_held_device_info.add") {
        arr.addSim = true;
      } else if (roles[i].subject == "fm.hand_held_device_info.update") {
        arr.updateSim = true;
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
    setshowSimModal(true);
  };

  const onOpenUpdateModal = (item, index) => {
    setupdateModalData(item);
    setshowSimModal(true);
    setupdateIndex(index);
    setonSubmit("update");
  };

  const onCloseSimModal = () => {
    setshowSimModal(false);
    setupdateIndex(null);
    setonSubmit(null);
    setupdateModalData(null);
  };

  const getData = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/hand-held-devices-info`)
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log(helper.applyCountID(res.data), "data");
          FilterDataForTable(helper.applyCountID(res.data.data));

          setdata(helper.applyCountID(res.data.data));
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
        serial_no: item.sim_number,
        sim_puk_number: item.sim_puk_number,
        sim_serial_number: item.sim_serial_number,
        service_provider: item.service_provider,
        data_limit: item.data_limit,

        price: item.price,
        device_serial_no: helper.isObject(item.hand_held_device)
          ? item.hand_held_device.serial_no
          : "",
        operating_system: helper.isObject(item.hand_held_device)
          ? item.hand_held_device.operating_system
          : "",
        last_used: item.last_used,

        expiry_date: item.expiry_date,
      });
    });
    setDataForTable(arr);
  };

  const create = (form) => {
    console.log("create", form);
    let date = form.expiry_date.split("T")[0];
    let time = form.expiry_date.split("T")[1];
    let dateTime = date + " " + time;
    // return;
    setLoader(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/hand-held-device-info/add`, {
        device: {
          // device_id: props.updateModalData.id,
          sim_serial_number: form.sim_serial_number,
          sim_number: form.sim_number,
          sim_puk_number: form.sim_puk_number,
          service_provider: form.service_provider,
          data_limit: form.data_limit,
          price: form.price,
          last_used: form.last_used,
          expiry_date: dateTime,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          setLoader(false);
          setshowSimModal(false);
          getData();
        } else {
          setLoader(false);
          helper.toastNotification("Something went wrong.", "FAILED_MESSAGE");
        }
      })
      .catch((error) => {
        setLoader(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
      });
  };
  const update = (form) => {
    console.log("update", form);
    let date = form.expiry_date.split("T")[0];
    let time = form.expiry_date.split("T")[1];
    let dateTime = date + " " + time;
    // return;

    setLoader(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/hand-held-device-info/update`, {
        device: {
          device_id: form.id,
          sim_serial_number:
            form.sim_serial_number == updateModalData.sim_serial_number
              ? ""
              : form.sim_serial_number,
          sim_number: form.sim_number,
          sim_puk_number: form.sim_puk_number,
          service_provider: form.service_provider,
          data_limit: form.data_limit,
          price: form.price,
          last_used: form.last_used,
          expiry_date: dateTime,
          id: form.id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          setLoader(false);
          setshowSimModal(false);

          getData();
        } else {
          setLoader(false);
          helper.toastNotification("Something went wrong.", "FAILED_MESSAGE");
        }
      })
      .catch((error) => {
        setLoader(false);
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
    setRoles();
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

      <Row>
        <Col lg={12}>
          <Row>
            <Col
              sm={3}
              style={{
                display: "flex",
              }}
            >
              {role.addSim ? (
                <Button onClick={(e) => openCreateModal()}>
                  <i className="fas fa-plus"></i> {t("Add Sim")}
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
                  {t("Sim Serial Number")}
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
                  {t("Sim Number")}
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
                  {t("Sim PUK Number")}
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
                  {t("Service Provider")}
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
                  {t("Data Limit")}
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
                <p>{t("Price")}</p>
              </th>
              <th className="table-th blackColor">
                <p>{t("Device Serial Number")}</p>
              </th>
              <th className="table-th blackColor">
                <p>{t("Operating System")}</p>
              </th>

              <th className="table-th blackColor">
                <p>{t("Last Used")}</p>
              </th>
              <th className="table-th blackColor">
                <p>{t("Expiry Date")}</p>
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
                    item.sim_serial_number
                      .toLowerCase()
                      .includes(searchData.toLowerCase()) ||
                    item.sim_number
                      .toLowerCase()
                      .includes(searchData.toLowerCase()) ||
                    item.sim_puk_number
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
                    <td>{item.sim_serial_number}</td>
                    <td>{item.sim_number}</td>
                    <td>{item.sim_puk_number}</td>
                    <td>{item.service_provider}</td>
                    <td>{item.data_limit}</td>
                    <td>{item.price}</td>
                    <td>
                      {helper.isObject(item.hand_held_device)
                        ? item.hand_held_device.serial_no
                        : ""}
                    </td>
                    <td>
                      {helper.isObject(item.hand_held_device)
                        ? item.hand_held_device.operating_system
                        : ""}
                    </td>
                    <td>{item.last_used}</td>
                    <td>{helper.humanReadableDate(item.expiry_date)}</td>

                    <td>
                      {role.updateSim ? (
                        <div style={{ display: "flex" }}>
                          <Edit
                            data-tip="Update"
                            size={15}
                            onClick={(e) => onOpenUpdateModal(item, index)}
                            style={{
                              marginTop: "4px",
                              marginRight: "5px",
                              cursor: "pointer",
                            }}
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
                <td colSpan={6}>No Records found</td>
              </tr>
            )}
          </tbody>
        </table>

        <AddSimModal
          show={showSimModal}
          updateModalData={updateModalData}
          onHide={onCloseSimModal}
          close={setshowSimModal}
          // getData={getData}
          submitAction={submitAction}
          loader={loader}
          // disableBtn={overlay}
          // gasStationList={gasStationList}
          // fuelTypeList={fuelTypeList}
        />
      </div>
    </div>
  );
}
