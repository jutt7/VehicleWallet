import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import UploadVat from "./uploadVat";
import UploadCr from "./uploadCr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { ClipLoader } from "react-spinners";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { getData } from "../../apps/user/store";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import "../client-invoices/mytable.css";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Input,
  Label,
} from "reactstrap";
export default function InvoiceModal(props) {
  const [overlay, setoverlay] = useState(false);
  const { t } = useTranslation();
  const [month, setMonth] = useState();
  const [data, setdata] = useState([]);
  const [monthData, setMonthData] = useState([]);

  const [discountType, setDiscountType] = useState({
    label: "Fixed",
    value: 1,
  });
  const [discountAmount, setDiscountAmount] = useState(0);

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
  const getData = () => {
    if (helper.isObject(month)) {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/commission-invoices`, {
          gas_station_network_id: props.updateModalData.gas_station_network_id,
          month: month ? month.value : "",
        })
        .then((res) => {
          helper.redirectToLogin(
            helper.isObject(res.data) ? res.data.code : 200
          );
          if (res.status && res.status === 200) {
            // console.log(helper.applyCountID(res.data.data.data), "data");
            if (res.data.data && res.data.data.length > 0) {
              setdata(res.data.data);
            } else {
              helper.toastNotification(
                "No Transaction Available",
                "FAILED_MESSAGE"
              );
              // props.onHide();
            }
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
    }
  };
  const createInvoice = () => {
    console.log("discountttttttt", discountAmount);
    // return;
    if (data && data.length > 0) {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/create-commission-invoice`, {
          gas_station_network_id: props.updateModalData.gas_station_network_id,
          month: month ? month.value : "",
          discount: discountAmount ? parseFloat(discountAmount).toFixed(2) : 0,
        })
        .then((res) => {
          helper.redirectToLogin(
            helper.isObject(res.data) ? res.data.code : 200
          );
          if (res.status && res.data.code === 200) {
            setoverlay(false);
            helper.toastNotification(
              "Request has been processed successfuly.",
              "SUCCESS_MESSAGE"
            );
            props.onHide();
          } else {
            if (res.data && res.data.message_en) {
              helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
            } else {
              helper.toastNotification(
                "No Transaction Found",
                "FAILED_MESSAGE"
              );
            }
            setoverlay(false);
          }
        })
        .catch((error) => {
          console.log(error, "error");
          setoverlay(false);
        });
    } else {
      helper.toastNotification("No Transaction Found", "FAILED_MESSAGE");
      props.onHide();
    }
  };

  useEffect(() => {
    if (helper.isObject(month)) {
      getData();
    }
  }, [month]);

  const setUpdateFormValues = () => {
    setdata([]);
    getMonths();
    // getData();
  };

  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onHide}
        onShow={(e) => setUpdateFormValues()}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            Processing Fee Invoice
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "700px", overflowY: "auto" }}>
          <Row style={{ marginBottom: "10px" }}>
            <Col sm={3}>
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
            {data &&
            data.length > 0 &&
            helper.isObject(data[0]) &&
            helper.isObject(data[0].gas_station_network) ? (
              <>
                <table class="table1" style={{ width: "100%" }}>
                  <TopTable
                    heading={"Network Name"}
                    detail={data[0].gas_station_network.name_en}
                  />
                  <TopTable
                    heading={"VAT No"}
                    detail={data[0].gas_station_network.vat_no}
                  />
                  <TopTable
                    heading={"Address"}
                    detail={data[0].gas_station_network.address}
                  />
                </table>
                <table
                  class="table1"
                  style={{ width: "100%", marginTop: "5px" }}
                >
                  <tr class="td">
                    <th class="th" style={{ height: "50px" }}>
                      <label style={{ fontSize: "1.3rem", marginLeft: "20px" }}>
                        Fuel Type
                      </label>
                    </th>
                    <th class="th">
                      <label style={{ fontSize: "1.3rem", marginLeft: "20px" }}>
                        Amount
                      </label>
                    </th>
                  </tr>
                  {data[0].all_fuel_type_amounts &&
                  data[0].all_fuel_type_amounts.length > 0
                    ? data[0].all_fuel_type_amounts.map((item) => {
                        return <FuelTable data={item} />;
                      })
                    : ""}
                </table>

                <PriceTable
                  data={data[0]}
                  discountType={discountType}
                  setDiscountType={setDiscountType}
                  discountAmount={discountAmount}
                  setDiscountAmount={setDiscountAmount}
                />
              </>
            ) : (
              ""
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={(e) => createInvoice()}
            disabled={
              data && helper.isObject(data[0])
                ? (
                    parseFloat(
                      (
                        parseFloat(data[0].amount_after_vat) -
                        parseFloat(discountAmount)
                      ).toFixed(2)
                    ) +
                    parseFloat(
                      percentage(
                        (
                          parseFloat(data[0].amount_after_vat) -
                          parseFloat(discountAmount)
                        ).toFixed(2),
                        15
                      )
                    )
                  ).toFixed(2) <= 0
                  ? true
                  : false
                : ""
            }
          >
            <i className="fas fa-check"></i> Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
const TopTable = ({ heading, detail }) => {
  return (
    <tr class="td">
      <th class="th" style={{ width: "200px", height: "50px" }}>
        <label style={{ fontSize: "1.3rem", marginLeft: "20px" }}>
          {heading}
        </label>
      </th>
      <th class="th">
        <label style={{ fontSize: "1.3rem", marginLeft: "20px" }}>
          {detail}
        </label>
      </th>
    </tr>
  );
};
const FuelTable = ({ data }) => {
  return (
    <tr class="td">
      <th class="th" style={{ height: "50px" }}>
        <label style={{ fontSize: "1rem", marginLeft: "20px" }}>
          {data.type ? data.type : ""}
        </label>
      </th>
      <th class="th">
        <label style={{ fontSize: "1rem", marginLeft: "20px" }}>
          {data.type_amount ? parseFloat(data.type_amount).toFixed(2) : 0}
        </label>
      </th>
    </tr>
  );
};

const PriceTable = ({
  data,
  discountType,
  setDiscountType,
  discountAmount,
  setDiscountAmount,
}) => {
  const disc = useRef(0.0);
  const [totalAmount, setTotalAmount] = useState(data.amount_after_vat);

  const [finalAmount, setFinalAmount] = useState();

  const getTotalAmount = (dis) => {
    // console.log("inside get amount");
    // console.log("discount type", discountType);
    if (discountType.value == 1) {
      setDiscountAmount(dis);
      setTotalAmount(parseFloat(data.amount_after_vat) - parseFloat(dis));
    } else {
      let numVal1 = parseFloat(data.amount_after_vat);
      let numVal2 = parseFloat(dis) / 100;
      let totalValue = numVal1 - numVal1 * numVal2;
      setDiscountAmount(numVal1 * numVal2);
      //   console.log("totalvalueeeeeeee", totalValue);
      setTotalAmount(totalValue.toFixed(2));
    }
  };
  useEffect(() => {
    getTotalAmount(disc.current);
  }, [discountType]);
  useEffect(() => {
    let va = data.vat_amount;
    let ta = totalAmount;
    let fa = (parseFloat(va) + parseFloat(ta)).toFixed(2);
    if (!isNaN(fa)) {
      setFinalAmount(fa);
    } else {
      setFinalAmount(parseFloat(data.total_amount).toFixed(2));
    }
  }, [totalAmount]);
  return (
    <table class="table1" style={{ width: "100%", marginTop: "5px" }}>
      <tr class="td">
        <th class="th" style={{ width: "200px", height: "50px" }}>
          <label style={{ fontSize: "1.3rem", marginLeft: "20px" }}>
            Amount Before VAT:
          </label>
        </th>
        <th style={{ textAlign: "right" }} class="th">
          <label style={{ fontSize: "1.3rem", marginRight: "20px" }}>
            {data.amount_after_vat}
          </label>
        </th>
      </tr>
      {helper.isObject(data) && data.discount_available == 1 ? (
        <>
          <tr class="td">
            <th class="th" style={{ width: "200px", height: "60px" }}>
              <label style={{ fontSize: "1.3rem", marginLeft: "20px" }}>
                Discount:
              </label>
            </th>
            <th class="th">
              {/* <div
            style={{
              display: "flex",
              alignItems: "center",
              //   justifyContent: "space-evenly",
            }}
          > */}
              <Row style={{ justifyContent: "right" }}>
                <Col sm={3} style={{ marginLeft: "15px" }}>
                  <Select
                    value={discountType}
                    onChange={(e) => setDiscountType(e)}
                    name="discount"
                    options={[
                      {
                        label: "Fixed",
                        value: 1,
                      },
                      {
                        label: "Percent",
                        value: 2,
                      },
                    ]}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </Col>
                <Col sm={2}>
                  <input
                    style={{ marginLeft: "5px" }}
                    type="number"
                    name="discount"
                    min={0}
                    // value={disc.current}
                    onChange={(e) => {
                      // setDiscountAmount(helper.cleanDecimal(e.target.value));
                      if (e.target.value != "") {
                        getTotalAmount(helper.cleanDecimal(e.target.value));
                        disc.current = helper.cleanDecimal(e.target.value);
                      } else {
                        getTotalAmount(0);
                        disc.current = 0;
                      }
                    }}
                    className="form-control"
                    placeholder="0.00"
                  />
                </Col>
                <Col
                  sm={2}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "right",
                    paddingRight: "45px",
                  }}
                >
                  {!isNaN(totalAmount)
                    ? parseFloat(discountAmount).toFixed(2)
                    : 0}
                </Col>
                {/* </div>
                 */}
              </Row>
            </th>
          </tr>
          <tr class="td">
            <th class="th" style={{ height: "50px" }}>
              <label style={{ fontSize: "1.3rem", marginLeft: "20px" }}>
                Amount After Discount:
              </label>
            </th>
            <th style={{ textAlign: "right" }} class="th">
              <label style={{ fontSize: "1.3rem", marginRight: "20px" }}>
                {(
                  parseFloat(data.amount_after_vat) - parseFloat(discountAmount)
                ).toFixed(2)}
              </label>
            </th>
          </tr>
        </>
      ) : (
        ""
      )}
      <tr class="td">
        <th class="th" style={{ height: "50px" }}>
          <label style={{ fontSize: "1.3rem", marginLeft: "20px" }}>
            VAT Amount:
          </label>
        </th>
        <th style={{ textAlign: "right" }} class="th">
          <label style={{ fontSize: "1.3rem", marginRight: "20px" }}>
            {/* {data.vat_amount} */}
            {percentage(
              (
                parseFloat(data.amount_after_vat) - parseFloat(discountAmount)
              ).toFixed(2),
              15
            )}
          </label>
        </th>
      </tr>

      <tr class="td">
        <th class="th" style={{ width: "200px", height: "50px" }}>
          <label style={{ fontSize: "1.3rem", marginLeft: "20px" }}>
            Total Amount:
          </label>
        </th>
        <th style={{ textAlign: "right" }} class="th">
          <div
            style={{
              display: "flex",
              alignItems: " ",
              justifyContent: "right",
            }}
          >
            {(
              parseFloat(
                (
                  parseFloat(data.amount_after_vat) - parseFloat(discountAmount)
                ).toFixed(2)
              ) +
              parseFloat(
                percentage(
                  (
                    parseFloat(data.amount_after_vat) -
                    parseFloat(discountAmount)
                  ).toFixed(2),
                  15
                )
              )
            ).toFixed(2) <= 0 ? (
              <p
                style={{
                  color: "red",
                  fontSize: "13px",
                  marginRight: "20px",
                  marginTop: "8px",
                }}
              >
                Total Amount should be greater than 0
              </p>
            ) : (
              ""
            )}
            <p
              style={{
                fontSize: "1.3rem",
                marginRight: "20px",
              }}
            >
              {/* {finalAmount} */}
              {(
                parseFloat(
                  (
                    parseFloat(data.amount_after_vat) -
                    parseFloat(discountAmount)
                  ).toFixed(2)
                ) +
                parseFloat(
                  percentage(
                    (
                      parseFloat(data.amount_after_vat) -
                      parseFloat(discountAmount)
                    ).toFixed(2),
                    15
                  )
                )
              ).toFixed(2)}
            </p>
          </div>
        </th>
      </tr>
    </table>
  );
};
function percentage(num, per) {
  return ((num / 100) * per).toFixed(2);
}
