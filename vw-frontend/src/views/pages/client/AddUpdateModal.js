import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import UploadVat from "./uploadVat";
import UploadCr from "./uploadCr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { useTranslation } from "react-i18next";

export default function AddUpdateModal(props) {
  const [overlay, setoverlay] = useState(false);
  const [pricing, setPricing] = useState([]);
  const [pricingToSend, SetPricingToSend] = useState([]);

  const { t } = useTranslation();

  const [regFee, setRegFee] = useState([]);
  const [monthFee, setMonthFee] = useState([]);

  const [isNewData, setIsNewData] = useState("");

  const [form, setform] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    address: "",
    deposited_amount: "",
    reserved_amount: "",
    vat: "",
    cr_number: "",
    operation_contact_email: "",
    operation_contact_person: "",
    operation_contact_number: "",
    billing_contact_person: "",
    billing_contact_email: "",
    billing_contact_number: "",
    admin_contact_person: "",
    admin_contact_email: "",
    admin_contact_number: "",
    billing_period: "",
    virtual_bank_account: "",
    min_amount_notification: "",
    cr_photo: "",
    vat_photo: "",
    admin_password: "",
    billing_password: "",
    operation_password: "",
    client_source: "",
    contract_no: "",
    contract_start_date: "",
    contract_end_date: "",
  });

  const [check, setCheck] = useState([]);

  const [error, seterror] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    address: "",
    deposited_amount: "",
    reserved_amount: "",
    vat_no: "",
    cr_number: "",
    operation_contact_email: "",
    operation_contact_person: "",
    operation_contact_number: "",
    billing_contact_person: "",
    billing_contact_email: "",
    billing_contact_number: "",
    admin_contact_person: "",
    admin_contact_email: "",

    admin_contact_number: "",
    billing_period: "",
    virtual_bank_account: "",
    min_amount_notification: "",
    admin_password: "",
    billing_password: "",
    operation_password: "",
    client_source: "",
    contract_no: "",
    contract_start_date: "",
    contract_end_date: "",
  });

  const [bill, setBill] = useState(false);
  const [op, setOp] = useState(false);

  const onInputchange = (value, key) => {
    let formUpdate = { ...form };
    formUpdate[key] = value;
    setform(formUpdate);
  };

  const submit = () => {
    // setoverlay(true);
    props.setModalLoader(true);
    let errorCount = 0;
    let error = {};

    seterror({
      name_en: "",
      name_ar: "",
      name_ur: "",
      address: "",
      deposited_amount: "",
      reserved_amount: "",
      vat_no: "",
      cr_number: "",
      operation_contact_email: "",
      operation_contact_person: "",
      operation_contact_number: "",
      billing_contact_person: "",
      billing_contact_email: "",
      billing_contact_number: "",
      admin_contact_person: "",
      admin_contact_email: "",
      admin_contact_number: "",
      billing_period: "",
      virtual_bank_account: "",
      min_amount_notification: "",
      admin_password: "",
      billing_password: "",
      operation_password: "",
      contract_no: "",
      contract_start_date: "",
      contract_end_date: "",
    });

    if (helper.isEmptyString(form.name_en)) {
      error.name_en = "Name english is required";
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
      error.contract_start_date = "Date is required";
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
    if (helper.isEmptyString(form.contract_no)) {
      error.contract_no = "Contract Number is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.vat_no)) {
      error.vat_no = "Vat amount is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.cr_number)) {
      error.cr_number = "CR number is required";
      errorCount++;
      setoverlay(false);
    }
    if (helper.isEmptyString(form.admin_contact_person)) {
      error.admin_contact_person = "Contact person is required";
      errorCount++;
      setoverlay(false);
    }
    // if (helper.isEmptyString(form.operation_contact_person)) {
    //   error.operation_contact_person = "Contact person is required";
    //   errorCount++;
    //   setoverlay(false);
    // }
    // if (helper.isEmptyString(form.billing_contact_person)) {
    //   error.billing_contact_person = "Contact person is required";
    //   errorCount++;
    //   setoverlay(false);
    // }
    if (helper.isEmptyString(form.admin_contact_number)) {
      error.admin_contact_number = "Number is required";
      errorCount++;
      setoverlay(false);
    }
    // if (helper.isEmptyString(form.operation_contact_number)) {
    //   error.operation_contact_number = "Number is required";
    //   errorCount++;
    //   setoverlay(false);
    // }
    // if (helper.isEmptyString(form.billing_contact_number)) {
    //   error.billing_contact_number = "Number is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    if (helper.isEmptyString(form.billing_period)) {
      error.billing_period = "Billing period is required";
      errorCount++;
      setoverlay(false);
    }

    // if (helper.isEmptyString(form.virtual_bank_account)) {
    //   error.virtual_bank_account = "Virtual bank account is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    // if (helper.isEmptyString(form.min_amount_notification)) {
    //   error.min_amount_notification = "Min amount notification is required";
    //   errorCount++;
    //   setoverlay(false);
    // }
    // if (
    //   helper.isEmptyString(form.operation_contact_email) &&
    //   !helper.isEmail(form.operation_contact_email)
    // ) {
    //   error.operation_contact_email = "Valid email is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    if (
      helper.isEmptyString(form.admin_contact_email) &&
      !helper.isEmail(form.admin_contact_email)
    ) {
      error.admin_contact_email = "Valid email is required";
      errorCount++;
      setoverlay(false);
    }
    if (!props.updateModalData) {
      if (helper.isEmptyString(form.admin_password)) {
        error.admin_password = "Password is required";
        errorCount++;
        setoverlay(false);
      }
      // if (helper.isEmptyString(form.billing_password)) {
      //   error.billing_password = "Password is required";
      //   errorCount++;
      //   setoverlay(false);
      // }
      // if (helper.isEmptyString(form.operation_password)) {
      //   error.operation_password = "Password is required";
      //   errorCount++;
      //   setoverlay(false);
      // }
    }

    // if (
    //   helper.isEmptyString(form.billing_contact_email) &&
    //   !helper.isEmail(form.billing_contact_email)
    // ) {
    //   error.billing_contact_email = "Valid email is required";
    //   errorCount++;
    //   setoverlay(false);
    // }
    // if (
    //   form.billing_contact_number.charAt(0) != 5 &&
    //   !helper.isEmptyString(form.billing_contact_number)
    // ) {
    //   error.billing_contact_number = "Number should start with 5";
    //   errorCount++;
    //   setoverlay(false);
    // }
    if (
      form.admin_contact_number.charAt(0) != 5 &&
      !helper.isEmptyString(form.admin_contact_number)
    ) {
      error.admin_contact_number = "Number should start with 5";
      errorCount++;
      setoverlay(false);
    }
    // if (
    //   form.operation_contact_number.charAt(0) != 5 &&
    //   !helper.isEmptyString(form.operation_contact_number)
    // ) {
    //   error.operation_contact_number = "Number should start with 5";
    //   errorCount++;
    //   setoverlay(false);
    // }

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
    if (
      form.admin_contact_email != "" &&
      form.operation_contact_email != "" &&
      form.billing_contact_email != ""
    ) {
      if (
        form.admin_contact_email == form.operation_contact_email ||
        form.admin_contact_email == form.billing_contact_email ||
        form.operation_contact_email == form.admin_contact_email ||
        form.operation_contact_email == form.billing_contact_email ||
        form.billing_contact_email == form.admin_contact_email ||
        form.billing_contact_email == form.operation_contact_email
      ) {
        helper.toastNotification(
          "Email addresses cannot be same!",
          "FAILED_MESSAGE"
        );
        errorCount++;
        setoverlay(false);
      }
    }
    if (
      form.admin_contact_number != "" &&
      form.operation_contact_number != "" &&
      form.billing_contact_number != ""
    ) {
      if (
        form.admin_contact_number == form.operation_contact_number ||
        form.admin_contact_number == form.billing_contact_number ||
        form.operation_contact_number == form.admin_contact_number ||
        form.operation_contact_number == form.billing_contact_number ||
        form.billing_contact_number == form.admin_contact_number ||
        form.billing_contact_number == form.operation_contact_number
      ) {
        helper.toastNotification(
          "Contact Numbers cannot be same!",
          "FAILED_MESSAGE"
        );
        errorCount++;
        setoverlay(false);
      }
    }

    if (errorCount > 0) {
      seterror(error);
      setoverlay(false);
      props.setModalLoader(false);
    } else {
      // setoverlay(false);
      // {
      //   props.updateModalData
      //     ? props.setNewPricing(pricingToSend)
      //     : props.setNewPricing(pricing);
      // }
      props.setNewPricing(pricing);
      props.setNewData(isNewData);
      props.submitAction(form);
    }
  };

  const getPricing = () => {
    // setoverlay(true);
    props.setModalLoader(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client-pricing`, {
        client: {
          client_id: props.updateModalData.client_id,
          api_type: "update",
        },
      })
      .then((res) => {
        console.log("data----------", res.data.data);
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status == 200) {
          if (res.data.data) {
            adjustPrice(helper.applyCountID(res.data.data), props.pricing);
            setIsNewData("");
          } else {
            adjustPrice(props.pricing, props.pricing);
            setIsNewData("new");
          }

          // setoverlay(false);
          props.setModalLoader(false);
        } else {
          setPricing([]);
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          // setPricing([]);
          // setoverlay(false);
          props.setModalLoader(false);
        }
      })
      .catch((error) => {
        setPricing([]);
        console.log(error, "error");
        props.setModalLoader(false);
        // setoverlay(false);
      });
  };

  const adjustPrice = (price, pprice) => {
    console.log("prices", price);
    let arr = [];
    price.forEach((element) => {
      let obj = {
        id: element.id ? element.id : "",
        // label: helper.isObject(element.vehicle_type)
        //   ? element.vehicle_type.name_en
        //   : element.label,
        label: element.label ? element.label : element.name_en,
        vehicle_type_id: element.vehicle_type_id
          ? element.vehicle_type_id
          : element.value,
        registration_fee: element.registration_fee
          ? element.registration_fee
          : element.base_registration_fee,
        monthly_sub_fee: element.monthly_sub_fee
          ? element.monthly_sub_fee
          : element.monthly_subs_fee
          ? element.monthly_subs_fee
          : element.base_monthly_sub_fee,
      };
      if (!props.updateModalData) {
        obj.count_id = element.count_id;
      }
      arr.push(obj);
    });
    console.log("arrrrrrrrrrprices", arr);
    setPricing(arr);
  };

  // const onValChange = (value, item, index) => {
  //   let arr = adjust;
  //   arr[index].registration_fee = value;
  //   console.log("arrrr", arr);
  //   setAdjust(arr);
  //   console.log("adjust", arr);
  // };
  // const onValChange1 = (value, item, index) => {
  //   let arr = adjust;
  //   arr[index].monthly_sub_fee = value;
  //   setAdjust(arr);
  // };

  const setUpdateFormValues = () => {
    setoverlay(false);
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

    console.log("props pricing update", props);

    {
      props.updateModalData
        ? getPricing()
        : adjustPrice(props.pricing, props.pricing);
    }

    if (helper.isObject(props.updateModalData)) {
      if (
        props.updateModalData.users &&
        props.updateModalData.users.length > 0
      ) {
        let user = props.updateModalData.users;
        user.forEach((item) => {
          if (item.designation == "client_manager") {
            obj.admin_contact_person = item.first_name;
            obj.admin_contact_number = item.mobile;
            obj.admin_contact_email = item.email;
            obj.admin_password = "";
            obj.admin_id = item.user_id;
          } else if (item.designation == "client_billing") {
            obj.billing_contact_person = item.first_name;
            obj.billing_contact_number = item.mobile;
            obj.billing_contact_email = item.email;
            obj.billing_password = "";
            obj.bill_id = item.user_id;
          } else if (item.designation == "client_operation") {
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
      client_source: helper.isObject(props.updateModalData)
        ? props.updateModalData.client_source
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

      cr_number: helper.isObject(props.updateModalData)
        ? props.updateModalData.cr_number
        : "",

      billing_period: helper.isObject(props.updateModalData)
        ? props.updateModalData.billing_period
        : "",
      virtual_bank_account: helper.isObject(props.updateModalData)
        ? props.updateModalData.virtual_bank_account
        : "",
      min_amount_notification: helper.isObject(props.updateModalData)
        ? props.updateModalData.min_amount_notification
        : "",
      cr_photo: "",
      vat_photo: "",
      registration_fee: helper.isObject(props.updateModalData)
        ? props.updateModalData.registration_fee
        : "",
      monthly_subs_fee: helper.isObject(props.updateModalData)
        ? props.updateModalData.monthly_subs_fee
        : "",
      contract_no: helper.isObject(props.updateModalData)
        ? props.updateModalData.contract_no
        : "",
      contract_start_date: helper.isObject(props.updateModalData)
        ? props.updateModalData.contract_start_date
        : "",
      contract_end_date: helper.isObject(props.updateModalData)
        ? props.updateModalData.contract_end_date
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
      credit: "",
      current_credit: "",
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
    <Modal
      show={props.show}
      onHide={props.onHide}
      onShow={(e) => setUpdateFormValues()}
      centered
      size="xl"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center">
          {props.updateModalData ? t("Update Client") : t("Add Client")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "530px", overflowY: "auto" }}>
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
            // loading={props.updateModalData ? overlay : props.modalLoader}
            loading={props.modalLoader ? true : false}
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
                      {t("Name Arabic")}
                      {/* <span style={{ color: "red" }}>*</span> */}
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
              </div>

              <div className="form-group marginBottom-5px">
                <Row>
                  <Col>
                    <label>
                      {t("Billing Period")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="billing_period"
                      value={form.billing_period || ""}
                      onChange={(e) =>
                        onInputchange(e.target.value, "billing_period")
                      }
                      className="form-control"
                      placeholder={t("Billing Period")}
                    />
                    <p style={{ color: "red" }}>
                      {error.billing_period ? error.billing_period : ""}
                    </p>
                    {/* <label>
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
                    </p> */}
                  </Col>
                  <Col>
                    <label>
                      {t("Address")} <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address || ""}
                      onChange={(e) => onInputchange(e.target.value, "address")}
                      className="form-control"
                      placeholder={t("Address")}
                    />
                    <p style={{ color: "red" }}>
                      {error.address ? error.address : ""}
                    </p>
                  </Col>
                </Row>
              </div>

              <div className="form-group marginBottom-5px">
                <Row>
                  <Col>
                    <label>
                      {t("Virtual Bank Account")}
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </label>
                    <input
                      type="text"
                      name="virtual_bank_account"
                      maxLength={24}
                      value={form.virtual_bank_account || ""}
                      onChange={(e) =>
                        onInputchange(
                          e.target.value,

                          "virtual_bank_account"
                        )
                      }
                      className="form-control"
                      placeholder={t("Virtual Bank Account")}
                    />
                    <p style={{ color: "red" }}>
                      {error.virtual_bank_account
                        ? error.virtual_bank_account
                        : ""}
                    </p>
                  </Col>

                  <Col>
                    <label>
                      {t("Min Amount Notification")}
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </label>
                    <input
                      type="text"
                      name="min_amount_notification"
                      value={form.min_amount_notification || ""}
                      onChange={(e) =>
                        onInputchange(e.target.value, "min_amount_notification")
                      }
                      className="form-control"
                      placeholder={t("Min Amount Notification")}
                    />
                    <p style={{ color: "red" }}>
                      {error.min_amount_notification
                        ? error.min_amount_notification
                        : ""}
                    </p>
                  </Col>
                </Row>
              </div>

              <div className="form-group marginBottom-5px">
                <Row>
                  <Col>
                    <label>
                      {t("Vat Number")} <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="vat"
                      value={form.vat_no || ""}
                      onChange={(e) =>
                        onInputchange(
                          helper.cleanInteger(
                            e.target.value,
                            "driving_license_number"
                          ),
                          "vat_no"
                        )
                      }
                      // onChange={(e) => onInputchange(e.target.value, "vat_no")}
                      className="form-control"
                      placeholder={t("Vat Number")}
                    />
                    <p style={{ color: "red" }}>
                      {error.vat_no ? error.vat_no : ""}
                    </p>
                  </Col>

                  <Col>
                    <label>
                      {t("CR Number")} <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="cr_number"
                      value={form.cr_number || ""}
                      onChange={(e) =>
                        onInputchange(
                          helper.cleanInteger(
                            e.target.value,
                            "driving_license_number"
                          ),
                          "cr_number"
                        )
                      }
                      // onChange={(e) =>
                      //   onInputchange(e.target.value, "cr_number")
                      // }
                      className="form-control"
                      placeholder={t("CR Number")}
                    />
                    <p style={{ color: "red" }}>
                      {error.cr_number ? error.cr_number : ""}
                    </p>
                  </Col>
                </Row>
              </div>
              <div className="form-group marginBottom-5px">
                <Row>
                  <Col>
                    <label>
                      {t("Client Source")}
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </label>
                    <input
                      type="text"
                      name="client_source"
                      value={form.client_source || ""}
                      onChange={(e) =>
                        onInputchange(
                          e.target.value,

                          "client_source"
                        )
                      }
                      // onChange={(e) => onInputchange(e.target.value, "vat_no")}
                      className="form-control"
                      placeholder={t("Client Source")}
                    />
                    <p style={{ color: "red" }}>
                      {error.client_source ? error.client_source : ""}
                    </p>
                  </Col>

                  <Col>
                    <label>
                      {t("Contract Number")}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="contract_no"
                      value={form.contract_no || ""}
                      onChange={(e) =>
                        onInputchange(
                          e.target.value,

                          "contract_no"
                        )
                      }
                      // onChange={(e) => onInputchange(e.target.value, "vat_no")}
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
            </Col>
            <Col>
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
                      <label>{t("Admin Contact Person")} </label>
                      <span style={{ color: "red" }}>*</span>
                      <input
                        type="text"
                        name="admin_contact_person"
                        value={form.admin_contact_person || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "admin_contact_person")
                        }
                        className="form-control"
                        placeholder={t("Admin Contact Person")}
                      />
                      <p style={{ color: "red" }}>
                        {error.admin_contact_person
                          ? error.admin_contact_person
                          : ""}
                      </p>
                    </Col>

                    <Col>
                      <label>{t("Admin Contact Number")} </label>
                      <span style={{ color: "red" }}>*</span>
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
                          placeholder={t("Admin Contact Number")}
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
                      <label>{t("Admin Contact Email")} </label>
                      <span style={{ color: "red" }}>*</span>
                      <input
                        type="text"
                        readOnly={props.updateModalData ? "readonly" : ""}
                        name="admin_contact_email"
                        value={form.admin_contact_email || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "admin_contact_email")
                        }
                        className="form-control"
                        placeholder={t("Admin Contact Email")}
                      />
                      <p style={{ color: "red" }}>
                        {error.admin_contact_email
                          ? error.admin_contact_email
                          : ""}
                      </p>
                    </Col>

                    <Col>
                      <label>{t("Password")} </label>
                      <span style={{ color: "red" }}>*</span>
                      <input
                        type="password"
                        name="admin_conatct_password"
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
              {/* Operations */}
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
                      <label>{t("Operation Contact Person")} </label>
                      <span style={{ color: "red" }}>{op ? "*" : ""}</span>{" "}
                      <input
                        type="text"
                        name="operation_contact_person"
                        value={form.operation_contact_person || ""}
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
                      <label>{t("Operation Contact Number")} </label>
                      <span style={{ color: "red" }}>{op ? "*" : ""}</span>{" "}
                      <InputGroup>
                        <InputGroup.Text id="basic-addon1">966</InputGroup.Text>
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
                </div>

                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>{t("Operation Contact Email")} </label>
                      <span style={{ color: "red" }}>{op ? "*" : ""}</span>{" "}
                      <input
                        type="text"
                        // readOnly={props.updateModalData ? "readonly" : ""}
                        name="operation_contact_email"
                        value={form.operation_contact_email || ""}
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
                      <label>{t("Password")} </label>
                      <span style={{ color: "red" }}>{op ? "*" : ""}</span>{" "}
                      <input
                        type="password"
                        name="operation_contact_password"
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
              {/* Billing */}
              <div
                style={{
                  padding: "5px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  border: "0.2px solid grey",
                }}
              >
                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>{t("Billing Contact Person")} </label>
                      <span style={{ color: "red" }}> {bill ? "*" : ""}</span>
                      <input
                        type="text"
                        name="billing_contact_person"
                        value={form.billing_contact_person || ""}
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
                      <label>{t("Billing Contact Number")} </label>
                      <span style={{ color: "red" }}> {bill ? "*" : ""}</span>
                      <InputGroup>
                        <InputGroup.Text id="basic-addon1">966</InputGroup.Text>
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
                </div>

                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>{t("Billing Contact Email")} </label>
                      <span style={{ color: "red" }}> {bill ? "*" : ""}</span>
                      <input
                        type="text"
                        // readOnly={props.updateModalData ? "readonly" : ""}
                        name="billing_contact_email"
                        value={form.billing_contact_email || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "billing_contact_email")
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
                      <label>{t("Password")} </label>
                      <span style={{ color: "red" }}> {bill ? "*" : ""}</span>
                      <input
                        type="password"
                        name="billing_contact_password"
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
            </Col>
            <Col>
              <p className="clientHeading">
                {" "}
                <span>{t("Pricing")}</span>
              </p>
              <div className="table-responsive" style={{ maxHeight: "420px" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th
                        className="table-th blackColor"
                        style={{ width: "120px" }}
                      >
                        <p>{t("Vehicle Type")}</p>
                      </th>
                      <th
                        className="table-th blackColor"
                        style={{ width: "120px" }}
                      >
                        <p>{t("Registration Fee")}</p>
                      </th>
                      <th
                        className="table-th blackColor"
                        style={{ width: "120px" }}
                      >
                        <p>{t("Monthly Subscription")}</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricing.length > 0 && pricing
                      ? pricing.map((item, index) => {
                          // console.log("item", item);
                          return (
                            <tr
                              className={
                                helper.applyRowClass(item, "id") === true
                                  ? `evenRowColor`
                                  : "oddRowColor"
                              }
                            >
                              <td>{item.label}</td>
                              <td>
                                <input
                                  type="text"
                                  name="registration_fee"
                                  value={item.registration_fee}
                                  onChange={(e) => {
                                    pricing.filter((element) => {
                                      if (element.count_id === item.count_id) {
                                        let newData = pricing;
                                        newData[index].registration_fee =
                                          helper.cleanDecimal(e.target.value);

                                        setPricing([...newData]);
                                      }
                                    });
                                  }}
                                  className="form-control"
                                  placeholder="Registration Fee"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  name="monthly_subs_fee"
                                  value={item.monthly_sub_fee}
                                  onChange={(e) =>
                                    pricing.filter((element) => {
                                      if (element.count_id === item.count_id) {
                                        let newData = pricing;
                                        newData[index].monthly_sub_fee =
                                          helper.cleanDecimal(e.target.value);
                                        setPricing([...newData]);
                                      }
                                    })
                                  }
                                  className="form-control"
                                  placeholder="Monthly Subscription"
                                  // style={{ width: "10px" }}
                                />
                              </td>
                            </tr>
                          );
                        })
                      : ""}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
          <Row></Row>
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
