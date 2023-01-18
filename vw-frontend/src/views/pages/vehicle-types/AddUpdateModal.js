import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";

import { useTranslation } from "react-i18next";

export default function AddUpdateModal(props) {
  const { t } = useTranslation();
  const [overlay, setoverlay] = useState(false);
  const [form, setform] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    weight: "",
    registration_fee: "",
    monthly_subs_fee: "",
  });

  const [error, seterror] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    weight: "",
    registration_fee: "",
    monthly_subs_fee: "",
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
      name_en: "",
      name_ar: "",
      name_ur: "",
      weight: "",
      registration_fee: "",
      monthly_subs_fee: "",
    });

    if (helper.isEmptyString(form.name_en)) {
      error.name_en = "Name english is required";
      errorCount++;
      setoverlay(false);
    }

    if (!helper.isObject(form.name_ar)) {
      error.name_ar = "Name arabic is required";
      errorCount++;
      setoverlay(false);
    }

    if (!helper.isObject(form.name_ur)) {
      error.name_ur = "Name urdu is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.weight)) {
      error.weight = "Weight is required";
      errorCount++;
      setoverlay(false);
    }
    if (!helper.isObject(form.registration_fee)) {
      error.registration_fee = "Registration Fee is required";
      errorCount++;
      setoverlay(false);
    }
    if (!helper.isObject(form.monthly_subs_fee)) {
      error.monthly_subs_fee = "Monthly Fee is required";
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

  const setUpdateFormValues = () => {
    setform({
      name_en: helper.isObject(props.updateModalData)
        ? props.updateModalData.name_en
        : "",
      name_ar: helper.isObject(props.updateModalData)
        ? props.updateModalData.name_ar
        : "",
      name_ur: helper.isObject(props.updateModalData)
        ? props.updateModalData.name_ur
        : "",
      weight: helper.isObject(props.updateModalData)
        ? props.updateModalData.weight
        : "",
      registration_fee: helper.isObject(props.updateModalData)
        ? props.updateModalData.registration_fee
        : "",
      monthly_subs_fee: helper.isObject(props.updateModalData)
        ? props.updateModalData.monthly_subs_fee
        : "",
    });

    seterror({
      name_en: "",
      name_ar: "",
      name_ur: "",
      weight: "",
      registration_fee: "",
      monthly_subs_fee: "",
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
              ? "Update Vehicle Type"
              : t("Add Vehicle Type")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "245px", overflowY: "auto" }}>
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
                    name="name_en"
                    value={form.name_en || ""}
                    onChange={(e) => onInputchange(e.target.value, "name_en")}
                    className="form-control"
                    placeholder={t("Name English")}
                  />
                  <p style={{ color: "red" }}>
                    {error.name_en ? error.name_en : ""}
                  </p>
                </Col>

                <Col>
                  <label>
                    {t("Name Arabic")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name_ar"
                    value={form.name_ar || ""}
                    onChange={(e) => onInputchange(e.target.value, "name_ar")}
                    className="form-control"
                    placeholder={t("Name Arabic")}
                  />
                  <p style={{ color: "red" }}>
                    {error.name_ar ? error.name_ar : ""}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col>
                  <label>
                    {t("Name Urdu")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name_ur"
                    value={form.name_ur || ""}
                    onChange={(e) => onInputchange(e.target.value, "name_ur")}
                    className="form-control"
                    placeholder={t("Name Urdu")}
                  />
                  <p style={{ color: "red" }}>
                    {error.name_ur ? error.name_ur : ""}
                  </p>
                </Col>

                <Col>
                  <label>
                    {"Weight"} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={form.weight || ""}
                    onChange={(e) => onInputchange(e.target.value, "weight")}
                    className="form-control"
                    placeholder={"Weight"}
                  />
                  <p style={{ color: "red" }}>
                    {error.weight ? error.weight : ""}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col>
                  <label>
                    {t("Monthly Subscription Fee")}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="monthly_sub_fee"
                    value={form.monthly_subs_fee || ""}
                    onChange={(e) =>
                      onInputchange(
                        helper.cleanInteger(e.target.value),
                        "monthly_subs_fee"
                      )
                    }
                    className="form-control"
                    placeholder={t("Monthly Subscription Fee")}
                  />
                  <p style={{ color: "red" }}>
                    {error.monthly_subs_fee ? error.monthly_subs_fee : ""}
                  </p>
                </Col>

                <Col>
                  <label>
                    {t("Registration Fee")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="reg_fee"
                    value={form.registration_fee || ""}
                    onChange={(e) =>
                      onInputchange(
                        helper.cleanInteger(e.target.value),
                        "registration_fee"
                      )
                    }
                    className="form-control"
                    placeholder={t("Registration Fee")}
                  />
                  <p style={{ color: "red" }}>
                    {error.registration_fee ? error.registration_fee : ""}
                  </p>
                </Col>
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
    </div>
  );
}
