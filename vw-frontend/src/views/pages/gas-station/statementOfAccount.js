import React, { useEffect, useState } from "react";

import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import pdfIcon from "@src/assets/images/icons/file-icons/pdf.png";
import excelIcon from "@src/assets/images/icons/file-icons/xls.png";
import logo from "@src/assets/images/logo/aqg.png";
import { Card, CardBody, CardTitle, CardHeader } from "reactstrap";

import { useTranslation } from "react-i18next";

import { getUserData } from "@utils";

import downloadIcon from "@src/assets/images/icons/download.png";

export default function company(props) {
  const { t } = useTranslation();
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState("");

  const [role, setRole] = useState({
    viewStatement: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (
        roles[i].subject == "fm.refueling_transaction.transaction_statement"
      ) {
        arr.viewStatement = true;
      }
    }
    // console.log("arrrrrrrrrrr", arr);
    setRole(arr);
  };

  const [filter, setfilter] = useState({
    transaction_type: "",
    from: "",
    to: "",
  });

  const downloadPDFNetwork = (type) => {
    let id = getUserData().gas_station_network_id;
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
        `${
          jwtDefaultConfig.adminBaseUrl
        }/gas_station_transaction_statement?gas_station_network_id=${
          getUserData().gas_station_network_id
            ? getUserData().gas_station_network_id
            : helper.getIDfromUrl(window.location.href)
        }`,
        {
          transaction_statement: {
            gas_station_id: "",
            from_date: filter.from,
            to_date: filter.to,
            type: filter.transaction_type,
            file_type: type,
          },
        }
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setoverlay(false);
          if (helper.isObject(res.data.data) || res.data.data.length > 0) {
            let link = document.createElement("a");
            link.href = res.data.data.link;
            link.download = res.data.data.name;
            link.dispatchEvent(new MouseEvent("click"));
          } else {
            helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
          }
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

  const downloadPDF = (type) => {
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
        `${jwtDefaultConfig.adminBaseUrl}/gas_station_transaction_statement`,
        {
          transaction_statement: {
            gas_station_id: props.stationID
              ? props.stationID
              : helper.getIDfromUrl(window.location.href),
            from_date: filter.from,
            to_date: filter.to,
            type: filter.transaction_type,
            file_type: type,
          },
        }
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setoverlay(false);
          let link = document.createElement("a");
          link.href = res.data.data.link;
          link.download = res.data.data.name;
          link.dispatchEvent(new MouseEvent("click"));
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

  const getNetworkData = () => {
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
        `${
          jwtDefaultConfig.adminBaseUrl
        }/gas_station_transaction_statement_data?gas_station_network_id=${
          getUserData().gas_station_network_id
            ? getUserData().gas_station_network_id
            : helper.getIDfromUrl(window.location.href)
        }`,
        {
          transaction_statement: {
            gas_station_id: "",
            from_date: filter.from,
            to_date: filter.to,
            type: filter.transaction_type,
          },
        }
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(res.data, "gas station data");
          setdata(res.data);

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
  const getData = () => {
    console.log(
      "urllllllllllllll"
      // window.location.pathname.split("/").splice(-2)[0]
    );
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
        `${jwtDefaultConfig.adminBaseUrl}/gas_station_transaction_statement_data`,
        {
          transaction_statement: {
            gas_station_id: props.stationID
              ? props.stationID
              : helper.getIDfromUrl(window.location.href),
            from_date: filter.from,
            to_date: filter.to,
            type: filter.transaction_type,
          },
        }
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(res.data, "gas station data");
          setdata(res.data);

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

  const refreshFilter = () => {
    // setfilter({
    //   transaction_type: "",
    //   from: "",
    //   to: "",
    // });

    // setdata("");
    if (
      window.location.pathname.split("/").splice(-1) ==
      "network-account-statement"
    ) {
      getNetworkData();
    } else if (
      window.location.pathname.split("/").splice(-2)[0] ==
      "network-account-statement"
    ) {
      getNetworkData();
    } else {
      getData();
    }
  };

  const onChangeInput = (value, name) => {
    let search = { ...filter };
    search[name] = value;
    setfilter(search);
  };
  const setDate = () => {
    var today = new Date().toISOString().slice(0, 10);
    var d = new Date(); // today!
    var x = 7; // go back 7 days!
    d.setDate(d.getDate() - x);
    var prevDate = d.toISOString().slice(0, 10);

    setfilter({
      transaction_type: "",
      from: prevDate,
      to: today,
    });
  };

  const getFuelType = (data) => {
    if (helper.isObject(data) && helper.isObject(data.fuel_type)) {
      return data.fuel_type.title_en;
    } else {
      return "";
    }
  };
  const getGasStation = (data) => {
    if (helper.isObject(data) && helper.isObject(data.gas_station)) {
      return data.gas_station.name_en;
    } else {
      return "";
    }
  };
  const getClient = (data) => {
    if (
      helper.isObject(data) &&
      helper.isObject(data.driver) &&
      helper.isObject(data.driver.client)
    ) {
      return data.driver.client.name_en;
    } else {
      return "";
    }
  };

  useEffect(() => {
    setRoles();
    //getData();
    setDate();
  }, [props.stationID]);

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
            {t("Statement of Account")} {props.gasStationName}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Row>
            <Col>
              <label>{t("Transaction Type")}</label>
              <select
                name="transaction_type"
                className="form-control"
                onChange={(e) =>
                  onChangeInput(e.target.value, "transaction_type")
                }
              >
                <option value="">All</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </Col>

            <Col>
              <label>{t("From Date")}</label>
              <input
                onChange={(e) => onChangeInput(e.target.value, "from")}
                value={filter.from}
                className="form-control"
                name="from"
                type="date"
              />
            </Col>

            <Col>
              <label>{t("To Date")}</label>
              <input
                onChange={(e) => onChangeInput(e.target.value, "to")}
                value={filter.to}
                className="form-control"
                name="to"
                type="date"
              />
            </Col>

            <Col>
              {/* {role.viewStatement ? ( */}
              <Button
                style={{ marginTop: "19px" }}
                onClick={(e) => {
                  if (
                    window.location.pathname.split("/").splice(-1) ==
                    "network-account-statement"
                  ) {
                    getNetworkData();
                  } else if (
                    window.location.pathname.split("/").splice(-2)[0] ==
                    "network-account-statement"
                  ) {
                    getNetworkData();
                  } else {
                    getData();
                  }
                }}
              >
                <i className="fa fa-search"></i>
              </Button>
              {/* ) : (
                ""
              )} */}
              <Button
                style={{ marginTop: "19px", marginLeft: "5px" }}
                onClick={(e) => refreshFilter()}
              >
                <i className="fa fa-refresh"></i>
              </Button>
              {helper.isObject(data) ? (
                <>
                  <img
                    onClick={(e) => {
                      if (
                        window.location.pathname.split("/").splice(-1) ==
                        "network-account-statement"
                      ) {
                        downloadPDFNetwork("pdf");
                      } else if (
                        window.location.pathname.split("/").splice(-2)[0] ==
                        "network-account-statement"
                      ) {
                        downloadPDFNetwork("pdf");
                      } else {
                        downloadPDF("pdf");
                      }
                    }}
                    src={pdfIcon}
                    style={{ width: "31px", marginTop: "21px" }}
                  />
                  <img
                    onClick={(e) => {
                      if (
                        window.location.pathname.split("/").splice(-1) ==
                        "network-account-statement"
                      ) {
                        downloadPDFNetwork("csv");
                      } else if (
                        window.location.pathname.split("/").splice(-2)[0] ==
                        "network-account-statement"
                      ) {
                        downloadPDFNetwork("csv");
                      } else {
                        downloadPDF("csv");
                      }
                    }}
                    src={excelIcon}
                    style={{ width: "31px", marginTop: "21px" }}
                  />
                </>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>

      {helper.isObject(data) ? (
        <Card>
          <CardBody>
            <h5 style={{ textAlign: "center" }}>{t("Statement of Account")}</h5>

            <Row>
              <div className="col-xs-12">
                <div style={{ width: "29%", float: "left" }}>
                  <img
                    src={logo}
                    className=""
                    title=""
                    alt="logo"
                    width="100"
                  />
                </div>
                <div
                  style={{ width: "70%", float: "right", textAlign: "right" }}
                >
                  <label>
                    {t("Date of Issue")}:{" "}
                    <span className="font-weight-bold">
                      {data.current_time}
                    </span>
                  </label>
                  <br />
                  <label>
                    {t("Account Title")}:{" "}
                    <span className="font-weight-bold">{data.client_name}</span>
                  </label>
                  <br />
                  <label>
                    {t("Contract Number: ")}{" "}
                    <span className="font-weight-bold">
                      {data.account_number}
                    </span>
                  </label>
                  <br />
                  <label>
                    {t("Statement Period")}:{" "}
                    <span className="font-weight-bold">
                      {data.from_to_date}
                    </span>
                  </label>
                </div>
              </div>
            </Row>
            <Row>
              <div className="col-xs-2">&nbsp;</div>
              <div
                className="col-xs-6 font-weight-bold"
                style={{ textAlign: "center" }}
              ></div>
            </Row>
            <Row>
              <div
                className="col-xs-12"
                style={{ textAlign: "center", margin: "0 auto" }}
              >
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <td className="table-th blackColor">{t("Date")}</td>
                        <td className="table-th blackColor">
                          {t("Description")}
                        </td>
                        <td className="table-th blackColor">
                          {t("Reference Number")}
                        </td>
                        <td className="table-th blackColor">
                          {t("Transaction Type")}
                        </td>
                        <td className="table-th blackColor">
                          {t("Amount Debited")}
                        </td>
                        <td className="table-th blackColor">
                          {t("Amount Credited")}
                        </td>
                        <td className="table-th blackColor">
                          {t("Running Balance")}
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data &&
                        data.data.map((item, index) => (
                          <tr key={index}>
                            <td>{helper.humanReadableDate(item.created_at)}</td>
                            <td>
                              {item.charge_reason ==
                                "vehicle_wallet_payment_to_gas_station" ||
                              item.charge_reason ==
                                "vehicle_wallet_payment_to_gas_station_network"
                                ? ` ${
                                    item.gas_station_id
                                      ? `VW Payment to ${
                                          helper.isObject(item.gas_station)
                                            ? item.gas_station.name_en
                                            : ""
                                        }`
                                      : "VW PAYMENT TO GAS STATION NETWORK"
                                  }`
                                : item.gas_station_type == "credit"
                                ? ` Refuel,                                   
                                ${
                                  item.liters ? `${item.liters} liters,` : ""
                                } ${
                                    getFuelType(item)
                                      ? `${getFuelType(item)},`
                                      : ""
                                  } ${
                                    getGasStation(item)
                                      ? `${getGasStation(item)},`
                                      : ""
                                  } 
                                   
                                  ${
                                    getClient(item) ? `${getClient(item)}` : ""
                                  }`
                                : `Vehicle Wallet Processing Fee +  
                                ${item.vat ? item.vat : "0.00"} 
                                 SAR VAT`}
                            </td>
                            <td> {item.reference_number} </td>
                            {/* <td>{item.reference_number}</td> */}
                            <td>{item.gas_station_type}</td>
                            <td>
                              {item.gas_station_type == "debit" && item.amount
                                ? `${
                                    item.vat
                                      ? (
                                          parseFloat(item.amount) +
                                          parseFloat(item.vat)
                                        ).toFixed(3)
                                      : item.amount
                                  }`
                                : "0.00"}
                            </td>
                            <td>
                              {item.gas_station_type == "credit" && item.amount
                                ? `${
                                    item.vat
                                      ? parseFloat(item.amount) +
                                        parseFloat(item.vat)
                                      : item.amount
                                  }`
                                : "0.00"}
                            </td>
                            <td>
                              {item.gas_station_net_running_balance
                                ? item.gas_station_net_running_balance
                                : "0.00"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Row>
            <Row>
              <div
                style={{
                  bottom: "5px",
                  left: "0px",
                  right: "0px",
                }}
              >
                <div className="row">
                  <div
                    className="col-xs-12 font-weight-bold"
                    // style={{ textAlign: "center" }}
                  >
                    <h5 style={{ marginTop: "10px", marinBottom: "10px" }}>
                      {t("Statement Summary")}
                    </h5>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-xs-12" style={{ fontSize: "12px" }}>
                    <label>
                      {t("Total Credit Amount")}:{" "}
                      <span className="fontweight-bold">
                        {t("SAR")} {data.total_credit_amount}
                      </span>
                    </label>
                    <br />
                    <label>
                      {t("Total Credit Transactions")}:{" "}
                      <span className="font-weight-bold">
                        {data.total_credit_transactions}
                      </span>
                    </label>
                    <br />
                    <label>
                      {t("Average Credit Transactions")}:{" "}
                      <span className="font-weight-bold">
                        {t("SAR")} {data.average_credit_transactions}
                      </span>
                    </label>
                    <br />
                    <label>
                      {t("Total Debit Amount")}:{" "}
                      <span className="font-weight-bold">
                        {t("SAR")} {data.total_debit_amount}
                      </span>
                    </label>
                    <br />
                    <label>
                      {t("Total Debit Transactions")}:{" "}
                      <span className="font-weight-bold">
                        {data.total_debit_transactions}
                      </span>
                    </label>
                    <br />
                    <label>
                      {t("Average Debit Transactions")}:{" "}
                      <span className="font-weight-bold">
                        {t("SAR")} {data.average_debit_transactions}
                      </span>
                    </label>
                  </div>
                </div>
                <br />
                <div style={{ fontsize: "10px" }}>
                  <label className="font-weight-bold">{t("Disclaimer")}:</label>{" "}
                  <br />
                  <p>{t("This is an electronic statement")}.</p>
                  <br />
                </div>
              </div>
            </Row>
          </CardBody>
        </Card>
      ) : (
        ""
      )}
    </div>
  );
}
