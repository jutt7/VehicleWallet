import React, { useState, useEffect } from "react";
import { Modal, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { ClipLoader } from "react-spinners";
import VehicleSheet from "../../../assets/files/VehicleSheet.xlsx";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { Phone } from "react-feather";
import Select from "react-select";

import {
  Button,
  Media,
  Label,
  Row,
  Col,
  Input,
  FormGroup,
  Alert,
  Form,
} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";

export default function BulkUploadModal(props) {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [overlay, setoverlay] = useState(false);
  const [error, setError] = useState(0);
  const { t } = useTranslation();

  const [sorting_icon, setsorting_icon] = useState();

  const handleSubmit = async (event) => {
    setoverlay(true);
    event.preventDefault();
    if (selectedFile == null) {
      setError(error + 1);
      setoverlay(false);
    } else {
      setError(0);
      const formData = new FormData();
      formData.append("uploaded_file", selectedFile);
      formData.append("client_id", props.client_id);
      try {
        const response = await axios({
          method: "post",
          url: `${jwtDefaultConfig.adminBaseUrl}/driver/import`,
          data: formData,
        }).then((res) => {
          console.log(res, "ressssssssss");
          if (res.data.code == 200) {
            setoverlay(false);
            props.getData();
            props.onCloseBulkUpdateModal();
            helper.toastNotification(
              "Request has been processed successfuly.",
              "SUCCESS_MESSAGE"
            );
          } else {
            helper.toastNotification(
              "Unable to process request.",
              "FAILED_MESSAGE"
            );
          }
        });
      } catch (error) {
        console.log(error);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
      }
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // useEffect(() => {
  //   console.log("dataaaaaaaaaaa", data);
  // }, [data]);

  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onCloseBulkUpdateModal}
        // onShow={(e) => props.setBulkData([])}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {t("Upload Vehicles")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "400px", overflowY: "auto" }}>
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
              loading={props.showLoader ? true : false}
            />
            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="file"
                      onChange={(e) => props.handleUpload(e)}
                      // onChange={handleFileSelect}
                      accept=".xlsx"
                    />
                    {/* <input type="submit" value="Upload File"  /> */}
                  </form>
                  {error == 0 ? (
                    ""
                  ) : (
                    <p style={{ color: "red", marginTop: "10px" }}>
                      {t("Please upload a file")}
                    </p>
                  )}
                </Col>
                <Col>
                  <p>
                    {t("Please Upload the data according to given template")}
                  </p>
                  <a
                    href={VehicleSheet}
                    download="VehicleSheet"
                    target="_blank"
                  >
                    <Button.Ripple
                      tag={Label}
                      className="mr-75"
                      size="sm"
                      color="primary"
                    >
                      {t("Download Template")}
                    </Button.Ripple>
                  </a>
                </Col>
              </Row>
            </div>
            <Row>
              <div className="table-responsive">
                {props.data && props.data.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th
                          className="table-th blackColor"
                          style={{ width: "120px" }}
                        >
                          <p>{t("Plate #")}</p>
                        </th>

                        <th className="table-th blackColor">
                          <p>{t("Vehicle Type")}</p>
                        </th>

                        <th className="table-th blackColor">
                          <p>{t("Fuel Type")}</p>
                        </th>

                        <th className="table-th blackColor">
                          <p>{t("Gas Tank Capacity")}</p>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {props.data &&
                        props.data.map((item, index) => (
                          <tr
                            key={index}
                            className={
                              helper.applyRowClass(item) === true
                                ? `evenRowColor`
                                : "oddRowColor"
                            }
                          >
                            <td>
                              <input
                                className="form-control"
                                placeholder="Plate #"
                                value={item.plate_no}
                                onChange={(e) => {
                                  props.data.filter((element) => {
                                    if (element.count_id === item.count_id) {
                                      let newData = props.data;
                                      newData[index].plate_no = e.target.value;
                                      newData[index].p = 0;

                                      props.setBulkData([...newData]);
                                    }
                                  });
                                }}
                              />
                              <p style={{ color: "red" }}>
                                {item.pno == 1 ? "Already exitst" : ""}
                                {item.p == 1 ? "Enter Plate No" : ""}
                              </p>
                            </td>
                            <td>
                              <Select
                                name="vehicle_type"
                                onChange={(e) => {
                                  props.data.filter((element) => {
                                    if (element.count_id === item.count_id) {
                                      let newData = props.data;
                                      if (e) {
                                        newData[index].type = e;
                                        newData[index].t = 0;
                                      } else {
                                        newData[index].type = [];
                                      }
                                      props.setBulkData([...newData]);
                                    }
                                  });
                                }}
                                options={props.vehicleTypeList}
                                // value={form.vehicle_type || []}
                                isClearable={true}
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                              />
                              <p style={{ color: "red" }}>
                                {item.t == 1 ? "Pick Vehicle Type" : ""}
                              </p>
                              {/* <input
                                className="form-control"
                                placeholder="Vehicle Type"
                                value={item.type}
                                onChange={(e) => {
                                  props.data.filter((element) => {
                                    if (element.count_id === item.count_id) {
                                      let newData = props.data;
                                      newData[index].first_name =
                                        helper.cleanInteger(e.target.value);
                                      props.setBulkData([...newData]);
                                    }
                                  });
                                }}
                                style={{ maxWidth: "100px" }}
                              /> */}
                            </td>

                            <td>
                              <Select
                                name="fuel_type"
                                onChange={(e) => {
                                  props.data.filter((element) => {
                                    if (element.count_id === item.count_id) {
                                      let newData = props.data;
                                      if (e) {
                                        newData[index].fuel_type = e;
                                        newData[index].ft = 0;
                                      } else {
                                        newData[index].fuel_type = [];
                                      }
                                      props.setBulkData([...newData]);
                                    }
                                  });
                                }}
                                options={props.fuelTypeList}
                                // value={form.vehicle_type || []}
                                isClearable={true}
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                              />
                              <p style={{ color: "red" }}>
                                {item.ft == 1 ? "Pick Fuel Type" : ""}
                              </p>
                              {/* <input
                                className="form-control"
                                placeholder="Fuel Type"
                                value={item.fuel_type}
                                onChange={(e) => {
                                  props.data.filter((element) => {
                                    if (element.count_id === item.count_id) {
                                      let newData = props.data;
                                      newData[index].last_name =
                                        helper.cleanInteger(e.target.value);
                                      props.setBulkData([...newData]);
                                    }
                                  });
                                }}
                                style={{ maxWidth: "100px" }}
                              /> */}
                            </td>

                            <td>
                              <div class="d-flex justify-content-left align-items-center">
                                <div class="d-flex flex-column">
                                  <a class="user_name text-truncate text-body">
                                    <span class="fw-bolder">
                                      <input
                                        className="form-control"
                                        placeholder="Gas Tank Capacity"
                                        value={item.gas_tank_capacity}
                                        onChange={(e) => {
                                          props.data.filter((element) => {
                                            if (
                                              element.count_id === item.count_id
                                            ) {
                                              let newData = props.data;
                                              newData[index].gas_tank_capacity =
                                                helper.cleanInteger(
                                                  e.target.value
                                                );
                                              newData[index].gtc = 0;

                                              props.setBulkData([...newData]);
                                            }
                                          });
                                        }}
                                      />
                                      <p style={{ color: "red" }}>
                                        {item.gtc == 1
                                          ? "Enter Gas Tank Capacity"
                                          : ""}
                                      </p>
                                    </span>
                                  </a>
                                </div>
                              </div>
                              <p style={{ color: "red" }}>
                                {item.mobile1 == 1 ? "Already exitst" : ""}
                              </p>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  ""
                )}
              </div>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={props.upload}>
            <i className="fas fa-check"></i> {t("Submit")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
