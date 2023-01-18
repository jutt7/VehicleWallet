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

function GasStationNetworkInvoices(props) {
  const { t } = useTranslation();
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [listCreate, setListCreate] = useState([]);
  const [check, setCheck] = useState(false);
  const [monthData, setMonthData] = useState([]);
  const [month, setMonth] = useState();

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
  const getNetworkData = () => {
    setoverlay(true);
    axios
      .get(
        `${
          jwtDefaultConfig.adminBaseUrl
        }/stations?page=${1}&pagination=true&gas_station_network_id=${helper.IDfromUrl(
          window.locatihelper.geton.href
        )}`,
        {}
      )
      .then((res) => {
        // helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
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

        setoverlay(false);
      });
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
            {t("Invoices")}
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
          </Row>
        </CardBody>
      </Card>
    </div>
  );
}

export default GasStationNetworkInvoices;
