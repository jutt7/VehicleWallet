import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

export default function AddUpdateModal(props) {
  const [overlay, setoverlay] = useState(false);
  const { t } = useTranslation();
  const [form, setform] = useState({
    client_reference_number: "",
    plate_no: "",
    gas_tank_capacity: "",
    odometer: "",
    brand: "",
    make: "",
    model: "",
    color: "",
    last_service_date: "",
    next_service_date: "",
    last_refill_date: "",
    odo_last_updated_date: "",
    milage_per_liter: "",
    driver: [],
    fuel_type: [],
    vehicle_type: [],
    cost_center: "",
    days_limit: "",
    allowed_litters: "",
  });

  const days = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "13", value: "13" },
    { label: "14", value: "14" },
    { label: "15", value: "15" },
    { label: "16", value: "16" },
    { label: "17", value: "17" },
    { label: "18", value: "18" },
    { label: "19", value: "19" },
    { label: "20", value: "20" },
    { label: "21", value: "21" },
    { label: "22", value: "22" },
    { label: "23", value: "23" },
    { label: "24", value: "24" },
    { label: "25", value: "25" },
    { label: "26", value: "26" },
    { label: "27", value: "27" },
    { label: "28", value: "28" },
    { label: "29", value: "29" },
    { label: "30", value: "30" },
  ];

  const [error, seterror] = useState({
    plate_no: "",
    gas_tank_capacity: "",
    odometer: "",
    brand: "",
    make: "",
    model: "",
    color: "",
    last_service_date: "",
    next_service_date: "",
    last_refill_date: "",
    driver: "",
    fuel_type: "",
    vehicle_type: "",
    milage_per_liter: "",
    cost_center: "",
    allowed_litters: "",
  });

  const [checkPlate, setCheckPlate] = useState("");

  const onInputchange = (value, key) => {
    console.log("value , key:", value, key);
    let formUpdate = { ...form };
    formUpdate[key] = value;
    setform(formUpdate);
  };

  const checkFormat = (value) => {
    let errorCount = 0;
    let error = {};
    seterror({
      plate_no: "",
      gas_tank_capacity: "",
      odometer: "",
      brand: "",
      make: "",
      model: "",
      color: "",
      last_service_date: "",
      next_service_date: "",
      last_refill_date: "",
      driver: "",
      fuel_type: "",
      vehicle_type: "",
      milage_per_liter: "",
      cost_center: "",
    });
    if (value.length > 0) {
      console.log("value", value);
      let strFirstThree = value.substring(0, 1);
      if (isNaN(strFirstThree)) {
        console.log("not valid");
        error.plate_no = "Please use 1AAA format";
        errorCount++;
        seterror(error);
        setCheckPlate(error.plate_no);
      } else {
        console.log(" valid");
        setCheckPlate("");
      }
    }
  };

  const submit = () => {
    setoverlay(true);
    if (props.disableBtn) {
      return false;
    }

    let errorCount = 0;
    let error = {};

    seterror({
      plate_no: "",
      gas_tank_capacity: "",
      odometer: "",
      brand: "",
      make: "",
      model: "",
      color: "",
      last_service_date: "",
      next_service_date: "",
      last_refill_date: "",
      driver: "",
      fuel_type: "",
      vehicle_type: "",
      milage_per_liter: "",
      cost_center: "",
      allowed_litters: "",
    });

    if (
      !helper.isObject(props.updateModalData) &&
      helper.isEmptyString(form.plate_no)
    ) {
      error.plate_no = "Vehicle plate # is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.gas_tank_capacity)) {
      error.gas_tank_capacity = "Gas tank capacity is required";
      errorCount++;
      setoverlay(false);
    }

    if (!helper.isObject(form.fuel_type)) {
      error.fuel_type = "Fuel type is required";
      errorCount++;
      setoverlay(false);
    }

    if (!helper.isObject(form.vehicle_type)) {
      error.vehicle_type = "Vehicle type is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isSpecialCharacters(form.cost_center)) {
      error.cost_center = "Cost Center can only be alpha-numeric value";
      errorCount++;
      setoverlay(false);
    }

    if (errorCount > 0) {
      if (checkPlate != "") {
        error.plate_no = checkPlate;
      }
      seterror(error);
      setoverlay(false);
    } else {
      props.submitAction(form);
      setTimeout(() => {
        setoverlay(false);
      }, 2000);
    }
  };

  const setUpdateFormValues = () => {
    console.log(props, "props update data");

    const driver =
      helper.isObject(props.updateModalData) &&
      helper.isObject(props.updateModalData.driver)
        ? {
            value: props.updateModalData.driver_id,
            label:
              props.updateModalData.driver.first_name +
              " " +
              props.updateModalData.driver.middle_name +
              " " +
              props.updateModalData.driver.last_name,
          }
        : [];

    const fuel_type = helper.isObject(props.updateModalData)
      ? props.fuelTypeList.find(
          (i) => i.value === props.updateModalData.fuel_type
        )
      : [];

    const vehicle_type = helper.isObject(props.updateModalData)
      ? props.vehicleTypeList.find(
          (i) => i.value === props.updateModalData.type
        )
      : [];

    setform({
      client_reference_number: helper.isObject(props.updateModalData)
        ? props.updateModalData.client_reference_number
        : "",
      plate_no: helper.isObject(props.updateModalData)
        ? props.updateModalData.plate_no
        : "",
      gas_tank_capacity: helper.isObject(props.updateModalData)
        ? props.updateModalData.gas_tank_capacity
        : "",
      odometer: helper.isObject(props.updateModalData)
        ? props.updateModalData.odometer
        : "",
      brand: helper.isObject(props.updateModalData)
        ? props.updateModalData.brand
        : "",
      make: helper.isObject(props.updateModalData)
        ? props.updateModalData.make
        : "",
      model: helper.isObject(props.updateModalData)
        ? props.updateModalData.model
        : "",
      color: helper.isObject(props.updateModalData)
        ? props.updateModalData.color
        : "",
      milage_per_liter: helper.isObject(props.updateModalData)
        ? props.updateModalData.milage_per_liter
        : "",
      odo_last_updated_date: helper.isObject(props.updateModalData)
        ? props.updateModalData.odo_last_updated_date
        : "",
      last_service_date: helper.isObject(props.updateModalData)
        ? helper.setDatetimeLocalDate(props.updateModalData.last_service_date)
        : "",
      next_service_date: helper.isObject(props.updateModalData)
        ? helper.setDatetimeLocalDate(props.updateModalData.next_service_date)
        : "",

      last_refill_date: helper.isObject(props.updateModalData)
        ? helper.setDatetimeLocalDate(props.updateModalData.last_refill_date)
        : "",
      odo_last_updated_date: helper.isObject(props.updateModalData)
        ? helper.setDatetimeLocalDate(
            props.updateModalData.odo_last_updated_date
          )
        : "",
      cost_center: helper.isObject(props.updateModalData)
        ? props.updateModalData.cost_center
        : "",
      days_limit: helper.isObject(props.updateModalData)
        ? {
            label: props.updateModalData.days_limit,
            value: props.updateModalData.days_limit,
          }
        : [],
      allowed_litters: helper.isObject(props.updateModalData)
        ? props.updateModalData.allowed_litters
        : "",
      driver: driver,
      fuel_type: fuel_type,
      vehicle_type: vehicle_type,
    });

    seterror({
      plate_no: "",
      gas_tank_capacity: "",
      odometer: "",
      brand: "",
      make: "",
      model: "",
      color: "",
      last_service_date: "",
      next_service_date: "",
      last_refill_date: "",
      driver: "",
      fuel_type: "",
      vehicle_type: "",
      milage_per_liter: "",
    });
  };

  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onHide}
        onShow={(e) => setUpdateFormValues()}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {props.updateModalData ? t("Update Vehicle") : t("Add Vehicle")}
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
            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    {t("Vehicle Plate")} #{" "}
                    {!helper.isObject(props.updateModalData) ? (
                      <span style={{ color: "red" }}>*</span>
                    ) : (
                      ""
                    )}
                  </label>
                  <input
                    type="text"
                    name="plate_no"
                    maxlength="7"
                    // disabled={
                    //   !helper.isObject(props.updateModalData) ? false : true
                    // }
                    value={form.plate_no || ""}
                    onChange={(e) => {
                      onInputchange(
                        helper.cleanString(e.target.value),
                        "plate_no"
                      );

                      checkFormat(helper.cleanString(e.target.value));
                    }}
                    className="form-control"
                    placeholder="Plate Number"
                  />
                  <p style={{ color: "red" }}>
                    {error.plate_no ? error.plate_no : ""}
                  </p>
                </Col>

                <Col>
                  <label>
                    {t("Vehicle Type")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    isDisabled={props.updateModalData ? "true" : ""}
                    name="vehicle_type"
                    onChange={(e) => onInputchange(e, "vehicle_type")}
                    options={props.vehicleTypeList}
                    value={form.vehicle_type || []}
                    isClearable={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  <p style={{ color: "red" }}>
                    {error.vehicle_type ? error.vehicle_type : ""}
                  </p>
                </Col>

                <Col>
                  <label>
                    {t("Fuel Type")} <span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    name="fuel_type"
                    onChange={(e) => onInputchange(e, "fuel_type")}
                    options={props.fuelTypeList}
                    value={form.fuel_type || []}
                    isClearable={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  <p style={{ color: "red" }}>
                    {error.fuel_type ? error.fuel_type : ""}
                  </p>
                </Col>
              </Row>
            </div>

            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    {t("Millage per liter")}{" "}
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </label>
                  <input
                    name="milage_per_liter"
                    value={form.milage_per_liter || ""}
                    onChange={(e) =>
                      onInputchange(
                        helper.cleanInteger(e.target.value),
                        "milage_per_liter"
                      )
                    }
                    className="form-control"
                    placeholder="Millage per liter"
                  />
                  <p style={{ color: "red" }}>
                    {error.milage_per_liter ? error.milage_per_liter : ""}
                  </p>
                </Col>
                <Col>
                  <label>{t("Driver")}</label>
                  <Select
                    name="driver"
                    onChange={(e) => onInputchange(e, "driver")}
                    options={props.driverList}
                    value={form.driver || []}
                    isClearable={true}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  <p style={{ color: "red" }}>
                    {error.driver ? error.driver : ""}
                  </p>
                </Col>
                <Col>
                  <label>
                    {t("Gas tank capacity")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="gas_tank_capacity"
                    value={form.gas_tank_capacity || ""}
                    onChange={(e) =>
                      onInputchange(
                        helper.cleanInteger(e.target.value),
                        "gas_tank_capacity"
                      )
                    }
                    className="form-control"
                    placeholder="Gas tank capacity"
                  />
                  <p style={{ color: "red" }}>
                    {error.gas_tank_capacity ? error.gas_tank_capacity : ""}
                  </p>
                </Col>
              </Row>
            </div>

            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>{t("Last Odometer / Last Odometer as of Date")}</label>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      name="odometer"
                      value={form.odometer || ""}
                      onChange={(e) =>
                        onInputchange(
                          helper.cleanInteger(e.target.value),
                          "odometer"
                        )
                      }
                      className="form-control"
                      placeholder="Odometer"
                      style={{ width: "70%", marginRight: "5px" }}
                    />
                    <input
                      type="datetime-local"
                      name="odo_last_updated_date"
                      value={form.odo_last_updated_date || ""}
                      onChange={(e) =>
                        onInputchange(e.target.value, "odo_last_updated_date")
                      }
                      className="form-control"
                      // disabled={
                      //   helper.isObject(props.updateModalData) ? true : false
                      // }
                      placeholder="Last Odometer Date"
                    />
                  </div>
                </Col>
                <Col>
                  {/* <label>
                    {t("Allowed liters in given days")}{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      name="allowed_litters"
                      value={form.allowed_litters || ""}
                      onChange={(e) =>
                        onInputchange(
                          helper.cleanDecimal(e.target.value),
                          "allowed_litters"
                        )
                      }
                      className="form-control"
                      placeholder="Allowed Liters"
                      style={{ width: "40%", marginRight: "5px" }}
                    />
                    <Select
                      name="allow_days"
                      onChange={(e) => onInputchange(e, "days_limit")}
                      options={days}
                      value={form.days_limit || []}
                      isClearable={true}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                    <p style={{ color: "red" }}>
                      {error.allowed_litters ? error.allowed_litters : ""}
                    </p>
                  </div> */}
                </Col>
                {/* <Col></Col> */}
              </Row>
            </div>

            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>{t("Make")}</label>
                  <input
                    type="text"
                    name="make"
                    value={form.make || ""}
                    onChange={(e) => onInputchange(e.target.value, "make")}
                    className="form-control"
                    placeholder="make"
                  />
                </Col>
                <Col>
                  <label>{t("Brand")}</label>
                  <input
                    type="text"
                    name="brand"
                    value={form.brand || ""}
                    onChange={(e) => onInputchange(e.target.value, "brand")}
                    className="form-control"
                    placeholder="brand"
                  />
                </Col>
                <Col>
                  <label>{t("Modal")}</label>
                  <input
                    type="text"
                    name="model"
                    value={form.model || ""}
                    onChange={(e) => onInputchange(e.target.value, "model")}
                    className="form-control"
                    placeholder="Modal"
                  />
                </Col>
              </Row>
            </div>

            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>{t("Color")}</label>
                  <input
                    type="text"
                    name="color"
                    value={form.color || ""}
                    onChange={(e) => onInputchange(e.target.value, "color")}
                    className="form-control"
                    placeholder="Color"
                  />
                </Col>

                <Col>
                  <label>{t("Last Service Date")}</label>
                  <input
                    type="datetime-local"
                    name="last_service_date"
                    value={form.last_service_date || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "last_service_date")
                    }
                    className="form-control"
                    placeholder="Last Service Date"
                  />
                </Col>
                <Col>
                  <label>{t("Next Service Date")}</label>
                  <input
                    type="datetime-local"
                    name="next_service_date"
                    value={form.next_service_date || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "next_service_date")
                    }
                    className="form-control"
                    placeholder="Next Service Date"
                  />
                </Col>
              </Row>
            </div>
            <div className="form-group marginBottom-5px">
              <Row>
                <Col>
                  <label>
                    {t("Client Reference Number")}
                    {/* <span style={{ color: "red" }}>*</span> */}
                  </label>
                  <input
                    type="text"
                    name="client_reference_number"
                    value={form.client_reference_number || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "client_reference_number")
                    }
                    className="form-control"
                    placeholder="Client Reference Number"
                  />
                  <p style={{ color: "red" }}>
                    {error.client_reference_number
                      ? error.client_reference_number
                      : ""}
                  </p>
                </Col>
                <Col>
                  <label>{t("Cost Center")}</label>
                  <input
                    type="text"
                    name="cost_center"
                    value={form.cost_center || ""}
                    onChange={(e) =>
                      onInputchange(e.target.value, "cost_center")
                    }
                    className="form-control"
                    placeholder="Cost Center"
                  />
                  <p style={{ color: "red" }}>
                    {error.cost_center ? error.cost_center : ""}
                  </p>
                </Col>
                <Col></Col>
              </Row>
            </div>

            {/*--------Check box ----------------- */}
            {/* <div
              className="form-group"
              style={{
                alignItems: "center",
                display: "flex",
                marginTop: "15px",
              }}
            >
              
              <input
                type="checkbox"
                name="vehicle1"

              />
              <label style={{ marginLeft: "10px" }}>
                Is it a replacement vehicle ?
              </label>
             
            </div> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => submit()}>
            <i className="fas fa-check"></i>{" "}
            {helper.isObject(props.updateModalData) ? t("Update") : t("Submit")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
