import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
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
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    mobile: "",
    gender: "",
    designation: "gas_station_manager",
  });

  const [error, seterror] = useState({
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    mobile: "",
    gender: "",
    designation: "",
  });

  const onInputchange = (value, key) => {
    console.log(form, "form");
    console.log(value);
    let formUpdate = { ...form };
    formUpdate[key] = value;
    console.log(formUpdate, "formUpdate");
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
      first_name: "",
      last_name: "",
      password: "",
      email: "",
      mobile: "",
      gender: "",
      designation: "",
    });

    if (helper.isEmptyString(form.first_name)) {
      error.first_name = "First name is required";
      errorCount++;
      setoverlay(false);
    }

    // if (helper.isEmptyString(form.last_name)) {
    //   error.last_name = "Last name is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    if (
      !helper.isObject(props.updateModalData) &&
      helper.isEmptyString(form.password)
    ) {
      error.password = "Password is required";
      errorCount++;
      setoverlay(false);
    }

    if (!helper.isEmail(form.email)) {
      error.email = "Valid email is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.mobile)) {
      error.mobile = "Mobile is required";
      errorCount++;
      setoverlay(false);
    }

    if (!helper.isEmptyString(form.mobile) && form.mobile.length < 9) {
      error.mobile = "Mobile number length should be 9";
      errorCount++;
      setoverlay(false);
    }
    if (form.mobile.charAt(0) != 5) {
      error.mobile = "Mobile number should start with 5";
      errorCount++;
      setoverlay(false);
    }

    // if (helper.isEmptyString(form.gender) || form.gender == "Select Gender") {
    //   error.gender = "Gender is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    if (helper.isEmptyString(form.designation)) {
      error.designation = "Designation is required";
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
    // let roles = [];
    // if (helper.isObject(props.updateModalData)) {
    //   let current_roles = JSON.parse(props.updateModalData.role_id);
    //   for (let i = 0; i < current_roles.length; i++) {
    //     const findRole = props.rolesList.find(
    //       (j) => j.value === current_roles[i]
    //     );
    //     if (helper.isObject(findRole)) {
    //       roles.push(findRole);
    //     }
    //   }
    // }

    // const group = helper.isObject(props.updateModalData)
    //   ? props.groupList.find(
    //       (i) =>
    //         props.updateModalData.group_id &&
    //         i.value === props.updateModalData.group_id
    //     )
    //   : [];
    setform({
      first_name: helper.isObject(props.updateModalData)
        ? props.updateModalData.first_name
        : "",
      last_name: helper.isObject(props.updateModalData)
        ? props.updateModalData.last_name
        : "",
      email: helper.isObject(props.updateModalData)
        ? props.updateModalData.email
        : "",
      mobile: helper.isObject(props.updateModalData)
        ? props.updateModalData.mobile
        : "",
      gender: helper.isObject(props.updateModalData)
        ? props.updateModalData.gender
        : "",
      password: "",
      designation: helper.isObject(props.updateModalData)
        ? props.updateModalData.designation
        : "gas_station_manager",
    });

    seterror({
      first_name: "",
      last_name: "",
      password: "",
      email: "",
      mobile: "",
      gender: "",
      designation: "",
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
            {props.updateModalData ? t("Update User") : t("Add User")}
            {props.gasStationName ? ` - ${props.gasStationName}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "280px", overflowY: "auto" }}>
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
                    {t("First Name")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "first_name")
                    }
                    className="form-control"
                    placeholder={t("First Name")}
                  />
                  <p style={{ color: "red" }}>
                    {error.first_name ? error.first_name : ""}
                  </p>
                </Col>

                <Col>
                  <label>
                    {t("Last Name")}
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name || ""}
                    onChange={(e) => onInputchange(e.target.value, "last_name")}
                    className="form-control"
                    placeholder={t("Last Name")}
                  />
                  <p style={{ color: "red" }}>
                    {error.last_name ? error.last_name : ""}
                  </p>
                </Col>
              </Row>
            </div>

            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    {t("Email")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="gas_station_user_email"
                    value={form.email || ""}
                    onChange={(e) => onInputchange(e.target.value, "email")}
                    className="form-control"
                    placeholder={t("Email")}
                    autocomplete="off"
                  />
                  <p style={{ color: "red" }}>
                    {error.email ? error.email : ""}
                  </p>
                </Col>

                <Col>
                  <label>
                    {t("Mobile")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <InputGroup>
                    <InputGroup.Text id="basic-addon1">966</InputGroup.Text>
                    <input
                      type="text"
                      name="mobile"
                      value={form.mobile || ""}
                      onChange={(e) =>
                        onInputchange(
                          helper.cleanInteger(e.target.value, "mobile"),
                          "mobile"
                        )
                      }
                      className="form-control"
                      placeholder="9 Digit Mobile Number"
                      autocomplete="off"
                    />
                  </InputGroup>
                  <p style={{ color: "red" }}>
                    {error.mobile ? error.mobile : ""}
                  </p>
                </Col>
              </Row>
            </div>

            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    {t("Password")}{" "}
                    {!props.updateModalData ? (
                      <span style={{ color: "red" }}>*</span>
                    ) : (
                      ""
                    )}
                  </label>
                  <input
                    type="password"
                    name="gas_station_user_password"
                    value={form.password || ""}
                    onChange={(e) => onInputchange(e.target.value, "password")}
                    className="form-control"
                    placeholder={t("Password")}
                    autocomplete="new-password"
                  />
                  <p style={{ color: "red" }}>
                    {error.password ? error.password : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    {t("Gender")}
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </label>
                  <select
                    className="form-control"
                    onChange={(e) => onInputchange(e.target.value, "gender")}
                    value={
                      form.gender == "0" ? "0" : form.gender == "1" ? "1" : ""
                    }
                  >
                    <option>Select Gender</option>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                  <p style={{ color: "red" }}>
                    {error.gender ? error.gender : ""}
                  </p>
                </Col>
              </Row>
            </div>

            <div className="form-group marginBottom-5px">
              <Row>
                {/* <Col sm={6}>
                  <label>
                    Designation <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      onInputchange(e.target.value, "designation")
                    }
                    defaultValue={form.designation || ""}
                  >
                    <option disabled={true}>Select Gender</option>
                    <option value="client_manager">Client Manager</option>
                    <option value="gas_station_manager">
                      Gas Station Manager
                    </option>
                    <option value="admin">VW Admin</option>
                  </select>
                  <p style={{ color: "red" }}>
                    {error.designation ? error.designation : ""}
                  </p>
                </Col> */}
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
