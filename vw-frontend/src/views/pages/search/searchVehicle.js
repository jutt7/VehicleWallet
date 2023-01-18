import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { Phone, Edit, Mail } from "react-feather";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { getUserData } from "@utils";
import detailIcon from "@src/assets/images/icons/details.png";

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

function SearchVehicle({ data, getSearchData }) {
  const [overlay, setoverlay] = useState(false);
  const [showAddUpdateModal, setshowAddUpdateModal] = useState(false);
  const [onSubmit, setonSubmit] = useState("");
  const [updateModalData, setupdateModalData] = useState(null);
  const [clientID, setClientID] = useState("");
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteMessage, setdeleteMessage] = useState("");
  const [deleteItem, setdeleteItem] = useState("");

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

  const remove = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/vehicle/delete`, {
        vehicle: {
          vehicle_id: deleteItem.vehicle_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setshowDeleteModal(false);
          setoverlay(false);

          getSearchData();
          helper.toastNotification(res.data.message_en, "SUCCESS_MESSAGE");
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
        console.log(error, "errorrrrrrrr");
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
                  <th className="table-th blackColor">
                    <p>Vehicle Number Plate</p>
                  </th>

                  <th className="table-th blackColor">
                    <p>Driver Name</p>
                  </th>
                  <th className="table-th blackColor">
                    <p>Client Name</p>
                  </th>
                  <th className="table-th blackColor"></th>

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
                      <td>{item.plate_no}</td>
                      <td>
                        <div class="d-flex justify-content-left align-items-center">
                          <div class="d-flex flex-column">
                            <a class="user_name text-truncate text-body">
                              <span class="fw-bolder">
                                {helper.isObject(item.driver)
                                  ? item.driver.first_name +
                                    " " +
                                    item.driver.last_name
                                  : ""}
                              </span>
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
                      <td></td>

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
      <DeleteModal
        show={showDeleteModal}
        confirmationText={`Are you sure to ${deleteMessage} a vehicle`}
        confirmationHeading={`${helper.uppercaseFirst(
          deleteMessage
        )} a vehicle`}
        onHide={onCloseDeleteModal}
        submitAction={submitAction}
        disableBtn={overlay}
      />
    </div>
  );
}

export default SearchVehicle;
