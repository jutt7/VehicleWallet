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
    operating_system: "",
    app_installed_vw_version: "",
    serial_no: "",
    type: "",
    model: "",
    manufacturer: "",
    sim_puk_number: "",
    sim_serial_number: "",
    sim_number: "",
    info_id: [],
  });
  const [status, setStatus] = useState({
    id: "",
    device_id: "",
  });
  const [simId, setSimId] = useState([]);

  const [error, seterror] = useState({
    operating_system: "",
    app_installed_vw_version: "",
    serial_no: "",
    type: "",
    model: "",
    manufacturer: "",
    sim_puk_number: "",
    sim_serial_number: "",
    sim_number: "",
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
      operating_system: "",
      app_installed_vw_version: "",
      serial_no: "",
      type: "",
      model: "",
      manufacturer: "",
    });

    if (helper.isEmptyString(form.operating_system)) {
      error.operating_system = "Operating system is required";
      errorCount++;
      setoverlay(false);
    }

    if (!helper.isObject(form.app_installed_vw_version)) {
      error.app_installed_vw_version = "App installed version is required";
      errorCount++;
      setoverlay(false);
    }

    if (!helper.isObject(form.serial_no)) {
      error.serial_no = "Serial # is required";
      errorCount++;
      setoverlay(false);
    }
    if (!helper.isObject(form.type)) {
      error.type = "Type is required";
      errorCount++;
      setoverlay(false);
    }
    if (!helper.isObject(form.model)) {
      error.model = "Modal is required";
      errorCount++;
      setoverlay(false);
    }
    if (!helper.isObject(form.manufacturer)) {
      error.manufacturer = "Manufacturer is required";
      errorCount++;
      setoverlay(false);
    }

    if (errorCount > 0) {
      seterror(error);
      setoverlay(false);
    } else {
      props.submitAction(form);
      // props.updateSim(status);
      setTimeout(() => {
        setoverlay(false);
      }, 2000);
    }
  };

  const setUpdateFormValues = () => {
    console.log("props data", props.updateModalData);
    setform({
      operating_system: helper.isObject(props.updateModalData)
        ? props.updateModalData.operating_system
        : "",
      app_installed_vw_version: helper.isObject(props.updateModalData)
        ? props.updateModalData.app_installed_vw_version
        : "",
      serial_no: helper.isObject(props.updateModalData)
        ? props.updateModalData.serial_no
        : "",
      type: helper.isObject(props.updateModalData)
        ? props.updateModalData.type
        : "",
      model: helper.isObject(props.updateModalData)
        ? props.updateModalData.model
        : "",
      manufacturer: helper.isObject(props.updateModalData)
        ? props.updateModalData.manufacturer
        : "",
      info_id:
        helper.isObject(props.updateModalData) &&
        helper.isObject(props.updateModalData.device_info)
          ? {
              label: props.updateModalData.device_info.sim_serial_number,
              value: props.updateModalData.device_info.id,
            }
          : "",
    });

    seterror({
      operating_system: "",
      app_installed_vw_version: "",
      serial_no: "",
      type: "",
      model: "",
      manufacturer: "",
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
              ? t("Update Handheld Device")
              : t("Add Handheld Device")}
          </Modal.Title>
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
              loading={overlay ? true : false}
            />
            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    {t("Operating System")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="operating_system"
                    value={form.operating_system || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "operating_system")
                    }
                    className="form-control"
                    placeholder="Operating System"
                  />
                  <p style={{ color: "red" }}>
                    {error.operating_system ? error.operating_system : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    {t("App Installed Version")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="app_installed_vw_version"
                    value={form.app_installed_vw_version || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "app_installed_vw_version")
                    }
                    className="form-control"
                    placeholder="App Installed Version"
                  />
                  <p style={{ color: "red" }}>
                    {error.app_installed_vw_version
                      ? error.app_installed_vw_version
                      : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    {t("Serial Number")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="serial_no"
                    value={form.serial_no || ""}
                    onChange={(e) => onInputchange(e.target.value, "serial_no")}
                    className="form-control"
                    placeholder="serial #"
                  />
                  <p style={{ color: "red" }}>
                    {error.serial_no ? error.serial_no : ""}
                  </p>
                </Col>
              </Row>
            </div>
            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    {t("Type")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={form.type || ""}
                    onChange={(e) => onInputchange(e.target.value, "type")}
                    className="form-control"
                    placeholder="Type"
                  />
                  <p style={{ color: "red" }}>{error.type ? error.type : ""}</p>
                </Col>
                <Col>
                  <label>
                    {t("Model")}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={form.model || ""}
                    onChange={(e) => onInputchange(e.target.value, "model")}
                    className="form-control"
                    placeholder={t("Model")}
                  />
                  <p style={{ color: "red" }}>
                    {error.model ? error.model : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    {t("Manufacturer")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={form.manufacturer || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "manufacturer")
                    }
                    className="form-control"
                    placeholder={t("Manufacturer")}
                  />
                  <p style={{ color: "red" }}>
                    {error.manufacturer ? error.manufacturer : ""}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <label>
                    {t("Select Sim")}
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </label>
                  <Select
                    isClearable
                    name="select-status"
                    style={{ height: "40px" }}
                    onChange={(e) => {
                      if (e) {
                        onInputchange(e, "info_id");
                        setSimId(e);
                      } else {
                        onInputchange("", "info_id");
                      }
                    }}
                    options={props.sim}
                    value={form.info_id || []}
                    isClearable={true}
                  />
                </Col>
                <Col></Col>
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
    </div>
  );
}
