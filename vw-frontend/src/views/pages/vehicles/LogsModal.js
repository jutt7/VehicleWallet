import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";

export default function LogsModal(props) {
  const [overlay, setoverlay] = useState(false);
  const { t } = useTranslation();
  const [data, setData] = useState([]);

  const getData = () => {
    setData([]);
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/vehicle-logs`, {
        logs: {
          vehicle_id: props.updateModalData.vehicle_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log(helper.applyCountID(res.data.vehicle_driver_log), "data");
          setData(helper.applyCountID(res.data.vehicle_driver_log));

          setoverlay(false);
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
        setData([]);
        setoverlay(false);
      });
  };

  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onHide}
        onShow={(e) => getData()}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            Vehicle Logs
            {props.clientName ? ` - ${props.clientName}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "420px", overflowY: "auto" }}>
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
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th
                      className="table-th blackColor"
                      style={{ width: "120px" }}
                    >
                      <p>{t("Title")}</p>
                    </th>

                    <th className="table-th blackColor">
                      <p>{t("Amount")}</p>
                    </th>
                    <th className="table-th blackColor">
                      <p>{t("Created at")}</p>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data && data.length > 0 ? (
                    data.map((item, index) => (
                      <tr
                        key={index}
                        className={
                          helper.applyRowClass(item) === true
                            ? `evenRowColor`
                            : "oddRowColor"
                        }
                      >
                        <td>
                          {helper.isObject(item) && helper.isObject(item.action)
                            ? item.action.title
                            : ""}
                        </td>
                        <td>{item.amount ? item.amount : ""}</td>
                        <td>{helper.humanReadableDate(item.created_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <p>No Logs found</p>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              props.close(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
