import React, { useState, useContext, useEffect } from "react";
import avatar from "@src/assets/images/avatars/pertol200.png";
import location from "@src/assets/images/icons/location-green.png";
import { useTranslation } from "react-i18next";
import helper from "@src/@core/helper";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { ClipLoader } from "react-spinners";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Input,
  Label,
} from "reactstrap";
import { Check, X } from "react-feather";

import PaymentSections from "./paymentSections";
function Payment(props) {
  const [overlay, setoverlay] = useState(false);

  const { t } = useTranslation();

  const [data, setData] = useState({});
  const [stations, setStations] = useState([]);
  const [amount, setAmount] = useState("");

  const [form, setform] = useState({
    transaction_reference: "",
    amount: "",
    photo: "",
  });
  const [avatar1, setAvatar] = useState(
    !helper.isEmptyString(form.photo)
      ? form.photo
      : require("@src/assets/images/portrait/small/payment.png").default
  );

  const onChange = (e) => {
    console.log("on change");
    const reader = new FileReader(),
      files = e.target.files;
    if (files[0].size > 800000) {
      helper.toastNotification(
        "Image size sould be less than 800kb",
        "FAILED_MESSAGE"
      );
    } else {
      console.log(files, "filiessssssssssss");
      reader.onload = function () {
        setAvatar(reader.result);

        onInputchange(reader.result, "photo");
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const onReset = () => {
    return new Promise((res, rej) => {
      setAvatar(
        require("@src/assets/images/portrait/small/payment.png").default
      );
      onInputchange("", "photo");
      res();
    });
  };

  const [error, seterror] = useState({
    transaction_reference: "",
    amount: "",
  });

  const onInputchange = (value, key) => {
    let formUpdate = { ...form };
    formUpdate[key] = value;
    setform(formUpdate);
  };

  const submit = () => {
    if (props.disableBtn) {
      return false;
    }

    let errorCount = 0;
    let error = {};

    seterror({
      transaction_reference: "",
      amount: "",
    });

    if (helper.isEmptyString(form.photo)) {
      error.photo = "Transaction file is required";
      errorCount++;
    }

    // if (helper.isEmptyString(form.transaction_reference)) {
    //   error.transaction_reference = "Transaction reference is required";
    //   errorCount++;
    // }

    if (helper.isEmptyString(form.amount)) {
      error.amount = "Amount is required";
      errorCount++;
    }

    if (errorCount > 0) {
      seterror(error);
    } else {
      //console.log(form, "form");
      //   create(form);
    }
  };

  const getData = () => {
    helper.getIDfromUrl(window.location.href);
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/gas-station-network`, {
        gas_station_network: {
          gas_station_network_id: helper.getIDfromUrl(window.location.href),
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setData(res.data.gas_station_network);
          console.log(res.data.gas_station_network, "data");
          if (res.data.gas_station_network.gas_stations.length > 0) {
            let arr = [];
            let count = 0;
            res.data.gas_station_network.gas_stations.forEach((item) => {
              if (item.account_number != null && item.account_number != "") {
                arr.push(item);
                count = count + parseFloat(item.deposited_amount);
              }
            });
            setAmount(count);
            setStations(helper.applyCountID(arr));
            setoverlay(false);
          }
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setData([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setData([]);
        setoverlay(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    console.log("dataaaaaa", data);
  }, [data]);

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
  return (
    <>
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
        loading={false}
      />
      <div className="row" style={{ marginBottom: "15px" }}>
        <div className="col-xs-12 col-sm-6 col-md-6">
          <div
            className="well well-sm"
            style={{
              background: "#fff",
              boxShadow: "0 4px 24px 0 rgb(34 41 47 / 10%)",
              borderRadius: "5px",
            }}
          >
            <div className="row">
              <div className="col-sm-6 col-md-5" style={{ width: "200px" }}>
                <img
                  src={avatar}
                  style={{
                    width: "191px",
                    borderRadius: "5px",
                  }}
                  className="img-rounded img-responsive"
                />
              </div>
              <div
                className="col-sm-6 col-md-7"
                style={{ marginLeft: "10px", marginTop: "15px" }}
              >
                <h5
                  style={{
                    marginTop: "5px",
                    width: "95%",
                    marginBottom: "10px",
                  }}
                >
                  {helper.isObject(data) ? data.name_en : "-----"}
                </h5>
                <p style={{ fontSize: "1.2em" }}>
                  <img src={location} /> {t("Location")}:{" "}
                  {helper.isObject(data) ? data.address : "------"}
                </p>
                <p style={{ fontSize: "1.2em" }}>
                  {t("Gas Station Network Due Amount")}:{" "}
                  {helper.isObject(data) && data.vw_deposited_amount
                    ? data.vw_deposited_amount
                    : "0.00"}{" "}
                  {t("SAR")}
                </p>
                <p style={{ fontSize: "1.2em" }}>
                  {t("Franchisee Gas Station Due Amount")}: {amount} {t("SAR")}
                </p>
                {window.location.pathname.split("/")[1] == "admin" ? (
                  <div
                    className="form-switch form-check-success"
                    style={{ marginTop: "5px" }}
                  >
                    {/* <CustomLabel htmlFor={`icon-success${3}`} /> */}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-6">
          <Row className="match-height">
            <Col>
              <Card style={{ height: "190px" }}>
                <CardHeader>
                  <CardTitle style={{ fontWeight: "bold" }} tag="h3">
                    {t("Franchisee Gas Stations")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th
                            className="table-th blackColor"
                            style={{ width: "120px" }}
                          >
                            <p>{t("Name")}</p>
                          </th>

                          <th className="table-th blackColor">
                            <p>{t("Deposited Amount")}</p>
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {stations &&
                          stations.map((item, index) => (
                            <tr
                              key={index}
                              className={
                                helper.applyRowClass(item) === true
                                  ? `evenRowColor`
                                  : "oddRowColor"
                              }
                            >
                              <td>{item.name_en}</td>
                              <td>{item.deposited_amount}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <PaymentSections stations={stations} getData={getData} />
    </>
  );
}

export default Payment;
