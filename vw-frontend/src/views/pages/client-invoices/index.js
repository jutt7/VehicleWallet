import React, { useEffect, useState } from "react";

import { Col, Row } from "react-bootstrap";
import { Nav, NavItem, NavLink, Button } from "reactstrap";

import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import helper from "@src/@core/helper";
import { ClipLoader } from "react-spinners";

import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import Select from "react-select";

import { useTranslation } from "react-i18next";
import SubInvoices from "./subInvoices";
import InvoiceModal from "../gas-station-network/InvoiceModal";
import InvoiceModel from "./InvoiceModel";
function Invoices(props) {
  const { t } = useTranslation();
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [sorting_icon, setsorting_icon] = useState();
  const [checkList, setCheckList] = useState([]);
  const [listCreate, setListCreate] = useState([]);
  const [check, setCheck] = useState(false);
  const [monthData, setMonthData] = useState([]);
  const [month, setMonth] = useState();
  const [subData, setSubData] = useState([]);
  const [invoiceLoader, setInvoiceLoader] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [modalData, setModalData] = useState([]);

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
    console.log("get dataaaaaaa", month);
    if (helper.isObject(month)) {
      // return;
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/client-invoices`, {
          client_id: props.clientID,
          month: month ? month.value : "",
        })
        .then((res) => {
          helper.redirectToLogin(
            helper.isObject(res.data) ? res.data.code : 200
          );
          if (res.status && res.status === 200) {
            res.data.data.forEach((item) => {
              item.status = 0;
              let obj = [
                {
                  label: "fuel_91",
                  value: "",
                },
                {
                  label: "fuel_95",
                  value: "",
                },
                {
                  label: "diesel",
                  value: "",
                },
              ];
              if (
                item.all_fuel_type_amounts &&
                item.all_fuel_type_amounts.length > 0
              ) {
                for (let i = 0; i < obj.length; i++) {
                  for (let j = 0; j < item.all_fuel_type_amounts.length; j++) {
                    if (obj[i].label == item.all_fuel_type_amounts[j].type) {
                      obj[i].value = item.all_fuel_type_amounts[j].type_amount;
                    }
                  }
                }
              }
              // console.log(obj, "test");
              item.fuelPrices = obj;
            });
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
    }
  };
  const getMonths = () => {
    // console.log("get data");
    // return;
    setoverlay(true);
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/get-months`, {})
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          let arr = [];
          let year = new Date().getFullYear();
          res.data.data.forEach((item) => {
            arr.push({
              label: item.month,
              value: item.month_nu,
            });
          });
          if (res.data.data.length > 0) {
            setMonth({
              label: res.data.data[0].month,
              value: res.data.data[0].month_nu,
            });
          }
          setMonthData(arr);
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

  const createInvoice = (item, meth, discount) => {
    // console.log("arrrrr", item);
    // console.log("disoutttttttttttt", discount);

    // return;
    setInvoiceLoader(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/create-invoice`, {
        client_id: props.clientID,
        gas_station_network_id: item.gas_station_network_id,
        month: month ? month.value : "",
        discount: discount ? parseFloat(discount).toFixed(2) : 0,
        // transaction_ids: item.transaction_ids,
        // items: arr,
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.data.code === 200) {
          setInvoiceLoader(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          let a = listCreate;
          let i = a.indexOf(item.count_id);
          if (i > -1) {
            a.splice(i, 1);
          }
          setListCreate(a);

          if (meth == "ind") {
            setShowInvoiceModal(false);
            getData();
          }
        } else {
          helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
          setInvoiceLoader(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setInvoiceLoader(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
      });
  };
  const createSubInvoice = () => {
    // console.log("arrrrr", arr);

    // return;
    if (subData && subData.length > 0) {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/create-subscription-invoices`, {
          client_id: props.clientID,
          month: month ? month.value : "",
        })
        .then((res) => {
          helper.redirectToLogin(
            helper.isObject(res.data) ? res.data.code : 200
          );
          if (res.status && res.status === 200) {
            setoverlay(false);
            helper.toastNotification(
              "Request has been processed successfuly.",
              "SUCCESS_MESSAGE"
            );
            setMonth("");
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
    }
  };

  const selectAll = () => {
    let arr = checkList;
    data.forEach((item, index) => {
      if (!arr.includes(item.count_id)) {
        data.filter((element) => {
          if (element.count_id === item.count_id) {
            let newData = data;
            newData[index].status = 1;
            setdata([...newData]);
          }
        });
        arr.push(item.count_id);
      } else {
        data.filter((element) => {
          if (element.count_id === item.count_id) {
            let newData = data;
            newData[index].status = 0;
            setdata([...newData]);
          }
        });
        let i = arr.indexOf(item.count_id);
        if (i > -1) {
          arr.splice(i, 1);
        }
      }
    });
    console.log("arrrrrrr", arr);
    setCheckList(arr);
  };

  const selectOne = (id) => {
    let arr = checkList;

    if (!arr.includes(id)) {
      data.filter((element, index) => {
        if (element.count_id === id) {
          let newData = data;
          newData[index].status = 1;
          setdata([...newData]);
        }
      });
      arr.push(id);
    } else {
      data.filter((element, index) => {
        if (element.count_id === id) {
          let newData = data;
          newData[index].status = 0;
          setdata([...newData]);
        }
      });
      let i = arr.indexOf(id);
      if (i > -1) {
        arr.splice(i, 1);
      }
    }
    console.log("arrrr", arr);
  };

  const openInvoiceModel = (item) => {
    setModalData(item);
    setShowInvoiceModal(true);
  };

  useEffect(() => {
    // console.log("listttt create ", listCreate);
    if (listCreate.length == 0) {
      getData();
    }
  }, [listCreate]);

  useEffect(() => {
    // getData();
    getMonths();
  }, []);
  useEffect(() => {
    if (!check) {
      getData();
    }
  }, [month, check]);
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
            {t("Invoices")} {props.clientName}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Row style={{ marginBottom: "10px", marginTop: "10px" }}>
            <Col sm={2}>
              <Select
                name="month"
                options={monthData}
                value={month}
                // isClearable={true}
                onChange={(e) => {
                  if (e) {
                    setMonth(e);
                  } else {
                    setMonth("");
                  }
                }}
              />
            </Col>
            <Col sm={2}>
              <Button
                outline={check ? true : false}
                color="primary"
                block
                onClick={() => {
                  setCheck(false);
                }}
              >
                <label color="primary">Refueling Invoices</label>
              </Button>
            </Col>
            <Col sm={2}>
              <Button
                outline={check ? false : true}
                color="primary"
                block
                onClick={() => {
                  setCheck(true);
                }}
              >
                <label>Subscription Invoices</label>
              </Button>
            </Col>
          </Row>
          {!check && checkList.length > 0 ? (
            <Button
              color="primary"
              style={{ marginLeft: "15px", marginBottom: "15px" }}
              onClick={() => {
                let arr = checkList;
                console.log("checklist arrrrrrrr", arr);
                setListCreate(arr);
                data.forEach((item) => {
                  for (let i = 0; i < checkList.length; i++) {
                    if (item.count_id == checkList[i]) {
                      createInvoice(item, "mul");
                    }
                  }
                });
              }}
            >
              Create Selected Invoices
            </Button>
          ) : (
            ""
          )}

          {check ? "" : ""}

          {!check ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th
                      style={{ display: "flex", alignItems: "center" }}
                      className="table-th blackColor"
                    >
                      <input
                        checked={
                          checkList.length > 0 &&
                          checkList.length == data.length
                            ? true
                            : false
                        }
                        type="checkbox"
                        onChange={() => {
                          selectAll();
                        }}
                      />
                      <label style={{ marginLeft: "5px" }}>Select All</label>
                    </th>
                    <th className="table-th blackColor">
                      <p>
                        {t("Supplier Name")}
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
                      <p>{t("VAT No")}</p>
                    </th>
                    <th className="table-th blackColor">
                      <p>{t("fuel_91")}</p>
                    </th>
                    <th className="table-th blackColor">
                      <p>{t("fuel_95")}</p>
                    </th>
                    <th className="table-th blackColor">
                      <p>{t("diesel")}</p>
                    </th>
                    <th className="table-th blackColor">
                      <p>{t("Amount Before VAT")}</p>
                    </th>
                    <th className="table-th blackColor">
                      <p>{t("VAT Amount")}</p>
                    </th>

                    <th className="table-th blackColor">
                      <p>{t("Total Amount")}</p>
                    </th>

                    <th className="table-th blackColor">
                      <p>{t("Action")}</p>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.length > 0 ? (
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
                          <input
                            type="checkbox"
                            checked={item.status == 1 ? true : false}
                            onChange={() => {
                              selectOne(item.count_id);
                            }}
                          />
                        </td>
                        <td>
                          <div className="d-flex justify-content-left align-items-center">
                            <div className="avatar me-1 bg-light-success">
                              <span className="avatar-content">
                                {helper.FirstWordFirstChar(
                                  helper.isObject(item.gas_station_network)
                                    ? item.gas_station_network.name_en
                                    : ""
                                )}
                                {/* {helper.FirstWordFirstChar(
                                  helper.isObject(item.gas_station_network)
                                    ? item.gas_station_network.name_en
                                    : ""
                                )} */}
                              </span>
                            </div>
                            <div className="d-flex flex-column">
                              <a className="user_name text-truncate text-body">
                                <span className="fw-bolder">
                                  {helper.isObject(item.gas_station_network)
                                    ? item.gas_station_network.name_en
                                    : ""}
                                </span>
                              </a>
                            </div>
                          </div>
                        </td>
                        <td>
                          {helper.isObject(item.gas_station_network)
                            ? item.gas_station_network.vat_no
                            : ""}
                        </td>
                        {item.fuelPrices
                          ? item.fuelPrices.map((element) => {
                              return (
                                <td>
                                  {element.value
                                    ? element.value.toFixed(2)
                                    : "0"}
                                </td>
                              );
                            })
                          : ""}
                        <td>
                          {item.amount_after_vat ? item.amount_after_vat : ""}
                        </td>
                        <td>{item.vat_amount ? item.vat_amount : "0.00"}</td>

                        <td>
                          {item.total_amount
                            ? item.total_amount.toFixed(2)
                            : ""}
                        </td>

                        <td>
                          <Button
                            color="primary"
                            onClick={() => {
                              // createInvoice(item, "ind");
                              openInvoiceModel(item);
                            }}
                          >
                            Create Invoice
                          </Button>
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
          ) : (
            <SubInvoices
              clientID={props.clientID}
              month={month}
              setSubData={setSubData}
              clientData={
                helper.isObject(props.clientData) ? props.clientData : ""
              }
            />
          )}
        </CardBody>
      </Card>
      <InvoiceModel
        loader={invoiceLoader}
        show={showInvoiceModal}
        onHide={() => setShowInvoiceModal(false)}
        modalData={modalData}
        createInvoice={createInvoice}
        clientData={helper.isObject(props.clientData) ? props.clientData : ""}
      />
    </div>
  );
}

export default Invoices;
