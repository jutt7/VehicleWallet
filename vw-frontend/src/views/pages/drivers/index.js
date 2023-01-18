import React, { useEffect, useState, useRef } from "react";
import { Input, Label } from "reactstrap";
import { Check, X, Edit, Unlock, Mail, Trash2 } from "react-feather";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import AddUpdateModal from "./AddUpdateModal";
import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import { Phone } from "react-feather";
import { Card, CardBody, CardTitle, CardHeader, Button } from "reactstrap";
import * as XLSX from "xlsx";
import BulkUploadModal from "./BulkUploadModel";
import MessageModal from "./MessageModal";

import { useTranslation } from "react-i18next";
import { getUserData } from "@utils";
import DataTableExportButton from "../../components/TableToExcel";

export default function Driver(props) {
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

  const { t } = useTranslation();

  const [showBulkUploadModal, setshowBulkUploadModal] = useState(false);
  const [showMessageModal, setshowMessageModal] = useState(false);

  const [searchData, setSearchData] = useState("");

  const [check, setCheck] = useState(false);

  const [clientsList, setclientsList] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [bulkData, setBulkData] = useState([]);
  const [cid, setCId] = useState([]);
  const [show, setShow] = useState(false);

  const [deletedData, setDeletedData] = useState([]);

  const [role, setRole] = useState({
    addDriver: false,
    updateDriver: false,
    deleteDriver: false,
    viewDriver: false,
    bulkUpload: false,
    unbind: false,
    chat: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.driver.add") {
        arr.addDriver = true;
      } else if (roles[i].subject == "fm.driver.update") {
        arr.updateDriver = true;
      } else if (roles[i].subject == "fm.driver.delete") {
        arr.deleteDriver = true;
      } else if (roles[i].subject == "fm.drivers") {
        arr.viewDriver = true;
      } else if (roles[i].subject == "fm.driver.import") {
        arr.bulkUpload = true;
      } else if (roles[i].subject == "fm.driver.unbind") {
        arr.unbind = true;
      } else if (roles[i].subject == "client-chat") {
        console.log("client chat found");
        arr.chat = true;
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
    if (onSubmit == "remove") {
      delet();
    }
  };

  const sortAscending = (icon, sortType, colsort) => {
    if (
      colsort == "employee_number" ||
      colsort == "first_name" ||
      colsort == "email" ||
      colsort == "civil_record_or_resident_permit_number" ||
      colsort == "driving_license_number"
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
  const onOpenMessageModal = (item, index) => {
    setupdateModalData(item);
    setshowMessageModal(true);
  };
  const fileInput = useRef();
  function SelectFileButton() {
    const selectFile = () => {
      fileInput.current.click();
    };
  }

  const onCloseAddUpdateModal = () => {
    setshowAddUpdateModal(false);
    setupdateIndex(null);
    setonSubmit(null);
    setupdateModalData(null);
  };
  const onCloseBulkUpdateModal = () => {
    setBulkData([]);
    setshowBulkUploadModal(false);
  };
  const onCloseMessageModal = () => {
    setshowMessageModal(false);
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

  const FilterDataForTable = (data) => {
    let arr = [];
    data.forEach((item) => {
      arr.push({
        employee_number: item.employee_number,
        name: item.first_name + " " + item.middle_name + " " + item.last_name,
        mobile: item.mobile,
        vehicle_plate_no: helper.isObject(item.vehicle)
          ? item.vehicle.plate_no
          : "",
        civil_record_or_resident_permit_number:
          item.civil_record_or_resident_permit_number,

        created_at: item.created_at,
        status: item.status,
      });
    });
    setDataForTable(arr);
  };

  const getData = () => {
    setoverlay(true);
    axios
      .post(
        `${jwtDefaultConfig.adminBaseUrl}/drivers?page=${currentPage}&pagination=true`,
        {
          client: {
            clientId: props.clientID,
          },
        }
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(helper.applyCountID(res.data.data.data), "data");
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

  const getUnassignedVehicles = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/unasigned-vehicles`, {
        vehicle: {
          client_id: props.clientID,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(helper.applyCountID(res.data.data), "data vehicles");
          setVehicles(res.data.data);

          setoverlay(false);
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

  const create = (args, method = "") => {
    console.log("create args", args);
    let nat =
      args.nationality && helper.isObject(args.nationality)
        ? args.nationality.value
        : "";
    // console.log("create args", nat);

    // return;

    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/driver/add`, {
        driver: {
          employee_number: args.employee_number ? args.employee_number : "",
          first_name: args.first_name ? args.first_name : "",
          middle_name: args.middle_name ? args.middle_name : "",
          last_name: args.last_name ? args.last_name : "",
          password: args.mobile ? args.mobile : "",
          driver_pin: args.driver_pin ? args.driver_pin : "",
          email: args.email ? args.email : "",
          mobile: args.mobile ? args.mobile : "",
          gender: args.gender ? args.gender : "",
          device_id: args.device_id ? args.device_id : "",
          driving_license_number: args.driving_license_number
            ? args.driving_license_number
            : "",
          civil_record_or_resident_permit_number:
            args.civil_record_or_resident_permit_number
              ? args.civil_record_or_resident_permit_number
              : "",
          nationality: nat,
          driver_prefered_language: args.prefered_language
            ? args.prefered_language
            : "",
          photo: args.photo ? args.photo : "",
          client_id: props.clientID ? props.clientID : "",
          civil_record_or_resident_permit_picture: "",
          // assinged_vehicle_id:
          //   args.assinged_vehicle_id && args.assinged_vehicle_id.value
          //     ? args.assinged_vehicle_id.value
          //     : "",
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
          getUnassignedVehicles();
        } else {
          setoverlay(false);
          if (res.data.data.employee_number) {
            helper.toastNotification(res.data.data.employee_number[0]);
          }
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
          if (res.data.data.civil_record_or_resident_permit_number) {
            helper.toastNotification(
              res.data.data.civil_record_or_resident_permit_number[0]
            );
          }
          // else {
          //   setoverlay(false);
          //   helper.toastNotification(
          //     "Unable to process request.",
          //     "FAILED_MESSAGE"
          //   );
          // }
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

  const setUnbind = (item) => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/driver/unbind`, {
        driver: {
          driver_id: item.driver_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
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
        console.log(error, "errorrrr");
      });
  };

  const update = (args) => {
    let id = "";
    if (args.assinged_vehicle_id && args.assinged_vehicle_id.id) {
      id = args.assinged_vehicle_id.id;
    } else {
      if (args.assinged_vehicle_id) {
        id = args.assinged_vehicle_id.value;
      }
    }

    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/driver/update`, {
        driver: {
          driver_id: updateModalData.driver_id,
          employee_number: args.employee_number,
          first_name: args.first_name,
          middle_name: args.middle_name,
          last_name: args.last_name,
          password: args.mobile,
          driver_pin: args.driver_pin,
          email: args.email,
          mobile: args.mobile == updateModalData.mobile ? "" : args.mobile,
          device_id: args.device_id,
          gender: args.gender,
          driving_license_number: args.driving_license_number,
          civil_record_or_resident_permit_number:
            args.civil_record_or_resident_permit_number,
          nationality: args.nationality.value,
          driver_prefered_language: args.prefered_language,
          client_id: props.clientID,
          photo: args.photo,
          // assinged_vehicle_id: id,
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
          getUnassignedVehicles();
        } else {
          setoverlay(false);
          if (res.data.data.employee_number) {
            helper.toastNotification(res.data.data.employee_number[0]);
          }
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
      .post(`${jwtDefaultConfig.adminBaseUrl}/driver/delete`, {
        driver: {
          driver_id: deleteItem.driver_id,
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
          civil_record_or_resident_permit_number: "",
          mobile: "",
          employee_number: "",
          first_name: "",
          // middle_name: "",
          last_name: "",
          // email: "",
          gender: "",
          nationality: "",
          driver_prefered_language: "",
          emp1: 0,
          mobile1: 0,
          res1: 0,
        };
        for (let j = 0; j < dataParse[i].length; j++) {
          obj = {
            civil_record_or_resident_permit_number: dataParse[i][0],
            mobile: dataParse[i][1],
            employee_number: dataParse[i][2],
            first_name: String(dataParse[i][3]),
            // middle_name: String(dataParse[i][4]),
            last_name: String(dataParse[i][4]),
            // email: dataParse[i][6],
            gender: dataParse[i][5],
            nationality: dataParse[i][6],
            driver_prefered_language: dataParse[i][7],
          };
        }
        arr.push(obj);
      }
      setBulkData(helper.applyCountID(arr));
      console.log("arrrrrrrrrr", arr);
    };
    reader.readAsBinaryString(f);
  };

  const upload = () => {
    if (bulkData && bulkData.length > 0) {
      setShow(true);
      let id = [];
      let driver = bulkData;
      driver.forEach((item) => {
        id.push(addDrivers(item));
      });
      // console.log("all iddddddddd", id);

      Promise.all(id).then((allId) => {
        setShow(false);

        console.log("all iddddddddd", allId);

        for (let i = 0; i < allId.length; i++) {
          if (allId[i] != -1) {
            driver = driver.filter((item) => item.count_id != allId[i]);
          }
        }
        setBulkData(driver);
      });
      // helper.toastNotification(
      //   "Request has been processed successfuly.",
      //   "SUCCESS_MESSAGE"
      // );
    } else {
      helper.toastNotification(
        "Please Select a file to upload.",
        "FAILED_MESSAGE"
      );
    }
  };
  useEffect(() => {
    setRoles();
    if (bulkData.length == 0) {
      setshowBulkUploadModal(false);

      getData();
      getUnassignedVehicles();
    }
  }, [bulkData]);

  const addDrivers = (args) => {
    return new Promise((resolve, rej) => {
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/driver/add`, {
          driver: {
            employee_number: args.employee_number ? args.employee_number : "",
            first_name: args.first_name ? args.first_name : "",
            middle_name: args.middle_name ? args.middle_name : "",
            last_name: args.last_name ? args.last_name : "",
            password: args.mobile ? args.mobile : "",
            driver_pin: args.driver_pin ? args.driver_pin : "",
            email: args.email ? args.email : "",
            mobile: args.mobile ? args.mobile : "",
            gender: args.gender ? args.gender : "",
            device_id: args.device_id ? args.device_id : "",
            driving_license_number: args.driving_license_number
              ? args.driving_license_number
              : "",
            civil_record_or_resident_permit_number:
              args.civil_record_or_resident_permit_number
                ? args.civil_record_or_resident_permit_number
                : "",
            nationality:
              args.nationality.value || args.nationality
                ? args.nationality.value || args.nationality
                : "",
            driver_prefered_language: args.prefered_language
              ? args.prefered_language
              : "",
            photo: args.photo ? args.photo : "",
            client_id: props.clientID ? props.clientID : "",
            civil_record_or_resident_permit_picture: "",
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
            // if (method == "upload") {
            //   console.log("create called with count id", args.count_id);
            //   let arr = cid;
            //   arr.push(args.count_id);
            //   console.log("arrrrrrr", arr);
            //   setCId(arr);
            // } else {
            //   getData();
            //   getUnassignedVehicles();
            // }
          } else {
            setoverlay(false);
            if (res.data.data.employee_number) {
              // helper.toastNotification(res.data.data.employee_number[0]);
              bulkData.filter((element, index) => {
                if (element.count_id === args.count_id) {
                  let newData = bulkData;
                  newData[index].emp1 = 1;
                  setBulkData([...newData]);
                }
              });
            }

            if (res.data.data.mobile) {
              // helper.toastNotification(res.data.data.mobile[0]);
              bulkData.filter((element, index) => {
                if (element.count_id === args.count_id) {
                  let newData = bulkData;
                  newData[index].mobile1 = 1;
                  setBulkData([...newData]);
                }
              });
            }

            if (res.data.data.civil_record_or_resident_permit_number) {
              helper.toastNotification(
                // res.data.data.civil_record_or_resident_permit_number[0]
                bulkData.filter((element, index) => {
                  if (element.count_id === args.count_id) {
                    let newData = bulkData;
                    newData[index].res1 = 1;
                    setBulkData([...newData]);
                  }
                })
              );
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
  };

  const getDeletedDrivers = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/driver/deleted`, {
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

  const delet = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/driver/trash`, {
        driver: {
          driver_id: deleteItem.driver_id,
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

  const getVehiclePlate = (data) => {
    if (helper.isObject(data.vehicle)) {
      return data.vehicle.plate_no;
    }

    // let obj;
    // if (helper.isObject(data.vehicle)) {
    //   obj = data.vehicle.find(
    //     (o) => o.request_status === "refueling"
    //   );
    //   return obj.longitude;
    // }
  };

  useEffect(() => {
    getData();
    getDeletedDrivers();
    getUnassignedVehicles();
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
          <CardTitle style={{ fontWeight: "bold" }} tag="h1">
            {t("Drivers")} {props.clientName}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Row>
            <Col lg={12}>
              <Row>
                <Col style={{ display: "flex" }}>
                  {role.addDriver ? (
                    <Button color="primary" onClick={(e) => openCreateModal()}>
                      <i className="fas fa-plus"></i> {t("Add Driver")}
                    </Button>
                  ) : (
                    ""
                  )}
                  {role.bulkUpload ? (
                    <Button
                      color="primary"
                      style={{ marginLeft: "5px", marginRight: "5px" }}
                      onClick={(e) => setshowBulkUploadModal(true)}
                    >
                      {t("Bulk Upload")}
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
                    <label color="primary">Active Drivers</label>
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
                    <label>Deleted Drivers</label>
                  </Button>
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
                      {t("Employee Number")}
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
                      {t("Vehicle Number Plate")}
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

                  <th className="table-th blackColor">
                    <p>
                      <span>{t("Civil record ID")} / </span>
                    </p>
                    <p>
                      <span> {t("Resident Permit number")}</span>
                    </p>
                  </th>
                  {!check ? (
                    <th className="table-th blackColor">
                      <p>{t("Unbind Mobile Device")}</p>
                    </th>
                  ) : (
                    ""
                  )}
                  <th className="table-th blackColor">
                    <p>{!check ? " Created at" : "Deleted At"}</p>
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
                          item.mobile
                            .toLowerCase()
                            .includes(searchData.toLowerCase()) ||
                          item.employee_number
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
                          <td>{getVehiclePlate(item)}</td>
                          <td>{item.civil_record_or_resident_permit_number}</td>
                          <td>
                            {item.u_uid && role.unbind ? (
                              <Button
                                color="primary"
                                data-tip="Unbind"
                                size={15}
                                onClick={(e) => setUnbind(item)}
                                style={{ marginTop: "4px", marginRight: "5px" }}
                              >
                                Unbind
                              </Button>
                            ) : (
                              ""
                            )}
                          </td>

                          <td>{helper.humanReadableDate(item.created_at)}</td>
                          <td>
                            {role.deleteDriver ? (
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
                              {role.updateDriver ? (
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
                              {role.chat ? (
                                <>
                                  {window.location.pathname.split("/")[1] !=
                                  "admin" ? (
                                    <Mail
                                      data-tip="Message"
                                      size={15}
                                      onClick={(e) =>
                                        onOpenMessageModal(item, index)
                                      }
                                      style={{
                                        marginTop: "4px",
                                        marginRight: "5px",
                                      }}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                              {role.deleteDriver ? (
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
                      ))
                  ) : (
                    <tr>
                      <td colSpan={7}>No Records found</td>
                    </tr>
                  )}
                </tbody>
              ) : (
                <tbody>
                  {deletedData.length > 0 ? (
                    deletedData &&
                    deletedData
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
                          item.mobile
                            .toLowerCase()
                            .includes(searchData.toLowerCase()) ||
                          item.employee_number
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
                          <td>{getVehiclePlate(item)}</td>
                          <td>{item.civil_record_or_resident_permit_number}</td>

                          <td>{helper.humanReadableDate(item.deleted_at)}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={7}>No Records found</td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </div>
          <AddUpdateModal
            show={showAddUpdateModal}
            updateModalData={updateModalData}
            onHide={onCloseAddUpdateModal}
            submitAction={submitAction}
            disableBtn={overlay}
            clientsList={clientsList}
            clientName={props.clientName}
            vehicles={vehicles}
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
          />
          <MessageModal
            show={showMessageModal}
            onCloseBulkUpdateModal={onCloseMessageModal}
            disableBtn={overlay}
            driver={updateModalData}
          />
          <DeleteModal
            show={showDeleteModal}
            confirmationText={`Are you sure to ${deleteMessage} a driver`}
            confirmationHeading={`${helper.uppercaseFirst(
              deleteMessage
            )} a driver`}
            onHide={onCloseDeleteModal}
            submitAction={submitAction}
            disableBtn={overlay}
          />
        </CardBody>
      </Card>
    </div>
  );
}
