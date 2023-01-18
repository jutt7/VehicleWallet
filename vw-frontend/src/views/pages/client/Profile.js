import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, useHistory } from "react-router-dom";
import avatar from "@src/assets/images/avatars/user200.png";
import location from "@src/assets/images/icons/location-green.png";
import currentBalance from "@src/assets/images/icons/current-balance.png";
import reserveBalance from "@src/assets/images/icons/reserve-green.png";
import bankCard from "@src/assets/images/icons/bank-card.png";
import contact from "@src/assets/images/icons/contact.png";
import crNumber from "@src/assets/images/icons/cr-number.png";
import email from "@src/assets/images/icons/email.png";
import vat from "@src/assets/images/icons/vat.png";
import user from "@src/assets/images/icons/user.png";
import FuelSummary from "./fuelSummary";
import DeleteModal from "../../components/modal/DeleteModal";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import helper from "@src/@core/helper";
import StatsCard from "@src/views/ui-elements/cards/statistics/customerStats";
import { Button, Col, Row } from "react-bootstrap";
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

import { useTranslation } from "react-i18next";
import { getUserData } from "@utils";
// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors";
import { ClipLoader } from "react-spinners";

import "@styles/react/libs/charts/apex-charts.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";

export default function Profile(props) {
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteMessage, setdeleteMessage] = useState("");
  const [overlay, setoverlay] = useState(false);
  const [deleteItem, setdeleteItem] = useState("");
  const [sorting_icon, setsorting_icon] = useState();

  const [clientData, setClientData] = useState("");
  const [data, setdata] = useState([]);
  const history = useHistory();
  const { t } = useTranslation();

  const [isRtl] = useRTL();

  // ** Theme Colors
  const { colors } = useContext(ThemeColors);

  const onOpenDeleteModal = (rowData) => {
    setdeleteItem(rowData);
    setdeleteMessage(rowData.status === 1 ? "Deactivate" : "activate");
    setshowDeleteModal(true);
  };

  // console.log("client props:", props);

  const onCloseDeleteModal = () => {
    setdeleteItem("");
    setshowDeleteModal(false);
  };

  const sortAscending = (icon, sortType, colsort) => {
    if (colsort == "order_number") {
      setsorting_icon(icon);
      setData(
        helper.applyCountID(
          data.sort((a, b) =>
            a[colsort] > b[colsort] && sortType === "asc" ? 1 : -1
          )
        )
      );
    } else if (colsort == "name") {
      setsorting_icon(icon);
      setData(
        helper.applyCountID(
          data.sort((a, b) =>
            a.customer.name.toLowerCase() > b.customer.name.toLowerCase() &&
            sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    } else if (colsort == "status") {
      setsorting_icon(icon);
      setData(
        helper.applyCountID(
          data.sort((a, b) =>
            helper
              .stringToJson(a.order_status.order_status_title)
              .en.toLowerCase() >
              helper
                .stringToJson(b.order_status.order_status_title)
                .en.toLowerCase() && sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    } else {
      setsorting_icon(icon);
      setData(
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

  const remove = () => {
    console.log(deleteItem, "deleteItem");
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client/delete`, {
        client: {
          clientId: deleteItem.client_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code == 200) {
          console.log(res, "edtfrtgy");
          setshowDeleteModal(false);
          setoverlay(false);
          props.getData();
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
        } else {
          console.log(res, "else ");
          setoverlay(false);
          setshowDeleteModal(false);
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setoverlay(false);
        setshowDeleteModal(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
      });
  };

  const getClientUsers = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client-users`, {
        client: {
          clientId: helper.getIDfromUrl(window.location.href)
            ? helper.getIDfromUrl(window.location.href)
            : getUserData().client_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
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

  useEffect(() => {
    getClientUsers();
  }, []);
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
        loading={overlay ? true : false}
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
              <div className="col-sm-6 col-md-5">
                <img
                  src={avatar}
                  style={{
                    width: "191px",
                    borderRadius: "5px",
                  }}
                  className="img-rounded img-responsive"
                />
              </div>
              <div className="col-sm-6 col-md-7">
                <h6
                  style={{
                    marginTop: "20px",
                    width: "95%",
                    marginBottom: "10px",
                  }}
                >
                  {helper.isObject(props.data) ? props.data.name_en : "----"}
                </h6>
                <p>
                  <img src={location} /> {t("Location")}:{" "}
                  {helper.isObject(props.data) ? props.data.address : "---"}
                </p>
                <p>
                  <img src={currentBalance} /> {t("Main Balance")}:{" "}
                  {helper.isObject(props.data) && props.data.main_balance
                    ? props.data.main_balance
                    : "0.00"}{" "}
                  {t("SAR")}
                </p>
                <p>
                  <img src={currentBalance} /> {t("Current Balance")}:{" "}
                  {helper.isObject(props.data) && props.data.current_balance
                    ? props.data.current_balance
                    : "0.00"}{" "}
                  {t("SAR")}
                </p>
                <p>
                  <img src={reserveBalance} /> {t("Reserved Amount")}:{" "}
                  {helper.isObject(props.data) && props.data.reserved_amount
                    ? props.data.reserved_amount
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
                      // defaultChecked={props.data.status == 1 ? true : false}
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
                <Button
                  outline
                  color="primary"
                  block
                  onClick={() => {
                    if (window.location.href.indexOf("/admin/") > -1) {
                      history.push("/vrp/admin/top-ups", {
                        id: helper.getIDfromUrl(window.location.href),
                      });
                    } else {
                      history.push("/vrp/client/top-ups");
                    }
                  }}
                  style={{
                    width: "150px",
                    float: "right",
                    marginRight: "15px",
                  }}
                >
                  View Top up
                </Button>
                {window.location.href.indexOf("/admin/") > -1 ? (
                  <>
                    <Button
                      outline
                      color="primary"
                      block
                      onClick={() =>
                        history.push("/vrp/admin/amount-topup", {
                          id: helper.getIDfromUrl(window.location.href),
                        })
                      }
                      style={{
                        width: "100px",
                        float: "right",
                        marginRight: "15px",
                      }}
                    >
                      Top Up
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-6">
          <Row className="match-height">
            <Col>
              <StatsCard cols={{ xl: "6", sm: "6", stats: props.stats }} />
            </Col>
          </Row>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12">
          <Card className="card-statistics">
            <CardHeader>
              <CardTitle tag="h4">{t("Client Detail")}</CardTitle>
            </CardHeader>
            <CardBody className="client-statistics-body">
              {/* <Row style={{ padding: "10px" }}>
                <Col>
                  <p>Admin Contact Person</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={user} />
                    {helper.isObject(props.data)
                      ? props.data.admin_contact_person
                      : "---"}
                  </p>
                </Col>

                <Col>
                  <p>{t("Admin Contact Number")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={contact} />
                    {data && data.length > 0 && helper.isObject(props.d)
                      ? props.data.admin_contact_number
                      : "---"}
                  </p>
                </Col>

                <Col>
                  <p>{t("Admin Contact Email")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={email} />
                    {helper.isObject(props.data)
                      ? props.data.admin_contact_email
                      : "---"}
                  </p>
                </Col>
              </Row>

              <Row style={{ padding: "10px" }}>
                <Col>
                  <p>{t("Billing Contact Person")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={user} />
                    {helper.isObject(props.data)
                      ? props.data.billing_contact_person
                      : "---"}
                  </p>
                </Col>
                <Col>
                  <p>{t("Billing Contact Number")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={contact} />
                    {helper.isObject(props.data)
                      ? props.data.billing_contact_number
                      : "---"}
                  </p>
                </Col>

                <Col>
                  <p>{t("Billing Contact Email")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={email} />
                    {helper.isObject(props.data)
                      ? props.data.billing_contact_email
                      : "---"}
                  </p>
                </Col>
              </Row>

              <Row style={{ padding: "10px" }}>
                <Col>
                  <p>{t("Operation Contact Person")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={user} />
                    {helper.isObject(props.data)
                      ? props.data.operation_contact_person
                      : "---"}
                  </p>
                </Col>

                <Col>
                  <p>{t("Operation Contact Number")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={contact} />
                    {helper.isObject(props.data)
                      ? props.data.operation_contact_number
                      : "---"}
                  </p>
                </Col>
                <Col>
                  <p>{t("Operation Contact Email")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={email} />
                    {helper.isObject(props.data)
                      ? props.data.operation_contact_email
                      : "---"}
                  </p>
                </Col>
              </Row> */}
              <Row style={{ padding: "10px" }}>
                <Col>
                  <p>{t("Vat Number")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={vat} />
                    {helper.isObject(props.data) ? props.data.vat_no : "---"}
                  </p>
                </Col>

                <Col>
                  <p>{t("Virtual Bank Account")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={bankCard} />
                    {helper.isObject(props.data)
                      ? props.data.virtual_bank_account
                      : "---"}
                  </p>
                </Col>

                <Col>
                  <p>{t("CR Number")}</p>
                  <p style={{ marginTop: "1px" }}>
                    <img style={{ marginRight: "5px" }} src={crNumber} />
                    {helper.isObject(props.data) ? props.data.cr_number : "---"}
                  </p>
                </Col>
              </Row>

              <div className="table-responsive" style={{ marginTop: "30px" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th className="table-th blackColor">
                        <p>
                          {t("Name")}
                          <span>
                            <i
                              onClick={(e) =>
                                sortAscending("Col1_asc", "asc", "order_number")
                              }
                              className={
                                sorting_icon == "Col1_asc"
                                  ? "fas fa-long-arrow-alt-up sort-color"
                                  : "fas fa-long-arrow-alt-up"
                              }
                            ></i>
                            <i
                              onClick={(e) =>
                                sortAscending("Col1_des", "des", "order_number")
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
                        <p>{t("Email")}</p>
                      </th>

                      <th className="table-th blackColor">
                        <p>{t("Mobile")}</p>
                      </th>

                      <th className="table-th blackColor">
                        <p>{t("Role")}</p>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data && data.length > 0 ? (
                      data.map((item, index) => (
                        <tr
                          key={index}
                          className={
                            helper.applyRowClass(item) === true
                              ? `evenRowColor`
                              : "oddRowColor"
                          }
                        >
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
                                      `${item.first_name} ${
                                        item.last_name ? item.last_name : ""
                                      }`,
                                      20
                                    )}
                                  </span>
                                </a>
                              </div>
                            </div>
                          </td>
                          <td>{item.email}</td>
                          <td>{item.mobile}</td>
                          <td>
                            {helper.isObject(item.group)
                              ? item.group.group_name_en
                              : ""}
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
              </div>
            </CardBody>
          </Card>
        </div>

        {/* -------- Client contract --------- */}
        {props.pricing ? (
          <div className="col-xs-12 col-sm-12 col-md-12">
            <Card className="card-statistics">
              <CardHeader>
                <CardTitle tag="h4">{t("Client Contract Prices")}</CardTitle>
              </CardHeader>
              <CardBody className="client-statistics-body">
                <Row style={{ padding: "10px" }}>
                  <Col>
                    <div
                      className="table-responsive"
                      style={{ maxHeight: "420px" }}
                    >
                      <table className="table">
                        <thead>
                          <tr>
                            <th
                              className="table-th blackColor"
                              style={{ width: "120px" }}
                            >
                              <p>{t("Vehicle Type")}</p>
                            </th>
                            <th
                              className="table-th blackColor"
                              style={{ width: "120px" }}
                            >
                              <p>{t("Registration Fee")}</p>
                            </th>
                            <th
                              className="table-th blackColor"
                              style={{ width: "120px" }}
                            >
                              <p>{t("Monthly Subscription")}</p>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {props.pricing && props.pricing.length > 0
                            ? props.pricing.map((item, index) => {
                                return (
                                  <tr
                                  // className={
                                  //   helper.applyRowClass(item, "id") === true
                                  //     ? `evenRowColor`
                                  //     : "oddRowColor"
                                  // }
                                  >
                                    <td>
                                      {helper.isObject(item.vehicle_type)
                                        ? item.vehicle_type.name_en
                                        : ""}
                                    </td>
                                    <td>
                                      {item.registration_fee != null
                                        ? parseFloat(item.registration_fee)
                                        : ""}

                                      {/* {item.registration_fee} */}
                                      {/* <input
                                      type="text"
                                      name="registration_fee"
                                      defaultValue={item.registration_fee}
                                      onChange={(e) =>
                                        onValueRegChange(
                                          e.target.value,
                                          index,
                                          item
                                        )
                                      }
                                      className="form-control"
                                      placeholder="Registration Fee"
                                    /> */}
                                    </td>
                                    <td>
                                      {item.monthly_sub_fee != null
                                        ? parseFloat(item.monthly_sub_fee)
                                        : ""}

                                      {/* {item.monthly_sub_fee != null
                                        ? item.monthly_sub_fee
                                        : ""} */}

                                      {/* <input
                                      type="text"
                                      name="monthly_subs_fee"
                                      defaultValue={
                                        item.monthly_subs_fee ||
                                        item.monthly_sub_fee
                                      }
                                      onChange={(e) =>
                                        onValueMonthChange(
                                          e.target.value,
                                          index,
                                          item
                                        )
                                      }
                                      className="form-control"
                                      placeholder="Monthly Subscription"
                                      // style={{ width: "60px" }}
                                    /> */}
                                    </td>
                                  </tr>
                                );
                              })
                            : ""}
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        ) : null}

        <div className="col-xs-12 col-sm-12 col-md-12">
          {props.data ? (
            <FuelSummary
              direction={isRtl ? "rtl" : "ltr"}
              warning={colors.warning.main}
              client_id={props.data.client_id}
            />
          ) : (
            ""
          )}
        </div>

        <DeleteModal
          show={showDeleteModal}
          confirmationText={`Are you sure to ${deleteMessage} a client`}
          confirmationHeading={`${helper.uppercaseFirst(
            deleteMessage
          )} a client`}
          onHide={onCloseDeleteModal}
          submitAction={(e) => remove()}
        />
      </div>
    </>
  );
}
