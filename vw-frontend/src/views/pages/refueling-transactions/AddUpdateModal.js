import React, { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import { ClipLoader } from "react-spinners";
import "./css/style.css";
import map from "@src/assets/images/elements/map.png";
import plate from "@src/assets/images/elements/truck41.png";
import dispenser from "@src/assets/images/elements/dispenser1.png";
import vehicles from "@src/assets/images/icons/vehicles.png";
import station from "@src/assets/images/icons/client-station.png";
import mobile from "@src/assets/images/icons/contact.png";
import DashboardMap from "../../charts/apex/DashboardMap";
import MapComponent from "../../components/map";

// import "./css/demo.css";

export default function AddUpdateModal(props) {
  // const [form, setform] = useState({
  //   name_en: "",
  //   name_ar: "",
  //   name_ur: "",
  //   weight: "",
  // });

  // const [error, seterror] = useState({
  //   name_en: "",
  //   name_ar: "",
  //   name_ur: "",
  //   weight: "",
  // });

  const onInputchange = (value, key) => {
    let formUpdate = { ...form };
    formUpdate[key] = value;
    setform(formUpdate);
  };

  const submit = () => {};

  const setUpdateFormValues = () => {
    console.log(props.updateModalData, "props");
  };

  const getStatusData = (data, status) => {
    let findData = {};
    findData = data.find((logs) => logs.request_status == status);
    return findData;
  };

  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onHide}
        onShow={(e) => setUpdateFormValues()}
        centered
        dialogClassName="modal-90-percent"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {props.updateModalData ? "Refueling Transaction Detail" : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "500px", overflowY: "auto" }}>
          <Row>
            <Col>
              <h6>Refuel Request Initiation</h6>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="table-th blackColor">
                        <p>Request ID</p>
                      </th>
                      <th className="table-th blackColor">
                        <p>Driver / Phone #</p>
                      </th>
                      <th className="table-th blackColor">
                        <p>Vehicle Number Plate</p>
                      </th>
                      <th className="table-th blackColor">
                        <p>Client</p>
                      </th>
                      <th className="table-th blackColor">
                        <p>Requested at</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {" "}
                        {helper.isObject(props.updateModalData) &&
                        helper.isObject(props.updateModalData.fuel_request)
                          ? props.updateModalData.fuel_request.fuel_req_id
                          : ""}
                      </td>
                      <td>
                        {helper.isObject(props.updateModalData) &&
                        helper.isObject(props.updateModalData.driver) ? (
                          <div class="d-flex justify-content-left align-items-center">
                            <div class="avatar me-1 bg-light-success">
                              <span class="avatar-content">
                                {helper.isObject(
                                  props.updateModalData.driver
                                ) &&
                                  helper.FirstWordFirstChar(
                                    props.updateModalData.driver.first_name
                                  )}
                                {helper.isObject(
                                  props.updateModalData.driver
                                ) &&
                                  helper.FirstWordFirstChar(
                                    props.updateModalData.driver.last_name
                                  )}
                              </span>
                            </div>
                            <div class="d-flex flex-column">
                              <a class="user_name text-truncate text-body">
                                <span class="fw-bolder">
                                  {helper.isObject(
                                    props.updateModalData.driver
                                  ) &&
                                    helper.shortTextWithDots(
                                      `${props.updateModalData.driver.first_name} ${props.updateModalData.driver.middle_name} ${props.updateModalData.driver.last_name}`,
                                      20
                                    )}
                                </span>
                              </a>
                              <small class="text-truncate text-muted mb-0">
                                {helper.isObject(props.updateModalData.driver)
                                  ? props.updateModalData.driver.mobile
                                  : ""}
                              </small>
                            </div>
                          </div>
                        ) : (
                          " "
                        )}
                      </td>
                      <td>
                        {helper.isObject(props.updateModalData) &&
                        helper.isObject(props.updateModalData.vehicle) ? (
                          <div class="d-flex justify-content-left align-items-center">
                            <div class="avatar me-1 bg-light-success">
                              <span class="avatar-content">
                                <img src={vehicles} />
                              </span>
                            </div>
                            <div class="d-flex flex-column">
                              <a class="user_name text-truncate text-body">
                                <span class="fw-bolder">
                                  {helper.isObject(
                                    props.updateModalData.vehicle
                                  )
                                    ? helper.shortTextWithDots(
                                        props.updateModalData.vehicle.plate_no,
                                        20
                                      )
                                    : ""}
                                </span>
                              </a>
                              <small class="text-truncate text-muted mb-0">
                                <i
                                  class="fa fa-user"
                                  style={{
                                    color: "#2d7337",
                                    marginRight: "2px",
                                  }}
                                  aria-hidden="true"
                                ></i>

                                {helper.isObject(
                                  props.updateModalData.driver
                                ) &&
                                helper.isObject(
                                  props.updateModalData.driver.client
                                )
                                  ? helper.shortTextWithDots(
                                      `${props.updateModalData.driver.client.name_en}`,
                                      20
                                    )
                                  : ""}
                              </small>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                      <td>
                        {helper.isObject(props.updateModalData) &&
                        helper.isObject(props.updateModalData.driver) &&
                        helper.isObject(props.updateModalData.driver.client) ? (
                          <div class="d-flex justify-content-left align-items-center">
                            <div class="avatar me-1 bg-light-success">
                              <span class="avatar-content">
                                {helper.isObject(
                                  props.updateModalData.driver
                                ) &&
                                  helper.FirstWordFirstChar(
                                    props.updateModalData.driver.client.name_en
                                  )}
                                {helper.isObject(
                                  props.updateModalData.driver
                                ) &&
                                  helper.SecondWordFirstChar(
                                    props.updateModalData.driver.client.name_en
                                  )}
                              </span>
                            </div>
                            <div class="d-flex flex-column">
                              <a class="user_name text-truncate text-body">
                                <span class="fw-bolder">
                                  {helper.isObject(props.updateModalData) &&
                                    helper.isObject(
                                      props.updateModalData.driver
                                    ) &&
                                    helper.isObject(
                                      props.updateModalData.driver.client
                                    ) &&
                                    helper.shortTextWithDots(
                                      `${props.updateModalData.driver.client.name_en}`,
                                      20
                                    )}
                                </span>
                              </a>
                            </div>
                          </div>
                        ) : (
                          " "
                        )}
                      </td>
                      <td>
                        {" "}
                        {helper.isObject(props.updateModalData) &&
                        helper.isObject(props.updateModalData.fuel_request) &&
                        helper.isObject(
                          props.updateModalData.fuel_request.created_at
                        )
                          ? helper.humanReadableDate(
                              props.updateModalData.fuel_request.created_at
                            )
                          : ""}{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h6>Transactional Information</h6>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="table-th blackColor">
                        <p>Transaction ID</p>
                      </th>
                      <th className="table-th blackColor">
                        <p>Quantity in liters</p>
                      </th>
                      <th className="table-th blackColor">
                        <p>Amount (SAR)</p>
                      </th>
                      <th className="table-th blackColor">
                        <p>Requested At</p>
                      </th>
                      <th className="table-th blackColor">
                        <p>Status</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {helper.isObject(props.updateModalData)
                          ? props.updateModalData.reference_number
                          : ""}
                      </td>
                      <td>
                        {helper.isObject(props.updateModalData) &&
                        props.updateModalData.liters
                          ? props.updateModalData.liters + " ltr"
                          : ""}
                      </td>
                      <td>
                        {helper.isObject(props.updateModalData) &&
                        props.updateModalData.amount
                          ? props.updateModalData.amount + " SAR"
                          : ""}
                      </td>
                      <td>
                        {helper.isObject(props.updateModalData)
                          ? helper.humanReadableDate(
                              props.updateModalData.created_at
                            )
                          : ""}
                      </td>
                      <td>
                        {helper.isObject(props.updateModalData) &&
                        helper.isObject(props.updateModalData.fuel_request_logs)
                          ? props.getStatusLabels(
                              props.updateModalData.fuel_request_logs
                            )
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Col>
            <Col>
              {/* <img style={{ width: "480px", height: "350px" }} src={map} /> */}
              <div>
                <MapComponent
                  height={"350px"}
                  width={"480px"}
                  data={
                    props.updateModalData &&
                    helper.isObject(props.updateModalData.gas_station)
                      ? [props.updateModalData.gas_station]
                      : ""
                  }
                  loading={false}
                />
              </div>
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Col>
              {helper.isObject(props.updateModalData) &&
              helper.isObject(props.updateModalData.fuel_request_logs) ? (
                <ul
                  class={`timelin-h green-timeline ${
                    helper.isObject(
                      getStatusData(
                        props.updateModalData.fuel_request_logs,
                        "transaction_held"
                      )
                    )
                      ? "width-75-long"
                      : ""
                  }`}
                >
                  <li
                    className={
                      helper.isObject(props.updateModalData) &&
                      helper.isObject(
                        getStatusData(
                          props.updateModalData.fuel_request_logs,
                          "request_pending"
                        )
                      )
                        ? "li-first"
                        : ""
                    }
                  >
                    <div class="top">
                      <span>
                        {/* {item.request_status == "transaction_held"
                                ? "Gas Station / Attendent"
                                : ""} */}
                      </span>
                    </div>
                    <div>
                      <h5>Refuel Request</h5>
                      <label>
                        {helper.isObject(
                          getStatusData(
                            props.updateModalData.fuel_request_logs,
                            "request_pending"
                          )
                        )
                          ? helper.humanReadableDate(
                              getStatusData(
                                props.updateModalData.fuel_request_logs,
                                "request_pending"
                              ).created_at
                            )
                          : ""}
                      </label>
                    </div>
                  </li>

                  <li
                    className={
                      helper.isObject(props.updateModalData) &&
                      helper.isObject(
                        getStatusData(
                          props.updateModalData.fuel_request_logs,
                          "request_approved"
                        )
                      )
                        ? "li-first"
                        : ""
                    }
                  >
                    <div class="top">
                      <span>
                        {/* {item.request_status == "transaction_held"
                                ? "Gas Station / Attendent"
                                : ""} */}
                      </span>
                    </div>
                    <div>
                      <h5>Request Approved</h5>
                      <label>
                        {helper.isObject(
                          getStatusData(
                            props.updateModalData.fuel_request_logs,
                            "request_approved"
                          )
                        )
                          ? helper.humanReadableDate(
                              getStatusData(
                                props.updateModalData.fuel_request_logs,
                                "request_approved"
                              ).created_at
                            )
                          : ""}
                      </label>
                    </div>
                  </li>

                  <li
                    className={
                      helper.isObject(props.updateModalData) &&
                      helper.isObject(
                        getStatusData(
                          props.updateModalData.fuel_request_logs,
                          "number_plate_scan"
                        )
                      )
                        ? "li-first"
                        : ""
                    }
                  >
                    <div class="top" style={{ top: "-45%" }}>
                      {helper.isObject(props.updateModalData) ? (
                        <>
                          <div
                            class="d-flex justify-content-left align-items-center"
                            style={{ marginTop: "10px" }}
                          >
                            <div class="avatar me-1 bg-light-primary">
                              <span class="avatar-content">
                                <img src={station} />
                              </span>
                            </div>
                            <div class="d-flex flex-column">
                              <a class="user_name text-truncate text-body">
                                <span class="fw-bolder">
                                  {helper.isObject(
                                    props.updateModalData.gas_station
                                  )
                                    ? helper.shortTextWithDots(
                                        props.updateModalData.gas_station
                                          .name_en,
                                        20
                                      )
                                    : ""}
                                </span>
                              </a>
                              <small class="text-truncate text-muted mb-0">
                                <i
                                  class="fa-solid fa-diagram-project"
                                  style={{
                                    color: "#2d7337",
                                    marginRight: "2px",
                                  }}
                                />
                                {helper.isObject(
                                  props.updateModalData.gas_station
                                    .gas_station_network
                                )
                                  ? helper.shortTextWithDots(
                                      props.updateModalData.gas_station
                                        .gas_station_network.name_en,
                                      20
                                    )
                                  : ""}{" "}
                              </small>
                            </div>
                          </div>

                          <div
                            class="d-flex justify-content-left align-items-center"
                            style={{ marginTop: "10px" }}
                          >
                            <div class="avatar me-1 bg-light-primary">
                              <span class="avatar-content">
                                {helper.isObject(
                                  props.updateModalData.gas_station_attendent
                                ) &&
                                  helper.FirstWordFirstChar(
                                    props.updateModalData.gas_station_attendent
                                      .first_name
                                  )}
                                {helper.isObject(
                                  props.updateModalData.gas_station_attendent
                                ) &&
                                  helper.FirstWordFirstChar(
                                    props.updateModalData.gas_station_attendent
                                      .last_name
                                  )}
                              </span>
                            </div>
                            <div class="d-flex flex-column">
                              <a class="user_name text-truncate text-body">
                                <span class="fw-bolder">
                                  {helper.isObject(
                                    props.updateModalData.gas_station_attendent
                                  ) &&
                                    helper.shortTextWithDots(
                                      `${props.updateModalData.gas_station_attendent.first_name} ${props.updateModalData.gas_station_attendent.middle_name} ${props.updateModalData.gas_station_attendent.last_name}`,
                                      20
                                    )}
                                </span>
                              </a>
                              <small class="text-truncate text-muted mb-0">
                                <img
                                  src={mobile}
                                  style={{
                                    marginRight: "2px",
                                    width: "10px",
                                  }}
                                />{" "}
                                {helper.isObject(
                                  props.updateModalData.gas_station_attendent
                                )
                                  ? props.updateModalData.gas_station_attendent
                                      .mobile
                                  : ""}
                              </small>
                            </div>
                          </div>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      <h5>Number Plate Scaned</h5>
                      <label>
                        {helper.isObject(
                          getStatusData(
                            props.updateModalData.fuel_request_logs,
                            "number_plate_scan"
                          )
                        )
                          ? helper.humanReadableDate(
                              getStatusData(
                                props.updateModalData.fuel_request_logs,
                                "number_plate_scan"
                              ).created_at
                            )
                          : ""}
                      </label>
                    </div>

                    {helper.isObject(
                      getStatusData(
                        props.updateModalData.fuel_request_logs,
                        "number_plate_scan"
                      )
                    ) ? (
                      <img
                        onClick={(e) =>
                          props.handleShowDialog(
                            getStatusData(
                              props.updateModalData.fuel_request_logs,
                              "number_plate_scan"
                            ).time_line_image
                          )
                        }
                        src={`${
                          getStatusData(
                            props.updateModalData.fuel_request_logs,
                            "number_plate_scan"
                          ).time_line_image
                        }`}
                        width={"50"}
                        height={"50"}
                        style={{
                          marginRight: "5px",
                          marginTop: "5px",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </li>

                  <li
                    className={
                      helper.isObject(props.updateModalData) &&
                      helper.isObject(
                        getStatusData(
                          props.updateModalData.fuel_request_logs,
                          "refueling"
                        )
                      )
                        ? "li-first"
                        : ""
                    }
                  >
                    <div class="top">
                      <span>
                        {/* {item.request_status == "transaction_held"
                                ? "Gas Station / Attendent"
                                : ""} */}
                      </span>
                    </div>
                    <div>
                      <h5>Refueling</h5>
                      <label>
                        {helper.isObject(
                          getStatusData(
                            props.updateModalData.fuel_request_logs,
                            "refueling"
                          )
                        )
                          ? helper.humanReadableDate(
                              getStatusData(
                                props.updateModalData.fuel_request_logs,
                                "refueling"
                              ).created_at
                            )
                          : ""}
                      </label>
                    </div>

                    {helper.isObject(
                      getStatusData(
                        props.updateModalData.fuel_request_logs,
                        "refueling"
                      )
                    ) ? (
                      <img
                        onClick={(e) =>
                          props.handleShowDialog(
                            getStatusData(
                              props.updateModalData.fuel_request_logs,
                              "refueling"
                            ).time_line_image
                          )
                        }
                        src={`${
                          getStatusData(
                            props.updateModalData.fuel_request_logs,
                            "refueling"
                          ).time_line_image
                        }`}
                        width={"50"}
                        height={"50"}
                        style={{
                          marginRight: "5px",
                          marginTop: "5px",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </li>

                  {helper.isObject(
                    getStatusData(
                      props.updateModalData.fuel_request_logs,
                      "transaction_held"
                    )
                  ) ? (
                    <li className="li-first">
                      <div class="top">
                        <span>
                          {/* {item.request_status == "transaction_held"
                                  ? "Gas Station / Attendent"
                                  : ""} */}
                        </span>
                      </div>
                      <div>
                        <h5>Transaction Held</h5>
                        <label>
                          {helper.isObject(
                            getStatusData(
                              props.updateModalData.fuel_request_logs,
                              "transaction_held"
                            )
                          )
                            ? helper.humanReadableDate(
                                getStatusData(
                                  props.updateModalData.fuel_request_logs,
                                  "transaction_held"
                                ).created_at
                              )
                            : ""}
                        </label>
                      </div>
                    </li>
                  ) : (
                    ""
                  )}

                  <li
                    className={
                      helper.isObject(props.updateModalData) &&
                      helper.isObject(
                        getStatusData(
                          props.updateModalData.fuel_request_logs,
                          "transaction_completed"
                        )
                      )
                        ? "li-first"
                        : ""
                    }
                  >
                    <div class="top">
                      <span>
                        {/* {item.request_status == "transaction_held"
                                ? "Gas Station / Attendent"
                                : ""} */}
                      </span>
                    </div>
                    <div>
                      <h5>Transaction Authorized</h5>
                      <label>
                        {helper.isObject(
                          getStatusData(
                            props.updateModalData.fuel_request_logs,
                            "transaction_completed"
                          )
                        )
                          ? helper.humanReadableDate(
                              getStatusData(
                                props.updateModalData.fuel_request_logs,
                                "transaction_completed"
                              ).created_at
                            )
                          : ""}
                      </label>
                    </div>
                  </li>
                  {/* {helper.isObject(props.updateModalData) &&
                    props.updateModalData.fuel_request_logs &&
                    props.updateModalData.fuel_request_logs.map(
                      (item, index) => (
                        <li key={index}>
                          <div class="top">
                            <span>
                              {item.request_status == "transaction_held"
                                ? "Gas Station / Attendent"
                                : ""}
                            </span>
                          </div>
                          <div>
                            <h5>{helper.getStatusName(item.request_status)}</h5>
                            <label>{item.created_at}</label>
                          </div>
                        </li>
                      )
                    )} */}
                </ul>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}
