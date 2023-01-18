import React, { useEffect, useState } from "react";
import { Input, Label, Button } from "reactstrap";
import { Check, X, Edit, Menu, Trash2 } from "react-feather";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import AddUpdateModal from "./AddUpdateModal";
import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import { Card, CardBody, CardTitle, CardHeader } from "reactstrap";
import * as XLSX from "xlsx";

import { useTranslation } from "react-i18next";
import LogsModal from "./LogsModal";
import { getUserData } from "@utils";
import BulkUploadModal from "./BulkUploadModel";
import DataTableExportButton from "../../components/TableToExcel";

export default function client(props) {
  const [clientShow, setclientShow] = useState(true);
  const [stationShow, setstationShow] = useState(false);
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [onSubmit, setonSubmit] = useState("");
  const [showAddUpdateModal, setshowAddUpdateModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
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

  const [clientList, setclientList] = useState([]);
  const [driverList, setdriverList] = useState([]);
  const [fuelTypeList, setfuelTypeList] = useState([]);
  const [vehicleTypeList, setvehicleTypeList] = useState([]);
  const [dateTime, setDateTime] = useState("");
  const [form, setform] = useState({
    temp_gas_tank_capacity: "",
    temp_capacity_expiry: "",
    vehicles: [],
  });

  const [showBulkUploadModal, setshowBulkUploadModal] = useState(false);
  const [bulkData, setBulkData] = useState([]);
  const [show, setShow] = useState(false);

  const [dataForTable, setDataForTable] = useState([]);
  const [deletedData, setDeletedData] = useState([]);

  const [check, setCheck] = useState(false);

  const [role, setRole] = useState({
    addVehicle: false,
    updateVehicle: false,
    deleteVehicle: false,
    viewLog: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.vehicle.add") {
        arr.addVehicle = true;
      } else if (roles[i].subject == "fm.vehicle.update") {
        arr.updateVehicle = true;
      } else if (roles[i].subject == "fm.vehicle.delete") {
        arr.deleteVehicle = true;
      } else if (roles[i].subject == "fm.vehicle_driver_logs") {
        arr.viewLog = true;
      }
    }
    // console.log("arrrrrrrrrrr", arr);
    setRole(arr);
    console.log(role);
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
    if (onSubmit == "remove") {
      delet();
    }
  };

  const sortAscending = (icon, sortType, colsort) => {
    if (
      colsort == "title_ar" ||
      colsort == "title_en" ||
      colsort == "title_ur" ||
      colsort == "plate_no" ||
      colsort == "brand" ||
      colsort == "make" ||
      colsort == "model" ||
      colsort == "color"
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
    } else if (colsort == "odometer") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            a[colsort] > b[colsort] && sortType === "asc" ? 1 : -1
          )
        )
      );
    } else if (colsort == "client") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            helper.isObject(a.client) &&
            helper.isObject(b.client) &&
            b.client.name_en &&
            a.client.name_en &&
            a.client.name_en.toLowerCase() > b.client.name_en.toLowerCase() &&
            sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    } else if (colsort == "vehicle_type") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            helper.isObject(a.vehicle_type) &&
            helper.isObject(b.vehicle_type) &&
            b.vehicle_type.name_en &&
            a.vehicle_type.name_en &&
            a.vehicle_type.name_en.toLowerCase() >
              b.vehicle_type.name_en.toLowerCase() &&
            sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    } else if (colsort == "vehicle_fuel_type") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            helper.isObject(a.vehicle_fuel_type) &&
            helper.isObject(b.vehicle_fuel_type) &&
            b.vehicle_fuel_type.title_en &&
            a.vehicle_fuel_type.title_en &&
            a.vehicle_fuel_type.title_en.toLowerCase() >
              b.vehicle_fuel_type.title_en.toLowerCase() &&
            sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    } else if (colsort == "driver") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            helper.isObject(a.driver) &&
            helper.isObject(b.driver) &&
            b.driver.first_name &&
            a.driver.first_name &&
            a.driver.first_name.toLowerCase() >
              b.driver.first_name.toLowerCase() &&
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
    // console.log(page, "testing data", currentPage);
  };

  const onCloseBulkUpdateModal = () => {
    setBulkData([]);
    setshowBulkUploadModal(false);
  };
  const handleUpload = (e) => {
    // console.log("in parse data");
    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // console.log("jsoonnnnnnn", dataParse);
      let arr = [];
      for (let i = 1; i < dataParse.length; i++) {
        let obj = {
          plate_no: "",
          type: "",
          fuel_type: "",
          gas_tank_capacity: "",
          pno: 0,
          t: 0,
          ft: 0,
          gtc: 0,
          p: 0,
        };
        for (let j = 0; j < dataParse[i].length; j++) {
          obj = {
            plate_no: dataParse[i][0] ? dataParse[i][0] : "",
            type: "",
            fuel_type: "",
            gas_tank_capacity: dataParse[i][1] ? dataParse[i][1] : "",
            t: 0,
            ft: 0,
            gtc: 0,
            p: 0,
          };
        }
        arr.push(obj);
      }
      setBulkData(helper.applyCountID(arr));
      // console.log("arrrrrrrrrr", arr);
    };
    reader.readAsBinaryString(f);
  };
  const upload = () => {
    if (bulkData && bulkData.length > 0) {
      setShow(true);
      let id = [];
      let driver = bulkData;
      driver.forEach((item) => {
        id.push(addVehicles(item));
      });
      // console.log("all iddddddddd", id);

      Promise.all(id).then((allId) => {
        setShow(false);

        // console.log("all iddddddddd", allId);

        for (let i = 0; i < allId.length; i++) {
          if (allId[i] != -1) {
            driver = driver.filter((item) => item.count_id != allId[i]);
          }
        }
        setBulkData(driver);
      });
    } else {
      helper.toastNotification(
        "Please Select a file to upload.",
        "FAILED_MESSAGE"
      );
    }
  };

  const FilterDataForTable = (data) => {
    let arr = [];
    data.forEach((item) => {
      arr.push({
        plate_no: item.plate_no,
        vehicle_type: helper.isObject(item.vehicle_type)
          ? item.vehicle_type.name_en
          : "",
        gas_tank_capacity: item.gas_tank_capacity,
        fuel_limit: item.temp_gas_tank_capacity,
        make: item.make,
        modal: item.modal,
        driver: helper.isObject(item.driver)
          ? item.driver.first_name +
            " " +
            item.driver.middle_name +
            " " +
            item.driver.last_name
          : "",
        fuel_type: helper.isObject(item.vehicle_fuel_type)
          ? item.vehicle_fuel_type.title_en
          : "",
        created_at: item.created_at,
        status: item.status,
      });
    });
    setDataForTable(arr);
  };

  useEffect(() => {
    // setRoles();
    if (bulkData.length == 0) {
      setshowBulkUploadModal(false);

      getData();
      getVehicleTypes();

      // getUnassignedVehicles();
    }
  }, [bulkData]);

  const addVehicles = (args) => {
    if (helper.isEmptyString(args.plate_no)) {
      bulkData.filter((element, index) => {
        if (element.count_id === args.count_id) {
          let newData = bulkData;
          newData[index].p = 1;
          setBulkData([...newData]);
        }
      });
    }
    if (helper.isEmptyString(args.gas_tank_capacity)) {
      bulkData.filter((element, index) => {
        if (element.count_id === args.count_id) {
          let newData = bulkData;
          newData[index].gtc = 1;
          setBulkData([...newData]);
        }
      });
    }
    if (!args.type) {
      bulkData.filter((element, index) => {
        if (element.count_id === args.count_id) {
          let newData = bulkData;
          newData[index].t = 1;
          setBulkData([...newData]);
        }
      });
    }
    if (!args.fuel_type) {
      bulkData.filter((element, index) => {
        if (element.count_id === args.count_id) {
          let newData = bulkData;
          newData[index].ft = 1;
          setBulkData([...newData]);
        }
      });
    }
    // console.log("argsssss", args);
    if (args.t == 0 && args.ft == 0 && args.gtc == 0 && args.p == 0) {
      return new Promise((resolve, rej) => {
        axios
          .post(`${jwtDefaultConfig.adminBaseUrl}/vehicle/add`, {
            vehicle: {
              client_reference_number: args.client_reference_number
                ? args.client_reference_number
                : "",
              plate_no: args.plate_no,
              gas_tank_capacity: args.gas_tank_capacity,
              odometer: args.odometer ? args.odometer : "",
              brand: args.brand ? args.brand : "",
              make: args.make ? args.make : "",
              model: args.model ? args.model : "",
              color: args.color ? args.color : "",
              last_service_date: args.last_service_date
                ? args.last_service_date
                : "",
              next_service_date: args.next_service_date
                ? args.next_service_date
                : "",
              last_refill_date: args.last_refill_date
                ? args.last_refill_date
                : "",
              client_id: props.clientID ? props.clientID : "",
              driver_id: args.driver ? args.driver.value : "",
              fuel_type: args.fuel_type.value,
              type: args.type.value,
              milage_per_liter: args.milage_per_liter
                ? args.milage_per_liter
                : "",
              odo_last_updated_date: args.odo_last_updated_date
                ? args.odo_last_updated_date
                : "",
              cost_center: args.cost_center ? args.cost_center : "",
              days_limit: args.days_limit ? args.days_limit.value : "7",
              allowed_litters: args.allowed_litters ? args.allowed_litters : "",
            },
          })
          .then((res) => {
            // arr.push(args.count_id);
            helper.redirectToLogin(
              helper.isObject(res.data) ? res.data.code : 200
            );
            if (res.data.code && res.data.code === 200) {
              setshowAddUpdateModal(false);
              helper.toastNotification(
                "Request has been processed successfuly.",
                "SUCCESS_MESSAGE"
              );
              resolve(args.count_id);
            } else {
              setoverlay(false);
              if (res.data.data && res.data.data.plate_no[0]) {
                // helper.toastNotification(res.data.data.employee_number[0]);
                bulkData.filter((element, index) => {
                  if (element.count_id === args.count_id) {
                    let newData = bulkData;
                    newData[index].pno = 1;
                    setBulkData([...newData]);
                  }
                });
              } else {
                helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
              }
              resolve(-1);
            }
          })
          .catch((error) => {
            resolve(-1);
            setoverlay(false);
            helper.toastNotification(
              "Unable to process request.",
              "FAILED_MESSAGE"
            );
            console.log(error, "errorrrr");
            // rej();
          });
      });
    }
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
  const onOpenLogsModal = (item, index) => {
    setupdateModalData(item);
    setShowLogsModal(true);
  };

  const onCloseAddUpdateModal = () => {
    setshowAddUpdateModal(false);
    setupdateIndex(null);
    setonSubmit(null);
    setupdateModalData(null);
  };
  const onCloseLogsModal = () => {
    setShowLogsModal(false);
  };

  const onOpenDeleteModal = (rowData, index, type) => {
    if (type == "status") {
      setdeleteItem(rowData);
      setdeleteIndex(index);
      setonSubmit("delete");
      setdeleteMessage(rowData.status === 1 ? "Deactivate" : "activate");
      setshowDeleteModal(true);
    } else if (type == "delete") {
      setdeleteItem(rowData);
      setdeleteIndex(index);
      setonSubmit("remove");
      setdeleteMessage("Delete");
      setshowDeleteModal(true);
    }
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
        `${jwtDefaultConfig.adminBaseUrl}/vehicles?page=${currentPage}&pagination=true`,
        {
          client: {
            clientId: props.clientID,
          },
        }
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
  const getDeletedVehicles = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/vehicle/deleted`, {
        client_id: props.clientID,
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setDeletedData(helper.applyCountID(res.data.data));

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

  const getDrivers = () => {
    axios
      .post(
        `${jwtDefaultConfig.adminBaseUrl}/unasigned-drivers?pagination=false&lang=ar`,
        {
          client: {
            clientId: props.clientID,
          },
        }
      )
      .then(async (res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setdriverList(res.data.data);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setdriverList([]);
        }
      })
      .catch((error) => {
        setdriverList([]);
      });
  };

  const getFuelTypes = () => {
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

  const getVehicleTypes = () => {
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/vehicle-types?pagination=false&lang=en`
      )
      .then(async (res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log("vehicle type list", res);
          setvehicleTypeList(res.data.data);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setvehicleTypeList([]);
        }
      })
      .catch((error) => {
        setvehicleTypeList([]);
      });
  };

  const create = (args) => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/vehicle/add`, {
        vehicle: {
          client_reference_number: args.client_reference_number,
          plate_no: args.plate_no,
          gas_tank_capacity: args.gas_tank_capacity,
          odometer: args.odometer,
          brand: args.brand,
          make: args.make,
          model: args.model,
          color: args.color,
          last_service_date: args.last_service_date,
          next_service_date: args.next_service_date,
          last_refill_date: args.last_refill_date,
          client_id: props.clientID,
          driver_id: args.driver.value,
          fuel_type: args.fuel_type.value,
          type: args.vehicle_type.value,
          milage_per_liter: args.milage_per_liter,
          odo_last_updated_date: args.odo_last_updated_date,
          cost_center: args.cost_center,
          days_limit: args.days_limit ? args.days_limit.value : "7",
          allowed_litters: args.allowed_litters,
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
          getDrivers();
        } else {
          console.log("msg", res.data.message_en);
          setoverlay(false);
          if (res.data.data) {
            helper.toastNotification(res.data.data.plate_no[0]);
          } else {
            helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
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
    // console.log("driver id", args.driver ? args.driver.value : "no value");
    let id = "";
    if (args.driver) {
      id = args.driver.value;
    } else if (!args.driver) {
      id = "empty";
    } else {
      id = "";
    }
    console.log("belwoeee id", id);

    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/vehicle/update`, {
        vehicle: {
          vehicle_id: updateModalData.vehicle_id,
          client_reference_number: args.client_reference_number,
          plate_no:
            args.plate_no == updateModalData.plate_no ? "" : args.plate_no,
          gas_tank_capacity: args.gas_tank_capacity,
          odometer: args.odometer,
          brand: args.brand,
          make: args.make,
          model: args.model,
          color: args.color,
          last_service_date: args.last_service_date,
          next_service_date: args.next_service_date,
          last_refill_date: args.last_refill_date,
          client_id: props.clientID,
          driver_id: id ? id : "",
          fuel_type: args.fuel_type.value,
          type: args.vehicle_type.value,
          milage_per_liter: args.milage_per_liter,
          odo_last_updated_date: args.odo_last_updated_date,

          cost_center: args.cost_center,
          days_limit: args.days_limit ? args.days_limit.value : "7",
          allowed_litters: args.allowed_litters,
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
          getDrivers();
        } else {
          console.log("msg", res.data.message_en);
          setoverlay(false);
          if (res.data.data) {
            helper.toastNotification(res.data.data.plate_no[0]);
          } else {
            helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
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

  const delet = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/vehicle/trash`, {
        vehicle: {
          vehicle_id: deleteItem.vehicle_id,
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

  const remove = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/vehicle/delete`, {
        vehicle: {
          vehicle_id: deleteItem.vehicle_id,
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
        } else if (res.data.code && res.data.code == 204) {
          setoverlay(false);
          setshowDeleteModal(false);
          helper.toastNotification(res.data.message_en);
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
    // console.log("in search data", value);
    if (value.length >= 3) {
      setSearchData(value);
    } else {
      setSearchData("");
    }
  };

  useEffect(() => {
    getDeletedVehicles();
    setRoles();
    getData();
    getDrivers();
    getFuelTypes();
    getVehicleTypes();
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
            {t("Vehicles")} {props.clientName}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Row>
            <Col lg={12}>
              <Row>
                <Col style={{ display: "flex" }}>
                  {role.addVehicle ? (
                    <Button color="primary" onClick={(e) => openCreateModal()}>
                      <i className="fas fa-plus"></i> {t("Add Vehicle")}
                    </Button>
                  ) : (
                    ""
                  )}
                  {role.addVehicle ? (
                    <Button
                      color="primary"
                      style={{ marginLeft: "5px" }}
                      onClick={(e) => setshowBulkUploadModal(true)}
                    >
                      {t("Bulk Upload")}
                    </Button>
                  ) : (
                    ""
                  )}
                  <input
                    className="form-control crud-search "
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
          <Row style={{ marginTop: "15px" }}>
            <Col lg={12}>
              <Row>
                <Col sm={3} style={{ display: "flex" }}>
                  <Button
                    outline={check ? true : false}
                    color="primary"
                    block
                    onClick={() => {
                      setCheck(false);
                    }}
                  >
                    <label color="primary">Active Vehicles</label>
                  </Button>
                  <Button
                    style={{ marginLeft: "5px", marginRight: "5px" }}
                    outline={check ? false : true}
                    color="primary"
                    block
                    onClick={() => {
                      setCheck(true);
                    }}
                  >
                    <label>Deleted Vehicles</label>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th className="table-th blackColor">
                    <p>
                      {t("Plate")} #
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col4_asc", "asc", "plate_no")
                          }
                          className={
                            sorting_icon == "Col4_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col4_des", "des", "plate_no")
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
                      {t("Vehicle Type")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col10_asc", "asc", "vehicle_type")
                          }
                          className={
                            sorting_icon == "Col10_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col10_des", "des", "vehicle_type")
                          }
                          className={
                            sorting_icon == "Col10_des"
                              ? "fas fa-long-arrow-alt-down sort-color"
                              : "fas fa-long-arrow-alt-down"
                          }
                        ></i>
                      </span>
                    </p>
                  </th>
                  <th className="table-th blackColor">
                    <p>
                      {t("Gas Tank Capacity")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col10_asc", "asc", "vehicle_type")
                          }
                          className={
                            sorting_icon == "Col10_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col10_des", "des", "vehicle_type")
                          }
                          className={
                            sorting_icon == "Col10_des"
                              ? "fas fa-long-arrow-alt-down sort-color"
                              : "fas fa-long-arrow-alt-down"
                          }
                        ></i>
                      </span>
                    </p>
                  </th>
                  <th className="table-th blackColor">{t("Fuel Limit")}</th>
                  {/* <th className="table-th blackColor">{t("Expriy")}</th> */}

                  <th className="table-th blackColor">
                    <p>
                      {t("Make")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col11_asc", "asc", "make")
                          }
                          className={
                            sorting_icon == "Col11_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col11_des", "des", "driver")
                          }
                          className={
                            sorting_icon == "Col11_des"
                              ? "fas fa-long-arrow-alt-down sort-color"
                              : "fas fa-long-arrow-alt-down"
                          }
                        ></i>
                      </span>
                    </p>
                  </th>
                  <th className="table-th blackColor">
                    <p>
                      {t("Modal")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col11_asc", "asc", "modal")
                          }
                          className={
                            sorting_icon == "Col11_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col11_des", "des", "driver")
                          }
                          className={
                            sorting_icon == "Col11_des"
                              ? "fas fa-long-arrow-alt-down sort-color"
                              : "fas fa-long-arrow-alt-down"
                          }
                        ></i>
                      </span>
                    </p>
                  </th>

                  <th className="table-th blackColor">
                    <p>
                      {t("Driver")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col11_asc", "asc", "driver")
                          }
                          className={
                            sorting_icon == "Col11_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col11_des", "des", "driver")
                          }
                          className={
                            sorting_icon == "Col11_des"
                              ? "fas fa-long-arrow-alt-down sort-color"
                              : "fas fa-long-arrow-alt-down"
                          }
                        ></i>
                      </span>
                    </p>
                  </th>

                  <th className="table-th blackColor">
                    <p>
                      {t("Fuel Type")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending(
                              "Col12_asc",
                              "asc",
                              "vehicle_fuel_type"
                            )
                          }
                          className={
                            sorting_icon == "Col12_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending(
                              "Col12_des",
                              "des",
                              "vehicle_fuel_type"
                            )
                          }
                          className={
                            sorting_icon == "Col12_des"
                              ? "fas fa-long-arrow-alt-down sort-color"
                              : "fas fa-long-arrow-alt-down"
                          }
                        ></i>
                      </span>
                    </p>
                  </th>

                  <th className="table-th blackColor">
                    <p>{!check ? "Created at" : "Deleted At"}</p>
                  </th>
                  {!check ? (
                    <th className="table-th blackColor">
                      <p>{t("Status")}</p>
                    </th>
                  ) : (
                    ""
                  )}
                  {!check ? (
                    <th className="table-th blackColor">
                      <p>{t("Action")}</p>
                    </th>
                  ) : (
                    ""
                  )}
                </tr>
              </thead>
              {!check ? (
                <tbody>
                  {data &&
                    data
                      .filter((item) => {
                        if (searchData == "") {
                          return item;
                        } else if (
                          item.plate_no
                            .toLowerCase()
                            .includes(searchData.toLowerCase())
                          //   ||
                          // helper.isObject(item.vehicle_type)
                          //   ? item.vehicle_type.name_en
                          //   : "" .toLowerCase().includes(searchData.toLowerCase())
                          // ||
                          //     helper.isObject(item.driver)
                          //   ? item.driver.first_name
                          //   : ""
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase()) ||
                          //     helper.isObject(item.driver)
                          //   ? item.driver.middle_name
                          //   : ""
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase()) ||
                          //     helper.isObject(item.driver)
                          //   ? item.driver.last_name
                          //   : ""
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase()) ||
                          //     helper.isObject(item.vehicle_fuel_type)
                          //   ? item.vehicle_fuel_type.title_en
                          //   : "".toLowerCase().includes(searchData.toLowerCase())
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
                            <div>
                              {/* <input
                              type="checkbox"
                              onChange={() => {
                                setVehicleArray(item.vehicle_id);
                              }}
                            /> */}
                              <label style={{ marginLeft: "10px" }}>
                                {item.plate_no}
                              </label>
                            </div>
                          </td>
                          <td>
                            {helper.isObject(item.vehicle_type)
                              ? item.vehicle_type.name_en
                              : ""}
                          </td>
                          <td>{item.gas_tank_capacity}</td>
                          <td
                            data-tip={
                              item.temp_capacity_expiry
                                ? "Expiry: " + item.temp_capacity_expiry
                                : ""
                            }
                          >
                            <label>
                              {item.temp_gas_tank_capacity
                                ? item.temp_gas_tank_capacity
                                : ""}
                            </label>
                          </td>
                          {/* <td>
                          {item.temp_capacity_expiry
                            ? item.temp_capacity_expiry
                            : ""}
                        </td> */}
                          <td>{item.make ? item.make : ""}</td>
                          <td>{item.brand ? item.brand : ""}</td>
                          <td>
                            {helper.isObject(item.driver)
                              ? `${item.driver.first_name} ${item.driver.middle_name} ${item.driver.last_name}`
                              : ""}
                          </td>
                          <td>
                            {helper.isObject(item.vehicle_fuel_type)
                              ? item.vehicle_fuel_type.title_en
                              : ""}
                          </td>

                          <td>{helper.humanReadableDate(item.created_at)}</td>
                          <td>
                            {role.deleteVehicle ? (
                              <div className="form-switch form-check-success">
                                <Input
                                  type="switch"
                                  // defaultChecked={item.status === 1 ? true : false}
                                  checked={item.status === 1 ? true : false}
                                  id={`icon-success${index}`}
                                  name={`icon-success${index}`}
                                  onChange={(e) =>
                                    onOpenDeleteModal(item, index, "status")
                                  }
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
                              {role.updateVehicle ? (
                                <Edit
                                  data-tip="Update"
                                  size={15}
                                  onClick={(e) =>
                                    onOpenUpdateModal(item, index)
                                  }
                                  style={{
                                    marginTop: "4px",
                                    marginRight: "5px",
                                  }}
                                />
                              ) : (
                                ""
                              )}
                              {role.viewLog ? (
                                <Menu
                                  data-tip="Vehicle Logs"
                                  size={15}
                                  onClick={(e) => onOpenLogsModal(item, index)}
                                  style={{
                                    marginTop: "4px",
                                    marginRight: "5px",
                                  }}
                                />
                              ) : (
                                ""
                              )}
                              {role.deleteVehicle ? (
                                <Trash2
                                  size={15}
                                  color="red"
                                  style={{
                                    marginTop: "4px",
                                    marginRight: "5px",
                                  }}
                                  data-tip="Delete"
                                  onClick={(e) =>
                                    onOpenDeleteModal(item, index, "delete")
                                  }
                                />
                              ) : (
                                ""
                              )}
                            </div>

                            <ReactTooltip />
                          </td>
                        </tr>
                      ))}
                </tbody>
              ) : (
                <tbody>
                  {deletedData &&
                    deletedData
                      .filter((item) => {
                        if (searchData == "") {
                          return item;
                        } else if (
                          item.plate_no
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
                            <div>
                              {/* <input
                          type="checkbox"
                          onChange={() => {
                            setVehicleArray(item.vehicle_id);
                          }}
                        /> */}
                              <label style={{ marginLeft: "10px" }}>
                                {item.plate_no}
                              </label>
                            </div>
                          </td>
                          <td>
                            {helper.isObject(item.vehicle_type)
                              ? item.vehicle_type.name_en
                              : ""}
                          </td>
                          <td>{item.gas_tank_capacity}</td>
                          <td
                            data-tip={
                              item.temp_capacity_expiry
                                ? "Expiry: " + item.temp_capacity_expiry
                                : ""
                            }
                          >
                            <label>
                              {item.temp_gas_tank_capacity
                                ? item.temp_gas_tank_capacity
                                : ""}
                            </label>
                          </td>
                          {/* <td>
                      {item.temp_capacity_expiry
                        ? item.temp_capacity_expiry
                        : ""}
                    </td> */}
                          <td>{item.make ? item.make : ""}</td>
                          <td>{item.brand ? item.brand : ""}</td>
                          <td>
                            {helper.isObject(item.driver)
                              ? `${item.driver.first_name} ${item.driver.middle_name} ${item.driver.last_name}`
                              : ""}
                          </td>
                          <td>
                            {helper.isObject(item.vehicle_fuel_type)
                              ? item.vehicle_fuel_type.title_en
                              : ""}
                          </td>

                          <td>{helper.humanReadableDate(item.deleted_at)}</td>
                        </tr>
                      ))}
                </tbody>
              )}
            </table>

            <AddUpdateModal
              show={showAddUpdateModal}
              updateModalData={updateModalData}
              onHide={onCloseAddUpdateModal}
              submitAction={submitAction}
              disableBtn={overlay}
              clientList={clientList}
              driverList={driverList}
              fuelTypeList={fuelTypeList}
              vehicleTypeList={vehicleTypeList}
              clientName={props.clientName}
            />
            <BulkUploadModal
              show={showBulkUploadModal}
              onCloseBulkUpdateModal={onCloseBulkUpdateModal}
              disableBtn={overlay}
              client_id={props.clientID}
              getData={getData}
              handleUpload={handleUpload}
              data={bulkData}
              upload={upload}
              setBulkData={setBulkData}
              showLoader={show}
              fuelTypeList={fuelTypeList}
              vehicleTypeList={vehicleTypeList}
            />
            <LogsModal
              show={showLogsModal}
              onHide={onCloseLogsModal}
              close={setShowLogsModal}
              updateModalData={updateModalData}
            />
            <DeleteModal
              show={showDeleteModal}
              confirmationText={`Are you sure to ${deleteMessage} a vehicle`}
              confirmationHeading={`${helper.uppercaseFirst(
                deleteMessage
              )} a vehicle`}
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
