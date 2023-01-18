import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function AddUpdateModal(props) {
  const [overlay, setoverlay] = useState(false);
  const { t } = useTranslation();
  const [form, setform] = useState({
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    mobile: "",
    gender: "",
    // designation: "client_manager",
    group_id: [],
  });

  const [error, seterror] = useState({
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    mobile: "",
    gender: "",
    designation: "",
    group_id: "",
  });

  const onInputchange = (value, key) => {
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
      first_name: "",
      last_name: "",
      password: "",
      email: "",
      mobile: "",
      gender: "",
      roles: "",
      group: "",
      designation: "",
      group_id: [],
    });

    if (helper.isEmptyString(form.first_name)) {
      error.first_name = "First name is required";
      errorCount++;
    }

    if (!helper.isObject(form.group_id)) {
      error.group_id = "Please select a group";
      errorCount++;
    }

    if (
      !helper.isObject(props.updateModalData) &&
      helper.isEmptyString(form.password)
    ) {
      error.password = "Password is required";
      errorCount++;
    }

    if (!helper.isEmail(form.email)) {
      error.email = "Valid email is required";
      errorCount++;
    }

    if (helper.isEmptyString(form.mobile)) {
      error.mobile = "Mobile is required";
      errorCount++;
    }

    if (form.mobile.length < 9) {
      error.mobile = "Mobile number length should be 9";
      errorCount++;
    }
    if (form.mobile.charAt(0) != 5) {
      error.mobile = "Mobile number should start with 5";
      errorCount++;
    }

    // if (helper.isEmptyString(form.designation)) {
    //   error.designation = "Designation is required";
    //   errorCount++;
    // }

    if (errorCount > 0) {
      seterror(error);
      setoverlay(false);
    } else {
      props.submitAction(form);
    }
  };

  const setUpdateFormValues = () => {
    console.log("upate model data", props.updateModalData);
    setoverlay(false);
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
      designation: helper.isObject(props.updateModalData)
        ? props.updateModalData.designation
        : "client_manager",
      gender: helper.isObject(props.updateModalData)
        ? props.updateModalData.gender
        : "",
      password: "",
      group_id: helper.isObject(props.updateModalData)
        ? {
            label:
              props.updateModalData.group_id == 18
                ? "Client Billing"
                : props.updateModalData.group_id == 17
                ? "Client Operations"
                : props.updateModalData.group_id == 9
                ? "Client Manager"
                : "",

            value: props.updateModalData.group_id
              ? props.updateModalData.group_id
              : "",
          }
        : "",
      // roles: roles,
      // group: group,
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
            {props.clientName ? ` - ${props.clientName}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "260px", overflowY: "auto" }}>
          <div>
            <div className="form-group marginBottom-5px">
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
              <Row>
                <Col>
                  <label>
                    {t("Name")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "first_name")
                    }
                    className="form-control"
                    placeholder="Name"
                  />
                  <p style={{ color: "red" }}>
                    {error.first_name ? error.first_name : ""}
                  </p>
                </Col>

                <Col>
                  {/* <label>
                    {t("Gender")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-control"
                    onChange={(e) => onInputchange(e.target.value, "gender")}
                    value={form.gender || ""}
                  >
                    <option>Select Gender</option>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                  <p style={{ color: "red" }}>
                    {error.gender ? error.gender : ""}
                  </p> */}
                  <label>
                    {t("Password")}
                    {!props.updateModalData ? (
                      <span style={{ color: "red" }}>*</span>
                    ) : (
                      ""
                    )}
                  </label>
                  <input
                    type="password"
                    name="client_user_password"
                    value={form.password || ""}
                    onChange={(e) => onInputchange(e.target.value, "password")}
                    className="form-control"
                    placeholder="Password"
                    autoComplete="new-password"
                  />
                  <p style={{ color: "red" }}>
                    {error.password ? error.password : ""}
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
                    name="client_user_email"
                    value={form.email || ""}
                    onChange={(e) => onInputchange(e.target.value, "email")}
                    className="form-control"
                    placeholder="Email"
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
                      placeholder="9 Digit Mobile #"
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
                    {t("Group")}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    name="group_id"
                    onChange={(e) => {
                      if (e) {
                        onInputchange(e, "group_id");
                      } else {
                        onInputchange("", "group_id");
                      }
                    }}
                    options={[
                      {
                        label: "Client Manager",
                        value: 9,
                      },
                      {
                        label: "Client Operation",
                        value: 17,
                      },
                      {
                        label: "Client Billing",
                        value: 18,
                      },
                    ]}
                    value={form.group_id}
                    // isClearable={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  <p style={{ color: "red" }}>
                    {error.group_id ? error.group_id : ""}
                  </p>
                </Col>
                <Col></Col>
              </Row>
            </div>

            <div className="form-group marginBottom-5px">
              <Row>
                <Col sm={6}>
                  {/* <label>
                    Designation <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      onInputchange(e.target.value, "designation")
                    }
                    defaultValue={form.designation || ""}
                  >
                    <option disabled={true}>Select Designationss</option>
                    <option value="client_manager">Client Manager</option>
                    <option value="gas_station_manager">
                      Gas Station Manager
                    </option>
                    <option value="admin">VW Admin</option>
                  </select>
                  <p style={{ color: "red" }}>
                    {error.designation ? error.designation : ""}
                  </p> */}
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
