import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";

export default function AddUpdateModal(props) {
  const [overlay, setoverlay] = useState(false);
  const [form, setform] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    client: [],
  });

  const [companiesList, setcompaniesList] = useState([]);

  const [error, seterror] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    client: "",
  });

  const onInputchange = (value, key) => {
    console.log(value);
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
      client: "",
    });

    if (helper.isEmptyString(form.name_en)) {
      error.name_en = "Name english is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.name_ar)) {
      error.name_ar = "Name arabic is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.name_ur)) {
      error.name_ur = "Name urdu is required";
      errorCount++;
      setoverlay(false);
    }

    if (!helper.isObject(form.client)) {
      error.client = "Client is required";
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

  const setUpdateFormValues = () => {
    const client = helper.isObject(props.updateModalData)
      ? props.clientsList.find(
          (i) => i.value === props.updateModalData.client_id
        )
      : [];
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
      client: client,
    });

    seterror({
      name_en: "",
      name_ar: "",
      name_ur: "",
      client: "",
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
            {props.updateModalData ? "Update Fuel" : "Add Fuel"}
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
                    Name English <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={form.name_en}
                    onChange={(e) => onInputchange(e.target.value, "name_en")}
                    className="form-control"
                    placeholder="Name English"
                  />
                  <p style={{ color: "red" }}>
                    {error.name_en ? error.name_en : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    Name Arabic <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name_ar"
                    value={form.name_ar}
                    onChange={(e) => onInputchange(e.target.value, "name_ar")}
                    className="form-control"
                    placeholder="Name Arabic"
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
                    Name Urdu <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name_ur"
                    value={form.name_ur}
                    onChange={(e) => onInputchange(e.target.value, "name_ur")}
                    className="form-control"
                    placeholder="Name Urdu"
                  />
                  <p style={{ color: "red" }}>
                    {error.name_ur ? error.name_ur : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    client <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    name="client"
                    onChange={(e) => onInputchange(e, "client")}
                    options={props.clientsList}
                    value={form.client}
                    isClearable={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  <p style={{ color: "red" }}>
                    {error.client ? error.client : ""}
                  </p>
                </Col>
              </Row>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => submit()}>
            <i className="fas fa-check"></i>{" "}
            {helper.isObject(props.updateModalData) ? "Update" : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
