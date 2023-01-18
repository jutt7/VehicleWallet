import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { Phone, Edit, Mail } from "react-feather";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import Select from "react-select";
import detailIcon from "@src/assets/images/icons/details.png";
import { useTranslation } from "react-i18next";
import { getUserData } from "@utils";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import SelectSearch, { fuzzySearch } from "react-select-search";

import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Input,
  Label,
  ButtonGroup,
  CardText,
  Button,
} from "reactstrap";
import AddUpdateModal from "../drivers/AddUpdateModal";
import DeleteModal from "../../components/modal/DeleteModal";

function SearchDriver({ data, getSearchData }) {
  const [overlay, setoverlay] = useState(false);
  const [showAddUpdateModal, setshowAddUpdateModal] = useState(false);
  const [onSubmit, setonSubmit] = useState("");
  const [updateModalData, setupdateModalData] = useState(null);
  const [clientID, setClientID] = useState("");
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteMessage, setdeleteMessage] = useState("");
  const [deleteItem, setdeleteItem] = useState("");

  const getVehiclePlate = (data) => {
    if (helper.isObject(data.vehicle)) {
      return data.vehicle.plate_no;
    }
  };
  const setUnbind = (item) => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/driver/unbind`, {
        driver: {
          driver_id: item.driver_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setoverlay(false);

          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          //   getData();
          getSearchData();
        } else {
          setoverlay(false);
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
        }
      })
      .catch((error) => {
        setoverlay(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
        console.log(error, "errorrrr");
      });
  };

  const onOpenUpdateModal = (item, index) => {
    setupdateModalData(item);
    setshowAddUpdateModal(true);
    setClientID(
      helper.isObject(item) && helper.isObject(item.cleint)
        ? item.client.client_id
        : ""
    );
    // setupdateIndex(index);
    setonSubmit("update");
  };
  const onCloseAddUpdateModal = () => {
    setshowAddUpdateModal(false);
    // setupdateIndex(null);
    // setonSubmit(null);
    setupdateModalData(null);
  };

  const onOpenDeleteModal = (rowData, index) => {
    setdeleteItem(rowData);
    // setdeleteIndex(index);
    setonSubmit("delete");
    setdeleteMessage(rowData.status === 1 ? "Deactivate" : "activate");
    setshowDeleteModal(true);
  };

  const submitAction = (args = "") => {
    if (onSubmit == "create") {
      create(args);
    }
    if (onSubmit == "update") {
      update(args);
    }
    if (onSubmit == "delete") {
      remove();
    }
  };
  const onCloseDeleteModal = () => {
    setshowDeleteModal(false);
    // setdeleteIndex("");
    setdeleteItem("");
    setonSubmit("");
  };
  const update = (args) => {
    let id = "";
    if (args.assinged_vehicle_id && args.assinged_vehicle_id.id) {
      id = args.assinged_vehicle_id.id;
    } else {
      if (args.assinged_vehicle_id) {
        id = args.assinged_vehicle_id.value;
      }
    }

    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/driver/update`, {
        driver: {
          driver_id: updateModalData.driver_id,
          employee_number: args.employee_number,
          first_name: args.first_name,
          middle_name: args.middle_name,
          last_name: args.last_name,
          password: args.mobile,
          driver_pin: args.driver_pin,
          email: args.email,
          mobile: args.mobile == updateModalData.mobile ? "" : args.mobile,
          device_id: args.device_id,
          gender: args.gender,
          driving_license_number: args.driving_license_number,
          civil_record_or_resident_permit_number:
            args.civil_record_or_resident_permit_number,
          nationality: args.nationality.value,
          driver_prefered_language: args.prefered_language,
          client_id: clientID,
          photo: args.photo,
          assinged_vehicle_id: id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setshowAddUpdateModal(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          //   getData();
          //   getUnassignedVehicles();
        } else {
          setoverlay(false);
          if (res.data.data.employee_number) {
            helper.toastNotification(res.data.data.employee_number[0]);
          }
          if (res.data.data.email) {
            helper.toastNotification(res.data.data.email[0]);
          }
          if (res.data.data.mobile) {
            helper.toastNotification(res.data.data.mobile[0]);
          }
          if (res.data.data.driving_license_number) {
            helper.toastNotification(res.data.data.driving_license_number[0]);
          }
          if (res.data.data.driving_license_number) {
            helper.toastNotification(res.data.data.driving_license_number[0]);
          }
          if (res.data.data.driving_license_number) {
            helper.toastNotification(
              res.data.data.civil_record_or_resident_permit_number[0]
            );
          }
        }
      })
      .catch((error) => {
        setoverlay(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
      });
  };
  const remove = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/driver/delete`, {
        driver: {
          driver_id: deleteItem.driver_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setshowDeleteModal(false);
          setoverlay(false);
          getSearchData();
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
        } else {
          setoverlay(false);
          setshowDeleteModal(false);
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
        }
      })
      .catch((error) => {
        setoverlay(false);
        setshowDeleteModal(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
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
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle style={{ fontWeight: "bold" }} tag="h1">
            {/* Drivers {props.clientName} */}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Row>
            <Col lg={12}>
              <Row>
                <Col style={{ display: "flex" }}></Col>
              </Row>
            </Col>
          </Row>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th
                    className="table-th blackColor"
                    style={{ width: "120px" }}
                  >
                    <p>Employee #</p>
                  </th>

                  <th className="table-th blackColor">
                    <p>Name</p>
                  </th>

                  <th className="table-th blackColor">
                    <p>Mobile</p>
                  </th>
                  <th className="table-th blackColor">
                    <p>Client Name</p>
                  </th>
                  <th className="table-th blackColor">
                    <p>Vehicle Number Plate</p>
                  </th>

                  <th className="table-th blackColor">
                    <p>
                      <span>Civil record ID / </span>
                    </p>
                    <p>
                      <span> Resident Permit number</span>
                    </p>
                  </th>
                  <th className="table-th blackColor">
                    <p>Bind/Unbind</p>
                  </th>
                  <th className="table-th blackColor">
                    <p>Created at</p>
                  </th>

                  <th className="table-th blackColor">
                    <p>Status</p>
                  </th>

                  <th className="table-th blackColor">{<p>Action</p>}</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data &&
                  data.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        helper.applyRowClass(item) === true
                          ? `evenRowColor`
                          : "oddRowColor"
                      }
                    >
                      <td>{item.employee_number}</td>
                      <td>
                        <div class="d-flex justify-content-left align-items-center">
                          <div class="avatar me-1 bg-light-success">
                            <span class="avatar-content">
                              {helper.FirstWordFirstChar(item.first_name)}
                              {helper.FirstWordFirstChar(item.last_name)}
                            </span>
                          </div>
                          <div class="d-flex flex-column">
                            <a class="user_name text-truncate text-body">
                              <span class="fw-bolder">
                                {helper.shortTextWithDots(
                                  `${item.first_name} ${item.middle_name} ${item.last_name}`,
                                  20
                                )}
                              </span>
                            </a>
                            <small class="text-truncate text-muted mb-0">
                              {item.email}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex justify-content-left align-items-center">
                          <div class="avatar me-1 bg-light-success">
                            <span class="avatar-content">
                              <Phone size={13} />
                            </span>
                          </div>
                          <div class="d-flex flex-column">
                            <a class="user_name text-truncate text-body">
                              <span class="fw-bolder">{item.mobile}</span>
                            </a>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Link
                          to={`/vrp/admin/manage-client/${
                            helper.isObject(item.client)
                              ? item.client.client_id
                              : ""
                          }`}
                        >
                          {helper.isObject(item.client)
                            ? item.client.name_en
                            : ""}
                        </Link>
                      </td>
                      <td>{getVehiclePlate(item)}</td>
                      <td>{item.civil_record_or_resident_permit_number}</td>
                      <td>
                        {item.u_uid ? (
                          <Button
                            color="primary"
                            data-tip="Unbind"
                            size={15}
                            onClick={(e) => setUnbind(item)}
                            style={{ marginTop: "4px", marginRight: "5px" }}
                          >
                            Unbind
                          </Button>
                        ) : (
                          ""
                        )}
                      </td>

                      <td>{helper.humanReadableDate(item.created_at)}</td>
                      <td>
                        <div className="form-switch form-check-success">
                          <Input
                            type="switch"
                            // defaultChecked={item.status === 1 ? true : false}
                            checked={item.status === 1 ? true : false}
                            id={`icon-success${index}`}
                            name={`icon-success${index}`}
                            onChange={(e) => onOpenDeleteModal(item, index)}
                            data-tip="Update Status"
                          />
                          {/* <CustomLabel htmlFor={`icon-success${index}`} /> */}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex" }}>
                          {/* <Edit
                            data-tip="Update"
                            size={15}
                            onClick={(e) => onOpenUpdateModal(item, index)}
                            style={{ marginTop: "4px", marginRight: "5px" }}
                          /> */}
                          <Link
                            to={`/vrp/admin/manage-client/${
                              helper.isObject(item.client)
                                ? item.client.client_id
                                : ""
                            }`}
                          >
                            <img
                              src={detailIcon}
                              style={{ marginTop: "4px" }}
                            />
                          </Link>
                          {window.location.pathname.split("/")[1] != "admin" ? (
                            <Mail
                              data-tip="Message"
                              size={15}
                              onClick={(e) => onOpenMessageModal(item, index)}
                              style={{
                                marginTop: "4px",
                                marginRight: "5px",
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                        <ReactTooltip />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>No Records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      <AddUpdateModal
        show={showAddUpdateModal}
        updateModalData={updateModalData}
        onHide={onCloseAddUpdateModal}
        submitAction={submitAction}
        disableBtn={overlay}
        //   clientsList={clientsList}
        //   clientName={props.clientName}
        //   vehicles={vehicles}
      />
      <DeleteModal
        show={showDeleteModal}
        confirmationText={`Are you sure to ${deleteMessage}  a driver`}
        confirmationHeading={`${helper.uppercaseFirst(deleteMessage)} a driver`}
        onHide={onCloseDeleteModal}
        submitAction={submitAction}
        disableBtn={overlay}
      />
    </div>
  );
}

export default SearchDriver;
