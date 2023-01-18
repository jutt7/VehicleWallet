import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";

import { useTranslation } from "react-i18next";

export default function ApproveUnapproveModal(props) {
  const { t } = useTranslation();
  const [overlay, setoverlay] = useState(false);

  const [values, setValues] = useState({
    transaction_id: "",
    client_id: "",
  });

  const submit = () => {
    setoverlay(true);

    props.submitAction(values);
    setTimeout(() => {
      setoverlay(false);
    }, 2000);
  };

  const setUpdateFormValues = () => {
    // console.log("props data", props.approveModalData);

    setValues({
      transaction_id: helper.isObject(props.approveModalData)
        ? props.approveModalData.transaction_id
        : "",
      client_id: helper.isObject(props.approveModalData)
        ? props.approveModalData.client_id
        : "",
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
          <Modal.Title className="text-center">{t("Approve")}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: "auto" }}>
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
              <p style={{ fontSize: "12px" }}>
                {t("Are you sure to Approve the transaction")} ?
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => submit()}>
            {props.type == "approve" ? (
              <i className="fas fa-check" style={{ marginRight: "5px" }}></i>
            ) : (
              <i className="fas fa-cancel" style={{ marginRight: "5px" }}></i>
            )}

            {props.type == "approve" ? t("Approve") : t("Un-Approve")}
            {/* Add Comment */}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
