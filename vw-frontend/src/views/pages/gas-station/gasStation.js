import React, { useEffect, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import { User } from "react-feather";
import transactionGreen from "@src/assets/images/icons/client-transactions.png";
import invoice from "@src/assets/images/icons/bill.png";

import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import { Check, X, LogIn, Edit } from "react-feather";
import AddUpdateModal from "./AddUpdateModal";
import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import detailIcon from "@src/assets/images/icons/details.png";
import { useTranslation } from "react-i18next";
import avatar from "@src/assets/images/avatars/pertol200.png";
import location from "@src/assets/images/icons/location-green.png";
import calendar from "@src/assets/images/icons/calendar.png";
import contract from "@src/assets/images/icons/contract.png";
import { Routes, Route, useHistory } from "react-router-dom";
import usersGreen from "@src/assets/images/icons/users.png";

import StatsCard from "@src/views/ui-elements/cards/statistics/gasStationNetworkStats";
import { isUserLoggedIn, getUserData } from "@utils";
import DataTableExportButton from "../../components/TableToExcel";
import Maps from "../gas-station-network/Map";
import InvoiceModal from "../gas-station-network/InvoiceModal";
import Transfer from "../gas-station-network/transferModal";
import NetworkUser from "../gas-station-network/networkUser";
import "./btn.css";

export default function index(props) {
  const [overlay, setoverlay] = useState(false);
  const { t } = useTranslation();
  const [data, setdata] = useState([]);
  const [onSubmit, setonSubmit] = useState("");
  const [showAddUpdateModal, setshowAddUpdateModal] = useState(false);
  const [updateModalData, setupdateModalData] = useState(null);
  const [updateIndex, setupdateIndex] = useState("");
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteIndex, setdeleteIndex] = useState("");
  const [deleteItem, setdeleteItem] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [rowCount, setrowCount] = useState(0);
  const [sorting_icon, setsorting_icon] = useState();
  const [deleteMessage, setdeleteMessage] = useState("");
  const [dataForTable, setDataForTable] = useState([]);

  const history = useHistory();

  const [showMapModal, setShowMapModal] = useState(false);
  const [mapData, setMapData] = useState([]);

  const [showInvoiceModal, setshowInvoiceModal] = useState(false);
  const [updateModalData1, setupdateModalData1] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showNetworkUserModal, setShowNetworkUserModal] = useState(false);

  const [paginationStates, setpaginationStates] = useState({
    itemsCountPerPage: "",
    activePage: "",
    totalItemsCount: "",
  });

  let check = "no";
  let check2 = "no";
  let pricing = [];
  let isNewData = "";

  const [searchData, setSearchData] = useState("");

  const [gasStationNetworkList, setgasStationNetworkList] = useState([]);
  const [handheldDeviceList, sethandheldDeviceList] = useState([]);

  const [fuelData, setFuelData] = useState([]);

  const [city, setCity] = useState([]);

  const [fuelprice, setFuelPrice] = useState([]);

  const [role, setRole] = useState({
    addStation: false,
    updateStation: false,
    deleteStation: false,
    viewStation: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.station.store") {
        // console.log("foundddddddddddddd", roles[i].subject);
        arr.addStation = true;
      } else if (roles[i].subject == "fm.station.update") {
        arr.updateStation = true;
      } else if (roles[i].subject == "fm.station.delete") {
        arr.deleteStation = true;
      } else if (roles[i].subject == "fm.station") {
        arr.viewStation = true;
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

  const setCheck = (str) => {
    check = str;
  };
  const setCheck2 = (str) => {
    check2 = str;
  };

  const setIsNewData = (args) => {
    console.log("new data check2", args);
    isNewData = args;
  };

  const onOpenMapModal = (item) => {
    if (
      helper.isObject(item) &&
      item.gas_stations &&
      item.gas_stations.length > 0
    ) {
      setMapData(item.gas_stations);
      setShowMapModal(true);
    }
  };

  const onOpenInvoiceModal = (item) => {
    if (helper.isObject(item)) {
      setupdateModalData1(item);
      setshowInvoiceModal(true);
    }
  };
  const onOpenTransferModal = (item) => {
    // console.log("in transfer model");
    if (helper.isObject(item)) {
      setupdateModalData1(item);
      setShowTransferModal(true);
    }
  };
  const onOpenNetworkModalModal = (item) => {
    if (helper.isObject(item) && item.users && item.users.length > 0) {
      item.users.forEach((user) => {
        if (user.designation == "gas_station_network_manager") {
          setupdateModalData1(user);

          setShowNetworkUserModal(true);
        }
      });
    }
  };

  const comission = (arr) => {
    pricing = arr;
    return pricing;
  };

  const sortAscending = (icon, sortType, colsort) => {
    if (
      colsort == "name_en" ||
      colsort == "name_ar" ||
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
    if (helper.isObject(rowData.hand_held_device)) {
      setdeleteMessage(rowData.status === 1 ? "Deactivate" : "activate");

      setdeleteItem(rowData);
      setdeleteIndex(index);
      setonSubmit("delete");
      setshowDeleteModal(true);
    } else {
      helper.toastNotification(
        "Please select a handheld device to activate the gas station",
        "FAILED_MESSAGE"
      );
    }
  };

  const onCloseDeleteModal = () => {
    setshowDeleteModal(false);
    setdeleteIndex("");
    setdeleteItem("");
    setonSubmit("");
  };

  const getNetworkID = () => {
    if (window.location.href.indexOf("/gas-station-network") > -1) {
      return JSON.parse(getUserData().gas_station_network_id);
    } else if (window.location.href.indexOf("/gas-station") > -1) {
      return helper.getIDfromUrl(window.location.href);
    }
  };

  const getData = () => {
    setoverlay(true);
    axios
      .get(
        `${
          jwtDefaultConfig.adminBaseUrl
        }/stations?page=${currentPage}&pagination=true&gas_station_network_id=${getNetworkID()}`,
        {}
      )
      .then((res) => {
        // helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
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
        gas_station_reference: item.reference ? item.reference : "",
        staff: item.staff && item.staff.length > 0 ? item.staff.length : 0,
        refueling_transactions:
          item.refueling_transactions && item.refueling_transactions.length > 0
            ? item.refueling_transactions.length
            : 0,

        status: item.status,

        created_at: item.created_at,
      });
    });
    setDataForTable(arr);
  };

  const create = (args) => {
    let p = [];
    // console.log("argssssssssss", args);
    // console.log("fuellllllllllll", fuelprice);

    if (args.price.value == "city price") {
      // console.log("in standard");
      fuelprice.forEach((element) => {
        let obj = {
          price: parseFloat(element.price).toFixed(2),
          fuel_type_id: element.id,
          extra_price: 0,
        };
        if (element.status == 1) {
          p.push(obj);
        }
      });
    } else if (args.price.value == "remote") {
      // console.log("in remote");

      fuelprice.forEach((element) => {
        console.log("element", element);
        let obj = {
          price: element.price
            ? (
                parseFloat(element.price) + parseFloat(element.extra_price)
              ).toFixed(2)
            : element.price.toFixed(2),
          fuel_type_id: element.id,
          extra_price: element.extra_price,
        };
        if (element.status == 1) {
          p.push(obj);
        }
      });
    }
    // console.log("argssssssssssss", args);
    // console.log("ppppppppppppp;", p);
    // return;
    setoverlay(true);
    // console.log("args", args);
    let arr = [];
    if (args.handheld_device.length > 0) {
      args.handheld_device.forEach((item) => {
        arr.push(item.value);
      });
    }

    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/station/store`, {
        gas_station: {
          name_en: args.name_en,
          name_ar: args.name_ar,
          name_ur: args.name_ur,
          address: args.address,
          latitude: args.lat,
          longitude: args.lng,
          working_hour_start: args.working_hour_start,
          working_hour_end: args.working_hour_end,
          gas_station_network_id: helper.getIDfromUrl(window.location.href)
            ? helper.getIDfromUrl(window.location.href)
            : getUserData().gas_station_network_id, //args.gas_station_network.value,
          fuel_91: args.fuel_91 ? 1 : 0,
          fuel_95: args.fuel_95 ? 1 : 0,
          diesel: args.diesel ? 1 : 0,
          dispenser_type: args.dispenser_type,
          geo_fence_radius: args.geo_fence_radius,
          handheld_device_id: arr.length > 0 ? arr : "",
          break_start_hours: args.break_start_hours,
          break_end_hours: args.break_end_hours,
          contact_no: args.contact_no,
          // operation_contact_person:
          //   check == true ? args.operation_contact_person : "",
          // operation_contact_number:
          //   check == true ? args.operation_contact_number : "",
          // operation_contact_email:
          //   check == true ? args.operation_contact_email : "",
          // operation_password: check == true ? args.operation_password : "",
          admin_contact_person: args.admin_contact_person,
          admin_contact_email: args.admin_contact_email,
          admin_contact_number: args.admin_contact_number,
          admin_password: args.admin_password,

          // billing_password: check2 == true ? args.billing_password : "",
          // billing_contact_person:
          //   check2 == true ? args.billing_contact_person : "",
          // billing_contact_email:
          //   check2 == true ? args.billing_contact_email : "",
          // billing_contact_number:
          //   check2 == true ? args.billing_contact_number : "",
          account_number: args.account_number,
          location_id: args.location_id.value ? args.location_id.value : "",
          wifi: args.wifi && helper.isObject(args.wifi) ? args.wifi.value : "",
          qualified:
            args.qualified && helper.isObject(args.qualified)
              ? args.qualified.value
              : "",
          fuel_price_type: args.price.value == "city price" ? "city" : "remote",
          reference: args.reference ? args.reference : "",
        },
        // pricing: pricing,
        fuel_price: p,
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
          let msg = res.data.message_en;
          if (msg.includes("already exist")) {
            setoverlay(false);
            helper.toastNotification(msg, "FAILED_MESSAGE");
          } else {
            setoverlay(false);
            helper.toastNotification(
              "Unable to process request.",
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
    // console.log("fuleproce", fuelprice);
    let p = [];
    if (args.price.value == "city price") {
      // console.log("in standard");
      fuelprice.forEach((element) => {
        let obj = {
          price: parseFloat(element.price).toFixed(2),

          fuel_type_id: element.id,
          id: element.price_id ? element.price_id : "",
          extra_price: 0,
        };
        if (element.status == 1) {
          p.push(obj);
        }
      });
    } else {
      fuelprice.forEach((element) => {
        let obj = {
          price: element.price
            ? (
                parseFloat(element.price) + parseFloat(element.extra_price)
              ).toFixed(2)
            : element.price.toFixed(2),
          fuel_type_id: element.id,
          id: element.price_id ? element.price_id : "",
          extra_price: element.extra_price,
        };
        if (element.status == 1) {
          p.push(obj);
        }
      });
    }
    console.log("argssssssssssss", args);

    console.log("ppppppppppp", p);
    // return;
    setoverlay(true);
    let arr = [];
    if (args.handheld_device.length > 0) {
      args.handheld_device.forEach((item) => {
        arr.push(item.id ? item.id : item.value);
      });
    }
    // console.log("arr", arr);
    // return;
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/station/update`, {
        gas_station: {
          gas_station_id: updateModalData.gas_station_id,
          name_en: args.name_en,
          name_ar: args.name_ar,
          name_ur: args.name_ur,
          address: args.address,
          latitude: args.lat,
          longitude: args.lng,
          working_hour_start: args.working_hour_start,
          working_hour_end: args.working_hour_end,
          gas_station_network_id: helper.getIDfromUrl(window.location.href)
            ? helper.getIDfromUrl(window.location.href)
            : getUserData().gas_station_network_id, //args.gas_station_network.value,          fuel_91: args.fuel_91 ? 1 : 0,
          fuel_95: args.fuel_95 ? 1 : 0,
          diesel: args.diesel ? 1 : 0,
          fuel_91: args.fuel_91 ? 1 : 0,
          dispenser_type: args.dispenser_type,
          geo_fence_radius: args.geo_fence_radius,
          handheld_device_id: arr.length > 0 ? arr : "",

          break_start_hours: args.break_start_hours,
          break_end_hours: args.break_end_hours,
          contact_no: args.contact_no,

          admin_contact_person: args.admin_contact_person,
          admin_contact_email: args.admin_contact_email,
          admin_contact_number: args.admin_contact_number,
          admin_password: args.admin_password ? args.admin_password : "",

          account_number: args.account_number,
          location_id: args.location_id.value ? args.location_id.value : "",
          wifi: args.wifi && helper.isObject(args.wifi) ? args.wifi.value : "",
          qualified:
            args.qualified && helper.isObject(args.qualified)
              ? args.qualified.value
              : "",
          fuel_price_type: args.price.value == "city price" ? "city" : "remote",
          reference: args.reference ? args.reference : "",
        },
        fuel_price: p,
        data: isNewData,
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setoverlay(false);
          setshowAddUpdateModal(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          if (props.data) {
            props.getSearchData;
          } else {
            getData();
          }
        } else {
          let msg = res.data.message_en;
          if (msg.includes("already exist")) {
            setoverlay(false);
            helper.toastNotification(msg, "FAILED_MESSAGE");
          } else {
            setoverlay(false);
            helper.toastNotification(
              "Unable to process request.",
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
      });
  };

  const remove = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/station/delete`, {
        gas_station: {
          gas_station_id: deleteItem.gas_station_id,
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

  const getGasStatonNetworks = () => {
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/gas-station-network`, {
        gas_station_network: {
          gas_station_network_id: getUserData().gas_station_network_id
            ? getUserData().gas_station_network_id
            : helper.getIDfromUrl(window.location.href),
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setgasStationNetworkList(res.data);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setgasStationNetworkList([]);
        }
      })
      .catch((error) => {
        setgasStationNetworkList([]);
      });
  };

  const getHandheldDevices = () => {
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/hand-held-devices?pagination=false&lang=en`
      )
      .then((res) => {
        console.log("handheld device", res);
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          sethandheldDeviceList(res.data.data);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          sethandheldDeviceList([]);
        }
      })
      .catch((error) => {
        sethandheldDeviceList([]);
      });
  };
  const filterData = (value) => {
    if (value.length >= 3) {
      setSearchData(value);
    } else {
      setSearchData("");
    }
  };

  const getFuelTypeData = () => {
    setoverlay(true);
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/fuel-types?page=${currentPage}&pagination=true`,
        {}
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(
            helper.applyCountID(res.data.data.data),
            "fuel type data"
          );
          setFuelData(helper.applyCountID(res.data.data.data));
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

  const getCity = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/all-locations?drop_down=true`, {})
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setCity(res.data.data);
          setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setCity([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setCity([]);
        setoverlay(false);
      });
  };

  useEffect(() => {
    setRoles();
    getCity();
    // if data is sent from seacrh module
    if (props.data) {
      setdata(props.data);
      getHandheldDevices();
    } else {
      // else get data from api
      getData();
      getGasStatonNetworks();
      getHandheldDevices();
      getFuelTypeData();
    }
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

      <Row style={{ marginBottom: "10px", marginTop: "10px" }}>
        <Col
          lg={12}
          // style={{
          //   display: "flex",
          //   alignItems: "center",

          //   justifyContent: "space-between",
          // }}
        >
          <Row>
            <Col style={{ maxWidth: "150px" }} sm={2}>
              <Button
                variant="outline-primary"
                color="primary"
                // className="btn"
                onClick={() => {
                  onOpenMapModal(gasStationNetworkList.gas_station_network);
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i
                    class="fa-solid fa-location-dot"
                    data-tip="Location"
                    style={{
                      fontSize: "18px",
                      color: "#1b663e",
                    }}
                  ></i>
                  <label style={{ marginLeft: "10px" }} color="primary">
                    Location
                  </label>
                </div>
              </Button>
            </Col>
            <Col style={{ maxWidth: "170px" }} sm={2}>
              <Button
                variant="outline-primary"
                color="primary"
                block
                onClick={() => {
                  onOpenTransferModal(
                    gasStationNetworkList.gas_station_network
                  );
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    style={{
                      fontSize: "18px",
                    }}
                    data-tip="Transfer Staff"
                    src={usersGreen}
                  />
                  <label style={{ marginLeft: "10px" }}>Transfer Staff</label>
                </div>
              </Button>
            </Col>
            <Col style={{ maxWidth: "230px" }} sm={2}>
              <Button
                variant="outline-primary"
                color="primary"
                block
                onClick={() => {
                  onOpenNetworkModalModal(
                    gasStationNetworkList.gas_station_network
                  );
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <User
                    data-tip="Gas Staton Network User"
                    size={16}
                    color="#2D7337"
                  />
                  <label style={{ marginLeft: "10px" }}>
                    Gas Station Network User
                  </label>
                </div>
              </Button>
            </Col>
            <Col style={{ maxWidth: "210px" }} sm={2}>
              <Button
                variant="outline-primary"
                color="primary"
                block
                onClick={() => {
                  if (
                    helper.isObject(gasStationNetworkList.gas_station_network)
                  ) {
                    history.push(
                      `/vrp/admin/network-account-statement/${
                        helper.isObject(
                          gasStationNetworkList.gas_station_network
                        )
                          ? gasStationNetworkList.gas_station_network
                              .gas_station_network_id
                          : ""
                      }`
                    );
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={transactionGreen} />
                  <label style={{ marginLeft: "5px" }}>
                    Statement of Account
                  </label>
                </div>
              </Button>
            </Col>
            <Col style={{ maxWidth: "150px" }} sm={2}>
              <Button
                variant="outline-primary"
                color="primary"
                block
                onClick={() => {
                  onOpenInvoiceModal(gasStationNetworkList.gas_station_network);
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={invoice} />
                  <label style={{ marginLeft: "5px" }}>Invoices</label>
                </div>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Row>
            <Col>
              <div
                className="well well-sm"
                style={{
                  // background: "pink",
                  background: "#fff",
                  boxShadow: "0 4px 24px 0 rgb(34 41 47 / 10%)",
                  borderRadius: "5px",
                  height: "176px",
                }}
              >
                <div className="row">
                  <div className="col-sm-6 col-md-5">
                    <img
                      src={avatar}
                      style={{
                        // width: "100%",
                        height: "88%",
                        borderRadius: "5px",
                        background: "pink",
                      }}
                      className="img-rounded img-responsive"
                    />
                  </div>
                  <div className="col-sm-6 col-md-7">
                    <h6
                      style={{
                        marginTop: "15px",
                        width: "95%",
                        marginBottom: "10px",
                        flex: "inline",
                      }}
                    >
                      {helper.isObject(
                        gasStationNetworkList.gas_station_network
                      )
                        ? gasStationNetworkList.gas_station_network.name_en
                        : "----"}
                    </h6>

                    <p>
                      <img src={location} style={{ marginRight: "5px" }} />{" "}
                      {t("Location")}:{" "}
                      {helper.isObject(
                        gasStationNetworkList.gas_station_network
                      )
                        ? gasStationNetworkList.gas_station_network.address
                        : "---"}
                    </p>
                    <p>
                      <img src={contract} style={{ marginRight: "5px" }} />{" "}
                      {t("Contract Number")}:{" "}
                      {helper.isObject(
                        gasStationNetworkList.gas_station_network
                      )
                        ? gasStationNetworkList.gas_station_network.contract_no
                        : "---"}
                    </p>
                    <p>
                      <img src={calendar} style={{ marginRight: "5px" }} />{" "}
                      {t("Contract Start Date")}:{" "}
                      {helper.isObject(
                        gasStationNetworkList.gas_station_network
                      )
                        ? gasStationNetworkList.gas_station_network
                            .contract_start_date
                        : "---"}
                    </p>
                    <p>
                      <img src={calendar} style={{ marginRight: "5px" }} />{" "}
                      {t("Contract Start End")}:{" "}
                      {helper.isObject(
                        gasStationNetworkList.gas_station_network
                      )
                        ? gasStationNetworkList.gas_station_network
                            .contract_end_date
                        : "---"}
                    </p>

                    {window.location.pathname.split("/")[1] == "admin" ? (
                      <div
                        className="form-switch form-check-success"
                        style={{ marginTop: "5px" }}
                      >
                        <Input
                          type="switch"
                          // defaultChecked={props.data.status === 1 ? true : false}
                          checked={props.data.status == 1 ? true : false}
                          id={`icon-success${3}`}
                          name={`icon-success${3}`}
                          onChange={(e) => onOpenDeleteModal(props.data)}
                        />
                        <CustomLabel htmlFor={`icon-success${3}`} />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </Col>

            <Col>
              <div
              // className="col-xs-12 col-sm-6 col-md-6"
              >
                <Row className="match-height">
                  <Col>
                    <StatsCard
                      cols={{
                        xl: "6",
                        sm: "6",
                        stats: helper.isObject(gasStationNetworkList)
                          ? gasStationNetworkList
                          : "",
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row style={{ marginTop: "30px" }}>
        <Col lg={12}>
          {props.data ? (
            ""
          ) : (
            <Row>
              <Col
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <i
                  style={{ marginRight: "15px", cursor: "pointer" }}
                  onClick={() => {
                    history.back();
                  }}
                  class="fa-solid fa-circle-arrow-left fa-2xl"
                ></i>
                {role.addStation ? (
                  <Button onClick={(e) => openCreateModal()}>
                    <i className="fas fa-plus"></i> {t("Add Gas Station")}
                  </Button>
                ) : (
                  ""
                )}
                <input
                  className="form-control crud-search"
                  placeholder="Search ..."
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
          )}
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
              <th className="table-th blackColor" style={{ width: "120px" }}>
                <p>
                  {t("Gas Station Reference")}
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

              <th className="table-th blackColor" style={{ width: "120px" }}>
                <p>
                  {t("No. of Staff")}
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

              <th className="table-th blackColor" style={{ width: "120px" }}>
                <p>
                  {t("Refuelling Transactions")}
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
                        sortAscending("Col3_des", "des", "created_at")
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
                      <Link
                        to={
                          window.location.href.indexOf("/admin/") > -1
                            ? `/vrp/admin/gas-station-detail/${item.gas_station_id}`
                            : window.location.href.indexOf("/gas-station/") > -1
                            ? `/vrp/gas-station/network-gas-station-detail/${item.gas_station_id}`
                            : ""
                        }
                      >
                        <div className="d-flex justify-content-left align-items-center">
                          <div className="avatar me-1 bg-light-success">
                            <span className="avatar-content">
                              {helper.FirstWordFirstChar(item.name_en)}
                              {helper.SecondWordFirstChar(item.name_en)}
                            </span>
                          </div>
                          <div className="d-flex flex-column">
                            <a className="user_name text-truncate text-body">
                              <span className="fw-bolder">
                                {helper.shortTextWithDots(item.name_en, 50)}
                              </span>
                            </a>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td>{item.reference ? item.reference : ""}</td>
                    <td>{item.staff ? item.staff.length : ""}</td>

                    <td>
                      {item.refueling_transactions
                        ? item.refueling_transactions.length
                        : ""}
                    </td>
                    <td>{helper.humanReadableDate(item.created_at)}</td>
                    <td>
                      {role.deleteStation ? (
                        <div className="form-switch form-check-success">
                          <Input
                            type="switch"
                            // defaultChecked={item.status === 1 ? true : false}
                            checked={
                              item.hand_held_device.length > 0 &&
                              item.status == 1
                                ? true
                                : false
                            }
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
                      <div style={{ display: "flex" }}>
                        {role.updateStation ? (
                          <Edit
                            data-tip="Update"
                            size={16}
                            onClick={(e) => onOpenUpdateModal(item, index)}
                            style={{ marginTop: "4px", marginRight: "5px" }}
                          />
                        ) : (
                          ""
                        )}
                        {role.viewStation ? (
                          <Link
                            to={
                              window.location.href.indexOf("/admin/") > -1
                                ? `/vrp/admin/gas-station-detail/${item.gas_station_id}`
                                : window.location.href.indexOf(
                                    "/gas-station/"
                                  ) > -1
                                ? `/vrp/gas-station/network-gas-station-detail/${item.gas_station_id}`
                                : ""
                            }
                          >
                            <img
                              src={detailIcon}
                              style={{ marginTop: "4px" }}
                            />
                          </Link>
                        ) : (
                          ""
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
          gasStationNetworkList={gasStationNetworkList}
          handheldDeviceList={handheldDeviceList}
          setCheck={setCheck}
          setCheck2={setCheck2}
          fuelData={fuelData}
          setFuelData={setFuelData}
          comission={comission}
          setIsNewData={setIsNewData}
          city={city}
          setFuelPrice={setFuelPrice}
        />
        <DeleteModal
          show={showDeleteModal}
          confirmationText={`Are you sure to ${deleteMessage} a gas station network ?`}
          confirmationHeading={`${helper.uppercaseFirst(
            deleteMessage
          )} a gas station network ?`}
          onHide={onCloseDeleteModal}
          submitAction={submitAction}
        />
        <Maps
          show={showMapModal}
          onCloseModal={() => setShowMapModal(false)}
          disableBtn={overlay}
          data={mapData}
        />
        <InvoiceModal
          show={showInvoiceModal}
          updateModalData={updateModalData1}
          disableBtn={overlay}
          onHide={() => setshowInvoiceModal(false)}
        />
        <Transfer
          show={showTransferModal}
          onCloseModal={() => setShowTransferModal(false)}
          disableBtn={overlay}
          transferModalData={updateModalData1}
          setShowTransferModal={setShowTransferModal}
        />
        <NetworkUser
          show={showNetworkUserModal}
          onHide={() => setShowNetworkUserModal(false)}
          disableBtn={overlay}
          updateModalData={updateModalData1}
          submitAction={() => setShowNetworkUserModal(false)}
        />
      </div>
    </div>
  );
}
