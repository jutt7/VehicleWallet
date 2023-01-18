import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  InputGroup,
  Card,
  CardBody,
  Row,
  Col,
  UncontrolledTooltip,
  Button,
} from "reactstrap";
import "@styles/react/libs/charts/apex-charts.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "./styles.css";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import helper from "@src/@core/helper";
// import { useParams } from "react-router-dom";
import {
  Cloud,
  CloudOff,
  Send,
  RefreshCcw,
  ChevronUp,
  ChevronDown,
} from "react-feather";
// import "./comments.css";
import { ClipLoader } from "react-spinners";

let comment_color = {
  user: "#25ed21",
  driver: "#04db65",
  supervisor: "#0c5640",
  supplier: "#3b9845",
};

function ClientChat() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [cheight, setcheight] = useState();
  const [drivers, setDrivers] = useState([]);
  const [overlay, setoverlay] = useState(false);

  const getData = () => {
    let user = JSON.parse(localStorage.getItem("userDataCustomer"));
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/drivers`, {
        client: {
          clientId: user.client_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(helper.applyCountID(res.data.data), "data");
          setDrivers(helper.applyCountID(res.data.data));

          setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setDrivers([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setDrivers([]);
        setoverlay(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
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
        loading={false}
      />

      <div className="main">
        <div className="msgs">
          <Row>
            <Col style={{ display: "flex" }}>
              <input
                style={{ width: "100%", margin: "0.5em" }}
                className="form-control crud-search"
                placeholder={"Search Drivers"}
                // onChange={(e) => filterData(e.target.value)}
              />
            </Col>
          </Row>
          <hr></hr>
          <h5 style={{ marginTop: "10px" }}>Drivers</h5>
          <div
            style={{
              marginTop: "10px",
              overflowY: "auto",
              height: "65vh",
            }}
          >
            {drivers && drivers.length > 0 ? (
              drivers.map((item) => {
                return <Drivers name={item.label} />;
              })
            ) : (
              <p>No drivers found</p>
            )}

            {/* <Drivers name={"Test"} />
            <Drivers name={"Test"} />
            <Drivers name={"Test"} />
            <Drivers name={"Test"} /> */}
          </div>
        </div>
        <div className="chat"></div>
      </div>
    </>
  );
}

export default ClientChat;

const Drivers = ({ name }) => {
  return (
    <div>
      <div className="container">
        <div className="avatar me-1 bg-light-success">
          <span className="avatar-content">
            {helper.FirstWordFirstChar(name)}
          </span>
        </div>
        <label className="title">{name}</label>
      </div>
      <hr style={{ width: "100%", marginTop: 0 }}></hr>
    </div>
  );
};
