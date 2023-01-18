import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";

export default function ApproveUnapproveModal(props) {
  const [overlay, setoverlay] = useState(false);

  const [values, setValues] = useState({
    gas_station_name: "",
    transaction_id: "",
    amount: "",
    liter: "",
    client_comment: "",
    comment_id: "",
    transaction_id: "",
    client_id: "",
    reference_number: "",
  });

  const [error, seterror] = useState({
    client_comment: "",
  });

  const onInputchange = (value, key) => {
    let formUpdate = { ...values };
    formUpdate[key] = value;
    console.log(formUpdate, "formUpdate");
    setValues(formUpdate);
  };

  const submit = () => {
    setoverlay(true);
    if (props.disableBtn) {
      return false;
    }

    let errorCount = 0;
    let error = {};

    seterror({
      comment: "",
    });

    if (helper.isEmptyString(values.client_comment)) {
      error.client_comment = "Please add a comment";
      errorCount++;
      setoverlay(false);
    }

    if (errorCount > 0) {
      seterror(error);
      setoverlay(false);
    } else {
      props.submitAction(values);
      setTimeout(() => {
        setoverlay(false);
      }, 2000);
    }
  };

  const setUpdateFormValues = () => {
    console.log("props data", props.approveModalData);

    setValues({
      gas_station_name:
        helper.isObject(props.approveModalData) &&
        helper.isObject(props.approveModalData.transaction.gas_station)
          ? props.approveModalData.transaction.gas_station.name_en
          : "",
      // transaction_id:
      //   helper.isObject(props.approveModalData) &&
      //   helper.isObject(props.approveModalData.transaction)
      //     ? props.approveModalData.transaction.reference_number
      //     : "",

      amount:
        helper.isObject(props.approveModalData) &&
        helper.isObject(props.approveModalData.transaction)
          ? props.approveModalData.transaction.amount
          : "",
      liter:
        helper.isObject(props.approveModalData) &&
        helper.isObject(props.approveModalData.transaction)
          ? props.approveModalData.transaction.liters
          : "",
      comment_id: helper.isObject(props.approveModalData)
        ? props.approveModalData.id
        : "",
      transaction_id: helper.isObject(props.approveModalData)
        ? props.approveModalData.transaction_id
        : "",
      reference_number:
        helper.isObject(props.approveModalData) &&
        helper.isObject(props.approveModalData.transaction)
          ? props.approveModalData.transaction.reference_number
          : "",
      client_id: helper.isObject(props.approveModalData)
        ? props.approveModalData.client_id
        : "",
    });

    seterror({
      comment: "",
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
          <Modal.Title className="text-center">Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "240px", overflowY: "auto" }}>
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
                  <label>Gas Station Name : </label>{" "}
                  <label> {values.gas_station_name || ""}</label>
                </Col>
                <Col>
                  <label>Transaction Reference Number :</label>
                  <label>{values.reference_number || ""}</label>
                </Col>
                {/* <Col></Col> */}
              </Row>
            </div>

            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>Liters :</label>
                  <label> {values.liter || ""} </label>
                </Col>
                <Col>
                  <label>Amount :</label>
                  <label> {values.amount || ""} </label>
                </Col>
                {/* <Col></Col> */}
              </Row>
            </div>

            <textarea
              style={{
                height: "140px",
                width: "100%",
                marginTop: "10px",
                padding: "10px",
              }}
              value={values.client_comment || ""}
              placeholder="Add Comment"
              onChange={(e) => {
                onInputchange(e.target.value, "client_comment");
              }}
            ></textarea>
            <p style={{ color: "red" }}>
              {error.client_comment ? error.client_comment : ""}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => submit()}>
            {props.type == "approve" ? (
              <i className="fas fa-check" style={{ marginRight: "5px" }}></i>
            ) : (
              <i className="fas fa-cancel" style={{ marginRight: "5px" }}></i>
            )}

            {props.type == "approve" ? "Approve" : "Un-Approve"}
            {/* Add Comment */}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
