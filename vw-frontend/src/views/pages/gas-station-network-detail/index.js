import React, { useState, useContext, useEffect } from "react";
import avatar from "@src/assets/images/avatars/pertol200.png";
import location from "@src/assets/images/icons/location-green.png";
import { useTranslation } from "react-i18next";
import helper from "@src/@core/helper";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { ClipLoader } from "react-spinners";
import { getUserData } from "@utils";
import contact from "@src/assets/images/icons/contact.png";
import crNumber from "@src/assets/images/icons/cr-number.png";
import email from "@src/assets/images/icons/email.png";
import vat from "@src/assets/images/icons/vat.png";
import user from "@src/assets/images/icons/user.png";

import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Input,
  Label,
} from "reactstrap";
import { Check, X } from "react-feather";
import ZoomableImageModal from "../refueling-transactions/imagePopup";
function NetworkDetail() {
  const [data, setData] = useState([]);
  const [overlay, setoverlay] = useState(false);
  const [isOpenImgDialog, setisOpenImgDialog] = useState(false);
  const [imgDialog, setimgDialog] = useState("");

  const [payments, setPayments] = useState([]);
  const [isPdf, setIsPdf] = useState(false);

  const { t } = useTranslation();

  const hideImageDialog = () => {
    setisOpenImgDialog(false);
    setimgDialog("");
  };
  const handleShowDialog = (imgSrc, check) => {
    setIsPdf(check);
    setisOpenImgDialog(!isOpenImgDialog);
    setimgDialog(imgSrc);
  };

  const getData = () => {
    helper.getIDfromUrl(window.location.href);
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/gas-station-network`, {
        gas_station_network: {
          gas_station_network_id: getUserData().gas_station_network_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setData(res.data.gas_station_network);
          setoverlay(false);
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
  const getNetworkPayment = () => {
    helper.getIDfromUrl(window.location.href);
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/network-payment-transactions`, {
        gas_station_network: {
          gas_station_network_id: getUserData().gas_station_network_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setPayments(helper.applyCountID(res.data.data));
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
        setPayments([]);
        setoverlay(false);
      });
  };

  const get_url_extension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };
  useEffect(() => {
    getData();
    getNetworkPayment();
  }, []);
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
        loading={overlay}
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
                  <img src={location} /> Location:{" "}
                  {helper.isObject(data) ? data.address : "------"}
                </p>
                <p style={{ fontSize: "1.2em" }}>
                  Gas Station Network Deposit:{" "}
                  {helper.isObject(data) && data.vw_deposited_amount
                    ? data.vw_deposited_amount
                    : "0.00"}{" "}
                  SAR
                </p>
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
                    Gas Station Network Manager
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col>
                      <p>Manager</p>
                      <p style={{ marginTop: "1px" }}>
                        <img style={{ marginRight: "5px" }} src={user} />
                        {helper.isObject(data.users)
                          ? data.users.first_name
                          : "---"}
                      </p>

                      <p>Manager Email</p>
                      <p style={{ marginTop: "1px" }}>
                        <img style={{ marginRight: "5px" }} src={email} />
                        {helper.isObject(data.users) ? data.users.email : "---"}
                      </p>
                    </Col>
                    <Col>
                      <p>Manager Contact Numebr</p>
                      <p style={{ marginTop: "1px" }}>
                        <img style={{ marginRight: "5px" }} src={contact} />
                        {helper.isObject(data.users)
                          ? data.users.mobile
                          : "---"}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col></Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <h6 style={{ marginBottom: "20px" }}>
        Gas Station Network Payment Detail
      </h6>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th className="table-th blackColor">
                <p>{t("Title")}</p>
              </th>

              <th className="table-th blackColor">
                <p>{t("Payment Reference ID")}</p>
              </th>

              <th className="table-th blackColor">
                <p>{t("Amount")}</p>
              </th>

              <th className="table-th blackColor">
                <p>{t("Payment Image")}</p>
              </th>
              <th className="table-th blackColor">
                <p>{t("Created at")}</p>
              </th>
            </tr>
          </thead>

          <tbody>
            {payments && payments.length > 0 ? (
              payments.map((item, index) => (
                <tr
                  key={index}
                  className={
                    helper.applyRowClass(item) === true
                      ? `evenRowColor`
                      : "oddRowColor"
                  }
                >
                  <td>
                    {item.gas_station_name ? (
                      <div className="d-flex justify-content-left align-items-center">
                        <div className="avatar me-1 bg-light-success">
                          <span className="avatar-content">
                            {helper.FirstWordFirstChar(item.gas_station_name)}
                            {helper.SecondWordFirstChar(item.gas_station_name)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      "Network Payment  "
                    )}
                  </td>
                  <td>{item.reference_number ? item.reference_number : ""}</td>
                  <td>{item.amount ? item.amount : ""}</td>

                  <td>
                    {item.transaction_file != null ? (
                      get_url_extension(item.transaction_file) == "pdf" ? (
                        <a href={item.transaction_file} target="_blank">
                          <i
                            class="fa-solid fa-file-pdf fa-3x"
                            // onClick={(e) =>
                            //   handleShowDialog(item.transaction_file, true)
                            // }
                          ></i>
                        </a>
                      ) : (
                        <img
                          onClick={(e) =>
                            handleShowDialog(item.transaction_file)
                          }
                          src={item.transaction_file}
                          style={{ height: "60px", width: "100px" }}
                        />
                      )
                    ) : (
                      <img
                        src="https://www.freeiconspng.com/uploads/no-image-icon-15.png"
                        style={{ height: "50px", width: "80px" }}
                        alt="No Image available"
                      />
                    )}
                  </td>
                  <td>{helper.humanReadableDate(item.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>{t("No Records found")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ZoomableImageModal
        isOpen={isOpenImgDialog}
        onHide={() => hideImageDialog()}
        imgUrl={imgDialog}
        isPdf={isPdf}
      />
    </>
  );
}

export default NetworkDetail;
