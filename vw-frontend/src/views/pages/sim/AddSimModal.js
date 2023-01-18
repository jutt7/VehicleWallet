import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";

import { useTranslation } from "react-i18next";

export default function AddSimModal(props) {
  const { t } = useTranslation();
  const [overlay, setoverlay] = useState(false);
  const [form, setform] = useState({
    sim_puk_number: "",
    sim_serial_number: "",
    sim_number: "",
    service_provider: "",
    data_limit: "",
    price: "",
    status: "",
    last_used: "",
    expiry_date: "",
    id: "",
  });
  const [data, setData] = useState({});
  const [exist, setExist] = useState(false);

  const [error, seterror] = useState({
    sim_puk_number: "",
    sim_serial_number: "",
    sim_number: "",
    service_provider: "",
    data_limit: "",
    price: "",
    status: "",
    last_used: "",
    expiry_date: "",
  });

  const onInputchange = (value, key) => {
    // console.log(form, "form");
    // console.log(value);
    let formUpdate = { ...form };
    formUpdate[key] = value;
    // console.log(formUpdate, "formUpdate");
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
      sim_puk_number: "",
      sim_serial_number: "",
      sim_number: "",
      service_provider: "",
      data_limit: "",
      price: "",
      status: "",
      last_used: "",
      expiry_date: "",
    });

    if (helper.isEmptyString(form.service_provider)) {
      error.service_provider = "Service Provider is required";
      errorCount++;
      setoverlay(false);
    }

    if (!helper.isObject(form.data_limit)) {
      error.data_limit = "Data Limit is required";
      errorCount++;
      setoverlay(false);
    }

    if (!helper.isObject(form.price)) {
      error.price = "Price is required";
      errorCount++;
      setoverlay(false);
    }
    if (!helper.isObject(form.expiry_date)) {
      error.expiry_date = "Expiry Date is required";
      errorCount++;
      setoverlay(false);
    }

    if (!helper.isObject(form.sim_serial_number)) {
      error.sim_serial_number = "Sim serial number is required";
      errorCount++;
      setoverlay(false);
    }
    if (!helper.isObject(form.sim_number)) {
      error.sim_number = "Sim number is required";
      errorCount++;
      setoverlay(false);
    }
    if (!helper.isObject(form.sim_puk_number)) {
      error.sim_puk_number = "Sim PUK Number is required";
      errorCount++;
      setoverlay(false);
    }

    if (errorCount > 0) {
      seterror(error);
      setoverlay(false);
    } else {
      props.submitAction(form);
    }
  };

  const getExpiry = (date) => {
    let d = date.split(" ")[0];
    let t = date.split(" ")[1];
    let dt = d + "T" + t;
    return dt;
  };

  const setUpdateFormValues = () => {
    setform({
      sim_number: helper.isObject(props.updateModalData)
        ? props.updateModalData.sim_number
        : "",
      sim_puk_number: helper.isObject(props.updateModalData)
        ? props.updateModalData.sim_puk_number
        : "",
      sim_serial_number: helper.isObject(props.updateModalData)
        ? props.updateModalData.sim_serial_number
        : "",
      service_provider: helper.isObject(props.updateModalData)
        ? props.updateModalData.service_provider
        : "",
      data_limit: helper.isObject(props.updateModalData)
        ? props.updateModalData.data_limit
        : "",
      price: helper.isObject(props.updateModalData)
        ? props.updateModalData.price
        : "",
      status: helper.isObject(props.updateModalData)
        ? props.updateModalData.status
        : "",
      last_used: helper.isObject(props.updateModalData)
        ? props.updateModalData.last_used
        : "",
      expiry_date: helper.isObject(props.updateModalData)
        ? getExpiry(props.updateModalData.expiry_date)
        : "",
      id: helper.isObject(props.updateModalData)
        ? props.updateModalData.id
        : "",
    });

    seterror({
      sim_puk_number: "",
      sim_serial_number: "",
      sim_number: "",
      service_provider: "",
      data_limit: "",
      price: "",
      status: "",
      last_used: "",
      expiry_date: "",
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
          <Modal.Title className="text-center">Sim Information</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "250px", overflowY: "auto" }}>
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
            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    {t("Sim serial number")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="sim_serial_number"
                    value={form.sim_serial_number || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "sim_serial_number")
                    }
                    className="form-control"
                    placeholder="sim_serial_number System"
                  />
                  <p style={{ color: "red" }}>
                    {error.sim_serial_number ? error.sim_serial_number : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    {t("Sim Number")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="sim_number"
                    value={form.sim_number || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "sim_number")
                    }
                    className="form-control"
                    placeholder="Sim Number"
                  />
                  <p style={{ color: "red" }}>
                    {error.sim_number ? error.sim_number : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    {t("Sim PUK number ")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="sim_puk_number"
                    value={form.sim_puk_number || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "sim_puk_number")
                    }
                    className="form-control"
                    placeholder="Sim PUK number "
                  />
                  <p style={{ color: "red" }}>
                    {error.sim_puk_number ? error.sim_puk_number : ""}
                  </p>
                </Col>
              </Row>
            </div>
            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    {t("Service Provider")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="service_provider"
                    value={form.service_provider || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "service_provider")
                    }
                    className="form-control"
                    placeholder="Service Provider"
                  />
                  <p style={{ color: "red" }}>
                    {error.service_provider ? error.service_provider : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    {t("Data Limit")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="data_limit"
                    value={form.data_limit || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "data_limit")
                    }
                    className="form-control"
                    placeholder="Data Limit"
                  />
                  <p style={{ color: "red" }}>
                    {error.data_limit ? error.data_limit : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    {t("Price")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={form.price || ""}
                    onChange={(e) => onInputchange(e.target.value, "price")}
                    className="form-control"
                    placeholder="Price"
                  />
                  <p style={{ color: "red" }}>
                    {error.price ? error.price : ""}
                  </p>
                </Col>
              </Row>
            </div>
            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    {t("Last Used")}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="model"
                    value={form.last_used || ""}
                    onChange={(e) => onInputchange(e.target.value, "last_used")}
                    className="form-control"
                    placeholder={t("Last Used")}
                  />
                  <p style={{ color: "red" }}>
                    {error.last_used ? error.last_used : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    {t("Expiry Date")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="manufacturer"
                    value={form.expiry_date || ""}
                    onChange={(e) => {
                      onInputchange(e.target.value, "expiry_date");
                    }}
                    className="form-control"
                    placeholder={t("Expiry Date")}
                  />
                  <p style={{ color: "red" }}>
                    {error.expiry_date ? error.expiry_date : ""}
                  </p>
                </Col>
                <Col>
                  {/* <label>
                    {t("Status")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={form.status || ""}
                    onChange={(e) => onInputchange(e.target.value, "status")}
                    className="form-control"
                    placeholder="Status"
                  />
                  <p style={{ color: "red" }}>
                    {error.status ? error.status : ""}
                  </p> */}
                </Col>
              </Row>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={(e) => {
              submit();
            }}
          >
            <i className="fas fa-check"></i>{" "}
            {props.updateModalData ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
