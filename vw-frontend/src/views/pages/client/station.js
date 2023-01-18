import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";
import { Check, X, Edit, Navigation } from "react-feather";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import AddUpdateModal from "./AddUpdateCompanyGasStation";
import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import { Card, CardBody, CardTitle, CardHeader } from "reactstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import Maps from "../gas-station-network/Map";
import { Link } from "react-router-dom";
import detailIcon from "@src/assets/images/icons/details.png";

// import Slider from "react-rangeslider";
// import "react-rangeslider/lib/index.css";
// const RcRange = Slider.createSliderWithTooltip(Slider.Range);
import { getUserData } from "@utils";

export default function company(props) {
  const { t } = useTranslation();

  const [companyShow, setcompanyShow] = useState(true);
  const [stationShow, setstationShow] = useState(false);
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [onSubmit, setonSubmit] = useState("");
  const [showAddUpdateModal, setshowAddUpdateModal] = useState(false);
  const [updateModalData, setupdateModalData] = useState(null);
  const [updateIndex, setupdateIndex] = useState("");
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteIndex, setdeleteIndex] = useState("");
  const [deleteItem, setdeleteItem] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [rowCount, setrowCount] = useState(0);
  const [sorting_icon, setsorting_icon] = useState();
  const [deleteMessage, setdeleteMessage] = useState("");
  const [paginationStates, setpaginationStates] = useState({
    itemsCountPerPage: "",
    activePage: "",
    totalItemsCount: "",
  });

  const [searchData, setSearchData] = useState("");

  const [gasStationList, setgasStationList] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapData, setMapData] = useState([]);

  const [selectedNetwork, setSelectedNetwork] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState([]);
  const [selectedFuelPrice, setSelectedFuelPrice] = useState([]);
  const [fuelPrice, setFuelPrice] = useState([]);

  const [fuel, setFuel] = useState([]);

  const [priceRange, setPriceRange] = useState([]);

  const [checkList, setCheckList] = useState([]);

  useEffect(() => {
    console.log("map modal changes", showMapModal);
  }, [showMapModal]);

  const [role, setRole] = useState({
    viewGasStation: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.client_stations") {
        arr.viewGasStation = true;
      }
    }
    // console.log("arrrrrrrrrrr", arr);
    setRole(arr);
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

  const onOpenMapModal = (item, index, args = "") => {
    // console.log("in open map modal");
    if (args == "station") {
      let arr = [];
      arr.push(item);
      setMapData(arr);

      // console.log("in if", item);

      setShowMapModal(true);
    } else if (args == "showAllLocation") {
      if (data && data.length > 0) {
        let arr = [];
        data.forEach((item) => {
          if (item.latitude && item.longitude) {
            arr.push({
              latitude: item.latitude,
              longitude: item.longitude,
            });
          }
        });

        setMapData(arr);

        // console.log("in if", item);

        setShowMapModal(true);
      }
    } else {
      if (helper.isObject(item)) {
        setMapData(item);
        setShowMapModal(true);
      }
    }
  };

  const sortAscending = (icon, sortType, colsort) => {
    if (colsort == "order_number") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            a[colsort] > b[colsort] && sortType === "asc" ? 1 : -1
          )
        )
      );
    } else if (colsort == "name") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            a.customer.name.toLowerCase() > b.customer.name.toLowerCase() &&
            sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    } else if (colsort == "status") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            helper
              .stringToJson(a.order_status.order_status_title)
              .en.toLowerCase() >
              helper
                .stringToJson(b.order_status.order_status_title)
                .en.toLowerCase() && sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    } else {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            helper.checkinteger(a[colsort]) > helper.checkinteger(b[colsort]) &&
            sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    }
  };

  const getGasStationNetwork = () => {
    setoverlay(true);
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/gas-station-networks?page=${currentPage}&pagination=true`,
        {}
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          let arr = [];
          res.data.data.data.forEach((item) => {
            arr.push({
              label: item.name_en,
              value: item.gas_station_network_id,
            });
          });
          // console.log("arrrrrrrrr", arr);
          setgasStationList(arr);
          // setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setgasStationList([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setgasStationList([]);
        setoverlay(false);
      });
  };

  const getData = () => {
    setoverlay(true);
    console.log(props.clientID, "props.companyID");
    axios
      .post(
        `${jwtDefaultConfig.adminBaseUrl}/client-stations?page=${currentPage}`,
        {
          client: {
            clientId: props.clientID,
          },
        }
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log(helper.applyCountID(res.data.data.data), "data");
          setdata(helper.applyCountID(res.data.data.data));
          setpaginationStates({
            activePage: res.data.data.current_page,
            itemsCountPerPage: res.data.data.per_page,
            totalItemsCount: res.data.data.total,
          });
          setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setdata([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setdata([]);
        setoverlay(false);
      });
  };

  const create = (id) => {
    // console.log("in create ");
    // return;
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client-station/store`, {
        client_selected_station: {
          client_id: props.clientID,
          gas_station_id: id,
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
          Search();
          // getGasStationNetwork();
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

  const update = (args) => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client-station/update`, {
        client_selected_station: {
          id: updateModalData.id,
          client_id: props.clientID,
          gas_station_network_id: args.gasStation.value,
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
          // getData();
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
      });
  };

  const remove = (id) => {
    // console.log("in remove ", id);
    // return;
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client-station/delete`, {
        client_selected_station: {
          id: id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setoverlay(false);
          // getData();
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          Search();
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

  const CustomLabel = ({ htmlFor }) => {
    return (
      <Label className="form-check-label" htmlFor={htmlFor}>
        <span className="switch-icon-left">
          <Check size={14} />
        </span>
        <span className="switch-icon-right">
          <X size={14} />
        </span>
      </Label>
    );
  };

  const filterData = (value) => {
    if (value.length >= 3) {
      setSearchData(value);
    } else {
      setSearchData("");
    }
  };

  const getFuelPrices = () => {
    setoverlay(true);
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/fuel-types?page=${currentPage}&pagination=true`,
        {}
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setFuel(res.data.data.data);
          let arr = [];
          res.data.data.data.forEach((item) => {
            arr.push({
              label: item.title_en + " - " + item.base_price + " SAR",
              value: item.id,
              price: item.base_price,
            });
          });
          setFuelPrice(arr);

          // setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          // setdata([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        // setdata([]);
        setoverlay(false);
      });
  };

  const Search = (args) => {
    setoverlay(true);

    // console.log(selectedFuelPrice.value, "price");
    // return;
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/search-stations`, {
        client_id: props.clientID,
        gas_station_network_id: selectedNetwork.value,
        fuel_price: selectedFuelPrice.value * 0.01,
        fuel_type_id: selectedFuelType.value,
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log(helper.applyCountID(res.data.data.data), "data");
          let checkList = res.data.dissabled_gas_station_ids;
          res.data.data.forEach((item) => {
            item.check = true;
            item.check_id = "";

            if (checkList.length > 0) {
              for (let i = 0; i < checkList.length; i++) {
                if (item.gas_station_id == checkList[i].gas_station_id) {
                  item.check = false;
                  item.check_id = checkList[i].id;
                }
              }
            }
            let obj = [
              {
                id: 1,
                price: "",
              },
              {
                id: 2,
                price: "",
              },
              {
                id: 3,
                price: "",
              },
            ];
            for (let i = 0; i < fuel.length; i++) {
              for (let j = 0; j < obj.length; j++) {
                if (fuel[i].id == obj[j].id) {
                  obj[j].price = "";
                  // obj[j].price = fuel[i].base_price;
                }
              }
            }
            let arr = item.fuel_prices;
            for (let i = 0; i < fuel.length; i++) {
              for (let j = 0; j < arr.length; j++) {
                if (fuel[i].id == arr[j].fuel_type_id) {
                  let p = parseFloat(arr[j].price).toFixed(2);

                  // parseFloat(fuel[i].base_price)
                  //   + parseFloat(arr[j].price)
                  //     .toFixed(2);
                  let fuelid = fuel[i].id;
                  let ind = obj.findIndex((x) => x.id == fuel[i].id);
                  if (ind >= 0) {
                    obj[ind].price = p;
                  }
                }
              }
            }
            item.fuelPrices = obj;
            // console.log("objjjjjjjjjj", obj);
            // console.log("itemmmmmmmm", item);
          });

          setdata(helper.applyCountID(res.data.data));

          setoverlay(false);
        } else {
          setoverlay(false);
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setdata([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setdata([]);
        setoverlay(false);
      });
  };

  const changeCheckList = (id) => {
    let arr = checkList;
    let index = arr.indexOf(id);
    if (index < 0) {
      arr.push(id);
    } else {
      arr.splice(index, 1);
    }
    console.log("arrrr", arr);
    setCheckList(arr);
  };
  const getCheck = (id) => {
    let arr = checkList;
    console.log("check list arr", arr);

    let index = arr.findIndex((x) => x == id);
    if (index >= 0) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (fuelPrice.length > 0) {
      Search();
    }
  }, [fuelPrice]);

  useEffect(() => {
    setRoles();
    // Search();
    // statusGasStation();
    getFuelPrices();

    // getCity();
    // getData();
    // getGasStationNetwork();
  }, [props.clientID]);

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
          <CardTitle style={{ fontWeight: "bold" }} tag="h4">
            Gas Stations {props.clientName}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          {/*------------------------ Filters ----------------*/}

          <label
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            {/* Filters */}
          </label>
          <Row style={{ marginBottom: "15px" }}>
            <Col lg={12}>
              <Row>
                <Col sm="2">
                  <Select
                    name="networl"
                    placeholder="Select Gas Station Network"
                    onChange={(e) => {
                      if (e) {
                        setSelectedNetwork(e);
                      } else {
                        setSelectedNetwork([]);
                      }
                    }}
                    options={gasStationList}
                    // value={form.location_id || []}
                    isClearable={true}
                    styles={{
                      width: "200px",
                    }}
                  />
                </Col>

                <Col sm="2">
                  <Select
                    name="fuel_types"
                    placeholder="Select Fuel Types"
                    onChange={(e) => {
                      if (e) {
                        setSelectedFuelType(e);

                        let price = e.price;
                        let arr = [];
                        console.log("selected type", e);
                        for (let i = -60; i <= -1; i++) {
                          // price = price - 0.01;

                          arr.push({
                            value: i,
                            label: i,
                          });
                        }
                        // price = e.price;
                        arr.push({
                          value: 0,
                          label: 0,
                        });
                        for (let i = 1; i <= 60; i++) {
                          arr.push({
                            value: i,
                            label: i,
                          });
                        }
                        arr.sort((a, b) => (a.label > b.label ? 1 : -1));
                        // console.log("rage arr", arr);
                        setPriceRange(arr);
                      } else {
                        // setLocation([]);
                        setSelectedFuelType([]);
                      }
                    }}
                    options={fuelPrice}
                    // value={form.location_id || []}
                    isClearable={true}
                    styles={{
                      width: "200px",
                    }}
                  />
                </Col>
                <Col sm="2">
                  <Select
                    isDisabled={
                      helper.isObject(selectedFuelType) ? false : true
                    }
                    name="fuel_types"
                    placeholder="Select Fuel Price"
                    onChange={(e) => {
                      if (e) {
                        setSelectedFuelPrice(e);
                      } else {
                        // setLocation([]);
                        setSelectedFuelPrice([]);
                      }
                    }}
                    options={priceRange}
                    // value={form.location_id || []}
                    isClearable={true}
                    styles={{
                      width: "200px",
                    }}
                  />
                </Col>

                <Col sm="1">
                  {role.viewGasStation ? (
                    <Button
                      style={{ marginLeft: "5px" }}
                      onClick={(e) => {
                        if (
                          helper.isObject(selectedFuelType) &&
                          !helper.isObject(selectedFuelPrice)
                        ) {
                          helper.toastNotification(
                            "Please Select Fuel Price",
                            "FAILED_MESSAGE"
                          );
                        } else {
                          Search();
                        }
                      }}
                    >
                      {t("Search")}
                    </Button>
                  ) : (
                    ""
                  )}
                </Col>
                <Col sm="2">
                  {role.viewGasStation ? (
                    <Button
                      style={{ marginLeft: "5px" }}
                      onClick={(e) => {
                        onOpenMapModal(0, 0, "showAllLocation");
                      }}
                    >
                      {t("Location of All Gas Stations")}
                    </Button>
                  ) : (
                    ""
                  )}
                </Col>
                <Col sm="2">
                  <input
                    className="form-control"
                    placeholder={`${t("Search")}...`}
                    onChange={(e) => filterData(e.target.value)}
                  />
                </Col>
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
                    <p>
                      {t("Gas Station Name")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col1_asc", "asc", "name_en")
                          }
                          className={
                            sorting_icon == "Col1_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col1_des", "des", "name_en")
                          }
                          className={
                            sorting_icon == "Col1_des"
                              ? "fas fa-long-arrow-alt-down sort-color"
                              : "fas fa-long-arrow-alt-down"
                          }
                        ></i>
                      </span>
                    </p>
                  </th>
                  <th className="table-th blackColor">
                    {<p>Gas Station Network</p>}
                  </th>
                  <th className="table-th blackColor">{<p>fuel_91</p>}</th>
                  <th className="table-th blackColor">{<p>fuel_95</p>}</th>
                  <th className="table-th blackColor">{<p>diesel</p>}</th>

                  <th className="table-th blackColor">
                    <p>{t("Action")}</p>
                  </th>
                </tr>
              </thead>

              <tbody>
                {data && data.length > 0 ? (
                  data
                    .filter((item, index) => {
                      if (searchData == "") {
                        return item;
                      } else if (
                        item.name_en
                          .toLowerCase()
                          .includes(searchData.toLowerCase())
                        // ||
                        // item.gas_station_network.name_en
                        //   .toLowerCase()
                        //   .includes(searchData.toLowerCase())
                      ) {
                        return item;
                      }
                    })
                    .map((item, index) => (
                      <tr
                        key={index}
                        className={
                          helper.applyRowClass(item) === true
                            ? `evenRowColor`
                            : "oddRowColor"
                        }
                      >
                        <td>
                          <div>
                            {/* <Link
                            to={
                              window.location.href.indexOf("/admin/") > -1
                                ? `/vrp/admin/gas-station-detail/${item.gas_station_id}`
                                : window.location.href.indexOf(
                                    "/gas-station/"
                                  ) > -1
                                ? `/vrp/gas-station/network-gas-station-detail/${item.gas_station_id}`
                                : ""
                            }
                          > */}
                            <div className="d-flex justify-content-left align-items-center">
                              {role.viewGasStation ? (
                                <input
                                  checked={item.check}
                                  type="checkbox"
                                  onChange={() => {
                                    data.filter((element) => {
                                      if (
                                        element.gas_station_id ===
                                        item.gas_station_id
                                      ) {
                                        let newData = data;
                                        newData[index].check = newData[index]
                                          .check
                                          ? false
                                          : true;
                                        if (newData[index].check) {
                                          remove(item.check_id);
                                        } else {
                                          create(item.gas_station_id);
                                        }
                                        setdata([...newData]);
                                      }
                                    });
                                    // if (item.check) {
                                    //   remove(item.gas_station_id);
                                    // } else {
                                    //   create(item.gas_station_id);
                                    // }
                                    // changeCheckList(item.gas_station_id);
                                  }}
                                  style={{ marginRight: "10px" }}
                                />
                              ) : (
                                ""
                              )}
                              <div className="avatar me-1 bg-light-success">
                                <span className="avatar-content">
                                  {helper.FirstWordFirstChar(item.name_en)}
                                  {helper.SecondWordFirstChar(item.name_en)}
                                </span>
                              </div>
                              <div className="d-flex flex-column">
                                <a className="user_name text-truncate text-body">
                                  <span className="fw-bolder">
                                    {helper.shortTextWithDots(item.name_en, 50)}
                                  </span>
                                </a>
                              </div>
                            </div>
                            {/* </Link> */}
                          </div>
                        </td>
                        <td>
                          {helper.isObject(item.gas_station_network)
                            ? item.gas_station_network.name_en
                            : ""}
                        </td>
                        {item.fuel_prices
                          ? item.fuelPrices.map((i) => {
                              return <td>{i.price}</td>;
                            })
                          : ""}

                        <td>
                          <div style={{ display: "flex" }}>
                            <i
                              class="fa-solid fa-location-dot"
                              data-tip="Location"
                              style={{
                                fontSize: "18px",
                                color: "#1b663e",
                                alignSelf: "center",
                                marginLeft: "8px",
                                marginTop: "2px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                onOpenMapModal(item, index, "station");
                              }}
                            ></i>
                            {/* {role.updateStation ? ( */}
                            {/* <Edit
                            data-tip="Update"
                            size={16}
                            // onClick={(e) => onOpenUpdateModal(item, index)}
                            style={{ marginTop: "4px", marginRight: "5px" }}
                          /> */}
                            {/* ) : (
                          ""
                        )} */}
                            {/* {role.viewStation ? ( */}
                            {/* <Link
                            to={
                              window.location.href.indexOf("/admin/") > -1
                                ? `/vrp/admin/gas-station-detail/${item.gas_station_id}`
                                : window.location.href.indexOf(
                                    "/gas-station/"
                                  ) > -1
                                ? `/vrp/gas-station/network-gas-station-detail/${item.gas_station_id}`
                                : ""
                            }
                          >
                            <img
                              src={detailIcon}
                              style={{ marginTop: "4px" }}
                            />
                          </Link> */}
                            {/* ) : (
                          ""
                        )} */}
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
            <Maps
              show={showMapModal}
              onCloseModal={() => setShowMapModal(false)}
              disableBtn={overlay}
              data={mapData}
            />
          </div>
          {/* )} */}
        </CardBody>
      </Card>
    </div>
  );
}
