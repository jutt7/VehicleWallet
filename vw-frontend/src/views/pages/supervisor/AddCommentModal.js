import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";

export default function AddCommentModal(props) {
  const [overlay, setoverlay] = useState(false);

  const [values, setValues] = useState({
    client_id: "",
    transaction_id: "",
    name: "",
    reference_number: "",
    liter: "",
    amount: "",
    comment: "",
  });

  const [error, seterror] = useState({
    comment: "",
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

    if (helper.isEmptyString(values.comment)) {
      error.comment = "Please add a comment";
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
    console.log("props data", props.updateModalData);

    setValues({
      name:
        helper.isObject(props.updateModalData) &&
        helper.isObject(props.updateModalData.gas_station_attendent)
          ? props.updateModalData.gas_station_attendent.first_name +
            props.updateModalData.gas_station_attendent.last_name
          : "",
      reference_number: helper.isObject(props.updateModalData)
        ? props.updateModalData.reference_number
        : "",

      liter: helper.isObject(props.updateModalData)
        ? props.updateModalData.liters
        : "",
      amount: helper.isObject(props.updateModalData)
        ? props.updateModalData.amount
        : "",
      transaction_id: helper.isObject(props.updateModalData)
        ? props.updateModalData.id
        : "",
      client_id: helper.isObject(props.updateModalData)
        ? props.updateModalData.client_id
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
                  <label>Attendent Name : </label>{" "}
                  <label> {values.name || ""}</label>
                </Col>
                <Col>
                  <label>Transaction Reference # :</label>
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
              value={values.comment || ""}
              placeholder="Add Comment"
              onChange={(e) => {
                onInputchange(e.target.value, "comment");
              }}
            ></textarea>
            <p style={{ color: "red" }}>{error.comment ? error.comment : ""}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => submit()}>
            <i className="fas fa-check"></i> Add Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
