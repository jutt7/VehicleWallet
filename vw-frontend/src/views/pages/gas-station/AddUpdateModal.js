import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { connectAdvanced } from "react-redux";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import SearchOnMap from "./searchOnMap";
import { useTranslation } from "react-i18next";
import "./modal.css";
export default function AddUpdateModal(props) {
  const [overlay, setoverlay] = useState(false);

  const { t } = useTranslation();

  const [showMapModal, setShowMapModal] = useState(false);

  const [pricing, setPricing] = useState([]);
  const [option, setOption] = useState([]);

  const [isNewData, setIsNewData] = useState("");

  const [location, setLocation] = useState({
    lat: "",
    lng: "",
  });

  const [form, setform] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    address: "",
    lat: "",
    lng: "",
    working_hour_start: "",
    working_hour_end: "",
    gas_station_network: [],
    fuel_91: false,
    fuel_95: false,
    diesel: false,
    dispenser_type: "",
    geo_fence_radius: "",
    handheld_device: [],
    break_start_hours: "",
    break_end_hours: "",
    contact_no: "",
    operation_contact_person: "",
    operation_contact_number: "",
    operation_contact_email: "",
    admin_contact_person: "",
    admin_contact_email: "",
    admin_contact_number: "",
    billing_contact_person: "",
    billing_contact_email: "",
    billing_contact_number: "",
    admin_password: "",
    billing_password: "",
    operation_password: "",
    account_number: "",
    location_id: [],
    qualified: [],
    wifi: [],
    // fuel_price_type:[],
    price: {
      value: "city price",
      label: "City Price",
    },
    reference: "",
  });

  const [error, seterror] = useState({
    name_en: "",
    name_ar: "",
    name_ur: "",
    address: "",
    lat: "",
    lng: "",
    gas_station_network: "",
    handheld_device: "",
    fuel_type: "",
    geo_fence_radius: "",
    operation_contact_person: "",
    operation_contact_number: "",
    operation_contact_email: "",
    admin_contact_person: "",
    admin_contact_em: "",
    admin_contact_number: "",
    billing_contact_person: "",
    billing_contact_email: "",
    billing_contact_number: "",
    admin_password: "",
    billing_password: "",
    operation_password: "",
    location_id: "",
    reference: "",
  });

  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const [checkOperation, setCheckOperation] = useState("");

  const onInputchange = (value, key) => {
    console.log("value", value);
    let formUpdate = { ...form };

    formUpdate[key] = value;
    setform(formUpdate);
  };

  const submit = () => {
    setoverlay(true);
    let errorCount = 0;
    let error = {};

    seterror({
      name_en: "",
      name_ar: "",
      name_ur: "",
      address: "",
      lat: "",
      lng: "",
      gas_station_network: "",
      handheld_device: "",
      fuel_type: "",
      geo_fence_radius: "",
      operation_contact_person: "",
      operation_contact_number: "",
      operation_contact_email: "",
      admin_contact_person: "",
      admin_contact_em: "",
      admin_contact_number: "",
      billing_contact_person: "",
      billing_contact_email: "",
      billing_contact_number: "",
      admin_password: "",
      billing_password: "",
      operation_password: "",
      location_id: "",
    });

    if (helper.isEmptyString(form.geo_fence_radius)) {
      error.geo_fence_radius = "Geo Fence Radius is required";
      errorCount++;
      setoverlay(false);
    }
    if (helper.isEmptyString(form.name_en)) {
      error.name_en = "Name english is required";
      errorCount++;
      setoverlay(false);
    }

    // if (helper.isEmptyString(form.name_ar)) {
    //   error.name_ar = "Name arabic is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    if (helper.isEmptyString(form.address)) {
      error.address = "Address is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.lat)) {
      error.lat = "Latitude is required";
      errorCount++;
      setoverlay(false);
    }

    if (helper.isEmptyString(form.lng)) {
      error.lng = "Longitude is required";
      errorCount++;
      setoverlay(false);
    }

    if (
      form.fuel_91 === false &&
      form.fuel_95 === false &&
      form.diesel === false
    ) {
      error.fuel_type = "Fuel type is required";
      errorCount++;
      setoverlay(false);
    }

    // if (
    //   helper.isEmptyString(form.admin_contact_email) &&
    //   !helper.isEmail(form.admin_contact_email)
    // ) {
    //   error.admin_contact_em = "Valid email is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    // if (helper.isEmptyString(form.admin_contact_person)) {
    //   console.log("Contact person is required", form.admin_contact_person);
    //   error.admin_contact_person = "Contact person is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    // if (helper.isEmptyString(form.admin_contact_number)) {
    //   error.admin_contact_number = "Number is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    // if (
    //   !helper.isEmptyString(form.admin_contact_number) &&
    //   form.admin_contact_number.charAt(0) != 5
    // ) {
    //   error.admin_contact_number = "Mobile number should start with 5";
    //   errorCount++;
    //   setoverlay(false);
    // }

    // if (!props.updateModalData) {
    //   if (helper.isEmptyString(form.admin_password)) {
    //     error.admin_password = "Password is required";
    //     errorCount++;
    //     setoverlay(false);
    //   }
    // }

    console.log(error, "gas station error");
    if (errorCount > 0) {
      seterror(error);
      setoverlay(false);
    } else {
      let c = 0;
      console.log("pricing", pricing);
      for (let i = 0; i < pricing.length; i++) {
        if (pricing[i].status == 1) {
          if (
            pricing[i].price > pricing[i].price_upper_limit ||
            pricing[i].price <= pricing[i].price_lower_limit
          ) {
            c++;
          }
          if (
            pricing[i].extra_price != 0 &&
            (pricing[i].extra_price.toString().substring(0, 1) != 0 ||
              pricing[i].extra_price.toString().charAt(1) != "." ||
              pricing[i].extra_price.length > 5)
          ) {
            c++;
          }
        }
      }
      if (c > 0) {
        console.log("in if", c);
        setoverlay(false);
        return;
      } else {
        console.log("in else", c);

        props.setIsNewData(isNewData);

        props.submitAction(form);

        setTimeout(() => {
          setoverlay(false);
        }, 2000);
      }
      // console.log(form, "form from modal");
      // props.setCheck(checked);
      // props.setCheck2(checked2);
      // {
      //   props.updateModalData
      //     ? props.comission(sendPricing("update"))
      //     : props.comission(sendPricing("create"));
      // }
    }
  };

  const setData = (data) => {
    console.log("set dataaaaaaa", data);
    let arr = [];

    data.forEach((item) => {
      let obj = {
        title_en: helper.isObject(item.fuel_type)
          ? item.fuel_type.title_en
          : item.title_en,
        vw_commision: helper.isObject(item) ? item.vw_commision : "",
        base_price: helper.isObject(item) ? item.vw_commision : "",
        price_id: helper.isObject(item) ? item.price_id : "",
        fuel_type_id:
          helper.isObject(item) && item.fuel_type_id
            ? item.fuel_type_id
            : item.id,
      };
      arr.push(obj);
    });
    console.log("set arrrrrrrr", arr);

    setPricing(arr);
  };

  const filterPrice = (check, fuelType) => {
    let arr = pricing;
    const x = arr.find((item) => item.label == fuelType);

    if (!helper.isObject(x)) {
      let obj = props.fuelData.find((item) => item.title_en == fuelType);
      console.log("objjjjjjjjjjjjjjj", obj);
      if (helper.isObject(obj)) {
        let o = {
          base_price: obj.base_price,
          label: obj.title_en,
          id: obj.id ? obj.id : "",
          add_price: "",
          price: obj.base_price,
          extra_price: 0,
          price_id: "",
          price_upper_limit: obj.price_upper_limit,
          price_lower_limit: obj.price_lower_limit,
          status: check,
        };
        arr.push(o);
      }
    }
    console.log("arrrrrrrrr", arr);

    pricing.filter((element, index) => {
      {
        if (element.label == fuelType && check) {
          let newData = pricing;

          newData[index].status = 1;
          setPricing([...newData]);
        } else if (element.label == fuelType && !check) {
          let newData = pricing;

          newData[index].status = 0;
          setPricing([...newData]);
        }
      }
    });
  };

  const setPrice = (fuelData, st) => {
    let arr = [];
    let a = [];
    let data = fuelData;

    if (data && data.length > 0) {
      data.forEach((element) => {
        let obj = {
          base_price:
            props.updateModalData && element.fuel_type
              ? element.fuel_type.base_price
              : element.base_price,
          label:
            props.updateModalData && element.fuel_type
              ? element.fuel_type.title_en
              : element.title_en,
          id:
            props.updateModalData && element.fuel_type
              ? element.fuel_type.id
              : element.id,
          add_price: "",
          price:
            props.updateModalData && element.fuel_type
              ? // ? element.extra_price
                (
                  parseFloat(element.price) - parseFloat(element.extra_price)
                ).toFixed(2)
              : // :  -
                //   parseFloat(element.extra_price) * 0.01
                // parseFloat(element.price)
                element.base_price,
          extra_price:
            props.updateModalData && element.fuel_type && element.extra_price
              ? element.extra_price
              : 0,
          price_id:
            props.updateModalData && element.fuel_type ? element.id : "",
          price_upper_limit:
            props.updateModalData && element.fuel_type
              ? element.fuel_type.price_upper_limit
              : element.price_upper_limit,
          price_lower_limit:
            props.updateModalData && element.fuel_type
              ? element.fuel_type.price_lower_limit
              : element.price_lower_limit,
          status: st,
        };

        let price = element.base_price;
        let arry = [];
        for (let i = -60; i <= -1; i++) {
          arry.push({
            value: i,
            label: i,
          });
          // }
        }

        price = element.base_price;
        arry.push({
          value: 0,
          label: 0,
        });
        for (let i = 1; i <= 60; i++) {
          arry.push({
            value: i,
            label: i,
          });
          // }
        }
        arry.sort((a, b) => (a.label > b.label ? 1 : -1));

        arr.push(obj);
        a.push(arry);
      });
    }
    if (props.updateModalData) {
      arr.forEach((item) => {
        if (item.label == "fuel_91") {
          if (props.updateModalData.fuel_91 == 1) {
            item.status = 1;
          }
        } else if (item.label == "fuel_95") {
          if (props.updateModalData.fuel_95 == 1) {
            item.status = 1;
          }
        } else if (item.label == "diesel") {
          if (props.updateModalData.diesel == 1) {
            item.status = 1;
          }
        }
      });
    }
    console.log("arrrrrrrrrrrrrrr", arr);
    setOption(a);
    setPricing(arr);
    props.setFuelPrice(arr);
  };

  const setUpdateFormValues = () => {
    console.log(props.updateModalData, "props.updateModalData");

    if (props.updateModalData) {
      setPrice(props.updateModalData.fuel_prices, props.updateModalData, 0);
    } else {
      setPrice(props.fuelData, 1);
    }

    // const gas_station_network = helper.isObject(props.updateModalData)
    //   ? props.gasStationNetworkList.find(
    //       (i) => i.value === props.updateModalData.gas_station_network_id
    //     )
    //   : [];

    const handheld_device = [];

    helper.isObject(props.updateModalData) &&
    helper.isObject(props.updateModalData.hand_held_device)
      ? props.updateModalData.hand_held_device.forEach((i) => {
          let obj = {
            id: i.id,
            label: `${i.serial_no} - ${i.app_installed_vw_version} - ${i.operating_system}`,
          };

          handheld_device.push(obj);
        })
      : [];

    console.log(props.updateModalData, "props.updateModalData");

    connectAdvanced;

    console.log(props.updateModalData, "props.updateModalData");

    if (
      helper.isObject(props.updateModalData) &&
      helper.isObject(props.updateModalData.users)
    ) {
      if (props.updateModalData.users.length == 3) {
        setChecked(true);
        setChecked2(true);
      }
    }

    setform({
      name_en: helper.isObject(props.updateModalData)
        ? props.updateModalData.name_en
        : "",
      name_ar: helper.isObject(props.updateModalData)
        ? props.updateModalData.name_ar
        : "",
      name_ur: helper.isObject(props.updateModalData)
        ? props.updateModalData.name_ur
        : "",
      address: helper.isObject(props.updateModalData)
        ? props.updateModalData.address
        : "",
      contact_no: helper.isObject(props.updateModalData)
        ? props.updateModalData.contact_no
        : "",
      lat: helper.isObject(props.updateModalData)
        ? props.updateModalData.latitude
        : "",
      lng: helper.isObject(props.updateModalData)
        ? props.updateModalData.longitude
        : "",
      working_hour_start: helper.isObject(props.updateModalData)
        ? props.updateModalData.working_hour_start
        : "",
      working_hour_end: helper.isObject(props.updateModalData)
        ? props.updateModalData.working_hour_end
        : "",
      // gas_station_network: gas_station_network,
      fuel_91: helper.isObject(props.updateModalData)
        ? props.updateModalData.fuel_91 === 1
          ? true
          : false
        : true,
      fuel_95: helper.isObject(props.updateModalData)
        ? props.updateModalData.fuel_95 === 1
          ? true
          : false
        : true,
      diesel: helper.isObject(props.updateModalData)
        ? props.updateModalData.diesel === 1
          ? true
          : false
        : true,
      dispenser_type: helper.isObject(props.updateModalData)
        ? props.updateModalData.dispenser_type
        : "",
      geo_fence_radius: helper.isObject(props.updateModalData)
        ? props.updateModalData.geo_fence_radius
        : "",
      handheld_device: handheld_device,
      break_start_hours: helper.isObject(props.updateModalData)
        ? props.updateModalData.break_start_hours
        : "",
      break_end_hours: helper.isObject(props.updateModalData)
        ? props.updateModalData.break_end_hours
        : "",

      admin_contact_person:
        helper.isObject(props.updateModalData) &&
        helper.isObject(props.updateModalData.users)
          ? props.updateModalData.users[0].first_name
          : "",
      admin_contact_number:
        helper.isObject(props.updateModalData) &&
        helper.isObject(props.updateModalData.users)
          ? props.updateModalData.users[0].mobile
          : "",
      admin_contact_email:
        helper.isObject(props.updateModalData) &&
        helper.isObject(props.updateModalData.users)
          ? props.updateModalData.users[0].email
          : "",
      account_number: helper.isObject(props.updateModalData)
        ? props.updateModalData.account_number
        : "",
      // admin_password: helper.isObject(props.updateModalData)
      //   ? props.updateModalData.admin_password
      //   : "",
      location_id: helper.isObject(props.updateModalData)
        ? {
            label:
              helper.isObject(props.updateModalData) &&
              helper.isObject(props.updateModalData.location)
                ? props.updateModalData.location.name_en
                : "",
            value:
              helper.isObject(props.updateModalData) &&
              helper.isObject(props.updateModalData.location)
                ? props.updateModalData.location.location_id
                : "",
          }
        : "",
      qualified: helper.isObject(props.updateModalData)
        ? {
            label: props.updateModalData.qualified
              ? props.updateModalData.qualified
              : "",

            value: props.updateModalData.qualified
              ? props.updateModalData.qualified
              : "",
          }
        : "",
      wifi: helper.isObject(props.updateModalData)
        ? {
            label: props.updateModalData.wifi ? props.updateModalData.wifi : "",

            value: props.updateModalData.wifi ? props.updateModalData.wifi : "",
          }
        : "",
      price: helper.isObject(props.updateModalData)
        ? {
            value:
              props.updateModalData.fuel_price_type == "city"
                ? "city price"
                : "remote",
            label:
              props.updateModalData.fuel_price_type == "city"
                ? "City Price"
                : "Remote Location Allowance",
          }
        : {
            value: "city price",
            label: "City Price",
          },
      reference: helper.isObject(props.updateModalData)
        ? props.updateModalData.reference
        : "",
      // fuel_price_type:[],
    });

    seterror({
      name_en: "",
      name_ar: "",
      name_ur: "",
      address: "",
      lat: "",
      lng: "",
      gas_station_network: "",
      handheld_device: "",
      fuel_type: "",
    });
  };

  useEffect(() => {
    if (location.lat != "" && location.lng != "") {
      let formUpdate = { ...form };
      formUpdate["lat"] = location.lat;
      formUpdate["lng"] = location.lng;
      setform(formUpdate);
    }
  }, [location]);

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      onShow={(e) => {
        setUpdateFormValues();
        console.log(props.fuelData, "props.fueldata");
      }}
      centered
      // size="xl"

      // size="lg"
      // dialogClassName="modal-90w"
      // style={{ minWidth: "90%" }}
      dialogClassName="modal-80w"
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center">
          {props.updateModalData
            ? t("Update Gas Station")
            : t("Add Gas Station")}
          {props.gasStationName ? ` - ${props.gasStationName}` : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          height: "620px",
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
          <Row>
            <Col>
              <p className="clientHeading">
                {" "}
                <span>{t("General Information")}</span>
              </p>
              <div className="form-group marginBottom-5px">
                <div
                  style={{
                    // background: "pink",
                    padding: "5px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    border: "0.2px solid grey",
                  }}
                >
                  <Row>
                    <Col>
                      <label>
                        {t("Name English")}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name_en"
                        value={form.name_en || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "name_en")
                        }
                        className="form-control"
                        placeholder={t("Name English")}
                      />
                      <p style={{ color: "red" }}>
                        {error.name_en ? error.name_en : ""}
                      </p>
                    </Col>

                    <Col>
                      <label>
                        {t("Name Arabic")}{" "}
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </label>
                      <input
                        type="text"
                        name="name_ar"
                        value={form.name_ar || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "name_ar")
                        }
                        className="form-control"
                        placeholder={t("Name Arabic")}
                      />
                      <p style={{ color: "red" }}>
                        {error.name_ar ? error.name_ar : ""}
                      </p>
                    </Col>
                    <Col>
                      <label>
                        {t("Gas Station Reference")}{" "}
                        {/* <span style={{ color: "red" }}>*</span> */}
                      </label>
                      <input
                        type="text"
                        name="reference"
                        value={form.reference || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "reference")
                        }
                        className="form-control"
                        placeholder={t("Gas Station Reference")}
                      />
                      <p style={{ color: "red" }}>
                        {error.reference ? error.reference : ""}
                      </p>
                    </Col>
                  </Row>
                  <div className="form-group marginBottom-5px">
                    <Row>
                      <a
                        href="#"
                        style={{ margin: "5px 0px 5px 0px" }}
                        onClick={() => setShowMapModal(true)}
                      >
                        <i className="fa fa-map-marker" aria-hidden="true"></i>{" "}
                        {t("Set Address with map")}
                      </a>
                      <Col>
                        <label>
                          {t("Address")} <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={form.address || ""}
                          onChange={(e) =>
                            onInputchange(e.target.value, "address")
                          }
                          className="form-control"
                          placeholder={t("Address")}
                        />
                        <p style={{ color: "red" }}>
                          {error.address ? error.address : ""}
                        </p>
                      </Col>

                      <Col>
                        <label>
                          {t("Latitude")}{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          // disabled
                          type="text"
                          name="latitude"
                          value={form.lat || ""}
                          onChange={(e) => onInputchange(e.target.value, "lat")}
                          className="form-control"
                          placeholder={t("Latitude")}
                        />
                        <p style={{ color: "red" }}>
                          {error.lat ? error.lat : ""}
                        </p>
                      </Col>

                      <Col>
                        <label>
                          {t("Longitude")}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          // disabled
                          type="text"
                          name="longitude"
                          value={form.lng || ""}
                          onChange={(e) => onInputchange(e.target.value, "lng")}
                          className="form-control"
                          placeholder={t("Longitude")}
                        />
                        <p style={{ color: "red" }}>
                          {error.lng ? error.lng : ""}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={4}>
                        <label>{t("City")}</label>{" "}
                        <Select
                          name="city"
                          onChange={(e) => {
                            if (e) {
                              onInputchange(e, "location_id");
                            } else {
                              onInputchange("", "location_id");
                            }
                          }}
                          options={props.city}
                          value={form.location_id || []}
                          isClearable={true}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>

              <div
                style={{
                  // background: "pink",
                  padding: "5px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  border: "0.2px solid grey",
                }}
              >
                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>{t("Contact Number")}</label>
                      <InputGroup>
                        <InputGroup.Text id="basic-addon1">966</InputGroup.Text>
                        <input
                          type="text"
                          name="contact_no"
                          value={form.contact_no || ""}
                          onChange={(e) =>
                            onInputchange(
                              helper.cleanInteger(e.target.value, "mobile"),
                              "contact_no"
                            )
                          }
                          className="form-control"
                          placeholder={t("Contact Number")}
                        />
                      </InputGroup>
                    </Col>

                    <Col>
                      <label>{t("Handheld Device")}</label>{" "}
                      <Select
                        isMulti
                        name="handheld_device"
                        onChange={(e) => {
                          if (e) {
                            onInputchange(e, "handheld_device");
                          } else {
                            onInputchange("", "handheld_device");
                          }
                        }}
                        options={props.handheldDeviceList}
                        value={form.handheld_device || []}
                        isClearable={true}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                      <p style={{ color: "red" }}>
                        {error.handheld_device ? error.handheld_device : ""}
                      </p>
                    </Col>
                  </Row>
                </div>

                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>{t("Account Number")}</label>
                      <input
                        type="text"
                        name="account_number"
                        value={form.account_number || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "account_number")
                        }
                        className="form-control"
                        placeholder={t("Account Number")}
                      />
                    </Col>

                    <Col>
                      <label>
                        {t("Geo Fense Radius")}{" "}
                        <span style={{ color: "red" }}>*</span>{" "}
                      </label>
                      <input
                        type="text"
                        name="geo_fence_radius"
                        value={form.geo_fence_radius || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "geo_fence_radius")
                        }
                        className="form-control"
                        placeholder={t("Geo Fense Radius")}
                      />
                      <p style={{ color: "red" }}>
                        {error.geo_fence_radius ? error.geo_fence_radius : ""}
                      </p>
                    </Col>
                  </Row>
                </div>

                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>{t("Dispenser Type")}</label>
                      <input
                        type="text"
                        name="dispenser_type"
                        value={form.dispenser_type || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "dispenser_type")
                        }
                        className="form-control"
                        placeholder={t("Dispenser Type")}
                      />
                    </Col>
                    <Col>
                      <label>{t("Gas Station Location")}</label>{" "}
                      <Select
                        name="price"
                        onChange={(e) => {
                          if (e) {
                            onInputchange(e, "price");
                          } else {
                            onInputchange("", "price");
                          }
                        }}
                        options={[
                          {
                            label: "City Gas Station",
                            value: "city price",
                          },
                          {
                            label: "Remote Gas Station",
                            value: "remote",
                          },
                        ]}
                        value={form.price}
                        // isClearable={true}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>{t("Qualified")}</label>{" "}
                      <Select
                        name="qualified"
                        onChange={(e) => {
                          if (e) {
                            onInputchange(e, "qualified");
                          } else {
                            onInputchange("", "qualified");
                          }
                        }}
                        options={[
                          {
                            label: "qualified",
                            value: "qualified",
                          },
                          {
                            label: "not qualified",
                            value: "not qualified",
                          },
                        ]}
                        value={form.qualified || []}
                        isClearable={true}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                      <p style={{ color: "red" }}>
                        {error.qualified ? error.qualified : ""}
                      </p>
                    </Col>
                    <Col>
                      <label>{t("Wifi")}</label>{" "}
                      <Select
                        name="wifi"
                        onChange={(e) => {
                          if (e) {
                            onInputchange(e, "wifi");
                          } else {
                            onInputchange("", "wifi");
                          }
                        }}
                        options={[
                          {
                            label: "available",
                            value: "available",
                          },
                          {
                            label: "not available",
                            value: "not available",
                          },
                        ]}
                        value={form.wifi || []}
                        isClearable={true}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                      <p style={{ color: "red" }}>
                        {error.wifi ? error.wifi : ""}
                      </p>
                    </Col>
                  </Row>
                </div>

                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>{t("Working Hour Start")}</label>
                      <input
                        type="text"
                        name="working_hour_start"
                        value={form.working_hour_start || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "working_hour_start")
                        }
                        className="form-control"
                        placeholder={t("Working Hour Start")}
                      />
                    </Col>

                    <Col>
                      <label>{t("Working Hour End")}</label>
                      <input
                        type="text"
                        name="working_hour_end"
                        value={form.working_hour_end || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "working_hour_end")
                        }
                        className="form-control"
                        placeholder={t("Working Hour End")}
                      />
                    </Col>
                  </Row>
                </div>
                <div className="form-group marginBottom-5px">
                  <Row>
                    <Col>
                      <label>{t("Break Start Hour")}</label>
                      <input
                        type="text"
                        name="break_start_hours"
                        value={form.break_start_hours || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "break_start_hours")
                        }
                        className="form-control"
                        placeholder={t("Break Start Hour")}
                      />
                    </Col>

                    <Col>
                      <label>{t("Break End Hours")}</label>
                      <input
                        type="text"
                        name="break_end_hours"
                        value={form.break_end_hours || ""}
                        onChange={(e) =>
                          onInputchange(e.target.value, "break_end_hours")
                        }
                        className="form-control"
                        placeholder={t("Break End Hours")}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>

            <Col>
              <p className="clientHeading">
                <span>{t("Fuel")}</span>
              </p>
              <div
                className="form-group marginBottom-5px"
                style={{ marginTop: "10px" }}
              >
                <Row>
                  <Col>
                    <label class="checkbox-inline">
                      <input
                        type="checkbox"
                        name="fuel_91"
                        checked={form.fuel_91 || false}
                        onChange={(e) => {
                          onInputchange(e.target.checked, "fuel_91");
                          filterPrice(e.target.checked, "fuel_91");
                        }}
                        style={{ marginRight: "5px" }}
                      />
                      91 Fuel
                    </label>
                  </Col>

                  <Col>
                    <label class="checkbox-inline">
                      <input
                        type="checkbox"
                        name="fuel_95"
                        checked={form.fuel_95 || false}
                        onChange={(e) => {
                          onInputchange(e.target.checked, "fuel_95");
                          filterPrice(e.target.checked, "fuel_95");
                        }}
                        style={{ marginRight: "5px" }}
                      />
                      95 Fuel
                    </label>
                  </Col>

                  <Col>
                    <label class="checkbox-inline">
                      <input
                        type="checkbox"
                        name="diesel"
                        checked={form.diesel || false}
                        onChange={(e) => {
                          onInputchange(e.target.checked, "diesel");
                          filterPrice(e.target.checked, "diesel");
                        }}
                        style={{ marginRight: "5px" }}
                      />
                      Diesel
                    </label>
                  </Col>
                </Row>
                <p style={{ color: "red" }}>
                  {error.fuel_type ? error.fuel_type : ""}
                </p>
              </div>
              {/* {props.updateModalData ||
              (form.price && form.price.value == "remote") ? ( */}
              <div
                style={{
                  // background: "pink",
                  padding: "5px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  marginTop: "20px",
                  border: "0.2px solid grey",
                }}
              >
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th
                          className="table-th blackColor"
                          style={{ width: "120px" }}
                        >
                          <p>{t("Fuel Type")}</p>
                        </th>

                        <th className="table-th blackColor">
                          <p>{t("Fuel Price")}</p>
                        </th>
                        {form.price && form.price.value == "remote" ? (
                          <>
                            <th className="table-th blackColor">
                              <p>{t("Remote Location Allowance")}</p>
                            </th>

                            <th className="table-th blackColor">
                              <p>Total Price</p>
                            </th>
                          </>
                        ) : (
                          ""
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {pricing && pricing.length > 0
                        ? pricing
                            .filter((item) => {
                              if (item.status == 1) {
                                return item;
                              }
                            })
                            .map((item, index) => {
                              return (
                                <tr>
                                  <td>
                                    <label>{item.label} </label>
                                  </td>

                                  <td>
                                    {/* <label>{item.base_price}</label> */}
                                    <input
                                      type="number"
                                      step="0.1"
                                      name="fuel_price"
                                      value={item.price}
                                      // value={item.base_price}
                                      onChange={(e) => {
                                        if (e) {
                                          pricing.filter((element, i) => {
                                            {
                                              if (element.label == item.label) {
                                                let newData = pricing;

                                                // (newData[index].base_price =
                                                //   helper.cleanDecimal(
                                                //     e.target.value
                                                //   )),
                                                (newData[i].price =
                                                  helper.cleanDecimal(
                                                    e.target.value
                                                  )),
                                                  setPricing([...newData]);
                                                // props.setFuelPrice([
                                                //   ...newData,
                                                // ]);
                                              }
                                            }
                                          });
                                        }
                                      }}
                                      className="form-control"
                                      placeholder={t("Price")}
                                      style={{ maxWidth: "180px" }}
                                    />
                                    <p style={{ color: "red" }}>
                                      {item.price == ""
                                        ? "Please enter price"
                                        : item.price > item.price_upper_limit
                                        ? "Price cannot be greater than upper price limit"
                                        : item.price <= item.price_lower_limit
                                        ? "Price cannot be lesser than lower price limit"
                                        : ""}
                                    </p>
                                  </td>
                                  {form.price &&
                                  form.price.value == "remote" ? (
                                    <>
                                      <td>
                                        <input
                                          type="number"
                                          step="0.001"
                                          name="fuel_price"
                                          value={item.extra_price}
                                          onChange={(e) => {
                                            if (e) {
                                              pricing.filter((element, i) => {
                                                {
                                                  if (
                                                    element.label == item.label
                                                  ) {
                                                    let newData = pricing;

                                                    (newData[i].extra_price =
                                                      helper.cleanDecimal(
                                                        e.target.value
                                                      )),
                                                      setPricing([...newData]);
                                                  }
                                                }
                                              });
                                            }
                                          }}
                                          className="form-control"
                                          placeholder={t("0.001")}
                                          style={{ maxWidth: "180px" }}
                                        />
                                        <p style={{ color: "red" }}>
                                          {item.extra_price != 0
                                            ? item.extra_price
                                                .toString()
                                                .substring(0, 1) != 0
                                              ? "Value should start with 0"
                                              : item.extra_price
                                                  .toString()
                                                  .charAt(1) != "."
                                              ? "Value should be a decimal number"
                                              : item.extra_price.length > 5
                                              ? "Upto 3 numbersare allowed after point"
                                              : ""
                                            : ""}
                                        </p>

                                        {/* <Select
                                          name="fuel_prices"
                                          
                                          value={{
                                            value: item.extra_price,
                                            label: item.extra_price,
                                          }}
                                          onChange={(e) => {
                                            if (e) {
                                              pricing.filter((element, i) => {
                                                if (
                                                  element.label === item.label
                                                ) {
                                                  let newData = pricing;
                                                  
                                                  (newData[i].extra_price =
                                                    e.value),
                                                    setPricing([...newData]);
                                                  props.setFuelPrice([
                                                    ...newData,
                                                  ]);
                                                }
                                              });
                                            } else {
                                              pricing.filter((element, i) => {
                                                if (
                                                  element.label === item.label
                                                ) {
                                                  let newData = pricing;
                                                  (newData[i].extra_price = 0),
                                                    setPricing([...newData]);
                                                  props.setFuelPrice([
                                                    ...newData,
                                                  ]);
                                                }
                                              });
                                            }
                                          }}
                                          options={option[index]}
                                        
                                          isClearable={true}
                                          menuPortalTarget={document.body}
                                          styles={{
                                            menuPortal: (base) => ({
                                              ...base,
                                              zIndex: 9999,
                                            }),
                                          }}
                                        /> */}
                                      </td>

                                      <td>
                                        {isNaN(
                                          (
                                            parseFloat(item.price) +
                                            parseFloat(item.extra_price)
                                          ).toFixed(2)
                                        )
                                          ? item.price
                                          : (
                                              parseFloat(item.price) +
                                              parseFloat(item.extra_price)
                                            ).toFixed(2)}
                                      </td>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </tr>
                              );
                            })
                        : ""}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* ) : (
                ""
              )} */}
            </Col>
            <SearchOnMap
              show={showMapModal}
              onCloseModal={() => setShowMapModal(false)}
              disableBtn={overlay}
              submit={() => setShowMapModal(false)}
              setLocation={setLocation}
              loc={{ lat: form.lat, lng: form.lng }}
              // data={mapData}
            />
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => submit()}>
          <i className="fas fa-check"></i>{" "}
          {helper.isObject(props.updateModalData) ? "Update" : "Submit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
