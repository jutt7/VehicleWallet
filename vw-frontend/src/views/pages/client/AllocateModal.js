import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { update } from "idb-keyval";

function AllocateModal(props) {
  const [form, setForm] = useState({
    current_balance: "",
  });
  const [error, seterror] = useState({
    current_balance: "",
  });
  const onInputchange = (value) => {
    let updateForm = { ...form };
    updateForm["current_balance"] = value;
    setForm(updateForm);
  };

  const submit = () => {
    // console.log("main balance", props.data.main_balance);
    // props.setModalLoader(true);
    let errorCount = 0;
    let error = {};

    seterror({
      current_balance: "",
    });
    if (props.data.main_balance == null) {
      {
        helper.toastNotification(
          "Main balance not available",
          "FAILED_MESSAGE"
        );
      }
    }
    if (helper.isEmptyString(form.current_balance)) {
      error.current_balance = "Enter Balance";
      errorCount++;
    }
    if (form.current_balance < 0) {
      error.current_balance = "Balance should be greater than 0";
      errorCount++;
    }
    if (
      helper.isObject(props.data) &&
      parseFloat(props.data.main_balance) < parseFloat(form.current_balance)
    ) {
      helper.toastNotification(
        "Allocated balance cannot be greater than main balance",
        "FAILED_MESSAGE"
      );
      errorCount++;
    }
    if (errorCount > 0) {
      seterror(error);
    } else {
      props.submitAction(form);
    }
  };

  const setUpdateFormValues = () => {
    setForm({
      current_balance: helper.isObject(props.data) ? "" : "",
    });
  };
  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onHide}
        onShow={(e) => setUpdateFormValues()}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Transfer Balance</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            height: "260px",
            overflowY: "auto",
            alignItems: "center",

            display: "flex",
          }}
        >
          <div
            style={{
              height: "70%",
              display: "grid",
              justifyContent: "space-between",
            }}
          >
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
              loading={props.showLoader}
            />
            <Row>
              <div>
                From
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <label
                    style={{
                      width: "70%",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      marginRight: "20px",
                    }}
                  >
                    Main Balance
                  </label>
                  <input
                    disabled
                    type="text"
                    value={
                      helper.isObject(props.data)
                        ? props.data.main_balance
                        : "0.00"
                    }
                    className="form-control"
                    placeholder="Main Balance"
                  />
                </div>
              </div>
            </Row>
            <Row>
              <div>
                To
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label
                    style={{
                      width: "70%",
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      marginRight: "20px",
                    }}
                  >
                    Allocated Balance
                  </label>
                  <input
                    // disabled
                    type="text"
                    name="first_name"
                    value={form.current_balance || ""}
                    onChange={(e) =>
                      onInputchange(helper.cleanInteger(e.target.value))
                    }
                    className="form-control"
                    placeholder="Allocated Balance"
                  />
                  <p style={{ color: "red" }}>
                    {error.current_balance ? error.current_balance : ""}
                  </p>
                </div>
              </div>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => submit()}>
            <i className="fas fa-check"></i> Transfer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default AllocateModal;
