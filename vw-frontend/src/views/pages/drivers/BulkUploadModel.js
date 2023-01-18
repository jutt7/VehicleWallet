import React, { useState, useEffect } from "react";
import { Modal, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { ClipLoader } from "react-spinners";
import DriverSheet from "../../../assets/files/DriverSheet.xlsx";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { Phone } from "react-feather";
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
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {t("Upload Drivers")}
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
                  <a href={DriverSheet} download="DriverSheet" target="_blank">
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
                          <p>{t("Employee Number")}</p>
                        </th>

                        <th className="table-th blackColor">
                          <p>{t("First Name")}</p>
                        </th>
                        {/* <th className="table-th blackColor">
                          <p>{t("Middle Name")}</p>
                        </th> */}
                        <th className="table-th blackColor">
                          <p>{t("Last Name")}</p>
                        </th>
                        {/* <th className="table-th blackColor">
                          <p>{t("Email")}</p>
                        </th> */}

                        <th className="table-th blackColor">
                          <p>{t("Mobile")}</p>
                        </th>

                        <th className="table-th blackColor">
                          <p>
                            <span>
                              {t("Civil record ID / Resident Permit number")}{" "}
                            </span>
                          </p>
                          {/* <p>
                            <span> {t("Resident Permit number")}</span>
                          </p> */}
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
                                placeholder="Emp #"
                                value={item.employee_number}
                                onChange={(e) => {
                                  props.data.filter((element) => {
                                    if (element.count_id === item.count_id) {
                                      let newData = props.data;
                                      newData[index].employee_number =
                                        e.target.value;
                                      props.setBulkData([...newData]);
                                    }
                                  });
                                }}
                              />
                              <p style={{ color: "red" }}>
                                {item.emp1 == 1 ? "Already exitst" : ""}
                              </p>
                            </td>
                            <td>
                              <input
                                className="form-control"
                                placeholder="First Name"
                                value={item.first_name}
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
                              />
                            </td>
                            {/* <td>
                              <input
                                className="form-control"
                                placeholder="Middle Name"
                                value={item.middle_name}
                                onChange={(e) => {
                                  props.data.filter((element) => {
                                    if (element.count_id === item.count_id) {
                                      let newData = props.data;
                                      newData[index].middle_name =
                                        helper.cleanInteger(e.target.value);
                                      props.setBulkData([...newData]);
                                    }
                                  });
                                }}
                                style={{ maxWidth: "100px" }}
                              />
                            </td> */}
                            <td>
                              <input
                                className="form-control"
                                placeholder="Last Name"
                                value={item.last_name}
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
                              />
                            </td>
                            {/* <td>
                              <input
                                className="form-control"
                                placeholder="Email"
                                value={item.email}
                                onChange={(e) => {
                                  props.data.filter((element) => {
                                    if (element.count_id === item.count_id) {
                                      let newData = props.data;
                                      newData[index].email =
                                        helper.cleanInteger(e.target.value);
                                      props.setBulkData([...newData]);
                                    }
                                  });
                                }}
                              />
                            </td> */}
                            <td>
                              <div class="d-flex justify-content-left align-items-center">
                                <div class="avatar me-1 bg-light-success">
                                  <span class="avatar-content">
                                    <Phone size={13} />
                                  </span>
                                </div>
                                <div class="d-flex flex-column">
                                  <a class="user_name text-truncate text-body">
                                    <span class="fw-bolder">
                                      <input
                                        className="form-control"
                                        placeholder="Emp #"
                                        value={item.mobile}
                                        onChange={(e) => {
                                          props.data.filter((element) => {
                                            if (
                                              element.count_id === item.count_id
                                            ) {
                                              let newData = props.data;
                                              newData[index].mobile =
                                                helper.cleanInteger(
                                                  e.target.value
                                                );
                                              props.setBulkData([...newData]);
                                            }
                                          });
                                        }}
                                      />
                                    </span>
                                  </a>
                                </div>
                              </div>
                              <p style={{ color: "red" }}>
                                {item.mobile1 == 1 ? "Already exitst" : ""}
                              </p>
                            </td>

                            <td>
                              <input
                                className="form-control"
                                placeholder="Emp #"
                                value={
                                  item.civil_record_or_resident_permit_number
                                }
                                onChange={(e) => {
                                  props.data.filter((element) => {
                                    if (element.count_id === item.count_id) {
                                      let newData = props.data;
                                      newData[
                                        index
                                      ].civil_record_or_resident_permit_number =
                                        helper.cleanInteger(e.target.value);
                                      props.setBulkData([...newData]);
                                    }
                                  });
                                }}
                              />
                              <p style={{ color: "red" }}>
                                {item.res1 == 1 ? "Already exitst" : ""}
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
