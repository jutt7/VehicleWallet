import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";

import { useTranslation } from "react-i18next";

export default function UpdateModal(props) {
  const { t } = useTranslation();
  const [overlay, setoverlay] = useState(false);
  const [form, setform] = useState({
    id: "",
    fuel_type: "",
    fuel_type_id: "",
    price: "",
    extra_price: "",
    price_lower_limit: "",
    price_upper_limit: "",
  });
  const [option, setOption] = useState([]);
  const [error, seterror] = useState({
    price: "",
  });

  const onInputchange = (value, key) => {
    let formUpdate = { ...form };
    formUpdate[key] = value;
    setform(formUpdate);
  };

  const submit = () => {
    setoverlay(true);
    if (props.disableBtn) {
      return false;
    }

    let errorCount = 0;
    let error = {};

    seterror({
      price: "",
    });

    if (helper.isEmptyString(form.price)) {
      error.price = "Price is required";
      errorCount++;
      setoverlay(false);
    }
    if (form.price > form.price_upper_limit) {
      errorCount++;
      setoverlay(false);
    }
    if (form.price <= form.price_lower_limit) {
      errorCount++;
      setoverlay(false);
    }
    if (
      form.extra_price != 0 &&
      form.extra_price.toString().substring(0, 1) != 0
    ) {
      errorCount++;
      setoverlay(false);
    }
    if (form.extra_price != 0 && form.extra_price.toString().charAt(1) != ".") {
      errorCount++;
      setoverlay(false);
    }
    if (form.extra_price != 0 && form.extra_price.length > 5) {
      errorCount++;
      setoverlay(false);
    }

    if (errorCount > 0) {
      seterror(error);
      setoverlay(false);
    } else {
      props.submitAction(form);
      setTimeout(() => {
        setoverlay(false);
      }, 2000);
    }
  };

  const setPrice = (data) => {
    // const op = [
    //   { label: "0.1", value: "0.1" },
    //   { label: "0.2", value: "0.2" },
    //   { label: "0.3", value: "0.3" },
    //   { label: "0.4", value: "0.4" },
    //   { label: "0.5", value: "0.5" },
    //   { label: "0.6", value: "0.6" },
    // ];
    let price = data.base_price;
    let arry = [];
    for (let i = -60; i <= -1; i++) {
      // price = price - 0.01;
      // if (price > 0) {
      arry.push({
        value: i,
        label: i,
      });
      // }
    }
    // price = data.base_price;
    arry.push({
      value: 0,
      label: 0,
    });
    for (let i = 1; i <= 60; i++) {
      if (price > 0) {
        arry.push({
          value: i,
          label: i,
        });
      }
    }
    arry.sort((a, b) => (a.label > b.label ? 1 : -1));
    // for (let i = 0; i < op.length; i++) {
    //   let num = parseFloat(op[i].label) + parseFloat(data.base_price);
    //   op[i].label = num.toFixed(2);
    //   op[i].value = op[i].value;
    // }

    setOption(arry);
  };

  const setUpdateFormValues = () => {
    console.log("propsssssssssss", props);
    console.log(
      "minusssssssssss",
      parseFloat(props.updateModalData.price) -
        parseFloat(props.updateModalData.extra_price)
    );
    setPrice(props.updateModalData.fuel_type);

    setform({
      id: helper.isObject(props.updateModalData)
        ? props.updateModalData.id
        : "",
      price: helper.isObject(props.updateModalData)
        ? props.updateModalData.price
        : "",
      fuel_type:
        helper.isObject(props.updateModalData) &&
        helper.isObject(props.updateModalData.fuel_type)
          ? props.updateModalData.fuel_type.title_en
          : "",
      fuel_type_id: helper.isObject(props.updateModalData)
        ? props.updateModalData.fuel_type_id
        : "",
      price: helper.isObject(props.updateModalData)
        ? (
            parseFloat(props.updateModalData.price) -
            parseFloat(props.updateModalData.extra_price)
          ).toFixed(2)
        : "",
      // extra_price: helper.isObject(props.updateModalData)
      //   ? {
      //       label: props.updateModalData.extra_price,
      //       value: props.updateModalData.extra_price,
      //     }
      //   : [],
      extra_price: helper.isObject(props.updateModalData)
        ? props.updateModalData.extra_price
        : "",
      price_lower_limit:
        helper.isObject(props.updateModalData) &&
        helper.isObject(props.updateModalData.fuel_type)
          ? props.updateModalData.fuel_type.price_lower_limit
          : "",
      price_upper_limit:
        helper.isObject(props.updateModalData) &&
        helper.isObject(props.updateModalData.fuel_type)
          ? props.updateModalData.fuel_type.price_upper_limit
          : "",
    });

    seterror({
      price: "",
    });
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
            {props.updateModalData
              ? t("Update Gas Station Fuel Price")
              : t("Add Fuel Price")}
            {/* {props.gasStationName ? ` - ${props.gasStationName}` : ""} */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "150px", overflowY: "auto" }}>
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

            <div className="form-group marginBottom-5px">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th
                        className="table-th blackColor"
                        style={{ width: "120px" }}
                      >
                        <p>{t("Fuel Type")}</p>
                      </th>

                      <th className="table-th blackColor">
                        <p>{t("Fuel Price")}</p>
                      </th>
                      <th className="table-th blackColor">
                        <p>{t("Remote Location Allowance")}</p>
                      </th>
                      <th className="table-th blackColor">
                        <p>Total Price</p>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {props && helper.isObject(props.updateModalData) ? (
                      <tr>
                        <td>
                          <label>
                            {helper.isObject(props.updateModalData.fuel_type)
                              ? props.updateModalData.fuel_type.title_en
                              : ""}{" "}
                          </label>
                        </td>

                        <td>
                          {/* <label>
                            {helper.isObject(props.updateModalData.fuel_type)
                              ? props.updateModalData.fuel_type.base_price
                              : ""}
                          </label> */}
                          <input
                            type="text"
                            name="fuel_price"
                            value={form.price}
                            // value={item.base_price}
                            onChange={(e) => {
                              if (e) {
                                onInputchange(
                                  helper.cleanDecimal(e.target.value),
                                  "price"
                                );
                              } else {
                                onInputchange("", "price");
                              }
                              // onChange(e.value);
                            }}
                            className="form-control"
                            placeholder={t("Price")}
                            style={{ maxWidth: "180px" }}
                          />
                          <p style={{ color: "red" }}>
                            {form.price == ""
                              ? "Please enter price"
                              : form.price > form.price_upper_limit
                              ? "Price cannot be greater than upper price limit"
                              : form.price <= form.price_lower_limit
                              ? "Price cannot be lesser than lower price limit"
                              : ""}
                          </p>
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.001"
                            name="fuel_price"
                            value={form.extra_price}
                            onChange={(e) => {
                              onInputchange(
                                helper.cleanDecimal(e.target.value),
                                "extra_price"
                              );
                            }}
                            className="form-control"
                            placeholder={t("0.001")}
                            style={{ maxWidth: "180px" }}
                          />
                          <p style={{ color: "red" }}>
                            {form.extra_price != 0
                              ? form.extra_price.toString().substring(0, 1) != 0
                                ? "Value should start with 0"
                                : form.extra_price.toString().charAt(1) != "."
                                ? "Value should be a decimal number"
                                : form.extra_price.length > 5
                                ? "Upto 3 numbersare allowed after point"
                                : ""
                              : ""}
                          </p>

                          {/* <Select
                            name="fuel_prices"
                            onChange={(e) => {
                              if (e) {
                                onInputchange(e, "extra_price");
                              } else {
                                onInputchange([], "extra_price");
                              }
                            }}
                            options={option}
                            value={form.extra_price}
                            isClearable={true}
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                              }),
                            }}
                          /> */}
                        </td>
                        <td>
                          {isNaN(
                            (
                              parseFloat(form.price) +
                              parseFloat(form.extra_price)
                            ).toFixed(2)
                          )
                            ? form.price
                            : (
                                parseFloat(form.price) +
                                parseFloat(form.extra_price)
                              ).toFixed(2)}
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
              </div>
              {/* <Row>
                <Col>
                  <label>
                    {form.fuel_type} <span style={{ color: "red" }}>*</span>
                  </label>
                </Col>

                <Col>
                  <Select
                    name="fuel_prices"
                    onChange={(e) => {
                      if (e) {
                        onInputchange(e, "price");
                      }
                      // onChange(e.value);
                    }}
                    options={option}
                    value={form.price}
                    isClearable={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </Col>
              </Row> */}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => submit()}>
            <i className="fas fa-check"></i>{" "}
            {helper.isObject(props.updateModalData) ? t("Update") : t("Submit")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
