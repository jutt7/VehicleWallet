import React, { useState, useEffect } from "react";
import { Modal, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { ClipLoader } from "react-spinners";
import DriverSheet from "../../../assets/files/DriverSheet.xlsx";
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
import Select from "react-select";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";

export default function Transfer(props) {
  const [value, setValue] = useState("");
  const [station, setStation] = useState("");
  const [item, setItem] = useState({});
  const [overlay, setoverlay] = useState(false);
  const [gasStations, setGasStations] = useState([]);
  const [option, setOption] = useState([]);
  const [form, setForm] = useState({
    staff_id: "",
    gas_station_id: "",
  });

  const setData = (data) => {
    let arr = [];
    data.forEach((element) => {
      let staff_arr = [];
      if (element.staff.length > 0) {
        element.staff.forEach((item) => {
          let obj = {
            label:
              item.first_name +
              " " +
              item.last_name +
              " (" +
              item.civil_record_or_resident_permit_number +
              ") - " +
              item.designation,
            value: item.staff_id,
          };
          staff_arr.push(obj);
        });
      }
      let obj = {
        label: element.name_en,
        options: staff_arr,
      };
      arr.push(obj);
    });
    setOption(arr);
  };

  const getData = () => {
    if (item.gas_station_network_id != null) {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/gas-station-attendents`, {
          gas_station_network_id: item.gas_station_network_id,
        })

        .then((res) => {
          helper.redirectToLogin(
            helper.isObject(res.data) ? res.data.code : 200
          );
          if (res.data.code && res.data.code === 200) {
            setoverlay(false);
            // console.log("gas station data", res.data.data);
            setData(res.data.data);
            // helper.toastNotification(
            //   "Request has been processed successfuly.",
            //   "SUCCESS_MESSAGE"
            // );
          } else {
            setoverlay(false);

            helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
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
    }
  };

  const getGasStations = () => {
    if (item.gas_station_network_id != null) {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/all-gas-stations`, {
          gas_station_network_id: item.gas_station_network_id,
        })

        .then((res) => {
          helper.redirectToLogin(
            helper.isObject(res.data) ? res.data.code : 200
          );
          if (res.data.code && res.data.code === 200) {
            setoverlay(false);

            setGasStations(res.data.data);
          } else {
            setoverlay(false);

            helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
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
    }
  };

  const transfer = () => {
    if (form.staff_id != "" && form.gas_station_id != "") {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/update-station`, {
          gas_station_id: form.gas_station_id,
          staff_id: form.staff_id,
        })

        .then((res) => {
          helper.redirectToLogin(
            helper.isObject(res.data) ? res.data.code : 200
          );
          if (res.data.code && res.data.code === 200) {
            setoverlay(false);
            setForm({
              staff_id: "",
              gas_station_id: "",
            });
            setGasStations([]);
            setOption([]);
            setItem({});
            helper.toastNotification(res.data.message_en, "SUCCESS_MESSAGE");
            props.setShowTransferModal(false);
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
    } else {
      helper.toastNotification(
        "Please select attendent and gas station.",
        "FAILED_MESSAGE"
      );
    }
  };

  useEffect(() => {
    if (item != null) {
      getData();
      getGasStations();
    }
  }, [item]);

  const setValues = () => {
    setItem(props.transferModalData);
  };

  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onCloseModal}
        onShow={(e) => setValues()}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Transfer Staff</Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            height: "200px",
            overflowY: "auto",
          }}
        >
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
          </div>
          <Row style={{ width: "100%", marginTop: "30px", marginLeft: "15px" }}>
            <Col lg={12}>
              <Row>
                <Col sm="6">
                  <label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Select Staff
                  </label>

                  <Select
                    // styles={colourStyles}
                    options={option}
                    onChange={(...args) => {
                      setForm({
                        staff_id: args[0].value,
                      });
                    }}
                    search
                    placeholder="Search..."
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </Col>
                <Col sm="4">
                  <label style={{ fontWeight: "bold", fontSize: "1em" }}>
                    Transfer to another Gas Station
                  </label>

                  <Select
                    // styles={colourStyles}
                    isDisabled={form.staff_id == "" ? true : false}
                    style={{
                      height: "40px",
                      fontWeight: "bold",
                      fontSize: "2em",
                    }}
                    options={gasStations}
                    onChange={(...args) => {
                      let f = form;
                      f["gas_station_id"] = args[0].value;
                      setForm(f);
                    }}
                    search
                    placeholder="Search..."
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </Col>
                <Col sm="2">
                  <Button
                    color="primary"
                    style={{ marginTop: "19px" }}
                    onClick={(e) => {
                      console.log("form is", form);
                      transfer();
                    }}
                  >
                    Transfer
                  </Button>
                </Col>
                <Col sm="4"></Col>
              </Row>
            </Col>
          </Row>
        </Modal.Body>

        {/* <Modal.Footer>
          <Button color="primary">
            <i className="fas fa-check"></i> Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}

const colourStyles = {
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      fontSize: "14px",
      fontWeight: "500",
    };
  },
  group: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      fontSize: "20px",
      fontWeight: "bold",
    };
  },
};
