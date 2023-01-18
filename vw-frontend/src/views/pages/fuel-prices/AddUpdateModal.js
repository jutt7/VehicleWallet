import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import helper from "@src/@core/helper";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function AddUpdateModal(props) {
  const { t } = useTranslation();
  const [overlay, setoverlay] = useState(false);
  const [form, setform] = useState({
    price: "",
    fuel_type: [],
    gas_station: [],
  });
  const [option, setOption] = useState([]);

  const [pricing, setPricing] = useState([]);

  const [fuel91, setFuel91] = useState({
    fuel_type_id: "",
    price: "",
    base_price: "",
  });
  const [fuel95, setFuel95] = useState({
    fuel_type_id: "",
    price: "",
    base_price: "",
  });
  const [diesel, setDiesel] = useState({
    fuel_type_id: "",
    price: "",
    base_price: "",
  });

  const [error, seterror] = useState({
    price91: "",
    price95: "",
    pricediesel: "",
  });

  const [priceRange, setPriceRange] = useState([]);

  // const options = [
  //   { label: "0.1", value: "0.1" },
  //   { label: "0.2", value: "0.2" },
  //   { label: "0.3", value: "0.3" },
  //   { label: "0.4", value: "0.4" },
  //   { label: "0.5", value: "0.5" },
  //   { label: "0.6", value: "0.6" },
  // ];

  const onInputchange = (value, key) => {
    if (key == "") console.log(form, "form");
    console.log(value);
    let formUpdate = { ...form };
    formUpdate[key] = value;
    console.log(formUpdate, "formUpdate");
    setform(formUpdate);
  };

  const on91Change = (value) => {
    console.log(value);
    let formUpdate = { ...fuel91 };
    formUpdate["price"] = value;
    setFuel91(formUpdate);
  };
  const on95Change = (value) => {
    console.log(value);
    let formUpdate = { ...fuel95 };
    formUpdate["price"] = value;
    setFuel95(formUpdate);
  };
  const onDieselChange = (value) => {
    console.log(value);
    let formUpdate = { ...diesel };
    formUpdate["price"] = value;
    setDiesel(formUpdate);
  };

  const submit = () => {
    setoverlay(true);
    if (props.disableBtn) {
      return false;
    }

    let errorCount = 0;
    let error = {};

    seterror({
      price91: "",
      price95: "",
      pricediesel: "",
    });

    // if (helper.isEmptyString(fuel91.price)) {
    //   error.price91 = "Price is required";
    //   errorCount++;
    //   setoverlay(false);
    // }
    // if (helper.isEmptyString(fuel95.price)) {
    //   error.price95 = "Price is required";
    //   errorCount++;
    //   setoverlay(false);
    // }
    // if (helper.isEmptyString(diesel.price)) {
    //   error.pricediesel = "Price is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    // if (!helper.isObject(form.fuel_type)) {
    //   error.fuel_type = "Fuel type is required";
    //   errorCount++;
    //   setoverlay(false);
    // }

    if (errorCount > 0) {
      seterror(error);
      setoverlay(false);
    } else {
      let c = 0;
      for (let i = 0; i < pricing.length; i++) {
        if (
          pricing[i].price > pricing[i].price_upper_limit ||
          pricing[i].price <= pricing[i].price_lower_limit
        ) {
          c++;
        }
      }
      if (c > 0) {
        console.log("in if");
        setoverlay(false);
        return;
      } else {
        console.log("in else");

        props.getTypes(pricing);
        // props.submitAction(form);
        setTimeout(() => {
          setoverlay(false);
        }, 2000);
      }
    }
  };

  const setPrice = (data) => {
    let arr = [];
    let a = [];

    data.forEach((element) => {
      let obj = {
        base_price: element.base_price,
        label: element.title_en,
        value: element.value,
        id: element.id,
        add_price: "",
        price: element.base_price,
        extra_price: element.extra_price ? element.extra_price : 0,
        price_upper_limit: element.price_upper_limit
          ? element.price_upper_limit
          : "",
        price_lower_limit: element.price_lower_limit
          ? element.price_lower_limit
          : 0,
      };

      let arry = [];
      for (let i = -60; i <= -1; i++) {
        // price = price - 0.01;
        // if (price > 0) {
        arry.push({
          // value: (price - element.base_price).toFixed(2),
          // label: price.toFixed(2),
          value: i,
          label: i,
        });
        // }
      }
      // console.log("arrrrrrrrrrrr", arr);
      // price = element.base_price;
      arry.push({
        value: 0,
        label: 0,
      });
      for (let i = 1; i <= 60; i++) {
        // if (price > 0) {
        // price = price + 0.01;
        arry.push({
          // value: (price - element.base_price).toFixed(2),
          // label: price.toFixed(2),
          value: i,
          label: i,
        });
        // }
      }
      arry.sort((a, b) => (a.label > b.label ? 1 : -1));

      // console.log("arryyyyyyyy", arry);

      arr.push(obj);
      a.push(arry);
      // a.push(op);
    });
    console.warn("arrrrr", arr);
    setOption(a);
    setPricing(arr);
  };

  const setUpdateFormValues = () => {
    console.log(props, "props");

    setPrice(props.fuelTypeList);

    const gas_station = helper.isObject(props.updateModalData)
      ? props.gasStationList.find(
          (i) => i.value === props.updateModalData.gas_station_id
        )
      : [];

    const fuel_type = helper.isObject(props.updateModalData)
      ? props.fuelTypeList.find(
          (i) => i.value === props.updateModalData.fuel_type_id
        )
      : [];

    setform({
      price: helper.isObject(props.updateModalData)
        ? props.updateModalData.price
        : "",
      fuel_type: fuel_type,
      gas_station: gas_station,
    });

    seterror({
      price: "",
      fuel_type: "",
      gas_station: "",
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
            {props.updateModalData
              ? t("Update Fuel Price")
              : t("Update Gas Station Price")}
            {props.gasStationName ? ` - ${props.gasStationName}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "250px", overflowY: "auto" }}>
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
                      <p>{t("Fuel Type")}</p>
                    </th>

                    <th className="table-th blackColor">
                      <p>{t("Fuel Price")}</p>
                    </th>
                    <th className="table-th blackColor">
                      <p>{t("Remote Location Allowance")}</p>
                    </th>
                    <th className="table-th blackColor">
                      <p>Total Price</p>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pricing && pricing.length > 0
                    ? pricing.map((item, index) => {
                        return (
                          <tr>
                            <td>
                              <label>{item.label} </label>
                            </td>

                            <td>
                              <input
                                type="text"
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

                                          (newData[i].price =
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
                                        if (element.label == item.label) {
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
                                    : item.extra_price.toString().charAt(1) !=
                                      "."
                                    ? "Value should be a decimal number"
                                    : item.extra_price.length > 5
                                    ? "Upto 3 numbersare allowed after point"
                                    : ""
                                  : ""}
                              </p>

                              {/* <Select
                                name="fuel_prices"
                                onChange={(e) => {
                                  if (e) {
                                    pricing.filter((element) => {
                                      if (element.value === item.value) {
                                        let newData = pricing;
                                        (newData[index].extra_price = e.value),
                                          setPricing([...newData]);
                                      }
                                    });
                                  } else {
                                    pricing.filter((element) => {
                                      if (element.value === item.value) {
                                        let newData = pricing;
                                        (newData[index].extra_price = 0),
                                          setPricing([...newData]);
                                      }
                                    });
                                  }
                                }}
                                options={option[index]}
                                // value={props.stations.name_en}
                                value={{
                                  value: item.extra_price,
                                  label: item.extra_price,
                                }}
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
                            {/* <td>
                              <label>
                                {item.add_price == ""
                                  ? item.base_price
                                  : parseFloat(item.base_price) +
                                    parseFloat(item.add_price)}
                              </label>
                            </td> */}
                          </tr>
                        );
                      })
                    : ""}

                  {/* <tr>
                    <td>
                      <label>
                        fuel_95 <span style={{ color: "red" }}>*</span>
                      </label>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="price"
                        value={fuel95.price || ""}
                        onChange={(e) =>
                          on95Change(helper.cleanDecimal(e.target.value))
                        }
                        className="form-control"
                        placeholder="Price"
                      />
                      <p style={{ color: "red" }}>
                        {error.price95 ? error.price95 : ""}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>
                        Diesel <span style={{ color: "red" }}>*</span>
                      </label>
                    </td>

                    <td>
                      <input
                        type="text"
                        name="price"
                        value={diesel.price || ""}
                        onChange={(e) =>
                          onDieselChange(helper.cleanDecimal(e.target.value))
                        }
                        className="form-control"
                        placeholder="Price"
                      />
                      <p style={{ color: "red" }}>
                        {error.pricediesel ? error.pricediesel : ""}
                      </p>
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </div>
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
