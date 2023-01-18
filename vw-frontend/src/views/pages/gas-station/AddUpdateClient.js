import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";

export default function AddUpdateModal(props) {
  const [overlay, setoverlay] = useState(false);
  const [form, setform] = useState({
    clients: [],
  });

  const [error, seterror] = useState({
    clients: "",
  });

  const onInputchange = (value, key) => {
    console.log(form, "form");
    console.log(value);
    let formUpdate = { ...form };
    formUpdate[key] = value;
    console.log(formUpdate, "formUpdate");
    setform(formUpdate);
  };

  const submit = () => {
    if (props.disableBtn) {
      return false;
    }

    let errorCount = 0;
    let error = {};

    seterror({
      clients: "",
    });

    if (!helper.isObject(form.clients)) {
      error.clients = "Client is required";
      errorCount++;
    }

    if (errorCount > 0) {
      seterror(error);
    } else {
      props.submitAction(form);
    }
  };

  const setUpdateFormValues = () => {
    const clients = helper.isObject(props.updateModalData)
      ? props.clientList.find(
          (i) => i.value === props.updateModalData.client_id
        )
      : [];

    setform({
      clients: clients,
    });

    seterror({
      clients: "",
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
      <Modal
        show={props.show}
        onHide={props.onHide}
        onShow={(e) => setUpdateFormValues()}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {props.updateModalData ? "Update Client" : "Add Client"}
            {props.gasStationName ? ` - ${props.gasStationName}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "150px", overflowY: "auto" }}>
          <div>
            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    Clients <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    name="clients"
                    onChange={(e) => onInputchange(e, "clients")}
                    options={props.clientList}
                    value={form.clients || []}
                    isClearable={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  <p style={{ color: "red" }}>
                    {error.clients ? error.clients : ""}
                  </p>
                </Col>
              </Row>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => submit()}>
            <i className="fas fa-check"></i> {helper.isObject(props.updateModalData) ? "Update" : "Submit" }
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
