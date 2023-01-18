import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
import { Check, X, Edit, Menu } from "react-feather";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import currentBalance from "@src/assets/images/icons/current-balance.png";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import { Card, CardText, CardBody, CardTitle, CardHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import vehiclesGreen from "@src/assets/images/icons/vehicles.png";
import Avatar from "@components/avatar";
import invoicesGreen from "@src/assets/images/icons/dollor-green.png";
import { getUserData } from "@utils";
import { useTranslation } from "react-i18next";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
// import LogsModal from "./LogsModal";

import AllocateModal from "./AllocateModal";
import DataTableExportButton from "../../components/TableToExcel";

function AllocateAmount(props) {
  const { t } = useTranslation();
  const [sorting_icon, setsorting_icon] = useState();
  const [data, setdata] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [paginationStates, setpaginationStates] = useState({
    itemsCountPerPage: "",
    activePage: "",
    totalItemsCount: "",
  });
  const [searchData, setSearchData] = useState("");

  const [overlay, setoverlay] = useState(false);

  const [dataForTable, setDataForTable] = useState([]);

  const [form, setform] = useState({
    temp_gas_tank_capacity: "",
    temp_capacity_expiry: "",
    vehicles: [],
    amount: "",
    renew_automatically: "no",
    remaining_balance: "no_carry_forword",
    days_limit: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);
  const [balance, setBalance] = useState({
    main_balance: "",
    current_balance: "",
    reserved_amount: "",
    rem_balance: "",
  });
  const [status, setStatus] = useState({
    label: "One Time Allocation",
    value: 2,
  });

  const [role, setRole] = useState({
    transfer: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.transfer_balance") {
        arr.transfer = true;
      }
    }
    // console.log("arrrrrrrrrrr", arr);
    setRole(arr);
  };

  const getData = () => {
    setoverlay(true);
    axios
      .post(
        `${jwtDefaultConfig.adminBaseUrl}/vehicles?page=${currentPage}&pagination=true`,
        {
          client: {
            clientId: props.clientID ? props.clientID : getUserData().client_id,
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
        auto_renew: item.renew_automatically ? item.renew_automatically : "",
        days_limit:
          item.days_limit && item.days_limit != "0"
            ? item.days_limit
            : "One Time",
        expiry: item.temp_capacity_expiry,
        make: item.make,
        model: item.model,
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
      });
    });
    setDataForTable(arr);
  };
  const getFuelTypes = () => {
    setoverlay(true);
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/fuel-types?page=${currentPage}&pagination=true`,
        {}
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(helper.applyCountID(res.data.data.data), "fuel data");
          setFuelTypes(helper.applyCountID(res.data.data.data));

          setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setFuelTypes([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setFuelTypes([]);
        setoverlay(false);
      });
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
      colsort == "color" ||
      colsort == "gas_tank_capacity"
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
  const setVehicleArray = (id) => {
    let formUpdate = { ...form };

    let arr = formUpdate.vehicles;

    let index = arr.findIndex((x) => x.vehicle_id == id);

    if (index >= 0) {
      arr.splice(index, 1);
    } else {
      arr.push({ vehicle_id: id });
    }

    formUpdate["vehicles"] = arr;
    setform(formUpdate);
  };

  const getCheck = (id) => {
    let formUpdate = { ...form };

    let arr = formUpdate.vehicles;
    let index = arr.findIndex((x) => x.vehicle_id == id);
    if (index >= 0) {
      return true;
    } else {
      return false;
    }
  };

  const save = () => {
    if (
      helper.isEmptyString(form.temp_gas_tank_capacity) &&
      helper.isEmptyString(form.amount)
    ) {
      helper.toastNotification(
        "Please enter gas tank capacity or amount.",
        "FAILED_MESSAGE"
      );
    } else if (
      helper.isEmptyString(form.temp_capacity_expiry) &&
      status.value == 2
    ) {
      helper.toastNotification("Please enter date and time", "FAILED_MESSAGE");
    } else if (helper.isEmptyString(form.days_limit) && status.value == 1) {
      helper.toastNotification("Please select day", "FAILED_MESSAGE");
    } else if (form.vehicles.length < 1) {
      helper.toastNotification(
        "Please select at least 1 vehicle",
        "FAILED_MESSAGE"
      );
    } else {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/update-temp-capacity`, {
          temp_gas_tank_capacity: form.temp_gas_tank_capacity
            ? form.temp_gas_tank_capacity
            : "",
          temp_capacity_expiry: form.temp_capacity_expiry
            ? form.temp_capacity_expiry
            : "",
          vehicles: form.vehicles ? form.vehicles : "",
          amount: form.amount ? form.amount : "",
          renew_automatically: form.renew_automatically
            ? form.renew_automatically
            : "",
          remaining_balance: form.remaining_balance
            ? form.remaining_balance
            : "",
          days_limit: form.days_limit ? form.days_limit : "",
        })
        .then((res) => {
          helper.redirectToLogin(
            helper.isObject(res.data) ? res.data.code : 200
          );
          if (res.data.code && res.data.code === 200) {
            // setshowAddUpdateModal(false);
            setoverlay(false);
            helper.toastNotification(
              "Request has been processed successfuly.",
              "SUCCESS_MESSAGE"
            );
            setform({
              temp_gas_tank_capacity: "",
              temp_capacity_expiry: "",
              vehicles: [],
              amount: "",
              renew_automatically: "no",
              remaining_balance: "no_carry_forword",
            });
            getData();
            // getDrivers();
          } else {
            setoverlay(false);

            helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
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
    }
  };
  const submitAction = (args) => {
    setoverlay(true);
    setModalLoader(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/transfer-balance`, {
        client: {
          client_id: props.clientID ? props.clientID : getUserData().client_id,
          current_balance: args.current_balance,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setShowModal(false);
          setModalLoader(false);
          setoverlay(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          if (window.location.href.indexOf("/client") > -1) {
            getBalance();
          } else {
            props.getData();
          }
          // getData();
          // getDrivers();
        } else {
          setoverlay(false);
          setModalLoader(false);
          helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
        }
      })
      .catch((error) => {
        setoverlay(false);
        setModalLoader(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
        console.log(error, "errorrrr");
      });
  };
  const onInputchange = (value, key) => {
    console.log("value , key:", value, key);
    let formUpdate = { ...form };
    formUpdate[key] = value;
    setform(formUpdate);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };
  const getBalance = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client`, {
        client: {
          clientId:
            window.location.href.indexOf("/admin/") > -1
              ? IDfromUrl(window.locatihelper.geton.href)
              : getUserData().client_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setBalance({
            main_balance: res.data.client.main_balance,
            current_balance: res.data.client.current_balance,
            reserved_amount: res.data.client.reserved_amount,
            rem_balance:
              parseFloat(res.data.client.current_balance) -
              parseFloat(res.data.client.reserved_amount),
          });

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

  useEffect(() => {
    if (helper.isObject(props.data)) {
      setBalance({
        main_balance: props.data.main_balance,
        current_balance: props.data.current_balance,
        reserved_amount: props.data.reserved_amount,
        rem_balance:
          parseFloat(props.data.current_balance) -
          parseFloat(props.data.reserved_amount),
      });
    }
  }, [props.data]);

  const days = [
    {
      label: "1 day",
      value: 1,
    },
    {
      label: "2 days",
      value: 2,
    },
    {
      label: "3 days",
      value: 3,
    },
    {
      label: "4 days",
      value: 4,
    },
    {
      label: "5 days",
      value: 5,
    },
    {
      label: "6 days",
      value: 6,
    },
    {
      label: "7 days",
      value: 7,
    },
    {
      label: "8 days",
      value: 8,
    },
    {
      label: "9 days",
      value: 9,
    },
    {
      label: "10 days",
      value: 10,
    },
    {
      label: "11 days",
      value: 11,
    },
    {
      label: "12 days",
      value: 12,
    },
    {
      label: "13 days",
      value: 13,
    },
    {
      label: "14 days",
      value: 14,
    },
    {
      label: "15 days",
      value: 15,
    },
    {
      label: "16 days",
      value: 16,
    },
    {
      label: "17 days",
      value: 17,
    },
    {
      label: "18 days",
      value: 18,
    },
    {
      label: "19 days",
      value: 19,
    },
    {
      label: "20 days",
      value: 20,
    },
    {
      label: "21 days",
      value: 21,
    },
    {
      label: "22 days",
      value: 22,
    },
    {
      label: "23 days",
      value: 23,
    },
    {
      label: "24 days",
      value: 24,
    },
    {
      label: "25 days",
      value: 25,
    },
    {
      label: "26 days",
      value: 26,
    },
    {
      label: "27 days",
      value: 27,
    },
    {
      label: "28 days",
      value: 28,
    },
    {
      label: "29 days",
      value: 29,
    },
    {
      label: "30 days",
      value: 30,
    },
  ];

  const getMinDate = () => {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // now.toISOString().slice(0, 16);
    // console.log("minnnnnnnnnn", now.toISOString().slice(0, 16).toString());
    return now.toISOString().slice(0, 16);
  };

  useEffect(() => {
    setRoles();
    getFuelTypes();
    getData();
    if (window.location.href.indexOf("/client") > -1) {
      getBalance();
    } else {
      setBalance({
        main_balance: props.data.main_balance,
        current_balance: props.data.current_balance,
        reserved_amount: props.data.reserved_amount,
        rem_balance:
          parseFloat(props.data.current_balance) -
          parseFloat(props.data.reserved_amount),
      });
    }
    // console.log("user dataaaaaaaaaaa", getUserData());
  }, []);

  useEffect(() => {
    // console.log("statussssssssssssss", status);
  }, [status]);

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
            {t("Client")}{" "}
            {props.clientName ? props.clientName : getUserData().username}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Row style={{ marginTop: "10px", marginBottom: "10px" }}>
            <Col lg={12}>
              <Row>
                {/* <Col
                  sm={2}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    // paddingLeft: "5px",
                    paddingRight: "5px",
                    // background: "pink",
                  }}
                ></Col> */}
                <Box
                  title={balance.main_balance ? balance.main_balance : "0.00"}
                  subtitle={"Main Balance"}
                  bg={"#f1fff0"}
                  btn={role.transfer}
                  setShowModal={setShowModal}
                  b={balance.main_balance}
                  icon={currentBalance}
                />
                <Box
                  title={
                    balance.current_balance ? balance.current_balance : "0.00"
                  }
                  subtitle={"Allocated Balance"}
                  bg={"#e0f9de"}
                />
                <Box
                  title={
                    balance.reserved_amount ? balance.reserved_amount : "0.00"
                  }
                  subtitle={"Reserved for Accepted Refuel Request"}
                  bg={"#d2f7cf"}
                  icon={vehiclesGreen}
                />
                <Box
                  title={
                    // balance.current_balance && balance.reserved_amount
                    //   ?
                    (
                      parseFloat(balance.current_balance) -
                      parseFloat(balance.reserved_amount)
                    ).toFixed(2)
                    // != isNaN
                    // ? (
                    //     parseFloat(balance.current_balance) -
                    //     parseFloat(balance.reserved_amount)
                    //   ).toFixed(2)
                    // : "0.00 "
                    // : "0.00"
                  }
                  subtitle={"Remaining Balance"}
                  bg={"#c6f3c3"}
                />
              </Row>
            </Col>
          </Row>
          {/* trip fuel--------------------------- */}
          <label
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            Allocate Fuel
          </label>
          <Row>
            <Col lg={12}>
              <Row>
                <Col sm="2">
                  <input
                    disabled={form.temp_gas_tank_capacity != "" ? true : false}
                    className="form-control"
                    type="text"
                    name="amount"
                    autoComplete="off"
                    value={form.amount || ""}
                    placeholder={`${t("Amount")}...`}
                    onChange={(e) =>
                      onInputchange(
                        helper.cleanDecimal(e.target.value, "amount"),
                        "amount"
                      )
                    }
                  />
                </Col>
                <Col sm="2">
                  <input
                    disabled={form.amount != "" ? true : false}
                    className="form-control"
                    type="text"
                    name="temp_gas_tank_capacity"
                    value={form.temp_gas_tank_capacity || ""}
                    placeholder={`${t("Fuel")}...`}
                    onChange={(e) =>
                      onInputchange(
                        helper.cleanDecimal(e.target.value, "amount"),
                        "temp_gas_tank_capacity"
                      )
                    }
                  />
                </Col>

                <Col sm="2">
                  {/* <label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    {t("Status")}
                  </label> */}
                  <Select
                    name="select-status"
                    style={{ height: "40px" }}
                    onChange={(e) => {
                      if (e) {
                        setStatus(e);
                      }
                    }}
                    options={[
                      {
                        label: "One Time Allocation",
                        value: 2,
                      },
                      {
                        label: "By Days",
                        value: 1,
                      },
                    ]}
                    value={status || []}
                    isClearable={true}
                  />
                </Col>
                {status.value == 2 ? (
                  <Col sm="2">
                    <input
                      onChange={(e) => {
                        let date = e.target.value.split("T")[0];
                        let time = e.target.value.split("T")[1];
                        let dateTime = date + " " + time;
                        onInputchange(dateTime, "temp_capacity_expiry");
                      }}
                      // value={filter.from}
                      className="form-control"
                      name="time_start"
                      type="datetime-local"
                      min={getMinDate()}
                      // min="2022-11-01T00:00"
                    />
                  </Col>
                ) : (
                  <Col sm="2">
                    <Select
                      name="select-days"
                      style={{ height: "40px" }}
                      onChange={(e) => {
                        if (e) {
                          onInputchange(e.value, "days_limit");
                        }
                      }}
                      options={days}
                      // value={status || []}
                      isClearable={true}
                    />
                  </Col>
                )}
                {status.value == 1 ? (
                  <Col
                    sm="2"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        // width: "50%",

                        alignItems: "center",
                        marginLeft: "10px",
                      }}
                    >
                      <label style={{ fontWeight: "700" }}>
                        Renew Automaticaly ?
                      </label>
                      <input
                        checked={
                          form.renew_automatically == "yes" ? true : false
                        }
                        type="checkbox"
                        style={{ marginLeft: "10px" }}
                        onChange={() => {
                          onInputchange(
                            form.renew_automatically == "yes" ? "no" : "yes",
                            "renew_automatically"
                          );
                        }}
                      />
                    </div>
                    {/* <div
                    style={{
                      display: "flex",
                      width: "50%",
                      alignItems: "center",
                    }}
                  >
                    <label style={{ fontWeight: "700" }}>Carry Forwerd ?</label>
                    <input
                      checked={
                        form.remaining_balance == "carry_forword" ? true : false
                      }
                      type="checkbox"
                      style={{ marginLeft: "10px" }}
                      onChange={() => {
                        onInputchange(
                          form.remaining_balance == "no_carry_forword"
                            ? "carry_forword"
                            : "no_carry_forword",
                          "remaining_balance"
                        );
                      }}
                    />
                  </div> */}
                  </Col>
                ) : (
                  <Col></Col>
                )}
                <Col sm="2">
                  {role.transfer ? (
                    <Button
                      style={{ marginLeft: "5px" }}
                      onClick={(e) => save()}
                    >
                      {t("Save")}
                    </Button>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <div style={{ marginTop: "10px" }}>
            {fuelTypes.length > 0 && form.amount != ""
              ? fuelTypes.map((i) => {
                  return (
                    <p style={{ fontSize: "1.2em" }}>
                      {i.title_en}:{" "}
                      {(parseFloat(form.amount) / i.base_price).toFixed(2)} ltr
                    </p>
                  );
                })
              : ""}
          </div>
          <hr></hr>

          <Row>
            <Col lg={12}>
              <Row>
                <Col sm={2} style={{ display: "flex" }}>
                  <input
                    className="form-control crud-search "
                    placeholder={`${t("Search")}...`}
                    onChange={(e) => filterData(e.target.value)}
                    style={{ width: "100%" }}
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
          <div className="table-responsive" style={{ marginTop: "20px" }}>
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
                            sortAscending(
                              "Col10_asc",
                              "asc",
                              "gas_tank_capacity"
                            )
                          }
                          className={
                            sorting_icon == "Col10_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending(
                              "Col10_des",
                              "des",
                              "gas_tank_capacity"
                            )
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
                    {t("Fuel Limit")}
                    <span>
                      <i
                        onClick={(e) =>
                          sortAscending(
                            "Col10_asc",
                            "asc",
                            "temp_gas_tank_capacity"
                          )
                        }
                        className={
                          sorting_icon == "Col10_asc"
                            ? "fas fa-long-arrow-alt-up sort-color"
                            : "fas fa-long-arrow-alt-up"
                        }
                      ></i>
                      <i
                        onClick={(e) =>
                          sortAscending(
                            "Col10_des",
                            "des",
                            "temp_gas_tank_capacity"
                          )
                        }
                        className={
                          sorting_icon == "Col10_des"
                            ? "fas fa-long-arrow-alt-down sort-color"
                            : "fas fa-long-arrow-alt-down"
                        }
                      ></i>
                    </span>
                  </th>
                  <th className="table-th blackColor">
                    <p>{t("Auto Renew")}</p>
                  </th>
                  <th className="table-th blackColor">
                    <p>{t("Days Limit")}</p>
                  </th>
                  <th className="table-th blackColor">
                    {t("Expiry")}
                    <span>
                      <i
                        onClick={(e) =>
                          sortAscending(
                            "Col10_asc",
                            "asc",
                            "temp_capacity_expiry"
                          )
                        }
                        className={
                          sorting_icon == "Col10_asc"
                            ? "fas fa-long-arrow-alt-up sort-color"
                            : "fas fa-long-arrow-alt-up"
                        }
                      ></i>
                      <i
                        onClick={(e) =>
                          sortAscending(
                            "Col10_des",
                            "des",
                            "temp_capacity_expiry"
                          )
                        }
                        className={
                          sorting_icon == "Col10_des"
                            ? "fas fa-long-arrow-alt-down sort-color"
                            : "fas fa-long-arrow-alt-down"
                        }
                      ></i>
                    </span>
                  </th>

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
                </tr>
              </thead>

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
                            {role.transfer ? (
                              <input
                                checked={getCheck(item.vehicle_id)}
                                type="checkbox"
                                onChange={() => {
                                  setVehicleArray(item.vehicle_id);
                                }}
                              />
                            ) : (
                              ""
                            )}
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
                        // data-tip={
                        //   item.temp_capacity_expiry
                        //     ? "Expiry: " + item.temp_capacity_expiry
                        //     : ""
                        // }
                        >
                          <label>
                            {item.temp_gas_tank_capacity
                              ? item.temp_gas_tank_capacity
                              : ""}
                          </label>
                        </td>
                        <td>
                          {item.renew_automatically
                            ? item.renew_automatically
                            : ""}
                        </td>
                        <td>
                          {item.days_limit ? item.days_limit : "One Time"}
                        </td>
                        <td>
                          {item.temp_capacity_expiry
                            ? helper.humanReadableDate(
                                item.temp_capacity_expiry
                              )
                            : ""}
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

                        {/* <ReactTooltip textColor={"black"} /> */}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      <AllocateModal
        show={showModal}
        onHide={onCloseModal}
        data={balance}
        submitAction={submitAction}
        showLoader={modalLoader}
      />
    </div>
  );
}

export default AllocateAmount;

const Box = ({ title, subtitle, bg, btn, setShowModal, b, icon }) => {
  return (
    <Col
      style={{
        background: bg,
        marginLeft: "5px",
        marginRight: "5px",
        marginTop: "5px",
        marginBottom: "5px",
        height: "80px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <Col
        style={{
          // alignItems: "center",
          // justifyContent: "center",
          // display: "flex",
          marginLeft: "20px",
        }}
      >
        <div className="d-flex align-items-center">
          <Avatar
            color={"light-info"}
            icon={<img src={icon ? icon : invoicesGreen} />}
            className="me-2"
          />

          <div className="my-auto">
            <h4 className="fw-bolder mb-0">
              {!isNaN(title) ? title : "0.00"} SAR
            </h4>
            <CardText className="font-small-6 mb-0">{subtitle}</CardText>
          </div>
        </div>
      </Col>
      {btn ? (
        <Button
          disabled={b ? false : true}
          onClick={() => {
            setShowModal(true);
          }}
        >
          {" "}
          <p>Transfer Balance</p>
        </Button>
      ) : (
        ""
      )}
    </Col>
  );
};
