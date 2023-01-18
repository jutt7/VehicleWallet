import React, { useState, useContext, useEffect } from "react";
import avatar from "@src/assets/images/avatars/pertol200.png";
import location from "@src/assets/images/icons/location-green.png";
import phone from "@src/assets/images/icons/phone.png";
import contact from "@src/assets/images/icons/contact.png";
import FuelSummary from "./fuelSummary";
import currentBalance from "@src/assets/images/icons/current-balance.png";

import fuel from "@src/assets/images/icons/client-station.png";
import dispenser from "@src/assets/images/icons/dispenser-type.png";
import gasNetwork from "@src/assets/images/icons/gas-network.png";
import clock from "@src/assets/images/icons/clock.png";
import yes from "@src/assets/images/icons/yes.png";
import no from "@src/assets/images/icons/no.png";

import helper from "@src/@core/helper";
import StatsCard from "@src/views/ui-elements/cards/statistics/gasStationStats";
import { Col, Row } from "react-bootstrap";
import DeleteModal from "../../components/modal/DeleteModal";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Input,
  Label,
} from "reactstrap";
import { Check, X } from "react-feather";

import { useRTL } from "@hooks/useRTL";

// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors";
import { ClipLoader } from "react-spinners";

import { useTranslation } from "react-i18next";
import { data } from "jquery";

export default function Profile(props) {
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteMessage, setdeleteMessage] = useState("");
  const [overlay, setoverlay] = useState(false);
  const [deleteItem, setdeleteItem] = useState("");
  const [devices, setDevices] = useState([]);

  const { t } = useTranslation();

  const [isRtl] = useRTL();

  console.log(props.data, "props data on gas station profile");

  // ** Theme Colors
  const { colors } = useContext(ThemeColors);

  const onOpenDeleteModal = (rowData) => {
    setdeleteItem(rowData);
    setdeleteMessage(rowData.status === 1 ? "Deactivate" : "activate");
    setshowDeleteModal(true);
  };

  const onCloseDeleteModal = () => {
    setdeleteItem("");
    setshowDeleteModal(false);
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
        if (res.data.code && res.data.code == 200) {
          setshowDeleteModal(false);
          setoverlay(false);
          // props.getData();
          props.toggleSwitch();
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

  useEffect(() => {
    setDevices(props.data ? props.data.hand_held_device : "");
    console.log("propssss");
  }, [props.data]);
  useEffect(() => {
    console.log("devcies", devices);
  }, [devices]);

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
        loading={overlay ? true : false}
      />
      <div className="row" style={{ marginBottom: "15px" }}>
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
                          width: "100%",

                          borderRadius: "5px",
                        }}
                        className="img-rounded img-responsive"
                      />
                    </div>
                    <div className="col-sm-6 col-md-7">
                      <h6
                        style={{
                          marginTop: "5px",
                          width: "95%",
                          marginBottom: "10px",
                          flex: "inline",
                        }}
                      >
                        {helper.isObject(props.data)
                          ? props.data.name_en
                          : "----"}
                        <label
                          style={{
                            fontWeight: "400",
                            fontSize: "10px",
                            borderWidth: "1px",
                            borderColor: "green",
                            borderStyle: "dotted",
                            marginLeft: "10px",
                            alignSelf: "flex-end",
                            paddingLeft: "5px",
                            paddingRight: "5px",
                          }}
                        >
                          {helper.isObject(props.data) &&
                          props.data.account_number != "" &&
                          props.data.account_number != null
                            ? "Franchisee"
                            : "Branch"}
                        </label>
                      </h6>

                      <p>
                        <img src={location} style={{ marginRight: "5px" }} />{" "}
                        {t("Location")}:{" "}
                        {helper.isObject(props.data)
                          ? props.data.address
                          : "---"}
                      </p>

                      <p>
                        <img src={gasNetwork} style={{ marginRight: "5px" }} />
                        {t("Gas Station Network")}:{" "}
                        {helper.isObject(props.data) &&
                        helper.isObject(props.data.gas_station_network) &&
                        props.data.gas_station_network.name_en
                          ? props.data.gas_station_network.name_en
                          : "---"}
                      </p>

                      <p>
                        <img src={contact} style={{ marginRight: "5px" }} />{" "}
                        {t("Contact Number")}:{" "}
                        {helper.isObject(props.data)
                          ? props.data.contact_no
                          : "---"}
                      </p>
                      <p>
                        <img src={currentBalance} /> {t("Deposited Amount")}:{" "}
                        {helper.isObject(props.data) &&
                        props.data.deposited_amount
                          ? props.data.deposited_amount
                          : "0.00"}{" "}
                        {t("SAR")}
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
                  className="well well-sm"
                  style={{
                    background: "#fff",
                    boxShadow: "0 4px 24px 0 rgb(34 41 47 / 10%)",
                    borderRadius: "5px",
                    height: "176px",
                    padding: "15px",
                  }}
                >
                  <h6>Handheld Devices</h6>
                  <div style={{ marginLeft: "10px", marginTop: "5px" }}>
                    {devices && devices.length > 0
                      ? devices.map((i) => {
                          return (
                            <p>
                              <img src={phone} style={{ marginRight: "5px" }} />
                              {i.operating_system +
                                "-" +
                                i.serial_no +
                                "-" +
                                i.app_installed_vw_version}
                            </p>
                          );
                        })
                      : ""}
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
                        cols={{ xl: "6", sm: "6", stats: props.stats }}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="col-xs-12 col-sm-12 col-md-12">
          <Card className="card-statistics">
            <CardHeader>
              <CardTitle tag="h4">{t("Gas Station Detail")}</CardTitle>
            </CardHeader>
            <CardBody className="client-statistics-body">
              <Row style={{ padding: "10px" }}>
                <Col>
                  <p>91 Fuel</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={fuel} />
                    {helper.isObject(props.data) && props.data.fuel_91 === 1 ? (
                      <img src={yes} />
                    ) : (
                      <img src={no} />
                    )}
                  </p>
                </Col>

                <Col>
                  <p>95 Fuel</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={fuel} />
                    {helper.isObject(props.data) && props.data.fuel_95 === 1 ? (
                      <img src={yes} />
                    ) : (
                      <img src={no} />
                    )}
                  </p>
                </Col>

                <Col>
                  <p>Diesel</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={fuel} />
                    {helper.isObject(props.data) && props.data.diesel === 1 ? (
                      <img src={yes} />
                    ) : (
                      <img src={no} />
                    )}
                  </p>
                </Col>

                <Col>
                  <p>{t("Dispenser Type")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={dispenser} />
                    {helper.isObject(props.data)
                      ? props.data.dispenser_type
                      : "---"}
                  </p>
                </Col>
              </Row>

              <Row style={{ padding: "10px" }}>
                <Col>
                  <p>{t("Break Start Hours")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={clock} />
                    {helper.isObject(props.data)
                      ? props.data.break_start_hours
                      : "---"}
                  </p>
                </Col>

                <Col>
                  <p>{t("Break End Hours")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={clock} />
                    {helper.isObject(props.data)
                      ? props.data.break_end_hours
                      : "---"}
                  </p>
                </Col>

                <Col>
                  <p>{t("Working Hour Start")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={clock} />
                    {helper.isObject(props.data)
                      ? props.data.working_hour_start
                      : "---"}
                  </p>
                </Col>

                <Col>
                  <p>{t("Working Hour End")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={clock} />
                    {helper.isObject(props.data)
                      ? props.data.working_hour_end
                      : "---"}
                  </p>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12">
          <FuelSummary
            direction={isRtl ? "rtl" : "ltr"}
            warning={colors.warning.main}
          />
        </div>
        <DeleteModal
          show={showDeleteModal}
          confirmationText={`Are you sure to ${deleteMessage} a gas station`}
          confirmationHeading={`${helper.uppercaseFirst(
            deleteMessage
          )} a gas station`}
          onHide={onCloseDeleteModal}
          submitAction={(e) => remove()}
        />
      </div>
    </>
  );
}
