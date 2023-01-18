import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import { Card, CardHeader, CardBody, CardTitle, Collapse } from "reactstrap";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";
import Select from "react-select";
import { useTranslation } from "react-i18next";

import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import Upload from "../amount-topup/upload";

function PaymentSections(props) {
  const [overlay, setoverlay] = useState(false);
  const [option, setOptions] = useState([]);
  const [st, setSt] = useState({});
  const { t } = useTranslation();
  const [form, setform] = useState({
    transaction_reference: "",
    amount: "",
    photo: "",
  });
  const [form1, setform1] = useState({
    transaction_reference: "",
    amount: "",
    photo: "",
    franchise: "",
  });

  const [file, setFile] = useState();
  const [file1, setFile1] = useState();

  useEffect(() => {
    // console.log("props", props.stations);
    if (props.stations.length > 0) {
      let arr = [];
      props.stations.forEach((item) => {
        arr.push({
          label: `${item.name_en}  ${item.deposited_amount}`,
          value: item.gas_station_id,
        });
      });
      setOptions(arr);
    }
  }, [props.stations]);

  const [avatar, setAvatar] = useState(
    !helper.isEmptyString(form.photo)
      ? form.photo
      : require("@src/assets/images/portrait/small/payment.png").default
  );
  const [avatar1, setAvatar1] = useState(
    !helper.isEmptyString(form.photo)
      ? form.photo
      : require("@src/assets/images/portrait/small/payment.png").default
  );

  const onChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    // console.log("fileeeeeeeeeeeeee", files);
    setFile(files[0]);
    // console.log("formdataaaaaaaaaaaa", [...formData.entries()]);
    // setformd(formData);

    if (files[0].size > 800000) {
      helper.toastNotification(
        "Image size sould be less than 800kb",
        "FAILED_MESSAGE"
      );
    } else {
      reader.onload = function () {
        setAvatar(reader.result);
        onInputchange(reader.result, "photo");
      };
      reader.readAsDataURL(files[0]);
    }
  };
  const onChange1 = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    setFile1(files[0]);
    if (files[0].size > 800000) {
      helper.toastNotification(
        "Image size sould be less than 800kb",
        "FAILED_MESSAGE"
      );
    } else {
      reader.onload = function () {
        setAvatar1(reader.result);

        onInputchange1(reader.result, "photo");
      };
      reader.readAsDataURL(files[0]);
    }
  };
  const onReset = () => {
    return new Promise((res, rej) => {
      setAvatar(
        require("@src/assets/images/portrait/small/payment.png").default
      );
      onInputchange("", "photo");
      res();
    });
  };
  const onReset1 = () => {
    return new Promise((res, rej) => {
      setAvatar1(
        require("@src/assets/images/portrait/small/payment.png").default
      );
      onInputchange1("", "photo");
      res();
    });
  };

  const [error, seterror] = useState({
    transaction_reference: "",
    amount: "",
  });
  const [error1, seterror1] = useState({
    transaction_reference: "",
    amount: "",
    franchise: "",
  });

  const onInputchange = (value, key) => {
    let formUpdate = { ...form };
    formUpdate[key] = value;
    setform(formUpdate);
  };
  const onInputchange1 = (value, key) => {
    let formUpdate = { ...form1 };
    formUpdate[key] = value;
    setform1(formUpdate);
  };

  const submitFranchise = () => {
    if (props.disableBtn) {
      return false;
    }

    let errorCount = 0;
    let error1 = {};

    seterror1({
      transaction_reference: "",
      amount: "",
      franchise: "",
    });

    // if (helper.isEmptyString(form1.photo)) {
    //   error1.photo = "Transaction file is required";
    //   errorCount++;
    // }

    if (helper.isEmptyString(form1.amount)) {
      error1.amount = "Amount is required";
      errorCount++;
    }
    if (helper.isEmptyString(form1.franchise)) {
      error1.franchise = "Select a franchise";
      errorCount++;
    }

    if (errorCount > 0) {
      seterror1(error1);
    } else {
      //console.log(form, "form");

      createFranchise(form1);
    }
  };

  const submit = () => {
    if (props.disableBtn) {
      return false;
    }

    let errorCount = 0;
    let error = {};

    seterror({
      transaction_reference: "",
      amount: "",
    });

    // if (helper.isEmptyString(form.photo)) {
    //   error.photo = "Transaction file is required";
    //   errorCount++;
    // }

    // if (helper.isEmptyString(form.transaction_reference)) {
    //   error.transaction_reference = "Transaction reference is required";
    //   errorCount++;
    // }

    if (helper.isEmptyString(form.amount)) {
      error.amount = "Amount is required";
      errorCount++;
    }

    if (errorCount > 0) {
      seterror(error);
    } else {
      //console.log(form, "form");

      create(form);
    }
  };

  const getObj = (args) => {
    if (args.photo == "") {
      return {
        amount: args.amount,
        gas_station_id: st.value,
      };
    } else {
      return {
        transaction_file_upload: args.photo,
        amount: args.amount,
        gas_station_id: st.value,
      };
    }
  };
  const getObj1 = (args) => {
    if (args.photo == "") {
      return {
        amount: args.amount,
        gas_station_network_id: helper.getIDfromUrl(window.location.href),
      };
    } else {
      return {
        transaction_file_upload: args.photo,
        amount: args.amount,
        gas_station_network_id: helper.getIDfromUrl(window.location.href),
      };
    }
  };

  const createFranchise = async (args) => {
    let formData = new FormData();
    formData.append("transaction_file_upload", file1);
    formData.append("amount", args.amount);
    formData.append("gas_station_id", st.value);
    setoverlay(true);
    // axios
    //   .post(
    //     `${jwtDefaultConfig.adminBaseUrl}/gas-station-payment-transaction`,

    //     {
    //       vw_payment_transaction: getObj(args),
    //     }
    //   )
    await axios({
      method: "post",
      url: `${jwtDefaultConfig.adminBaseUrl}/gas-station-payment-transaction`,
      data: formData,
      // headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(async (res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setoverlay(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );

          onReset1().then(() => {
            setform1({
              transaction_reference: "",
              amount: "",
              photo: "",
              franchise: "",
            });
          });
          props.getData();
        } else {
          setoverlay(false);
        }
      })
      .catch((error) => {
        setoverlay(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
        console.log(error, "errorrrr");
      });
  };
  const create = async (args) => {
    let formData = new FormData();
    if (file) {
      formData.append("transaction_file_upload", file ? file : "");
    }
    formData.append("amount", args.amount);
    formData.append(
      "gas_station_network_id",
      helper.getIDfromUrl(window.location.href)
    );

    setoverlay(true);
    // axios.post(`${jwtDefaultConfig.adminBaseUrl}/network-payment-transaction`, {
    //   vw_payment_transaction: [...formData],
    //   // vw_payment_transaction: getObj1(args),
    // });
    await axios({
      method: "post",
      url: `${jwtDefaultConfig.adminBaseUrl}/network-payment-transaction`,
      data: formData,
      // headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(async (res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setoverlay(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );

          onReset().then(() => {
            setform({
              amount: "",
            });
          });
          props.getData();
        } else {
          setoverlay(false);
        }
      })
      .catch((error) => {
        setoverlay(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
        console.log(error, "errorrrr");
      });
  };

  return (
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
      <div className="row">
        <div className="col-xs-12 col-sm-6 col-md-6">
          <Card className="card-snippet">
            <CardHeader>
              <CardTitle
                tag="h4"
                style={{ fontSize: "1.4em", fontWeight: "bold" }}
              >
                {t("Gas Station Network Payment")}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label style={{ marginBottom: "5px" }}>
                        {t("Transaction File")}
                      </label>
                      <Upload
                        onReset={(e) => onReset}
                        avatar={avatar}
                        onChange={(e) => onChange(e)}
                        setAvatar={(e) => setAvatar(e)}
                        onInputchange={(e, y) => onInputchange(e, y)}
                        photo={form.photo}
                      />
                      <p style={{ color: "red" }}>
                        {error.photo ? error.photo : ""}
                      </p>
                    </Col>
                  </Row>
                </div>
                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col className="col-4">
                      <label style={{ marginBottom: "5px" }}>
                        {t("Amount")} <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="amount"
                        value={form.amount || ""}
                        onChange={(e) =>
                          onInputchange(
                            helper.cleanDecimal(e.target.value, "amount"),
                            "amount"
                          )
                        }
                        className="form-control"
                        placeholder={t("Amount")}
                      />
                      <p style={{ color: "red" }}>
                        {error.amount ? error.amount : ""}
                      </p>
                    </Col>
                  </Row>
                </div>

                <div
                  className="form-group marginBottom-5px"
                  style={{ marginTop: "10px" }}
                >
                  <Button onClick={(e) => submit()}>
                    <i className="fas fa-check"></i> {t("Submit")}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-6">
          <Card className="card-snippet">
            <CardHeader>
              <CardTitle
                tag="h4"
                style={{ fontSize: "1.4em", fontWeight: "bold" }}
              >
                {t("Gas Station Network Franchise Payment")}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div>
                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label style={{ marginBottom: "5px" }}>
                        {t("Transaction File")}
                      </label>
                      <Upload
                        onReset={(e) => onReset1}
                        avatar={avatar1}
                        onChange={(e) => onChange1(e)}
                        setAvatar={(e) => setAvatar1(e)}
                        onInputchange={(e, y) => onInputchange1(e, y)}
                        photo={form1.photo}
                      />
                      <p style={{ color: "red" }}>
                        {error1.photo ? error1.photo : ""}
                      </p>
                    </Col>
                  </Row>
                </div>
                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col className="col-4">
                      <label style={{ marginBottom: "5px" }}>
                        {"Select Franchise"}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        name="credit_terms"
                        onChange={(e) => {
                          console.log("e.target", e.value);
                          onInputchange1(e.value, "franchise");
                          setSt(e);
                        }}
                        options={option}
                        // value={props.stations.name_en}
                        isClearable={true}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                      <p style={{ color: "red" }}>
                        {error1.franchise ? error1.franchise : ""}
                      </p>
                    </Col>
                    <Col className="col-4">
                      <label style={{ marginBottom: "5px" }}>
                        {t("Amount")} <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="amount"
                        value={form1.amount || ""}
                        onChange={(e) =>
                          onInputchange1(
                            helper.cleanDecimal(e.target.value, "amount"),
                            "amount"
                          )
                        }
                        className="form-control"
                        placeholder={t("Amount")}
                      />
                      <p style={{ color: "red" }}>
                        {error1.amount ? error1.amount : ""}
                      </p>
                    </Col>
                  </Row>
                </div>

                <div
                  className="form-group marginBottom-5px"
                  style={{ marginTop: "10px" }}
                >
                  <Button onClick={(e) => submitFranchise()}>
                    <i className="fas fa-check"></i> {t("Submit")}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PaymentSections;
