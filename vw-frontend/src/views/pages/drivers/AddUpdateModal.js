import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";
import UploadPhoto from "./upload";

import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";

import { useTranslation } from "react-i18next";

let en;

export default function AddUpdateModal(props) {
  const [overlay, setoverlay] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const { t } = useTranslation();
  const [form, setform] = useState({
    employee_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    driver_pin: "",
    email: "",
    mobile: "",
    gender: "",
    // driving_license_number: "",
    civil_record_or_resident_permit_number: "",
    nationality: [],
    prefered_language: "english",
    photo: "",
    device_id: "",
    assinged_vehicle_id: [],
  });

  const [error, seterror] = useState({
    employee_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    driver_pin: "",
    email: "",
    mobile: "",
    gender: "",
    // driving_license_number: "",
    civil_record_or_resident_permit_number: "",
    nationality: "",
    prefered_language: "",
  });

  const onInputchange = (value, key) => {
    console.log("statyus", value);
    let formUpdate = { ...form };
    formUpdate[key] = value;
    setform(formUpdate);
  };

  const nationalities = [
    { label: "Afghanistan", value: "Afghanistan" },
    { label: "Albania", value: "Albania" },
    { label: "Algeria", value: "Algeria" },
    { label: "Andorra", value: "Andorra" },
    { label: "Angola", value: "Angola" },
    { label: "Antigua and Barbuda", value: "Antigua and Barbuda" },
    { label: "Argentina", value: "Argentina" },
    { label: "Armenia", value: "Armenia" },
    { label: "Australia", value: "Australia" },
    { label: "Austria", value: "Austria" },
    { label: "Azerbaijan", value: "Azerbaijan" },
    { label: "Bahamas", value: "Bahamas" },
    { label: "Bahrain", value: "Bahrain" },
    { label: "Bangladesh", value: "Bangladesh" },
    { label: "Barbados", value: "Barbados" },
    { label: "Belarus", value: "Belarus" },
    { label: "Belgium", value: "Belgium" },
    { label: "Belize", value: "Belize" },
    { label: "Benin", value: "Benin" },
    { label: "Bhutan", value: "Bhutan" },
    { label: "Bolivia", value: "Bolivia" },
    { label: "Bosnia and Herzegovina", value: "Bosnia and Herzegovina" },
    { label: "Botswana", value: "Botswana" },
    { label: "Brazil", value: "Brazil" },
    { label: "Brunei", value: "Brunei" },
    { label: "Bulgaria", value: "Bulgaria" },
    { label: "Burkina Faso", value: "Burkina Faso" },
    { label: "Burundi", value: "Burundi" },
    { label: "Côte d'Ivoire", value: "Côte d'Ivoire" },
    { label: "Cabo Verde", value: "Cabo Verde" },
    { label: "Cambodia", value: "Cambodia" },
    { label: "Cameroon", value: "Cameroon" },
    { label: "Canada", value: "Canada" },
    { label: "Central African Republic", value: "Central African Republic" },
    { label: "Chad", value: "Chad" },
    { label: "Chile", value: "Chile" },
    { label: "China", value: "China" },
    { label: "Colombia", value: "Colombia" },
    { label: "Congo (Congo-Brazzaville)", value: "Congo (Congo-Brazzaville)" },
    { label: "Costa Rica", value: "Costa Rica" },
    { label: "Croatia", value: "Croatia" },
    { label: "Cuba", value: "Cuba" },
    { label: "Cyprus", value: "Cyprus" },
    { label: "Czechia (Czech Republic)", value: "Czechia (Czech Republic)" },
    {
      label: "Democratic Republic of the Congo",
      value: "Democratic Republic of the Congo",
    },
    { label: "Denmark", value: "Denmark" },
    { label: "Djibouti", value: "Djibouti" },
    { label: "Dominica", value: "Dominica" },
    { label: "Dominican Republic", value: "Dominican Republic" },
    { label: "Ecuador", value: "Ecuador" },
    { label: "Egypt", value: "Egypt" },
    { label: "El Salvador", value: "El Salvador" },
    { label: "Equatorial Guinea", value: "Equatorial Guinea" },
    { label: "Eritrea", value: "Eritrea" },
    { label: "Estonia", value: "Estonia" },
    {
      label: "Eswatini (fmr. 'Swaziland')",
      value: "Eswatini (fmr. 'Swaziland')",
    },
    { label: "Ethiopia", value: "Ethiopia" },
    { label: "Fiji", value: "Fiji" },
    { label: "Finland", value: "Finland" },
    { label: "France", value: "France" },
    { label: "Gabon", value: "Gabon" },
    { label: "Gambia", value: "Gambia" },
    { label: "Georgia", value: "Georgia" },
    { label: "Germany", value: "Germany" },
    { label: "Ghana", value: "Ghana" },
    { label: "Greece", value: "Greece" },
    { label: "Grenada", value: "Grenada" },
    { label: "Guatemala", value: "Guatemala" },
    { label: "Guinea", value: "Guinea" },
    { label: "Guinea-Bissau", value: "Guinea-Bissau" },
    { label: "Guyana", value: "Guyana" },
    { label: "Haiti", value: "Haiti" },
    { label: "Holy See", value: "Holy See" },
    { label: "Honduras", value: "Honduras" },
    { label: "Hungary", value: "Hungary" },
    { label: "Iceland", value: "Iceland" },
    { label: "India", value: "India" },
    { label: "Indonesia", value: "Indonesia" },
    { label: "Iran", value: "Iran" },
    { label: "Iraq", value: "Iraq" },
    { label: "Ireland", value: "Ireland" },
    { label: "Israel", value: "Israel" },
    { label: "Italy", value: "Italy" },
    { label: "Jamaica", value: "Jamaica" },
    { label: "Japan", value: "Japan" },
    { label: "Jordan", value: "Jordan" },
    { label: "Kazakhstan", value: "Kazakhstan" },
    { label: "Kenya", value: "Kenya" },
    { label: "Kiribati", value: "Kiribati" },
    { label: "Kuwait", value: "Kuwait" },
    { label: "Kyrgyzstan", value: "Kyrgyzstan" },
    { label: "Laos", value: "Laos" },
    { label: "Latvia", value: "Latvia" },
    { label: "Lebanon", value: "Lebanon" },
    { label: "Lesotho", value: "Lesotho" },
    { label: "Liberia", value: "Liberia" },
    { label: "Libya", value: "Libya" },
    { label: "Liechtenstein", value: "Liechtenstein" },
    { label: "Lithuania", value: "Lithuania" },
    { label: "Luxembourg", value: "Luxembourg" },
    { label: "Madagascar", value: "Madagascar" },
    { label: "Malawi", value: "Malawi" },
    { label: "Malaysia", value: "Malaysia" },
    { label: "Maldives", value: "Maldives" },
    { label: "Mali", value: "Mali" },
    { label: "Malta", value: "Malta" },
    { label: "Marshall Islands", value: "Marshall Islands" },
    { label: "Mauritania", value: "Mauritania" },
    { label: "Mauritius", value: "Mauritius" },
    { label: "Mexico", value: "Mexico" },
    { label: "Micronesia", value: "Micronesia" },
    { label: "Moldova", value: "Moldova" },
    { label: "Monaco", value: "Monaco" },
    { label: "Mongolia", value: "Mongolia" },
    { label: "Montenegro", value: "Montenegro" },
    { label: "Morocco", value: "Morocco" },
    { label: "Mozambique", value: "Mozambique" },
    { label: "Myanmar (formerly Burma)", value: "Myanmar (formerly Burma)" },
    { label: "Namibia", value: "Namibia" },
    { label: "Nauru", value: "Nauru" },
    { label: "Nepal", value: "Nepal" },
    { label: "Netherlands", value: "Netherlands" },
    { label: "New Zealand", value: "New Zealand" },
    { label: "Nicaragua", value: "Nicaragua" },
    { label: "Niger", value: "Niger" },
    { label: "Nigeria", value: "Nigeria" },
    { label: "North Korea", value: "North Korea" },
    { label: "North Macedonia", value: "North Macedonia" },
    { label: "Norway", value: "Norway" },
    { label: "Oman", value: "Oman" },
    { label: "Pakistan", value: "Pakistan" },
    { label: "Palau", value: "Palau" },
    { label: "Palestine State", value: "Palestine State" },
    { label: "Panama", value: "Panama" },
    { label: "Papua New Guinea", value: "Papua New Guinea" },
    { label: "Paraguay", value: "Paraguay" },
    { label: "Peru", value: "Peru" },
    { label: "Philippines", value: "Philippines" },
    { label: "Poland", value: "Poland" },
    { label: "Portugal", value: "Portugal" },
    { label: "Qatar", value: "Qatar" },
    { label: "Romania", value: "Romania" },
    { label: "Russia", value: "Russia" },
    { label: "Rwanda", value: "Rwanda" },
    { label: "Saint Kitts and Nevis", value: "Saint Kitts and Nevis" },
    { label: "Saint Lucia", value: "Saint Lucia" },
    {
      label: "Saint Vincent and the Grenadines",
      value: "Saint Vincent and the Grenadines",
    },
    { label: "Samoa", value: "Samoa" },
    { label: "San Marino", value: "San Marino" },
    { label: "Sao Tome and Principe", value: "Sao Tome and Principe" },
    { label: "Saudi Arabia", value: "Saudi Arabia" },
    { label: "Senegal", value: "Senegal" },
    { label: "Serbia", value: "Serbia" },
    { label: "Seychelles", value: "Seychelles" },
    { label: "Sierra Leone", value: "Sierra Leone" },
    { label: "Singapore", value: "Singapore" },
    { label: "Slovakia", value: "Slovakia" },
    { label: "Slovenia", value: "Slovenia" },
    { label: "Solomon Islands", value: "Solomon Islands" },
    { label: "Somalia", value: "Somalia" },
    { label: "South Africa", value: "South Africa" },
    { label: "South Korea", value: "South Korea" },
    { label: "South Sudan", value: "South Sudan" },
    { label: "Spain", value: "Spain" },
    { label: "Sri Lanka", value: "Sri Lanka" },
    { label: "Sudan", value: "Sudan" },
    { label: "Suriname", value: "Suriname" },
    { label: "Sweden", value: "Sweden" },
    { label: "Switzerland", value: "Switzerland" },
    { label: "Syria", value: "Syria" },
    { label: "Tajikistan", value: "Tajikistan" },
    { label: "Tanzania", value: "Tanzania" },
    { label: "Thailand", value: "Thailand" },
    { label: "Timor-Leste", value: "Timor-Leste" },
    { label: "Togo", value: "Togo" },
    { label: "Tonga", value: "Tonga" },
    { label: "Trinidad and Tobago", value: "Trinidad and Tobago" },
    { label: "Tunisia", value: "Tunisia" },
    { label: "Turkey", value: "Turkey" },
    { label: "Turkmenistan", value: "Turkmenistan" },
    { label: "Tuvalu", value: "Tuvalu" },
    { label: "Uganda", value: "Uganda" },
    { label: "Ukraine", value: "Ukraine" },
    { label: "United Arab Emirates", value: "United Arab Emirates" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "United States of America", value: "United States of America" },
    { label: "Uruguay", value: "Uruguay" },
    { label: "Uzbekistan", value: "Uzbekistan" },
    { label: "Vanuatu", value: "Vanuatu" },
    { label: "Venezuela", value: "Venezuela" },
    { label: "Vietnam", value: "Vietnam" },
    { label: "Yemen", value: "Yemen" },
    { label: "Zambia", value: "Zambia" },
    { label: "Zimbabwe", value: "Zimbabwe" },
  ];

  const submit = () => {
    setoverlay(true);
    if (props.disableBtn) {
      return false;
    }

    let errorCount = 0;
    let error = {};

    seterror({
      employee_number: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      driver_pin: "",
      email: "",
      mobile: "",
      gender: "",
      // driving_license_number: "",
      civil_record_or_resident_permit_number: "",
      nationality: "",
      prefered_language: "",
    });

    if (helper.isEmptyString(form.employee_number)) {
      error.employee_number = "Employee # is required";
      errorCount++;
      setoverlay(false);
    }

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

    // if (
    //   !helper.isObject(props.updateModalData) &&
    //   helper.isEmptyString(form.driver_pin)
    // ) {
    //   error.driver_pin = "Pin code is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    // if (!helper.isEmptyString(form.driver_pin) && form.driver_pin.length < 4) {
    //   error.driver_pin = "Driver pin length should be 4";
    //   errorCount++;
    //   setoverlay(false);
    // }

    // if (!helper.isEmail(form.email)) {
    //   error.email = "Valid email is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

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
    if (helper.isEmptyString(form.civil_record_or_resident_permit_number)) {
      error.civil_record_or_resident_permit_number = "Residence ID is required";
      errorCount++;
      setoverlay(false);
    }

    // if (!helper.isObject(form.nationality)) {
    //   error.nationality = "Nationality is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    // if (helper.isEmptyString(form.prefered_language)) {
    //   error.prefered_language = "Prefered language is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    if (errorCount > 0) {
      seterror(error);
      setoverlay(false);
    } else {
      //console.log(form, "form");

      if (
        helper.isObject(props.updateModalData) &&
        props.updateModalData.employee_number === form.employee_number
      ) {
        form.employee_number = "";
      }
      if (
        helper.isObject(props.updateModalData) &&
        props.updateModalData.civil_record_or_resident_permit_number ===
          form.civil_record_or_resident_permit_number
      ) {
        form.civil_record_or_resident_permit_number = "";
      }
      props.submitAction(form);
      setTimeout(() => {
        setoverlay(false);
      }, 2000);
    }
  };

  const setUpdateFormValues = () => {
    setoverlay(false);
    en = helper.randomInteger(1, 9999);
    console.log("vehicelsss", props.vehicles);

    setVehicles(props.vehicles);

    setform({
      employee_number: helper.isObject(props.updateModalData)
        ? props.updateModalData.employee_number
        : "",
      device_id: helper.isObject(props.updateModalData)
        ? props.updateModalData.device_id
        : "",
      first_name: helper.isObject(props.updateModalData)
        ? props.updateModalData.first_name
        : "",
      middle_name: helper.isObject(props.updateModalData)
        ? props.updateModalData.middle_name
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
      driving_license_number: helper.isObject(props.updateModalData)
        ? props.updateModalData.driving_license_number
        : "",
      civil_record_or_resident_permit_number: helper.isObject(
        props.updateModalData
      )
        ? props.updateModalData.civil_record_or_resident_permit_number
        : "",
      nationality: helper.isObject(props.updateModalData)
        ? {
            label: props.updateModalData.nationality,
            value: props.updateModalData.nationality,
          }
        : [],
      prefered_language: helper.isObject(props.updateModalData)
        ? props.updateModalData.driver_prefered_language
        : "english",
      driver_pin: helper.isObject(props.updateModalData)
        ? props.updateModalData.driver_pin
        : "",
      photo: "",

      assinged_vehicle_id:
        helper.isObject(props.updateModalData) &&
        helper.isObject(props.updateModalData.vehicle)
          ? {
              label: props.updateModalData.vehicle.plate_no,
              value: props.updateModalData.vehicle.plate_no,
              id: props.updateModalData.assinged_vehicle_id,
            }
          : [],
    });

    seterror({
      employee_number: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      driver_pin: "",
      email: "",
      mobile: "",
      gender: "",
      driving_license_number: "",
      civil_record_or_resident_permit_number: "",
      nationality: "",
      prefered_language: "",
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
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {props.updateModalData
              ? `${t("Update")}  ${t("Driver")}`
              : t("Add Driver")}
            {props.clientName ? ` - ${props.clientName}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "400px", overflowY: "auto" }}>
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
                  <UploadPhoto
                    onInputchange={(e, y) => onInputchange(e, y)}
                    photo={
                      helper.isObject(props.updateModalData)
                        ? props.updateModalData.image
                        : ""
                    }
                  />
                </Col>
              </Row>
            </div>
            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    {t("Civil record ID")} / {t("Resident Permit number")}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="civil_record_or_resident_permit_number"
                    value={form.civil_record_or_resident_permit_number || ""}
                    onChange={(e) =>
                      onInputchange(
                        helper.cleanInteger(e.target.value, "civil_id"),
                        "civil_record_or_resident_permit_number"
                      )
                    }
                    className="form-control"
                    placeholder={t("Civil ID / Resident Permit Number")}
                  />
                  <p style={{ color: "red" }}>
                    {error.civil_record_or_resident_permit_number
                      ? error.civil_record_or_resident_permit_number
                      : ""}
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

                <Col>
                  <label>
                    {t("Pin Code")}
                    {!props.updateModalData ? (
                      // <span style={{ color: "red" }}>*</span>
                      <p></p>
                    ) : (
                      ""
                    )}
                  </label>
                  <input
                    type="text"
                    name="driver_pin"
                    value={form.driver_pin || ""}
                    onChange={(e) =>
                      onInputchange(
                        helper.cleanInteger(e.target.value, "driver_pin"),
                        "driver_pin"
                      )
                    }
                    className="form-control"
                    placeholder={t("Pin Code")}
                  />
                  <p style={{ color: "red" }}>
                    {error.driver_pin ? error.driver_pin : ""}
                  </p>
                </Col>
              </Row>
            </div>
            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    {t("Employee Number")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="employee_number"
                    value={form.employee_number || ""}
                    // readOnly="readonly"
                    onChange={(e) =>
                      onInputchange(e.target.value, "employee_number")
                    }
                    className="form-control"
                    placeholder={t("Employee Number")}
                  />
                  <p style={{ color: "red" }}>
                    {error.employee_number ? error.employee_number : ""}
                  </p>
                </Col>
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
                    {t("Middle Name")}
                    {/* <span style={{ color: "red" }}></span> */}
                  </label>
                  <input
                    type="text"
                    name="middle_name"
                    value={form.middle_name || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "middle_name")
                    }
                    className="form-control"
                    placeholder={t("Middle Name")}
                  />
                  <p style={{ color: "red" }}>
                    {error.middle_name ? error.middle_name : ""}
                  </p>
                </Col>
              </Row>
            </div>

            <div className="form-group marginBottom-5px">
              <Row>
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

                <Col>
                  {/* <label>{t("Email")}</label>
                  <input
                    type="text"
                    name="client_driver_email"
                    value={form.email || ""}
                    onChange={(e) => onInputchange(e.target.value, "email")}
                    className="form-control"
                    placeholder={t("Email")}
                    autoComplete="off"
                  />
                  <p style={{ color: "red" }}>
                    {error.email ? error.email : ""}
                  </p> */}

                  <label>{t("Nationality")}</label>
                  <Select
                    name="nationality"
                    onChange={(e) => onInputchange(e, "nationality")}
                    options={nationalities}
                    value={form.nationality}
                    isClearable={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  <p style={{ color: "red" }}>
                    {error.nationality ? error.nationality : ""}
                  </p>
                </Col>

                <Col>
                  <label>
                    {t("Preferred Language")}{" "}
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </label>
                  <select
                    className="form-control"
                    defaultValue={form.prefered_language || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "prefered_language")
                    }
                  >
                    <option disabled={true}>Select Preferred Language</option>
                    <option value="arabic">Arabic</option>
                    <option value="urdu">Urdu</option>
                    <option value="english">English</option>
                  </select>
                  <p style={{ color: "red" }}>
                    {error.prefered_language ? error.prefered_language : ""}
                  </p>
                </Col>
              </Row>
            </div>

            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  {/* <label>
                    {t("Gender")}
                  </label>
                  <select
                    className="form-control"
                    onChange={(e) => onInputchange(e.target.value, "gender")}
                    value={
                      form.gender == "0" ? "0" : form.gender == "1" ? "1" : ""
                    }
                    // value={form.gender == "0" ? "0" : "1" || ""}
                  >
                    <option>Select Gender</option>
                    <option value="1">Male</option>
                    <option value="0">Female</option>
                  </select>
                  <p style={{ color: "red" }}>
                    {error.gender ? error.gender : ""}
                  </p> */}
                </Col>
                <Col>
                  {/* <label>
                    {t("Nationality")}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    name="nationality"
                    onChange={(e) => onInputchange(e, "nationality")}
                    options={nationalities}
                    value={form.nationality}
                    isClearable={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  <p style={{ color: "red" }}>
                    {error.nationality ? error.nationality : ""}
                  </p> */}
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
    </div>
  );
}
