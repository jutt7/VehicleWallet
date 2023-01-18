import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import { ClipLoader } from "react-spinners";

import { useTranslation } from "react-i18next";

export default function AddUpdateModal(props) {
  const { t } = useTranslation();
  const [overlay, setoverlay] = useState(false);
  const [form, setform] = useState({
    title_en: "",
    title_ar: "",
    title_ur: "",
    base_price: "",
    vw_commision: "",
    price_upper_limit: "",
    price_lower_limit: "",
  });

  const [error, seterror] = useState({
    title_en: "",
    title_ar: "",
    title_ur: "",
    base_price: "",
    vw_commision: "",
    price_upper_limit: "",
    price_lower_limit: "",
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
      title_en: "",
      title_ar: "",
      title_ur: "",
      base_price: "",
      comision: "",
      price_upper_limit: "",
      price_lower_limit: "",
    });

    if (helper.isEmptyString(form.title_en)) {
      error.title_en = "Name english is required";
      errorCount++;
      setoverlay(false);
    }
    if (helper.isEmptyString(form.vw_commision)) {
      error.vw_commision = "Comision is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.title_ar)) {
      error.title_ar = "Name arabic is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.title_ur)) {
      error.title_ur = "Name urdu is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.base_price)) {
      error.base_price = "Base price is required";
      errorCount++;
      setoverlay(false);
    }
    if (helper.isEmptyString(form.price_upper_limit)) {
      error.price_upper_limit = "Upper price limit is required";
      errorCount++;
      setoverlay(false);
    }
    if (helper.isEmptyString(form.price_lower_limit)) {
      error.price_lower_limit = "Lower price limit is required";
      errorCount++;
      setoverlay(false);
    }

    if (errorCount > 0) {
      seterror(error);
      setoverlay(false);
    } else {
      props.submitAction(form);
      //alert()
      setTimeout(() => {
        setoverlay(false);
      }, 2000);
    }
  };

  const setUpdateFormValues = () => {
    setform({
      title_en: helper.isObject(props.updateModalData)
        ? props.updateModalData.title_en
        : "",
      title_ar: helper.isObject(props.updateModalData)
        ? props.updateModalData.title_ar
        : "",
      title_ur: helper.isObject(props.updateModalData)
        ? props.updateModalData.title_ur
        : "",
      base_price: helper.isObject(props.updateModalData)
        ? props.updateModalData.base_price
        : "",
      vw_commision: helper.isObject(props.updateModalData)
        ? props.updateModalData.vw_commision
        : "",
      price_upper_limit: helper.isObject(props.updateModalData)
        ? props.updateModalData.price_upper_limit
        : "",
      price_lower_limit: helper.isObject(props.updateModalData)
        ? props.updateModalData.price_lower_limit
        : "",
    });

    seterror({
      title_en: "",
      title_ar: "",
      title_ur: "",
      base_price: "",
      vw_commision: "",
    });
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      onShow={(e) => setUpdateFormValues()}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center">
          {props.updateModalData ? t("Update Fuel Type") : t("Add Fuel Type")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "300px", overflowY: "auto" }}>
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
            <Row>
              <Col>
                <label>
                  {t("Name English")} <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="title_en"
                  value={form.title_en}
                  onChange={(e) => onInputchange(e.target.value, "title_en")}
                  className="form-control"
                  placeholder={t("Name English")}
                />
                <p style={{ color: "red" }}>
                  {error.title_en ? error.title_en : ""}
                </p>
              </Col>

              <Col>
                <label>
                  {t("Name Arabic")} <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="title_ar"
                  value={form.title_ar}
                  onChange={(e) => onInputchange(e.target.value, "title_ar")}
                  className="form-control"
                  placeholder={t("Name Arabic")}
                />
                <p style={{ color: "red" }}>
                  {error.title_ar ? error.title_ar : ""}
                </p>
              </Col>
            </Row>
          </div>

          <div className="form-group marginBottom-5px">
            <Row>
              <Col>
                <label>
                  {t("Name Urdu")} <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="title_ur"
                  value={form.title_ur}
                  onChange={(e) => onInputchange(e.target.value, "title_ur")}
                  className="form-control"
                  placeholder={t("Name Urdu")}
                />
                <p style={{ color: "red" }}>
                  {error.title_ur ? error.title_ur : ""}
                </p>
              </Col>

              <Col>
                <label>
                  {t("Base Price")} <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="base_price"
                  value={form.base_price}
                  onChange={(e) =>
                    // onInputchange(e.target.value, "base_price")
                    onInputchange(
                      helper.cleanDecimal(e.target.value, "base_price"),
                      "base_price"
                    )
                  }
                  className="form-control"
                  placeholder={t("Base Price")}
                />
                <p style={{ color: "red" }}>
                  {error.base_price ? error.base_price : ""}
                </p>
              </Col>
            </Row>
          </div>
          <div className="form-group marginBottom-5px">
            <Row>
              <Col>
                <label>
                  {t("Vehicle Wallet Processin Fee")}{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="vw_commision"
                  value={form.vw_commision}
                  onChange={(e) =>
                    onInputchange(
                      helper.cleanDecimal(e.target.value),
                      "vw_commision"
                    )
                  }
                  className="form-control"
                  placeholder={t("Vehicle Wallet Processing Fee")}
                />
                <p style={{ color: "red" }}>
                  {error.vw_commision ? error.vw_commision : ""}
                </p>
              </Col>

              <Col>
                <label>
                  {t("Upper Fuel Price Limit")}{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="price_upper_limit"
                  value={form.price_upper_limit}
                  onChange={(e) =>
                    onInputchange(
                      helper.cleanDecimal(e.target.value),
                      "price_upper_limit"
                    )
                  }
                  className="form-control"
                  placeholder={t("Upper Fuel Price Limit")}
                />
                <p style={{ color: "red" }}>
                  {error.price_upper_limit ? error.price_upper_limit : ""}
                </p>
              </Col>
            </Row>
          </div>
          <div className="form-group marginBottom-5px">
            <Row>
              <Col>
                <label>
                  {t("Lower Fuel Price Limit")}{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="price_lower_limit"
                  value={form.price_lower_limit}
                  onChange={(e) =>
                    onInputchange(
                      helper.cleanDecimal(e.target.value),
                      "price_lower_limit"
                    )
                  }
                  className="form-control"
                  placeholder={t("Lower Fuel Price Limit")}
                />
                <p style={{ color: "red" }}>
                  {error.price_lower_limit ? error.price_lower_limit : ""}
                </p>
              </Col>

              <Col></Col>
            </Row>
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
  );
}
