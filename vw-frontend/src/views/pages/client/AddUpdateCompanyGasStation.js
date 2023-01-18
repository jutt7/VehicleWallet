import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function AddUpdateModal(props) {
  const [overlay, setoverlay] = useState(false);
  const { t } = useTranslation();
  const [form, setform] = useState({
    gasStation: [],
  });

  const [error, seterror] = useState({
    gasStation: "",
  });

  const onInputchange = (value, key) => {
    console.log(value);
    let formUpdate = { ...form };
    formUpdate[key] = value;
    setform(formUpdate);
  };

  const submit = () => {
    setoverlay(true);
    let errorCount = 0;
    let error = {};

    seterror({
      gasStation: "",
    });

    if (!helper.isObject(form.gasStation)) {
      error.gasStation = "Gas station network is required";
      errorCount++;
      setoverlay(false);
    }

    if (errorCount > 0) {
      seterror(error);
    } else {
      props.submitAction(form);

      //alert()
    }
  };

  const setUpdateFormValues = () => {
    setoverlay(false);
    console.log("modal data: ", props.updateModalData);
    const gasStation = helper.isObject(props.updateModalData)
      ? props.gasStationList.find(
          (i) => i.value === props.updateModalData.gas_station_network_id
        )
      : [];
    console.log(props.gasStationList, "gasStationList");
    console.log(props.updateModalData, "gasStation");
    setform({
      gasStation: gasStation,
    });

    seterror({
      gasStation: "",
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
            {props.updateModalData
              ? t("Update Client Gas Station")
              : t("Add Client Gas Station")}
            {props.clientName ? ` - ${props.clientName}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "200px", overflowY: "auto" }}>
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
                  <label>
                    {t("Gas Station Network")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    name="gasStation"
                    onChange={(e) => onInputchange(e, "gasStation")}
                    options={props.gasStationList}
                    value={form.gasStation}
                    isClearable={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  <p style={{ color: "red" }}>
                    {error.gasStation ? error.gasStation : ""}
                  </p>
                </Col>
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
