import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import { Card, CardHeader, CardBody, CardTitle, Collapse } from "reactstrap";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";
import UploadPhoto from "./upload";
import { getUserData } from "@utils";

import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";

export default function AmountTopup(props) {
  const [overlay, setoverlay] = useState(false);
  const [form, setform] = useState({
    transaction_reference: "",
    amount: "",
    photo: "",
  });
  const [avatar, setAvatar] = useState(
    !helper.isEmptyString(form.photo)
      ? form.photo
      : require("@src/assets/images/portrait/small/payment.png").default
  );

  const [file, setFile] = useState();

  const onChange = (e) => {
    // console.log("on change");
    const reader = new FileReader(),
      files = e.target.files;
    setFile(files[0]);
    if (files[0].size > 800000) {
      helper.toastNotification(
        "Image size sould be less than 800kb",
        "FAILED_MESSAGE"
      );
    } else {
      console.log(files, "filiessssssssssss");
      reader.onload = function () {
        setAvatar(reader.result);

        onInputchange(reader.result, "photo");
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

  const [error, seterror] = useState({
    transaction_reference: "",
    amount: "",
  });

  const onInputchange = (value, key) => {
    let formUpdate = { ...form };
    formUpdate[key] = value;
    setform(formUpdate);
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

    if (helper.isEmptyString(form.photo)) {
      error.photo = "Transaction file is required";
      errorCount++;
    }

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

  const create = async (args) => {
    // console.log("propppppppppppps", props.location.state);
    // return;

    let formData = new FormData();

    formData.append("transaction_file_upload", file ? file : "");
    formData.append("amount", args.amount);
    formData.append(
      "client_id",
      props.location.state ? props.location.state.id : getUserData().client_id
    );
    if (window.location.href.indexOf("/admin/") > -1) {
      formData.append("from", "admin");
    } else {
      formData.append("from", "client");
    }

    setoverlay(true);
    // axios
    //   .post(`${jwtDefaultConfig.adminBaseUrl}/topup-transaction/store`, {
    //     topup_transaction: {
    //       transaction_file_upload: args.photo,
    //       amount: args.amount,
    //     },
    //   })
    await axios({
      method: "post",
      url: `${jwtDefaultConfig.adminBaseUrl}/topup-transaction/store`,
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

          console.log(res.data.data, "toop");
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
      <Card className="card-snippet">
        <CardHeader>
          <CardTitle tag="h4">
            {props.title ? props.title : "Topup Amount"}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div>
            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label style={{ marginBottom: "5px" }}>
                    Transaction File <span style={{ color: "red" }}>*</span>
                  </label>
                  <UploadPhoto
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
                <Col className="col-6">
                  <label style={{ marginBottom: "5px" }}>
                    Amount <span style={{ color: "red" }}>*</span>
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
                    placeholder="Amount"
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
                <i className="fas fa-check"></i> Submit
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
