import React, { useState, useEffect } from "react";
import { Modal, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { ClipLoader } from "react-spinners";
import DriverSheet from "../../../assets/files/DriverSheet.xlsx";
import {
  Button,
  Media,
  Label,
  Row,
  Col,
  Input,
  FormGroup,
  Alert,
  Form,
} from "reactstrap";
import Select from "react-select";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { useTranslation } from "react-i18next";
export default function NetworkUser(props) {
  const [value, setValue] = useState("");
  const [station, setStation] = useState("");
  const [item, setItem] = useState({});
  const [overlay, setoverlay] = useState(false);
  const [gasStations, setGasStations] = useState([]);
  const [option, setOption] = useState([]);
  const { t } = useTranslation();
  const [form, setform] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    address: "",
    vat_no: "",
    cr_number: "",
    location_id: "",

    admin_contact_person: "",
    admin_contact_email: "",
    admin_contact_number: "",

    payment_terms: [],
    credit_terms: [],
    // vw_deposited_amount: "",
    cr_photo: "",
    vat_photo: "",
    admin_password: "",
  });

  const [error, seterror] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    address: "",
    vat_no: "",
    cr_number: "",
    location_id: "",

    admin_contact_person: "",
    admin_contact_email: "",
    admin_contact_number: "",

    payment_terms: "",
    credit_terms: "",
    // vw_deposited_amount: "",
    cr_photo: "",
    vat_photo: "",
    admin_password: "",
  });

  const onInputchange = (value, key) => {
    console.log("value", value);
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
      address: "",
      vat_no: "",
      cr_number: "",
      location_id: "",

      admin_contact_person: "",
      admin_contact_email: "",
      admin_contact_number: "",

      payment_terms: "",
      credit_terms: "",
      // vw_deposited_amount: "",
      cr_photo: "",
      vat_photo: "",
      admin_password: "",
    });

    if (helper.isEmptyString(form.name_en)) {
      error.name_en = "Name english is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.name_ar)) {
      error.name_ar = "Name arabic is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.name_ur)) {
      error.name_ur = "Name urdu is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.address)) {
      error.address = "Address is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.vat_no)) {
      error.vat_no = "Vat number is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.cr_number)) {
      error.cr_number = "CR number is required";
      errorCount++;
      setoverlay(false);
    }

    if (
      helper.isEmptyString(form.admin_contact_email) &&
      !helper.isEmail(form.admin_contact_email)
    ) {
      error.admin_contact_email = "Valid email is required";
      errorCount++;
      setoverlay(false);
    }
    if (helper.isEmptyString(form.admin_contact_person)) {
      error.admin_contact_person = "Conatct person is required";
      errorCount++;
      setoverlay(false);
    }
    if (helper.isEmptyString(form.admin_contact_number)) {
      error.admin_contact_number = "Conatct numebr is required";
      errorCount++;
      setoverlay(false);
    }
    if (helper.isEmptyString(form.admin_contact_number)) {
      error.admin_password = "Password is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.payment_terms)) {
      error.payment_terms = "Payment terms is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.credit_terms)) {
      error.credit_terms = "Credit terms is required";
      errorCount++;
      setoverlay(false);
    }

    // if (helper.isEmptyString(form.vw_deposited_amount)) {
    //   error.vw_deposited_amount = "VW deposited amount is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

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
    console.log(
      "add upadte props in network userrrrrrrrr",
      props.updateModalData
    );

    setform({
      name_en: helper.isObject(props.updateModalData)
        ? props.updateModalData.first_name
        : "",
      name_ar: helper.isObject(props.updateModalData)
        ? props.updateModalData.name_ar
        : "",
      name_ur: helper.isObject(props.updateModalData)
        ? props.updateModalData.name_ur
        : "",
      address: helper.isObject(props.updateModalData)
        ? props.updateModalData.address
        : "",
      vat_no: helper.isObject(props.updateModalData)
        ? props.updateModalData.vat_no
        : "",
      cr_number: helper.isObject(props.updateModalData)
        ? props.updateModalData.cr_number
        : "",

      // admin_contact_person:
      //   helper.isObject(props.updateModalData) &&
      //   props.updateModalData.users.length > 0
      //     ? props.updateModalData.users[0].first_name
      //     : "",
      // admin_contact_number:
      //   helper.isObject(props.updateModalData) &&
      //   props.updateModalData.users.length > 0
      //     ? props.updateModalData.users[0].mobile
      //     : "",
      // admin_contact_email:
      //   helper.isObject(props.updateModalData) &&
      //   props.updateModalData.users.length > 0
      //     ? props.updateModalData.users[0].email
      //     : "",
      admin_contact_person: helper.isObject(props.updateModalData)
        ? props.updateModalData.first_name
        : "",
      admin_contact_number: helper.isObject(props.updateModalData)
        ? props.updateModalData.mobile
        : "",
      admin_contact_email: helper.isObject(props.updateModalData)
        ? props.updateModalData.email
        : "",

      payment_terms: helper.isObject(props.updateModalData)
        ? {
            label: props.updateModalData.payment_terms + " " + "days",
            value: props.updateModalData.payment_terms + " " + "days",
          }
        : [],
      credit_terms: helper.isObject(props.updateModalData)
        ? {
            label: props.updateModalData.credit_terms + " " + "days",
            value: props.updateModalData.credit_terms + " " + "days",
          }
        : [],

      // vw_deposited_amount: helper.isObject(props.updateModalData)
      //   ? props.updateModalData.vw_deposited_amount
      //   : "",
      cr_photo: "",
      vat_photo: "",
    });

    seterror({
      name_en: "",
      name_ar: "",
      name_ur: "",
      address: "",
      vat_no: "",
      cr_number: "",
      location_id: "",
      // operation_contact_person: "",
      // operation_contact_number: "",
      // operation_contact_email: "",
      // admin_contact_person: "",
      // admin_contact_email: "",
      // admin_contact_number: "",
      // billing_contact_person: "",
      // billing_contact_email: "",
      // billing_contact_number: "",
      payment_terms: "",
      credit_terms: "",
      vw_deposited_amount: "",
      cr_photo: "",
      vat_photo: "",
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
            Gas Station Network User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "200px", overflowY: "auto" }}>
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
                    Manager Contact Person{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="admin_contact_person"
                    value={form.admin_contact_person}
                    onChange={(e) =>
                      onInputchange(e.target.value, "admin_contact_person")
                    }
                    className="form-control"
                    placeholder={t("Manager Contact Person")}
                  />
                  <p style={{ color: "red" }}>
                    {error.admin_contact_person
                      ? error.admin_contact_person
                      : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    Manager Contact Number
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <InputGroup>
                    <InputGroup.Text id="basic-addon1">966</InputGroup.Text>
                    <input
                      type="text"
                      name="admin_contact_number"
                      value={form.admin_contact_number || ""}
                      onChange={(e) =>
                        onInputchange(
                          helper.cleanInteger(e.target.value, "mobile"),
                          "admin_contact_number"
                        )
                      }
                      className="form-control"
                      placeholder={t("Manager Contact Number")}
                    />
                  </InputGroup>
                  <p style={{ color: "red" }}>
                    {error.admin_contact_number
                      ? error.admin_contact_number
                      : ""}
                  </p>
                </Col>
              </Row>
            </div>

            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    Manager Contact Email{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="gas_station_network_manager_email"
                    value={form.admin_contact_email}
                    onChange={(e) =>
                      onInputchange(e.target.value, "admin_contact_email")
                    }
                    className="form-control"
                    placeholder={t("Manager Contact Email")}
                  />
                  <p style={{ color: "red" }}>
                    {error.admin_contact_email ? error.admin_contact_email : ""}
                  </p>
                </Col>

                <Col>
                  <label>
                    Password <span style={{ color: "red" }}>*</span>
                  </label>

                  <input
                    type="password"
                    name="gas_station_network_manager_password"
                    value={form.admin_password || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "admin_password")
                    }
                    className="form-control"
                    placeholder={t("Password")}
                  />
                  <p style={{ color: "red" }}>
                    {error.admin_password ? error.admin_password : ""}
                  </p>
                </Col>
              </Row>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={(e) => props.submitAction()}>
            {/* <i className="fas fa-check"></i> */}
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
