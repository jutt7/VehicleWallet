import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import UploadVat from "./uploadVat";
import UploadCr from "./uploadCr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { ClipLoader } from "react-spinners";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import ZoomableImageModal from "../refueling-transactions/imagePopup";

export default function AddUpdateModal(props) {
  const [overlay, setoverlay] = useState(false);
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
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

    billing_contact_person: "",
    billing_contact_email: "",
    billing_contact_number: "",

    operation_contact_person: "",
    operation_contact_email: "",
    operation_contact_number: "",

    payment_terms: [],
    credit_terms: [],
    // vw_deposited_amount: "",
    cr_photo: "",
    vat_photo: "",
    admin_password: "",
    billing_password: "",
    operation_password: "",
    contract_no: "",
    contract_start_date: "",
    contract_end_date: "",
    price: [],
    admin_id: "",
    bill_id: "",
    op_id: "",
  });

  const [comission, setComission] = useState([]);

  const [bill, setBill] = useState(false);
  const [op, setOp] = useState(false);

  const terms = [
    { label: "1 day", value: "1" },
    { label: "2 days", value: "2" },
    { label: "3 days", value: "3" },
    { label: "4 days", value: "4" },
    { label: "5 days", value: "5" },
    { label: "6 days", value: "6" },
    { label: "7 days", value: "7" },
    { label: "8 days", value: "8" },
    { label: "9 days", value: "9" },
    { label: "10 days", value: "10" },
    { label: "11 days", value: "11" },
    { label: "12 days", value: "12" },
    { label: "13 days", value: "13" },
    { label: "14 days", value: "14" },
    { label: "15 days", value: "15" },
    { label: "16 days", value: "16" },
    { label: "17 days", value: "17" },
    { label: "18 days", value: "18" },
    { label: "19 days", value: "19" },
    { label: "20 days", value: "20" },
  ];

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

    billing_contact_person: "",
    billing_contact_email: "",
    billing_contact_number: "",

    operation_contact_person: "",
    operation_contact_email: "",
    operation_contact_number: "",

    payment_terms: "",
    credit_terms: "",
    // vw_deposited_amount: "",
    cr_photo: "",
    vat_photo: "",
    admin_password: "",
    contract_no: "",
    contract_start_date: "",
    contract_end_date: "",
  });

  const onInputchange = (value, key) => {
    // console.log("value", value);
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

      billing_contact_person: "",
      billing_contact_email: "",
      billing_contact_number: "",

      operation_contact_person: "",
      operation_contact_email: "",
      operation_contact_number: "",

      payment_terms: "",
      credit_terms: "",
      // vw_deposited_amount: "",
      cr_photo: "",
      vat_photo: "",
      admin_password: "",
      contract_no: "",
      contract_start_date: "",
      contract_end_date: "",
    });

    if (helper.isEmptyString(form.name_en)) {
      error.name_en = "Name english is required";
      errorCount++;
      setoverlay(false);
    }

    // if (helper.isEmptyString(form.name_ar)) {
    //   error.name_ar = "Name arabic is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    // if (helper.isEmptyString(form.name_ur)) {
    //   error.name_ur = "Name urdu is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

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
      error.admin_contact_number = "Number is required";
      errorCount++;
      setoverlay(false);
    }

    if (
      !helper.isEmptyString(form.admin_contact_number) &&
      form.admin_contact_number.charAt(0) != 5
    ) {
      error.admin_contact_number = "Mobile number should start with 5";
      errorCount++;
      setoverlay(false);
    }
    if (
      !helper.isEmptyString(form.admin_contact_number) &&
      form.admin_contact_number.length < 9
    ) {
      error.admin_contact_number = "Number sould be of lenght 9";
      errorCount++;
      setoverlay(false);
    }
    if (
      !helper.isObject(props.updateModalData) &&
      helper.isEmptyString(form.admin_password)
    ) {
      error.admin_password = "Password is required";
      errorCount++;
      setoverlay(false);
    }
    if (bill) {
      if (
        helper.isEmptyString(form.billing_contact_email) &&
        !helper.isEmail(form.billing_contact_email)
      ) {
        error.billing_contact_email = "Valid email is required";
        errorCount++;
        setoverlay(false);
      }
      if (helper.isEmptyString(form.billing_contact_person)) {
        error.billing_contact_person = "Conatct person is required";
        errorCount++;
        setoverlay(false);
      }
      if (helper.isEmptyString(form.billing_contact_number)) {
        error.billing_contact_number = "Number is required";
        errorCount++;
        setoverlay(false);
      }

      if (
        !helper.isEmptyString(form.billing_contact_number) &&
        form.billing_contact_number.charAt(0) != 5
      ) {
        error.billing_contact_number = "Mobile number should start with 5";
        errorCount++;
        setoverlay(false);
      }
      if (
        !helper.isEmptyString(form.billing_contact_number) &&
        form.billing_contact_number.length < 9
      ) {
        error.billing_contact_number = "Number sould be of lenght 9";
        errorCount++;
        setoverlay(false);
      }
      if (
        !helper.isObject(props.updateModalData) &&
        helper.isEmptyString(form.billing_password)
      ) {
        error.billing_password = "Password is required";
        errorCount++;
        setoverlay(false);
      }
    }
    if (op) {
      if (
        helper.isEmptyString(form.operation_contact_email) &&
        !helper.isEmail(form.operation_contact_email)
      ) {
        error.operation_contact_email = "Valid email is required";
        errorCount++;
        setoverlay(false);
      }
      if (helper.isEmptyString(form.operation_contact_person)) {
        error.operation_contact_person = "Conatct person is required";
        errorCount++;
        setoverlay(false);
      }
      if (helper.isEmptyString(form.operation_contact_number)) {
        error.operation_contact_number = "Number is required";
        errorCount++;
        setoverlay(false);
      }

      if (
        !helper.isEmptyString(form.operation_contact_number) &&
        form.operation_contact_number.charAt(0) != 5
      ) {
        error.operation_contact_number = "Mobile number should start with 5";
        errorCount++;
        setoverlay(false);
      }
      if (
        !helper.isEmptyString(form.operation_contact_number) &&
        form.operation_contact_number.length < 9
      ) {
        error.operation_contact_number = "Number sould be of lenght 9";
        errorCount++;
        setoverlay(false);
      }
      if (
        !helper.isObject(props.updateModalData) &&
        helper.isEmptyString(form.operation_password)
      ) {
        error.operation_password = "Password is required";
        errorCount++;
        setoverlay(false);
      }
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
    if (helper.isEmptyString(form.contract_no)) {
      error.contract_no = "Contract Number is required";
      errorCount++;
      setoverlay(false);
    }
    if (helper.isEmptyString(form.contract_start_date)) {
      error.contract_start_date = "Date is required";
      errorCount++;
      setoverlay(false);
    }
    if (helper.isEmptyString(form.contract_end_date)) {
      error.contract_end_date = "Date is required";
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

  const setFuelComission = (data) => {
    // console.log("dataaaaaaaaa", data);
    let arr = [];
    data.forEach((item) => {
      arr.push({
        count_id: "",
        id: props.updateModalData ? item.fuel_type_id : item.id,
        comission: props.updateModalData
          ? item.vw_commision
          : item.vw_commision,
        price_id: props.updateModalData ? item.price_id : "",
        fuelType:
          props.updateModalData && helper.isObject(item.fuel_type)
            ? item.fuel_type.title_en
            : item.title_en,
      });
    });
    console.log("arrrrrrrrrr", arr);
    props.setComissionSubmit(arr);
    setComission(arr);
  };

  const setUpdateFormValues = () => {
    let obj = {
      admin_contact_person: "",
      admin_contact_email: "",
      admin_contact_number: "",

      billing_contact_person: "",
      billing_contact_email: "",
      billing_contact_number: "",

      operation_contact_person: "",
      operation_contact_email: "",
      operation_contact_number: "",

      admin_password: "",
      billing_password: "",
      operation_password: "",

      admin_id: "",
      bill_id: "",
      op_id: "",
    };
    console.log("add upadte props", props);
    if (
      props.updateModalData &&
      props.updateModalData.fuel_commissions.length > 0
    ) {
      setFuelComission(props.updateModalData.fuel_commissions);
    } else {
      // console.log("in else");
      setFuelComission(props.fuelData);
    }
    if (helper.isObject(props.updateModalData)) {
      if (
        props.updateModalData.users &&
        props.updateModalData.users.length > 0
      ) {
        let user = props.updateModalData.users;
        user.forEach((item) => {
          if (item.designation == "gas_station_network_manager") {
            obj.admin_contact_person = item.first_name;
            obj.admin_contact_number = item.mobile;
            obj.admin_contact_email = item.email;
            obj.admin_password = "";
            obj.admin_id = item.user_id;
          } else if (item.designation == "gas_station_network_billing") {
            obj.billing_contact_person = item.first_name;
            obj.billing_contact_number = item.mobile;
            obj.billing_contact_email = item.email;
            obj.billing_password = "";
            obj.bill_id = item.user_id;
          } else if (item.designation == "gas_station_network_operation") {
            obj.operation_contact_person = item.first_name;
            obj.operation_contact_number = item.mobile;
            obj.operation_contact_email = item.email;
            obj.operation_password = "";
            obj.op_id = item.user_id;
          }
        });
        console.log("ojjjjjjjjjj", obj);
      }
    }

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
      address: helper.isObject(props.updateModalData)
        ? props.updateModalData.address
        : "",
      vat_no: helper.isObject(props.updateModalData)
        ? props.updateModalData.vat_no
        : "",
      cr_number: helper.isObject(props.updateModalData)
        ? props.updateModalData.cr_number
        : "",

      admin_contact_person: obj.admin_contact_person,
      admin_contact_number: obj.admin_contact_number,
      admin_contact_email: obj.admin_contact_email,

      billing_contact_person: obj.billing_contact_person,
      billing_contact_number: obj.billing_contact_number,
      billing_contact_email: obj.billing_contact_email,

      operation_contact_person: obj.operation_contact_person,
      operation_contact_number: obj.operation_contact_number,
      operation_contact_email: obj.operation_contact_email,

      payment_terms: helper.isObject(props.updateModalData)
        ? {
            label: props.updateModalData.payment_terms + " " + "days",
            value: props.updateModalData.payment_terms,
          }
        : [],
      credit_terms: helper.isObject(props.updateModalData)
        ? {
            label: props.updateModalData.credit_terms + " " + "days",
            value: props.updateModalData.credit_terms,
          }
        : [],
      contract_no: helper.isObject(props.updateModalData)
        ? props.updateModalData.contract_no
        : "",
      contract_start_date: helper.isObject(props.updateModalData)
        ? props.updateModalData.contract_start_date
        : "",
      contract_end_date: helper.isObject(props.updateModalData)
        ? props.updateModalData.contract_end_date
        : "",

      // vw_deposited_amount: helper.isObject(props.updateModalData)
      //   ? props.updateModalData.vw_deposited_amount
      //   : "",
      cr_photo: "",
      vat_photo: "",

      admin_password: obj.admin_password,
      billing_password: obj.billing_password,
      operation_password: obj.operation_password,
      admin_id: obj.admin_id,
      bill_id: obj.bill_id,
      op_id: obj.op_id,
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

  useEffect(() => {
    // console.log("formmmmmmmmmmmm", form);
    if (
      form.billing_contact_email == "" &&
      form.billing_contact_number == "" &&
      form.billing_contact_person == "" &&
      form.billing_password == ""
    ) {
      setBill(false);
    } else {
      setBill(true);
    }
  }, [form]);
  useEffect(() => {
    if (
      form.operation_contact_email == "" &&
      form.operation_contact_number == "" &&
      form.operation_contact_person == "" &&
      form.operation_password == ""
    ) {
      setOp(false);
    } else {
      setOp(true);
    }
  }, [form]);

  return (
    <>
      <ZoomableImageModal
        isOpen={show}
        onHide={() => setShow(false)}
        imgUrl={
          helper.isObject(props.updateModalData)
            ? props.updateModalData.vat_file
            : ""
        }
        // isPdf={isPdf}
      />
      ;
      <Modal
        show={props.show}
        onHide={props.onHide}
        onShow={(e) => setUpdateFormValues()}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {props.updateModalData
              ? t("Update Gas Station Network")
              : t("Add Gas Station Network")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "500px", overflowY: "auto" }}>
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
            <Row>
              <Col>
                <p className="clientHeading">
                  {" "}
                  <span>{t("General Information")}</span>
                </p>
                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <UploadVat
                        onInputchange={(e, y) => onInputchange(e, y)}
                        vat_photo={
                          helper.isObject(props.updateModalData)
                            ? props.updateModalData.vat_file
                            : ""
                        }
                      />
                    </Col>

                    <Col>
                      <UploadCr
                        onInputchange={(e, y) => onInputchange(e, y)}
                        cr_photo={
                          helper.isObject(props.updateModalData)
                            ? props.updateModalData.cr_file
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
                        {t("Name English")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name_en"
                        value={form.name_en}
                        onChange={(e) =>
                          onInputchange(e.target.value, "name_en")
                        }
                        className="form-control"
                        placeholder={t("Name English")}
                      />
                      <p style={{ color: "red" }}>
                        {error.name_en ? error.name_en : ""}
                      </p>
                    </Col>
                    <Col>
                      <label>
                        {t("Name Arabic")}
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </label>
                      <input
                        type="text"
                        name="name_ar"
                        value={form.name_ar}
                        onChange={(e) =>
                          onInputchange(e.target.value, "name_ar")
                        }
                        className="form-control"
                        placeholder={t("Name Arabic")}
                      />
                      <p style={{ color: "red" }}>
                        {error.name_ar ? error.name_ar : ""}
                      </p>
                    </Col>
                  </Row>
                </div>

                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>
                        {t("Address")} <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={(e) =>
                          onInputchange(e.target.value, "address")
                        }
                        className="form-control"
                        placeholder={t("Address")}
                      />
                      <p style={{ color: "red" }}>
                        {error.address ? error.address : ""}
                      </p>
                    </Col>

                    <Col>
                      <label>
                        {t("Credit Terms")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>

                      <Select
                        name="credit_terms"
                        onChange={(e) => onInputchange(e, "credit_terms")}
                        options={terms}
                        value={form.credit_terms}
                        isClearable={true}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                      <p style={{ color: "red" }}>
                        {error.credit_terms ? error.credit_terms : ""}
                      </p>
                    </Col>
                  </Row>
                </div>

                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>
                        {t("Payment Terms")}
                        <span style={{ color: "red" }}>*</span>
                      </label>

                      <Select
                        name="payment_terms"
                        onChange={(e) => onInputchange(e, "payment_terms")}
                        options={terms}
                        value={form.payment_terms}
                        isClearable={true}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                      <p style={{ color: "red" }}>
                        {error.payment_terms ? error.payment_terms : ""}
                      </p>
                    </Col>
                    <Col>
                      <label>
                        {t("Vat Number")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="vat_no"
                        value={form.vat_no}
                        onChange={(e) =>
                          onInputchange(
                            helper.cleanInteger(e.target.value, "vat_no"),
                            "vat_no"
                          )
                        }
                        className="form-control"
                        placeholder={t("Vat Number")}
                      />
                      <p style={{ color: "red" }}>
                        {error.vat_no ? error.vat_no : ""}
                      </p>
                    </Col>
                  </Row>
                </div>

                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>
                        {t("CR Number")} <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="cr_number"
                        value={form.cr_number}
                        onChange={(e) =>
                          onInputchange(
                            helper.cleanInteger(e.target.value, "cr_number"),
                            "cr_number"
                          )
                        }
                        className="form-control"
                        placeholder={t("CR Number")}
                      />
                      <p style={{ color: "red" }}>
                        {error.cr_number ? error.cr_number : ""}
                      </p>
                    </Col>
                    <Col>
                      <label>
                        {t("Contract Number")}{" "}
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </label>
                      <input
                        type="text"
                        name="contract_no"
                        value={form.contract_no}
                        onChange={(e) =>
                          onInputchange(e.target.value, "contract_no")
                        }
                        className="form-control"
                        placeholder={t("Contract Number")}
                      />
                      <p style={{ color: "red" }}>
                        {error.contract_no ? error.contract_no : ""}
                      </p>
                    </Col>
                  </Row>
                </div>

                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>
                        {t("Contract Start Date")}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        name="contract_start_date"
                        value={form.contract_start_date || ""}
                        onChange={(e) =>
                          onInputchange(
                            e.target.value,

                            "contract_start_date"
                          )
                        }
                        // onChange={(e) => onInputchange(e.target.value, "vat_no")}
                        className="form-control"
                      />
                      <p style={{ color: "red" }}>
                        {error.contract_start_date
                          ? error.contract_start_date
                          : ""}
                      </p>
                    </Col>

                    <Col>
                      <label>
                        {t("Contract End Date")}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        name="contract_end_date"
                        value={form.contract_end_date || ""}
                        onChange={(e) =>
                          onInputchange(
                            e.target.value,

                            "contract_end_date"
                          )
                        }
                        // onChange={(e) => onInputchange(e.target.value, "vat_no")}
                        className="form-control"
                      />
                      <p style={{ color: "red" }}>
                        {error.contract_end_date ? error.contract_end_date : ""}
                      </p>
                    </Col>
                  </Row>
                </div>

                {/* <div className="form-group marginBottom-5px">
                <Row>
                  <Col sm={6}>
                    <label>
                      VW Deposited Amount{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="vw_deposited_amount"
                      value={form.vw_deposited_amount}
                      onChange={(e) =>
                        onInputchange(
                          helper.cleanDecimal(e.target.value),
                          "vw_deposited_amount"
                        )
                      }
                      className="form-control"
                      placeholder="Vehicle Wallet Deposited Amount"
                    />
                    <p style={{ color: "red" }}>
                      {error.vw_deposited_amount
                        ? error.vw_deposited_amount
                        : ""}
                    </p>
                  </Col>
                </Row>
              </div> */}
              </Col>
              <Col>
                {/* Manager */}

                <p className="clientHeading">
                  {" "}
                  <span>{t("Contact Information")}</span>
                </p>
                <div
                  style={{
                    // background: "pink",
                    padding: "5px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    border: "0.2px solid grey",
                  }}
                >
                  <div className="form-group marginBottom-5px">
                    <Row>
                      <Col>
                        <label>
                          {t("Manager Contact Person")}
                          <span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <input
                          type="text"
                          name="admin_contact_person"
                          value={form.admin_contact_person}
                          onChange={(e) =>
                            onInputchange(
                              e.target.value,
                              "admin_contact_person"
                            )
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
                          {t("Manager Contact Number")}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <InputGroup>
                          <InputGroup.Text id="basic-addon1">
                            966
                          </InputGroup.Text>
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
                    <Row>
                      <Col>
                        <label>
                          {t("Manager Contact Email")}
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
                          {error.admin_contact_email
                            ? error.admin_contact_email
                            : ""}
                        </p>
                      </Col>

                      <Col>
                        <label>
                          {t("Password")}{" "}
                          <span style={{ color: "red" }}>*</span>
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

                {/* Billing */}

                <div
                  style={{
                    // background: "pink",
                    padding: "5px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    border: "0.2px solid grey",
                  }}
                >
                  <div className="form-group marginBottom-5px">
                    <Row>
                      <Col>
                        <label>
                          {t("Billing Contact Person")}
                          <span style={{ color: "red" }}>
                            {bill ? "*" : ""}
                          </span>{" "}
                        </label>
                        <input
                          type="text"
                          name="billing_contact_person"
                          value={form.billing_contact_person}
                          onChange={(e) =>
                            onInputchange(
                              e.target.value,
                              "billing_contact_person"
                            )
                          }
                          className="form-control"
                          placeholder={t("Billing Contact Person")}
                        />
                        <p style={{ color: "red" }}>
                          {error.billing_contact_person
                            ? error.billing_contact_person
                            : ""}
                        </p>
                      </Col>

                      <Col>
                        <label>
                          {t("Billing Contact Number")}
                          <span style={{ color: "red" }}>
                            {bill ? "*" : ""}
                          </span>{" "}
                        </label>
                        <InputGroup>
                          <InputGroup.Text id="basic-addon1">
                            966
                          </InputGroup.Text>
                          <input
                            type="text"
                            name="billing_contact_number"
                            value={form.billing_contact_number || ""}
                            onChange={(e) =>
                              onInputchange(
                                helper.cleanInteger(e.target.value, "mobile"),
                                "billing_contact_number"
                              )
                            }
                            className="form-control"
                            placeholder={t("Billing Contact Number")}
                          />
                        </InputGroup>
                        <p style={{ color: "red" }}>
                          {error.billing_contact_number
                            ? error.billing_contact_number
                            : ""}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label>
                          {t("Billing Contact Email")}
                          <span style={{ color: "red" }}>
                            {bill ? "*" : ""}
                          </span>{" "}
                        </label>
                        <input
                          type="text"
                          name="billing_contact_email"
                          value={form.billing_contact_email}
                          onChange={(e) =>
                            onInputchange(
                              e.target.value,
                              "billing_contact_email"
                            )
                          }
                          className="form-control"
                          placeholder={t("Billing Contact Email")}
                        />
                        <p style={{ color: "red" }}>
                          {error.billing_contact_email
                            ? error.billing_contact_email
                            : ""}
                        </p>
                      </Col>

                      <Col>
                        <label>
                          {t("Password")}
                          <span style={{ color: "red" }}>
                            {bill ? "*" : ""}
                          </span>{" "}
                        </label>
                        <input
                          type="password"
                          name="billing_password"
                          value={form.billing_password || ""}
                          onChange={(e) =>
                            onInputchange(e.target.value, "billing_password")
                          }
                          className="form-control"
                          placeholder={t("Password")}
                        />
                        <p style={{ color: "red" }}>
                          {error.billing_password ? error.billing_password : ""}
                        </p>
                      </Col>
                    </Row>
                  </div>
                </div>

                {/* Operation */}

                <div
                  style={{
                    // background: "pink",
                    padding: "5px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    border: "0.2px solid grey",
                  }}
                >
                  <div className="form-group marginBottom-5px">
                    <Row>
                      <Col>
                        <label>
                          {t("Operation Contact Person")}
                          <span style={{ color: "red" }}>
                            {op ? "*" : ""}
                          </span>{" "}
                        </label>
                        <input
                          type="text"
                          name="operation_contact_person"
                          value={form.operation_contact_person}
                          onChange={(e) =>
                            onInputchange(
                              e.target.value,
                              "operation_contact_person"
                            )
                          }
                          className="form-control"
                          placeholder={t("Operation Contact Person")}
                        />
                        <p style={{ color: "red" }}>
                          {error.operation_contact_person
                            ? error.operation_contact_person
                            : ""}
                        </p>
                      </Col>

                      <Col>
                        <label>
                          {t("Operation Contact Number")}
                          <span style={{ color: "red" }}>
                            {op ? "*" : ""}
                          </span>{" "}
                        </label>
                        <InputGroup>
                          <InputGroup.Text id="basic-addon1">
                            966
                          </InputGroup.Text>
                          <input
                            type="text"
                            name="operation_contact_number"
                            value={form.operation_contact_number || ""}
                            onChange={(e) =>
                              onInputchange(
                                helper.cleanInteger(e.target.value, "mobile"),
                                "operation_contact_number"
                              )
                            }
                            className="form-control"
                            placeholder={t("Operation Contact Number")}
                          />
                        </InputGroup>
                        <p style={{ color: "red" }}>
                          {error.operation_contact_number
                            ? error.operation_contact_number
                            : ""}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label>
                          {t("Operation Contact Email")}
                          <span style={{ color: "red" }}>
                            {op ? "*" : ""}
                          </span>{" "}
                        </label>
                        <input
                          type="text"
                          name="operation_contact_email"
                          value={form.operation_contact_email}
                          onChange={(e) =>
                            onInputchange(
                              e.target.value,
                              "operation_contact_email"
                            )
                          }
                          className="form-control"
                          placeholder={t("Operation Contact Email")}
                        />
                        <p style={{ color: "red" }}>
                          {error.operation_contact_email
                            ? error.operation_contact_email
                            : ""}
                        </p>
                      </Col>

                      <Col>
                        <label>
                          {t("Password")}
                          <span style={{ color: "red" }}>
                            {op ? "*" : ""}
                          </span>{" "}
                        </label>
                        <input
                          type="password"
                          name="operation_password"
                          value={form.operation_password || ""}
                          onChange={(e) =>
                            onInputchange(e.target.value, "operation_password")
                          }
                          className="form-control"
                          placeholder={t("Password")}
                        />
                        <p style={{ color: "red" }}>
                          {error.operation_password
                            ? error.operation_password
                            : ""}
                        </p>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
              <Col>
                <p className="clientHeading">
                  <span>{t("Fuel Processing Fee")}</span>
                </p>
                <div
                  style={{
                    // background: "pink",
                    padding: "5px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    border: "0.2px solid grey",
                  }}
                >
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
                            <p>{t("Processing Fee")}</p>
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {comission && comission.length > 0
                          ? comission.map((item, index) => {
                              return (
                                <tr>
                                  <td>{item.fuelType}</td>
                                  <td>
                                    <input
                                      type="text"
                                      name="Comission"
                                      value={item.comission}
                                      onChange={(e) =>
                                        comission.filter((element) => {
                                          if (element.id === item.id) {
                                            let newData = comission;
                                            newData[index].comission =
                                              helper.cleanDecimal(
                                                e.target.value
                                              );

                                            setComission([...newData]);
                                            props.setComissionSubmit([
                                              ...newData,
                                            ]);
                                          }
                                        })
                                      }
                                      className="form-control"
                                      placeholder="Processing Fee"
                                    />
                                  </td>
                                </tr>
                              );
                            })
                          : ""}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => submit()}>
            <i className="fas fa-check"></i>{" "}
            {helper.isObject(props.updateModalData) ? t("Update") : t("Submit")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
