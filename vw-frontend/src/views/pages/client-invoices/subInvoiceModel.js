import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";

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
export default function SubInvoiceModel(props) {
  const [overlay, setoverlay] = useState(false);
  const { t } = useTranslation();

  const [discountType, setDiscountType] = useState({
    label: "Fixed",
    value: 1,
  });
  const [discountAmount, setDiscountAmount] = useState(0);

  const createInvoice = () => {
    console.log("discountttttttt", discountAmount);
    // return;
    if (data && data.length > 0) {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/create-commission-invoice`, {
          gas_station_network_id: props.updateModalData.gas_station_network_id,
          month: "",
          discount: discountAmount ? parseFloat(discountAmount).toFixed(2) : 0,
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
            props.onHide();
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
    } else {
      helper.toastNotification("No Transaction Found", "FAILED_MESSAGE");
      props.onHide();
    }
  };

  const setUpdateFormValues = () => {
    console.log("propssssssss", props);
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
            Subscription Invoice
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "650px", overflowY: "auto" }}>
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
              loading={props.loader}
            />
            {props.totalAmount && props.totalAmount > 0 ? (
              <>
                <table
                  class="table1"
                  style={{ width: "100%", marginLeft: "1.5px" }}
                >
                  <TopTable
                    heading={"Client Name"}
                    detail={
                      helper.isObject(props.clientData)
                        ? props.clientData.name_en
                        : ""
                    }
                  />
                  <TopTable
                    heading={"VAT No"}
                    detail={
                      helper.isObject(props.clientData)
                        ? props.clientData.vat_no
                        : ""
                    }
                  />
                  <TopTable
                    heading={"Address"}
                    detail={
                      helper.isObject(props.clientData)
                        ? props.clientData.address
                        : ""
                    }
                  />
                </table>

                <table
                  class="table1"
                  style={{ width: "100%", marginTop: "5px" }}
                >
                  <tr class="td">
                    <th class="th" style={{ width: "50%", height: "50px" }}>
                      <label style={{ fontSize: "1.3rem", marginLeft: "20px" }}>
                        Charge Reason
                      </label>
                    </th>
                    <th class="th">
                      <label style={{ fontSize: "1.3rem", marginLeft: "20px" }}>
                        Amount
                      </label>
                    </th>
                  </tr>
                  <FuelTable
                    reason={"Vehicle Subscription Fee"}
                    amount={props.subFee}
                  />

                  <FuelTable
                    reason={"Vehicle Registration Fee"}
                    amount={props.regFee}
                  />
                </table>
                <PriceTable
                  discount_available={props.discount_available}
                  data={props.totalAmount}
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
            onClick={(e) => props.createSubInvoice(discountAmount)}
            disabled={
              props.totalAmount && props.totalAmount > 0
                ? (
                    parseFloat(
                      (
                        parseFloat(props.totalAmount) -
                        parseFloat(discountAmount)
                      ).toFixed(2)
                    ) +
                    parseFloat(
                      percentage(
                        (
                          parseFloat(props.totalAmount) -
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

const FuelTable = ({ reason, amount }) => {
  return (
    <tr class="td">
      <th class="th" style={{ height: "50px" }}>
        <label style={{ fontSize: "1rem", marginLeft: "20px" }}>{reason}</label>
      </th>
      <th class="th">
        <label style={{ fontSize: "1rem", marginLeft: "20px" }}>{amount}</label>
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
  discount_available,
}) => {
  const disc = useRef(0.0);
  const [totalAmount, setTotalAmount] = useState(data);

  const [finalAmount, setFinalAmount] = useState();

  const getTotalAmount = (dis) => {
    // console.log("inside get amount");
    // console.log("discount type", discountType);
    if (discountType.value == 1) {
      setDiscountAmount(dis);
      setTotalAmount(parseFloat(data) - parseFloat(dis));
    } else {
      let numVal1 = parseFloat(data);
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
    let va = percentage(
      (parseFloat(data) - parseFloat(discountAmount)).toFixed(2),
      15
    );
    let ta = totalAmount;
    let fa = (parseFloat(va) + parseFloat(ta)).toFixed(2);
    if (!isNaN(fa)) {
      setFinalAmount(fa);
    } else {
      setFinalAmount(parseFloat(data).toFixed(2));
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
            {data}
          </label>
        </th>
      </tr>
      {discount_available && discount_available == 1 ? (
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
                {(parseFloat(data) - parseFloat(discountAmount)).toFixed(2)}
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
              (parseFloat(data) - parseFloat(discountAmount)).toFixed(2),
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
                (parseFloat(data) - parseFloat(discountAmount)).toFixed(2)
              ) +
              parseFloat(
                percentage(
                  (parseFloat(data) - parseFloat(discountAmount)).toFixed(2),
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
                  (parseFloat(data) - parseFloat(discountAmount)).toFixed(2)
                ) +
                parseFloat(
                  percentage(
                    (parseFloat(data) - parseFloat(discountAmount)).toFixed(2),
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
