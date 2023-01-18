import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { Phone, Edit, Mail } from "react-feather";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import Select from "react-select";
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

import "./search-select.css";
import SearchDriver from "./searchDriver";
import Client from "../client/client";
import Network from "../gas-station-network";
import Station from "../gas-station/gasStation";
import SearchVehicle from "./searchVehicle";

function Search() {
  const [overlay, setoverlay] = useState(false);
  const [searchData, setSearchData] = useState("");
  const { t } = useTranslation();

  const [value, setValue] = useState("");
  const [data, setData] = useState([]);

  const [selected, setSelected] = useState("Type");

  const [rSelected, setRSelected] = useState("");

  const [windowSize, setWindowSize] = useState(getWindowSize());

  const getSearchData = () => {
    if (rSelected != "" && searchData != "") {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/search-driver-vehicle`, {
          search: rSelected,
          text: searchData,
        })
        .then((res) => {
          helper.redirectToLogin(
            helper.isObject(res.data) ? res.data.code : 200
          );
          if (res.status && res.status === 200) {
            setoverlay(false);
            console.log("dataaaaaaa", res.data.all_data);
            if (res.data.all_data.length > 0) {
              setData(helper.applyCountID(res.data.all_data));
            } else {
              helper.toastNotification("No Match found", "FAILED_MESSAGE");
            }
          } else {
            helper.toastNotification(
              "Unable to process request.",
              "FAILED_MESSAGE"
            );
            setData([]);

            setoverlay(false);
          }
        })
        .catch((error) => {
          console.log(error, "error");
          setoverlay(false);
          setData([]);
        });
    } else {
      helper.toastNotification(
        "Please choose an option and fill the input field",
        "FAILED_MESSAGE"
      );
    }
  };

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    console.log("height:", innerHeight);
    console.log("width:", innerWidth);
    return { innerWidth, innerHeight };
  }

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

      <Row>
        <Col lg={12}>
          <Row>
            <Col sm={windowSize.innerWidth > 1316 ? "4" : "0"}>
              <label
                style={{ fontWeight: "bold", fontSize: "1em", display: "flex" }}
              >
                {t("Choose an option")}
              </label>

              <Form>
                {["radio"].map((type) => (
                  <div key={`inline-${type}`} className="mb-3">
                    <Form.Check
                      style={{ fontSize: "1.35em" }}
                      inline
                      label={t("Client")}
                      name="group1"
                      type={type}
                      onClick={() => {
                        setData([]);
                        setSelected("Please enter name");
                        setRSelected("client");
                      }}
                    />
                    <Form.Check
                      style={{ fontSize: "1.35em" }}
                      inline
                      label={t("Gas Station")}
                      name="group1"
                      type={type}
                      onClick={() => {
                        setData([]);

                        setSelected("Please enter name");
                        setRSelected("gas_station");
                      }}
                    />
                    <Form.Check
                      style={{ fontSize: "1.35em" }}
                      inline
                      name="group1"
                      label={t("Gas Station Network")}
                      type={type}
                      onClick={() => {
                        setData([]);

                        setSelected("Please enter name");
                        setRSelected("network");
                      }}
                    />
                    <Form.Check
                      style={{ fontSize: "1.35em" }}
                      inline
                      label={t("Driver")}
                      name="group1"
                      type={type}
                      onClick={() => {
                        setData([]);

                        setSelected(
                          "Please enter name " + "/" + " Resident Permit No."
                        );
                        setRSelected("driver");
                      }}
                    />
                    <Form.Check
                      style={{ fontSize: "1.35em" }}
                      inline
                      name="group1"
                      label={t("Vehicle")}
                      type={type}
                      onClick={() => {
                        setData([]);

                        setSelected("Please enter title " + "/" + " Plate No.");
                        setRSelected("vehicle");
                      }}
                    />
                  </div>
                ))}
              </Form>
            </Col>
            <Col sm={windowSize.innerWidth < 1316 ? "3" : "2"}>
              <Label
                className="form-label"
                style={{
                  fontWeight: "bold",
                  fontSize: "1em",
                  display: "flex",
                  // marginTop: "15px",
                }}
              >
                {/* {selected}
                 */}
                {t("Please fill the input to search")}
              </Label>
              <input
                className="form-control crud-search"
                placeholder={`${t("Search")}...`}
                onChange={(e) => setSearchData(e.target.value)}
                style={{
                  width: "auto",
                  background: "white",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                }}
              />
            </Col>
            <Col sm="1" style={{ marginLeft: "20px" }}>
              <Button
                color="primary"
                style={{ marginTop: "19px" }}
                onClick={(e) => getSearchData()}
              >
                <i className="fa fa-search"></i>
              </Button>
            </Col>
            {/* <Col sm="6"></Col> */}
          </Row>
        </Col>
      </Row>

      <div
        style={{ marginTop: "50px" }}
        className="col-xs-12 col-sm-12 col-md-12"
      >
        {rSelected == "client" ? (
          <GetClient data={data} getSearchData={getSearchData} />
        ) : rSelected == "driver" ? (
          <GetDriver data={data} getSearchData={getSearchData} />
        ) : rSelected == "network" ? (
          <GetNetwork data={data} getSearchData={getSearchData} />
        ) : rSelected == "gas_station" ? (
          <GetStation data={data} getSearchData={getSearchData} />
        ) : rSelected == "vehicle" ? (
          <GetVehicle data={data} getSearchData={getSearchData} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Search;

const GetClient = ({ data, getSearchData }) => {
  console.log("dataaaaa in get client", data);
  return (
    <div>
      {data && data.length > 0 ? (
        <Client data={data} getSearchData={getSearchData} />
      ) : (
        ""
      )}
    </div>
  );
};
const GetNetwork = ({ data, getSearchData }) => {
  return (
    <div>
      {data && data.length > 0 ? (
        <Network data={data} getSearchData={getSearchData} />
      ) : (
        ""
      )}
    </div>
  );
};
const GetStation = ({ data, getSearchData }) => {
  return (
    <div>
      {data && data.length > 0 ? (
        <Station data={data} getSearchData={getSearchData} />
      ) : (
        ""
      )}
    </div>
  );
};
const GetDriver = ({ data, getSearchData }) => {
  return (
    <div>
      {data && data.length > 0 ? (
        <SearchDriver data={data} getSearchData={getSearchData} />
      ) : (
        ""
      )}
    </div>
  );
};
const GetVehicle = ({ data, getSearchData }) => {
  return (
    <div>
      {data && data.length > 0 ? (
        <SearchVehicle data={data} getSearchData={getSearchData} />
      ) : (
        ""
      )}
    </div>
  );
};

{
  /* <ButtonGroup>
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    setData([]);
                    setSelected("Please enter name");
                    setRSelected("client");
                  }}
                  active={rSelected == "client"}
                >
                  Client
                </Button>
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    setData([]);

                    setSelected("Please enter name");
                    setRSelected("gas_station");
                  }}
                  active={rSelected == "gas_station"}
                >
                  Gas Station
                </Button>
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    setData([]);

                    setSelected("Please enter name");
                    setRSelected("network");
                  }}
                  active={rSelected == "network"}
                  block
                >
                  Gas Station Network
                </Button>
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    setData([]);

                    setSelected(
                      "Please enter name " + "/" + " Resident Permit No."
                    );
                    setRSelected("driver");
                  }}
                  active={rSelected == "driver"}
                >
                  Driver
                </Button>
                <Button
                  outline
                  color="primary"
                  onClick={() => {
                    setData([]);

                    setSelected("Please enter title " + "/" + " Plate No.");
                    setRSelected("vehicle");
                  }}
                  active={rSelected == "vehicle"}
                >
                  Vehicle
                </Button>
              </ButtonGroup> */
}
