import React, { useEffect, useState } from "react";

import { Col, Row } from "react-bootstrap";
import { Nav, NavItem, NavLink, Button } from "reactstrap";

import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import helper from "@src/@core/helper";
import { ClipLoader } from "react-spinners";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { useTranslation } from "react-i18next";
import SubInvoiceModel from "./subInvoiceModel";
function SubInvoices(props) {
  const { t } = useTranslation();
  const [data, setdata] = useState([]);
  const [overlay, setoverlay] = useState(false);
  const [sorting_icon, setsorting_icon] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [subFee, setSubFee] = useState(0);
  const [regFee, setRegFee] = useState(0);
  const [showSubModel, setShowSubModel] = useState(false);
  const [discount_available, setDiscount_available] = useState();
  const [invoiceLoader, setInvoiceLoader] = useState(false);

  const sortAscending = (icon, sortType, colsort) => {
    if (
      colsort == "name_ar" ||
      colsort == "name_en" ||
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
    } else if (
      colsort == "deposited_amount" ||
      colsort == "reserved_amount" ||
      colsort == "vat_no"
    ) {
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

  const getData = () => {
    // console.log("get data");
    // return;
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client-subscription-invoices`, {
        client_id: props.clientID,
        month: props.month ? props.month.value : "",
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setdata(helper.applyCountID(res.data.data));
          props.setSubData(helper.applyCountID(res.data.data));
          let count = 0;
          let sub = 0;
          let reg = 0;
          if (res.data.data && res.data.data.length > 0) {
            if (res.data.discount_available) {
              setDiscount_available(res.data.discount_available);
            }
            res.data.data.forEach((item) => {
              if (item.amount) {
                count = count + parseFloat(item.amount);
              }
              if (item.charge_reason == "vehicle_registration") {
                reg = reg + parseFloat(item.amount);
              } else if (item.charge_reason == "vehicle_subscription_fee") {
                sub = sub + parseFloat(item.amount);
              }
            });
            setRegFee(reg);
            setSubFee(sub);
            setTotalAmount(count);
          }

          setoverlay(false);
        } else {
          setoverlay(false);
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setdata([]);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setdata([]);
        setoverlay(false);
      });
  };

  const createSubInvoice = (discount) => {
    console.log("discounttttt", discount);

    // return;
    setInvoiceLoader(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/create-subscription-invoices`, {
        client_id: props.clientID,
        month: props.month ? props.month.value : "",
        discount: discount ? parseFloat(discount) : 0,
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.data.code === 200) {
          setInvoiceLoader(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          getData();
        } else {
          helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
          setInvoiceLoader(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        helper.toastNotification("Invoice not created", "FAILED_MESSAGE");
        setInvoiceLoader(false);
      });
  };

  useEffect(() => {
    getData();
  }, [props.month]);
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
      {data && data.length > 0 ? (
        <Button
          color="primary"
          style={{ marginLeft: "15px", marginBottom: "15px" }}
          onClick={() => {
            // createSubInvoice();
            setShowSubModel(true);
          }}
        >
          Create Invoice
        </Button>
      ) : (
        ""
      )}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th className="table-th blackColor">
                <p>
                  {t("Vehicle Plate No")}
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
                <p>{t("Vehicle Fuel Type")}</p>
              </th>
              <th className="table-th blackColor">
                <p>{t("Amount")}</p>
              </th>
              <th className="table-th blackColor">
                <p>{t("VAT")}</p>
              </th>
              <th className="table-th blackColor">
                <p>{t("Charge Reason")}</p>
              </th>
            </tr>
          </thead>

          <tbody>
            {data && data.length > 0 ? (
              data &&
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
                    <div className="d-flex justify-content-left align-items-center">
                      <div className="avatar me-1 bg-light-success">
                        <span className="avatar-content">
                          {helper.FirstWordFirstChar(
                            helper.isObject(item.vehicle)
                              ? item.vehicle.plate_no
                              : ""
                          )}
                        </span>
                      </div>
                      <div className="d-flex flex-column">
                        <a className="user_name text-truncate text-body">
                          <span className="fw-bolder">
                            {helper.isObject(item.vehicle)
                              ? item.vehicle.plate_no
                              : ""}
                          </span>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td>
                    {helper.isObject(item.vehicle) &&
                    helper.isObject(item.vehicle.vehicle_fuel_type)
                      ? item.vehicle.vehicle_fuel_type.title_en
                      : ""}
                  </td>

                  <td>{item.amount ? item.amount : "0.00"}</td>
                  <td>{item.vat ? item.vat : ""}</td>

                  <td>
                    {item.charge_reason ? (
                      item.charge_reason == "vehicle_subscription_fee" ? (
                        <span class="badge" style={{ background: "#71c87e" }}>
                          Vehicle Subscription Fee
                        </span>
                      ) : item.charge_reason == "vehicle_registration" ? (
                        <span class="badge bg-light-info rounded-pill">
                          Vehicle Registration Fee
                        </span>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </td>
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
      <SubInvoiceModel
        loader={invoiceLoader}
        show={showSubModel}
        onHide={() => setShowSubModel(false)}
        totalAmount={totalAmount}
        regFee={regFee}
        subFee={subFee}
        createSubInvoice={createSubInvoice}
        clientData={helper.isObject(props.clientData) ? props.clientData : ""}
        discount_available={discount_available}
      />
    </div>
  );
}

export default SubInvoices;
