import React, { useState, useEffect, useRef } from "react";
import { Modal, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import axios from "axios";
import { Check } from "react-feather";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { ClipLoader } from "react-spinners";

import { Button, Row, Col, Input } from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";

import { Card, CardBody, UncontrolledTooltip } from "reactstrap";

import { useParams } from "react-router-dom";
import { Send, RefreshCcw } from "react-feather";

let comment_color = {
  driver: " #2D7337",
  client: "#0c5640",
  supervisor: "#0c5640",
  supplier: "#3b9845",
};

export default function MessageModal(props) {
  const [overlay, setoverlay] = useState(false);
  const [driver, setDriver] = useState("");

  const [allmsg, setallmsg] = useState([]);
  const [msg, setmsg] = useState("");

  useEffect(() => {
    // setcheight("10");
    if (allmsg.length > 0) {
      updateScroll();
    }
  }, [allmsg]);

  const updateScroll = () => {
    var element = document.querySelector("#cbody");
    element.scrollTop = element.scrollHeight;
  };

  const getComments = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/get-comments`, {
        driver_id: driver.driver_id,
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          console.log("commentsssssss", res.data.data);
          setallmsg(res.data.data);
        }
        setoverlay(false);
      })
      .catch((error) => {
        setoverlay(false);
        console.log(error, "error");
      });
  };

  const submit = () => {
    setoverlay(true);
    const args = {
      comment: {
        comment_text: msg,
        receiver_id: driver.driver_id,
      },
    };

    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/add-comment`, args)
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          console.log("comment from driver", res.data);
          setoverlay(false);
          setmsg("");
          getComments();

          helper.toastNotification(res.data.message, "SUCCESS_MESSAGE");
        } else {
          setoverlay(false);
          helper.toastNotification(
            "Unable to process request",
            "FAILED_MESSAGE"
          );
        }
      })
      .catch((error) => {
        setoverlay(false);
        console.log(error, "error");
        helper.toastNotification("Unable to process request", "FAILED_MESSAGE");
      });
  };

  useEffect(() => {
    if (driver != "") {
      getComments();
    }
  }, [driver]);

  return (
    <div>
      <Modal
        show={props.show}
        onHide={() => {
          setallmsg("");
          setmsg("");
          setDriver("");
          props.onCloseBulkUpdateModal();
        }}
        onShow={(e) => {
          setallmsg("");
          setmsg("");
          setDriver(props.driver ? props.driver : "");
          console.log("driverrrrr id", props.driver);
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Message</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "650px", overflowY: "auto" }}>
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
            <div className="chat-app-window">
              <div>
                <Card>
                  <Card>
                    <CardBody>
                      <Row
                        style={{
                          backgroundColor: "white",
                          borderStyle: "groove",
                        }}
                      >
                        <Col lg={4}>
                          <label
                            style={{ padding: "12px", fontWeight: "bold" }}
                          >
                            <b>
                              {props.driver
                                ? helper.uppercaseFirst(
                                    props.driver.first_name
                                  ) +
                                  " " +
                                  helper.uppercaseFirst(props.driver.last_name)
                                : ""}
                            </b>
                          </label>
                          <Button
                            color="primary"
                            style={{ marginBottom: "5px" }}
                            onClick={() => getComments()}
                          >
                            <RefreshCcw size={15} />
                          </Button>
                        </Col>
                        <Col
                          style={{ padding: "12px", textAlign: "end" }}
                          lg={8}
                        >
                          <label>Driver</label>
                          <span
                            style={{
                              backgroundColor: comment_color.driver,
                              height: "10px",
                              color: comment_color.driver,
                              marginRight: "10px",
                              marginLeft: "5px",
                            }}
                          >
                            aa
                          </span>
                          <label>Client</label>
                          <span
                            style={{
                              backgroundColor: comment_color.client,
                              height: "10px",
                              color: comment_color.client,
                              marginRight: "10px",
                              marginLeft: "5px",
                            }}
                          >
                            aa
                          </span>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <CardBody
                    style={{
                      height: "415px",
                      overflowY: "auto",
                    }}
                    id="cbody"
                  >
                    {helper.isArray(allmsg) && allmsg.length ? (
                      allmsg.map((item, index) => (
                        <Row
                          key={index}
                          style={
                            item.sender_type == "driver"
                              ? { direction: "rtl", marginBottom: "10px" }
                              : { marginBottom: "10px" }
                          }
                        >
                          <Col>
                            <div
                              style={{
                                backgroundColor:
                                  comment_color[item.sender_type],
                                color: "white",
                                borderRadius: "10px",
                                padding: "5px",
                              }}
                            >
                              <label style={{ fontWeight: "bold" }}>
                                {item.sender_type == "driver"
                                  ? props.driver
                                    ? helper.uppercaseFirst(
                                        props.driver.first_name
                                      ) +
                                      " " +
                                      helper.uppercaseFirst(
                                        props.driver.last_name
                                      )
                                    : ""
                                  : driver && helper.isObject(driver.client)
                                  ? driver.client.name_en
                                  : ""}
                              </label>
                              <br />

                              <label style={{ fontSize: "1.2em" }}>
                                {item.comment_text}
                              </label>
                            </div>
                            <label
                              style={
                                item.sender_type == "driver"
                                  ? { float: "left" }
                                  : { float: "right" }
                              }
                            >
                              {helper.humanReadableDate(item.created_at)}
                            </label>
                            {/* <Check
                              size={14}
                              color={item.is_read != "1" ? "blue" : "grey"}
                            /> */}
                          </Col>
                          <Col></Col>
                        </Row>
                      ))
                    ) : (
                      <p>No Messages found.</p>
                    )}
                    {/* <div ref={bottomRef} /> */}
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <InputGroup>
                      <Input
                        style={{
                          paddingTop: "15px",
                          paddingBottom: "15px",
                          fontSize: "1.2em",
                        }}
                        value={msg}
                        onChange={(e) => setmsg(e.target.value)}
                        placeholder="Type your message here..."
                      />
                      <Row id="private" style={{ margin: "0px 5px" }}>
                        <input
                          type="checkbox"
                          //   value={ptype}
                          //   checked={ptype ? true : false}
                          //   onClick={(e) => setptype(!ptype)}
                        ></input>
                      </Row>
                      <Row id="public">
                        <Button color="primary" className="privateBtn">
                          <Send
                            size={20}
                            color="#fff"
                            style={{ cursor: "pointer" }}
                            onClick={submit}
                          />
                        </Button>
                      </Row>
                    </InputGroup>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

// [
//     {
//       created_source: "user",
//       commenter: "awais",
//       comment_type: "public",
//       comment_text: "hello how are you?",
//       created_at: "15-09-2022",
//     },
//     {
//       created_source: "driver",
//       commenter: "gondal",
//       comment_type: "public",
//       comment_text: "Im fine",
//       created_at: "16-10-2022",
//     },
//     {
//       created_source: "user",
//       commenter: "awais",
//       comment_type: "public",
//       comment_text: "hello how are you?",
//       created_at: "15-09-2022",
//     },
//     {
//       created_source: "driver",
//       commenter: "gondal",
//       comment_type: "public",
//       comment_text: "Im fine",
//       created_at: "16-10-2022",
//     },
//   ]
