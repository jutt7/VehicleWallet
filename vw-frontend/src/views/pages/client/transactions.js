import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
import { Check, X, Edit, Trash2 } from "react-feather";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import AddUpdateModal from "../refueling-transactions/AddUpdateModal";
import ZoomableImageModal from "../refueling-transactions/imagePopup";

import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import station from "@src/assets/images/icons/client-station.png";
import bankcard from "@src/assets/images/icons/bank-card.png";
import vehicles from "@src/assets/images/icons/vehicles.png";
import pump from "@src/assets/images/icons/fuel-pump.png";
import driver from "@src/assets/images/icons/driver-icon.png";
import mobile from "@src/assets/images/icons/contact.png";
import resident from "@src/assets/images/icons/resident.png";
import user from "@src/assets/images/icons/user.png";
import fuelType from "@src/assets/images/icons/oil-bottle.png";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { getUserData } from "@utils";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { Card, CardBody, CardTitle, CardHeader } from "reactstrap";

import { useTranslation } from "react-i18next";
import ApproveModal from "../approve-topup/AprroveModal";

export default function client(props) {
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [onSubmit, setonSubmit] = useState("");
  const [showAddUpdateModal, setshowAddUpdateModal] = useState(false);
  const [updateModalData, setupdateModalData] = useState(null);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  // const [deleteItem, setdeleteItem] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [deleteMessage, setdeleteMessage] = useState("");
  const [sorting_icon, setsorting_icon] = useState();
  const [paginationStates, setpaginationStates] = useState({
    itemsCountPerPage: "",
    activePage: "",
    totalItemsCount: "",
  });

  const { t } = useTranslation();

  const [transactionPicker, settransactionPicker] = useState("");
  const [status, setstatus] = useState("");
  const [isOpenImgDialog, setisOpenImgDialog] = useState(false);
  const [imgDialog, setimgDialog] = useState("");

  const [showApproveModal, setshowApproveModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState("");

  const [allDrivers, setAllDrivers] = useState([]);
  const [selectDriver, setSelectDriver] = useState("");
  const [allVehicles, setAllVehicles] = useState([]);
  const [selectVehicle, setSelectVehicle] = useState("");

  const [role, setRole] = useState({
    delete: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.driver_expire_request") {
        arr.delete = true;
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
      DeleteRequest(deleteItem);
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

  const onOpenApproveModal = (rowData) => {
    setonSubmit("delete");
    setDeleteItem(rowData);
    setshowApproveModal(true);
  };

  const onCloseApproveModal = () => {
    setDeleteItem("");
    setshowApproveModal(false);
  };

  const onCurrPageChange = (page) => {
    setcurrentPage(page);

    console.log(page, "testing data", currentPage);
  };
  useEffect(() => {
    getData();
  }, [currentPage]);

  const openCreateModal = () => {
    setupdateModalData(null);
    setonSubmit("create");
    setshowAddUpdateModal(true);
  };

  const onOpenUpdateModal = (item, index) => {
    getTransactionDetail(item.refueling_transaction.id);
  };

  const onCloseAddUpdateModal = () => {
    setshowAddUpdateModal(false);
    // setupdateIndex(null);
    // setonSubmit(null);
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

  const refreshFilter = () => {
    // settransactionPicker("");
    // setstatus("");

    setoverlay(true);
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/expire_requests`)
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setoverlay(false);
          getData();
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
        setdata([]);
        setoverlay(false);
      });
  };

  const hideImageDialog = () => {
    setisOpenImgDialog(false);
    setimgDialog("");
  };

  const handleShowDialog = (imgSrc) => {
    setisOpenImgDialog(!isOpenImgDialog);
    setimgDialog(imgSrc);
  };

  const getData = () => {
    let to = "";
    let from = "";
    let transaction_status = "";

    if (helper.isObject(transactionPicker)) {
      from = helper.formatDateInHashes(transactionPicker[0]);
      to = helper.formatDateInHashes(transactionPicker[1]);
    }

    if (helper.isObject(status)) {
      transaction_status = status.value;
    }

    setoverlay(true);
    axios
      .get(
        `${
          jwtDefaultConfig.adminBaseUrl
        }/fuel_requests?page=${currentPage}&from=${from}&to=${to}&transaction_status=${transaction_status}&client_id=${
          props.clientID ? props.clientID : getUserData().client_id
        }&driver_id=${selectDriver}&vehicle_id=${selectVehicle}`
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setdata(helper.applyCountID(res.data.data.data));
          // setdata(helper.applyCountID(res.data.data.data));
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
  const DeleteRequest = (data) => {
    setoverlay(true);
    setshowApproveModal(false);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/expire_request`, {
        request: {
          fuel_req_id: data.fuel_req_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setoverlay(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          getData();
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
  const getReqData = (data) => {
    if (helper.isObject(data.previous_transaction)) {
      return data.previous_transaction;
    }
  };
  const getAmount = (data) => {
    if (helper.isObject(data.previous_transaction)) {
      // console.log(
      //   data.previous_transaction.fuel_request_logs[0].latitude,
      //   "in get amount"
      // );
      return data.previous_transaction.amount;
    } else {
      return "not found";
    }
  };
  const getLitr = (data) => {
    if (helper.isObject(data.previous_transaction)) {
      return data.previous_transaction.liters;
    }
  };
  const getDriverLat = (data) => {
    if (helper.isObject(data.previous_transaction.fuel_request_logs)) {
      return data.previous_transaction.fuel_request_logs[0].latitude;
    }
  };
  const getDriverLong = (data) => {
    if (helper.isObject(data.previous_transaction.fuel_request_logs)) {
      return data.previous_transaction.fuel_request_logs[0].longitude;
    }
  };
  const getStationLat = (data) => {
    let obj;
    if (helper.isObject(data.previous_transaction.fuel_request_logs)) {
      obj = data.previous_transaction.fuel_request_logs.find(
        (o) => o.request_status === "refueling"
      );
      return helper.isObject(obj) && obj.latitude ? obj.latitude : "";
    }
  };
  const getStationLong = (data) => {
    let obj;
    if (helper.isObject(data.previous_transaction.fuel_request_logs)) {
      obj = data.previous_transaction.fuel_request_logs.find(
        (o) => o.request_status === "refueling"
      );
      return helper.isObject(obj) && obj.longitude ? obj.longitude : "";
    }
  };
  const getImg = (data) => {
    let obj;
    if (helper.isObject(data.previous_transaction.fuel_request_logs)) {
      obj = data.previous_transaction.fuel_request_logs.find(
        (o) => o.request_status === "refueling"
      );
      // return obj.time_line_image;
      return helper.isObject(obj) && obj.time_line_image
        ? obj.time_line_image
        : "https://www.freeiconspng.com/uploads/no-image-icon-15.png";
    }
  };
  const getStationDate = (data) => {
    let obj;
    if (helper.isObject(data.previous_transaction.fuel_request_logs)) {
      obj = data.previous_transaction.fuel_request_logs.find(
        (o) => o.request_status === "refueling"
      );
      return helper.isObject(obj) && obj.mobile_date_time
        ? helper.humanReadableDate(obj.created_at)
        : "";
    }
  };

  const getAllDrivers = () => {
    // console.log('useeeeeeeeeeeeeeeer', getUserData());
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/drivers`, {
        client: {
          clientId: props.clientID ? props.clientID : getUserData().client_id,
        },
      })
      .then(async (res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log("all driversssssss", res.data.data);
          // let arr = [];
          // res.data.data.data.forEach((item) => {
          //   let obj = {
          //     label: item.first_name + item.last_name ? item.last_name : "",
          //     value: item.driver_id,
          //   };
          //   arr.push(obj);
          // });
          setAllDrivers(res.data.data);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
        }
      })
      .catch((error) => {});
  };
  const getAllVehicles = () => {
    axios
      .post(
        `${jwtDefaultConfig.adminBaseUrl}/vehicles?page=${currentPage}&pagination=true`,
        {
          client: {
            clientId: props.clientID ? props.clientID : getUserData().client_id,
          },
        }
      )
      .then(async (res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log("all vehicles", res.data.data);
          let arr = [];
          res.data.data.data.forEach((item) => {
            let obj = {
              label: item.plate_no,
              value: item.vehicle_id,
            };
            arr.push(obj);
          });

          setAllVehicles(arr);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
        }
      })
      .catch((error) => {});
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

  const getTransactionDetail = (id) => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/refueling-transaction`, {
        refueling_transaction: {
          id: id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setupdateModalData(res.data.refueling_transaction);
          setshowAddUpdateModal(true);
          // setupdateIndex(index);
          // setonSubmit("update");
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

  const getStatusLabels = (data) => {
    // if (!data.length) return false;

    if (data.transaction_status == 6) {
      return (
        <div>
          <span class="badge bg-danger rounded-pill">Transaction Expired</span>
        </div>
      );
    }

    if (data.transaction_status == 5) {
      return (
        <div>
          <span class="badge" style={{ background: "#71c87e" }}>
            Request Approved
          </span>
        </div>
      );
    }
    if (data.transaction_status == 4) {
      return (
        <div>
          <span class="badge bg-light-info rounded-pill">
            Number Plate Scan
          </span>
        </div>
      );
    }
    if (data.transaction_status == 3) {
      return (
        <div>
          <span class="badge bg-secondary">Held Transaction</span>
        </div>
      );
    }
    if (data.transaction_status == 1) {
      return (
        <div>
          <span class="badge bg-primary">Transaction Completed</span>
        </div>
      );
    }

    // if (data[data.length - 1].request_status === "request_approved") {
    //   return (
    //     <div>
    //       <span class="badge" style={{ background: "#71c87e" }}>
    //         Request Approved
    //       </span>
    //     </div>
    //   );
    // }
    // if (data[data.length - 1].request_status === "request_pending") {
    //   return (
    //     <div>
    //       <span class="badge bg-warning">Pending Request</span>
    //     </div>
    //   );
    // }
    // if (data[data.length - 1].request_status === "transaction_initiated") {
    //   return (
    //     <div>
    //       <span class="badge bg-info">Transaction Initiated</span>
    //     </div>
    //   );
    // }
    // if (data[data.length - 1].request_status === "transaction_held") {
    //   return (
    //     <div>
    //       <span class="badge bg-secondary">Transaction Held</span>
    //     </div>
    //   );
    // }
    // if (data[data.length - 1].request_status === "transaction_completed") {
    //   return (
    //     <div>
    //       <span class="badge bg-primary">Transaction Completed</span>
    //     </div>
    //   );
    // }
    // if (
    //   data[data.length - 1].request_status === "transaction_pending_with_client"
    // ) {
    //   return (
    //     <div>
    //       <span class="badge bg-light-info rounded-pill">
    //         Transaction pending with client
    //       </span>
    //     </div>
    //   );
    // }
    // if (
    //   data[data.length - 1].request_status === "transaction_pending_with_vw"
    // ) {
    //   return (
    //     <div>
    //       <span class="badge bg-light-info rounded-pill">
    //         Transaction pending with vw
    //       </span>
    //     </div>
    //   );
    // }
    // if (
    //   data[data.length - 1].request_status === "transaction_pending_with_vw"
    // ) {
    //   return (
    //     <div>
    //       <span class="badge bg-light-info rounded-pill">
    //         Transaction pending with vw
    //       </span>
    //     </div>
    //   );
    // }
    // if (data[data.length - 1].request_status === "request_expire") {
    //   return (
    //     <div>
    //       <span class="badge bg-danger rounded-pill">Transaction expired</span>
    //     </div>
    //   );
    // }
    // if (data[data.length - 1].request_status === "number_plate_scan") {
    //   return (
    //     <div>
    //       <span class="badge bg-light-info rounded-pill">
    //         Number Plate Scaned
    //       </span>
    //     </div>
    //   );
    // }
    // if (data[data.length - 1].request_status === "refueling") {
    //   return (
    //     <div>
    //       <span class="badge bg-light-info rounded-pill">Refueling</span>
    //     </div>
    //   );
    // }
    else {
      return;
    }
  };

  const getStatusData = (data, status) => {
    let findData = {};
    findData = data.find((logs) => logs.request_status == status);
    return findData ? findData : "";
  };

  const getSupervisorDetail = (data, arg) => {
    let obj = {
      name: "",
      mobile: "",
      civil_record_or_resident_permit_number: "",
    };
    if (
      helper.isObject(data.refueling_transaction) &&
      helper.isObject(data.refueling_transaction.gas_station) &&
      data.refueling_transaction.gas_station.staff &&
      data.refueling_transaction.gas_station.staff.length > 0
    ) {
      data.refueling_transaction.gas_station.staff.forEach((item) => {
        if (item.designation == "super visor") {
          // console.log("itemmmmmmmmm", item);
          obj.name = item.first_name + " " + item.last_name;
          obj.mobile = item.mobile ? item.mobile : "";
          obj.civil_record_or_resident_permit_number =
            item.civil_record_or_resident_permit_number
              ? item.civil_record_or_resident_permit_number
              : "";
        }
      });
    }
    // console.log("objjjjjjj", obj);
    if (arg == "name") {
      return obj.name;
    }
    if (arg == "mobile") {
      return obj.mobile;
    }
    if (arg == "id") {
      return obj.civil_record_or_resident_permit_number;
    }
  };

  useEffect(() => {
    setRoles();
    getData();
    getAllDrivers();
    getAllVehicles();
    // getGasStation();
    // getFuelType();
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
            {t("Client Transactions")} {props.clientName}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Row>
            <Col lg={12}>
              <Row>
                {/* <Col sm="3">
              <Label className="form-label" for="range-picker">
                Request date range
              </Label>
              <Flatpickr
                value={requestPicker}
                id="range-picker"
                className="form-control"
                onChange={(date) => setrequestPicker(date)}
                options={{
                  mode: "range",
                  defaultDate: ["2020-02-01", "2020-02-15"],
                }}
              />
            </Col> */}
                <Col sm="3">
                  <Label
                    className="form-label"
                    for="range-picker2"
                    style={{ fontWeight: "bold", fontSize: "1em" }}
                  >
                    {t("Transaction date range")}
                  </Label>
                  <Flatpickr
                    color={"red"}
                    value={transactionPicker}
                    id="range-picker2"
                    className="form-control"
                    onChange={(date) => settransactionPicker(date)}
                    options={{
                      mode: "range",
                    }}
                  />
                </Col>
                <Col sm="3">
                  <label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    {t("Status")}
                  </label>
                  <Select
                    name="select-status"
                    style={{ height: "40px" }}
                    onChange={(e) => setstatus(e)}
                    options={[
                      {
                        label: "Transaction Expired",
                        value: 6,
                      },
                      {
                        label: "Request Approved",
                        value: 5,
                      },
                      {
                        label: "Held Transaction",
                        value: 3,
                      },
                      {
                        label: "Number Plate Scan",
                        value: 4,
                      },
                      {
                        label: "Transaction Completed",
                        value: 1,
                      },
                    ]}
                    value={status || []}
                    isClearable={true}
                  />
                </Col>
                <Col sm="2">
                  <label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    {t("Driver")}
                  </label>
                  <Select
                    name="select-status"
                    style={{ height: "40px" }}
                    onChange={(e) => {
                      if (e) {
                        setSelectDriver(e.value);
                      } else {
                        setSelectDriver("");
                      }
                    }}
                    options={allDrivers}
                    // value={status || []}
                    isClearable={true}
                  />
                </Col>
                <Col sm="2">
                  <label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    {t("Vehicle")}
                  </label>
                  <Select
                    name="select-status"
                    style={{ height: "40px" }}
                    onChange={(e) => {
                      if (e) {
                        setSelectVehicle(e.value);
                      } else {
                        setSelectVehicle("");
                      }
                    }}
                    options={allVehicles}
                    // value={status || []}
                    isClearable={true}
                  />
                </Col>
                <Col sm="2">
                  <Button
                    style={{ marginTop: "19px" }}
                    onClick={(e) => getData()}
                  >
                    <i className="fa fa-search"></i>
                  </Button>
                  <Button
                    style={{ marginTop: "19px", marginLeft: "5px" }}
                    onClick={(e) => refreshFilter()}
                  >
                    <i className="fa fa-refresh"></i>
                  </Button>
                </Col>
                <Col>
                  <div
                    className={`fleetPaginator`}
                    style={{ marginTop: "30px" }}
                  >
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
            {/* <Col lg={12}>
          <Row>
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
        </Col> */}
          </Row>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="table-th blackColor">
                    <p>
                      {t("Fuel Request")} #
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
                      {t("Transaction")} #
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
                      {t("Current Amount")}
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
                    <p style={{ marginTop: "1px" }}>
                      {t("Liter")}
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
                      {t("Previous Amount")}
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
                    <p style={{ marginTop: "1px" }}>
                      {t("Liter")}
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

                  {/* <th className="table-th blackColor">
                    <p>{t("Pending with")}</p>
                  </th> */}

                  <th className="table-th blackColor">
                    <p>{t("Status")}</p>
                  </th>
                </tr>
              </thead>

              <tbody>
                {data && data.length > 0 ? (
                  data &&
                  data.map((item, index) => (
                    <tr key={index}>
                      <td style={{ background: "#f1fff0" }}>
                        {role.delete &&
                        item.transaction_status &&
                        item.transaction_status == 5 ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "end",
                            }}
                          >
                            <Trash2
                              data-tip="Delete Request"
                              size={16}
                              color="red"
                              onClick={(e) => onOpenApproveModal(item)}
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
                        <a
                          onClick={(e) => onOpenUpdateModal(item, index)}
                          href="#"
                        >
                          <div class="d-flex justify-content-left align-items-center">
                            <div class="avatar me-1 bg-light-primary">
                              <span class="avatar-content">
                                <img src={pump} />
                              </span>
                            </div>
                            <div class="d-flex flex-column">
                              <a class="user_name text-truncate text-body">
                                <span class="fw-bolder">
                                  {item.fuel_req_id}
                                </span>
                              </a>
                              <small class="text-truncate text-muted mb-0">
                                <i
                                  class="fa fa-clock-o"
                                  style={{
                                    color: "#2d7337",
                                    marginRight: "2px",
                                  }}
                                ></i>
                                {helper.isObject(
                                  getStatusData(
                                    item.fuel_request_logs,
                                    "request_approved"
                                  )
                                )
                                  ? helper.humanReadableDate(
                                      getStatusData(
                                        item.fuel_request_logs,
                                        "request_approved"
                                      ).created_at
                                    )
                                  : ""}
                              </small>
                            </div>
                          </div>

                          <div
                            class="d-flex justify-content-left align-items-center"
                            style={{ marginTop: "5px" }}
                          >
                            <div class="avatar me-1 bg-light-primary">
                              <span class="avatar-content">
                                <img src={vehicles} />
                              </span>
                            </div>
                            <div class="d-flex flex-column">
                              <a class="user_name text-truncate text-body">
                                <span class="fw-bolder">
                                  {helper.isObject(item.vehicle)
                                    ? helper.shortTextWithDots(
                                        item.vehicle.plate_no,
                                        20
                                      )
                                    : ""}
                                </span>
                              </a>
                              <small class="text-truncate text-muted mb-0">
                                <img
                                  src={user}
                                  style={{ marginRight: "2px", width: "10px" }}
                                />{" "}
                                Client:{" "}
                                {helper.isObject(item.driver) &&
                                helper.isObject(item.driver.client)
                                  ? helper.shortTextWithDots(
                                      `${item.driver.client.name_en}`,
                                      20
                                    )
                                  : ""}
                              </small>
                              <small class="text-truncate text-muted mb-0">
                                <img
                                  src={driver}
                                  style={{ marginRight: "2px", width: "10px" }}
                                />{" "}
                                Driver:{" "}
                                {helper.isObject(item.driver) &&
                                  helper.shortTextWithDots(
                                    `${item.driver.first_name} ${item.driver.middle_name} ${item.driver.last_name}`,
                                    20
                                  )}
                              </small>
                              <small class="text-truncate text-muted mb-0">
                                <img
                                  src={mobile}
                                  style={{ marginRight: "2px", width: "10px" }}
                                />{" "}
                                Driver Mobile:{" "}
                                {helper.isObject(item.driver) &&
                                  item.driver.mobile}
                              </small>
                              <small class="text-truncate text-muted mb-0">
                                <img
                                  src={resident}
                                  style={{ marginRight: "2px", width: "10px" }}
                                />{" "}
                                Resident #:{" "}
                                {helper.isObject(item.driver) &&
                                  item.driver
                                    .civil_record_or_resident_permit_number}
                              </small>
                              <small class="text-truncate text-muted mb-0">
                                <img
                                  src={fuelType}
                                  style={{ marginRight: "2px", width: "10px" }}
                                />{" "}
                                Fuel Type:{" "}
                                {helper.isObject(item.vehicle) &&
                                helper.isObject(item.vehicle.vehicle_fuel_type)
                                  ? item.vehicle.vehicle_fuel_type.title_en
                                  : ""}
                              </small>
                            </div>
                          </div>
                        </a>
                      </td>

                      <td style={{ background: "#e0f9de" }}>
                        {helper.isObject(item.refueling_transaction) ? (
                          <div>
                            <div class="d-flex justify-content-left align-items-center">
                              <div class="avatar me-1 bg-light-primary">
                                <span class="avatar-content">
                                  {helper.isObject(
                                    getStatusData(
                                      item.fuel_request_logs,
                                      "number_plate_scan"
                                    )
                                  ) ? (
                                    <img
                                      onClick={(e) =>
                                        handleShowDialog(
                                          getStatusData(
                                            item.fuel_request_logs,
                                            "number_plate_scan"
                                          ).time_line_image
                                            ? getStatusData(
                                                item.fuel_request_logs,
                                                "number_plate_scan"
                                              ).time_line_image
                                            : "https://www.freeiconspng.com/uploads/no-image-icon-15.png"
                                        )
                                      }
                                      style={{ width: "30px", height: "30px" }}
                                      src={`${
                                        getStatusData(
                                          item.fuel_request_logs,
                                          "number_plate_scan"
                                        ).time_line_image
                                          ? getStatusData(
                                              item.fuel_request_logs,
                                              "number_plate_scan"
                                            ).time_line_image
                                          : "https://www.freeiconspng.com/uploads/no-image-icon-15.png"
                                      }`}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </span>
                              </div>
                              <div class="d-flex flex-column">
                                <a
                                  class="user_name text-truncate text-body"
                                  onClick={(e) =>
                                    onOpenUpdateModal(item, index)
                                  }
                                  href="#"
                                >
                                  <span class="fw-bolder">
                                    {
                                      item.refueling_transaction
                                        .reference_number
                                    }
                                  </span>
                                </a>
                                <small class="text-truncate text-muted mb-0">
                                  <i
                                    class="fa fa-clock-o"
                                    style={{
                                      color: "#2d7337",
                                      marginRight: "2px",
                                    }}
                                  ></i>{" "}
                                  {helper.isObject(
                                    getStatusData(
                                      item.fuel_request_logs,
                                      "number_plate_scan"
                                    )
                                  )
                                    ? helper.humanReadableDate(
                                        getStatusData(
                                          item.fuel_request_logs,
                                          "number_plate_scan"
                                        ).created_at
                                      )
                                    : ""}
                                </small>
                              </div>
                            </div>

                            {helper.isObject(item.refueling_transaction) ? (
                              <>
                                <div
                                  class="d-flex justify-content-left align-items-center"
                                  style={{ marginTop: "10px" }}
                                >
                                  <div class="avatar me-1 bg-light-primary">
                                    <span class="avatar-content">
                                      <img src={station} />
                                    </span>
                                  </div>
                                  <div class="d-flex flex-column">
                                    <a class="user_name text-truncate text-body">
                                      <span class="fw-bolder">
                                        {helper.isObject(
                                          item.refueling_transaction.gas_station
                                        )
                                          ? helper.shortTextWithDots(
                                              item.refueling_transaction
                                                .gas_station.name_en,
                                              20
                                            )
                                          : ""}
                                      </span>
                                    </a>
                                    <small class="text-truncate text-muted mb-0">
                                      <i
                                        class="fa-solid fa-diagram-project"
                                        style={{
                                          color: "#2d7337",
                                          marginRight: "2px",
                                        }}
                                      />
                                      {helper.isObject(
                                        item.refueling_transaction.gas_station
                                          .gas_station_network
                                      )
                                        ? helper.shortTextWithDots(
                                            item.refueling_transaction
                                              .gas_station.gas_station_network
                                              .name_en,
                                            20
                                          )
                                        : ""}{" "}
                                    </small>
                                  </div>
                                </div>

                                <div
                                  class="d-flex justify-content-left align-items-center"
                                  style={{ marginTop: "10px" }}
                                >
                                  <div class="avatar me-1 bg-light-primary">
                                    <span class="avatar-content">
                                      {helper.isObject(
                                        item.refueling_transaction
                                          .gas_station_attendent
                                      ) &&
                                        helper.FirstWordFirstChar(
                                          item.refueling_transaction
                                            .gas_station_attendent.first_name
                                        )}
                                      {helper.isObject(
                                        item.refueling_transaction
                                          .gas_station_attendent
                                      ) &&
                                        helper.FirstWordFirstChar(
                                          item.refueling_transaction
                                            .gas_station_attendent.last_name
                                        )}
                                    </span>
                                  </div>
                                  <div class="d-flex flex-column">
                                    <a class="user_name text-truncate text-body">
                                      <span class="fw-bolder">
                                        {helper.isObject(
                                          item.refueling_transaction
                                            .gas_station_attendent
                                        ) &&
                                          helper.shortTextWithDots(
                                            `${item.refueling_transaction.gas_station_attendent.first_name} ${item.refueling_transaction.gas_station_attendent.middle_name} ${item.refueling_transaction.gas_station_attendent.last_name}`,
                                            20
                                          )}
                                      </span>
                                    </a>
                                    <small class="text-truncate text-muted mb-0">
                                      <img
                                        src={mobile}
                                        style={{
                                          marginRight: "2px",
                                          width: "10px",
                                        }}
                                      />{" "}
                                      {helper.isObject(
                                        item.refueling_transaction
                                          .gas_station_attendent
                                      )
                                        ? item.refueling_transaction
                                            .gas_station_attendent.mobile
                                        : ""}
                                    </small>
                                  </div>
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </td>

                      <td style={{ background: "#d2f7cf" }}>
                        {helper.isObject(item.refueling_transaction) &&
                        item.refueling_transaction.amount &&
                        item.refueling_transaction.liters ? (
                          <>
                            <div class="d-flex justify-content-left align-items-center">
                              <div class="avatar me-1 bg-light-primary">
                                <span class="avatar-content">
                                  {helper.isObject(
                                    getStatusData(
                                      item.fuel_request_logs,
                                      "number_plate_scan"
                                    )
                                  ) ? (
                                    <img
                                      onClick={(e) =>
                                        handleShowDialog(
                                          getStatusData(
                                            item.fuel_request_logs,
                                            "refueling"
                                          ).time_line_image
                                            ? getStatusData(
                                                item.fuel_request_logs,
                                                "refueling"
                                              ).time_line_image
                                            : "https://www.freeiconspng.com/uploads/no-image-icon-15.png"
                                        )
                                      }
                                      style={{ width: "30px", height: "30px" }}
                                      src={`${
                                        getStatusData(
                                          item.fuel_request_logs,
                                          "refueling"
                                        ).time_line_image
                                          ? getStatusData(
                                              item.fuel_request_logs,
                                              "refueling"
                                            ).time_line_image
                                          : "https://www.freeiconspng.com/uploads/no-image-icon-15.png"
                                      }`}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </span>
                              </div>
                              <div class="d-flex flex-column">
                                <a class="user_name text-truncate text-body">
                                  <p class="fw-bolder">
                                    {item.refueling_transaction.amount
                                      ? `${item.refueling_transaction.amount} SAR`
                                      : ""}
                                  </p>
                                  <p style={{ marginTop: "0px" }}>
                                    <i
                                      class="fa fa-tint"
                                      aria-hidden="true"
                                      style={{
                                        color: "#2d7337",
                                        marginRight: "2px",
                                      }}
                                    />{" "}
                                    {item.refueling_transaction.liters
                                      ? `${item.refueling_transaction.liters} ltr`
                                      : ""}
                                  </p>
                                </a>
                                <small class="text-truncate text-muted mb-0">
                                  <i
                                    class="fa fa-clock-o"
                                    style={{
                                      color: "#2d7337",
                                      marginRight: "2px",
                                    }}
                                  ></i>{" "}
                                  {helper.isObject(
                                    getStatusData(
                                      item.fuel_request_logs,
                                      item.fuel_request_logs[
                                        item.fuel_request_logs.length - 1
                                      ].request_status
                                    )
                                  )
                                    ? helper.humanReadableDate(
                                        getStatusData(
                                          item.fuel_request_logs,
                                          item.fuel_request_logs[
                                            item.fuel_request_logs.length - 1
                                          ].request_status
                                        ).created_at
                                      )
                                    : ""}
                                </small>
                                <small class="text-truncate text-muted mb-0">
                                  <i
                                    class="fa fa-map-marker"
                                    style={{
                                      color: "#2d7337",
                                      marginRight: "2px",
                                    }}
                                  ></i>
                                  {" Driver Location: "}
                                  {helper.isObject(
                                    getStatusData(
                                      item.fuel_request_logs,
                                      "request_approved"
                                    )
                                  )
                                    ? getStatusData(
                                        item.fuel_request_logs,
                                        "request_approved"
                                      ).latitude +
                                      "," +
                                      getStatusData(
                                        item.fuel_request_logs,
                                        "request_approved"
                                      ).longitude
                                    : ""}
                                </small>
                                <small class="text-truncate text-muted mb-0">
                                  <i
                                    class="fa fa-map-marker"
                                    style={{
                                      color: "#2d7337",
                                      marginRight: "2px",
                                    }}
                                  ></i>
                                  {"Gas Station Location "}
                                  {helper.isObject(
                                    getStatusData(
                                      item.fuel_request_logs,
                                      item.fuel_request_logs[
                                        item.fuel_request_logs.length - 1
                                      ].request_status
                                    )
                                  )
                                    ? getStatusData(
                                        item.fuel_request_logs,
                                        item.fuel_request_logs[
                                          item.fuel_request_logs.length - 1
                                        ].request_status
                                      ).latitude +
                                      "," +
                                      getStatusData(
                                        item.fuel_request_logs,
                                        item.fuel_request_logs[
                                          item.fuel_request_logs.length - 1
                                        ].request_status
                                      ).longitude
                                    : ""}
                                </small>
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </td>

                      {/*---------------------previous transaction--------------------*/}

                      <td style={{ background: "#c6f3c3" }}>
                        {/* {console.log(
                      "refuling transaction",
                      helper.isObject(item.refueling_transaction)
                    )} */}
                        {/* {helper.isObject(
                      item.refueling_transaction
                        ? getReqData(item.refueling_transaction)
                        : console.log("not found")
                    )} */}

                        {helper.isObject(item.refueling_transaction) &&
                        getReqData(item.refueling_transaction) != null ? (
                          <>
                            <div class="d-flex justify-content-left align-items-center">
                              <div class="avatar me-1 bg-light-primary">
                                <span class="avatar-content">
                                  {helper.isObject(
                                    item.refueling_transaction
                                  ) ? (
                                    <img
                                      onClick={(e) =>
                                        handleShowDialog(
                                          getImg(item.refueling_transaction)
                                        )
                                      }
                                      style={{ width: "30px", height: "30px" }}
                                      src={getImg(item.refueling_transaction)}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </span>
                              </div>
                              <div class="d-flex flex-column">
                                <a class="user_name text-truncate text-body">
                                  <p class="fw-bolder">
                                    {`${getAmount(
                                      item.refueling_transaction
                                    )} SAR`}
                                  </p>
                                  <p style={{ marginTop: "0px" }}>
                                    <i
                                      class="fa fa-tint"
                                      aria-hidden="true"
                                      style={{
                                        color: "#2d7337",
                                        marginRight: "2px",
                                      }}
                                    />
                                    {`${getLitr(
                                      item.refueling_transaction
                                    )} Litr`}
                                  </p>
                                </a>
                                <small class="text-truncate text-muted mb-0">
                                  <i
                                    class="fa fa-clock-o"
                                    style={{
                                      color: "#2d7337",
                                      marginRight: "2px",
                                    }}
                                  ></i>{" "}
                                  {getStationDate(item.refueling_transaction)}
                                </small>
                                {getDriverLong(item.refueling_transaction) ? (
                                  <small class="text-truncate text-muted mb-0">
                                    <i
                                      class="fa fa-map-marker"
                                      style={{
                                        color: "#2d7337",
                                        marginRight: "2px",
                                      }}
                                    ></i>
                                    {" Driver Location: "}
                                    {getDriverLat(item.refueling_transaction) +
                                      "," +
                                      getDriverLong(item.refueling_transaction)}
                                  </small>
                                ) : (
                                  ""
                                )}
                                {getDriverLong(item.refueling_transaction) ? (
                                  <small class="text-truncate text-muted mb-0">
                                    <i
                                      class="fa fa-map-marker"
                                      style={{
                                        color: "#2d7337",
                                        marginRight: "2px",
                                      }}
                                    ></i>
                                    {" Gas Station Location: "}
                                    {getStationLat(item.refueling_transaction) +
                                      "," +
                                      getStationLong(
                                        item.refueling_transaction
                                      )}
                                  </small>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                      {/* <td style={{ background: "#95f599" }}></td> */}
                      <td>
                        <div>
                          {item ? getStatusLabels(item) : ""}
                          {item.transaction_status == 3 ? (
                            <div
                              class="d-flex flex-column"
                              style={{ marginTop: "15px" }}
                            >
                              <small class="text-truncate text-muted mb-0">
                                <img
                                  src={driver}
                                  style={{ marginRight: "2px", width: "10px" }}
                                />{" "}
                                Supervisor:{" "}
                                {helper.isObject(item.driver) &&
                                  helper.shortTextWithDots(
                                    `${getSupervisorDetail(item, "name")}`,
                                    20
                                  )}
                              </small>
                              <small class="text-truncate text-muted mb-0">
                                <img
                                  src={mobile}
                                  style={{ marginRight: "2px", width: "10px" }}
                                />{" "}
                                Supervisor Mobile:{" "}
                                {getSupervisorDetail(item, "mobile")}
                              </small>
                              <small class="text-truncate text-muted mb-0">
                                <img
                                  src={resident}
                                  style={{ marginRight: "2px", width: "10px" }}
                                />{" "}
                                Resident #: {getSupervisorDetail(item, "id")}
                              </small>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>{t("No Records found")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <AddUpdateModal
            show={showAddUpdateModal}
            updateModalData={updateModalData}
            getStatusLabels={(e) => getStatusLabels(e)}
            onHide={onCloseAddUpdateModal}
            submitAction={submitAction}
            disableBtn={overlay}
            getStatusData={(e) => getStatusData(e)}
            handleShowDialog={(e) => handleShowDialog(e)}
          />
          <ApproveModal
            show={showApproveModal}
            confirmationText={`Are you sure to Cancel the request ?`}
            confirmationHeading={"Cancel Request"}
            onHide={onCloseApproveModal}
            submitAction={submitAction}
          />

          <ZoomableImageModal
            isOpen={isOpenImgDialog}
            onHide={() => hideImageDialog()}
            imgUrl={imgDialog}
          />
        </CardBody>
      </Card>
    </div>
  );
}
