import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";

import { useTranslation } from "react-i18next";
import "./mytable.css";
export default function InvoiceModel(props) {
  const { t } = useTranslation();

  const [discountType, setDiscountType] = useState({
    label: "Fixed",
    value: 1,
  });
  const [discountAmount, setDiscountAmount] = useState(0);

  const [overlay, setoverlay] = useState(false);

  const setUpdateFormValues = () => {
    console.log("propssssssssss", props);
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
          <Modal.Title className="text-center">Refueling Invoice</Modal.Title>
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
            {helper.isObject(props.modalData) &&
            helper.isObject(props.modalData.gas_station_network) ? (
              <>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <table class="table1" style={{ width: "100%" }}>
                    <TopTable
                      heading={"Supplier Name"}
                      detail={props.modalData.gas_station_network.name_en}
                    />
                    <TopTable
                      heading={"VAT No"}
                      detail={props.modalData.gas_station_network.vat_no}
                    />
                    <TopTable
                      heading={"Address"}
                      detail={props.modalData.gas_station_network.address}
                    />
                  </table>
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
                </div>
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
                  {props.modalData.all_fuel_type_amounts &&
                  props.modalData.all_fuel_type_amounts.length > 0
                    ? props.modalData.all_fuel_type_amounts.map((item) => {
                        return <FuelTable data={item} />;
                      })
                    : ""}
                </table>

                <PriceTable
                  data={props.modalData}
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
            onClick={(e) =>
              props.createInvoice(props.modalData, "ind", discountAmount)
            }
            disabled={
              (
                parseFloat(
                  (
                    parseFloat(props.modalData.amount_after_vat) -
                    parseFloat(discountAmount)
                  ).toFixed(2)
                ) +
                parseFloat(
                  percentage(
                    (
                      parseFloat(props.modalData.amount_after_vat) -
                      parseFloat(discountAmount)
                    ).toFixed(2),
                    15
                  )
                )
              ).toFixed(2) <= 0
                ? true
                : false
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
    console.log("inside get amount");
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
