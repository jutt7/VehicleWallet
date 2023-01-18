// ** React Imports
import { Fragment, useState, useEffect } from "react";
// ** Third Party Components
import axios from "axios";
// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from "reactstrap";
// ** Demo Components
import Tabs from "./Tabs";
import Profile from "./Profile";
import Driver from "../drivers";
import Vehicle from "../vehicles";
import Station from "./station";
import User from "./users";
import Transactions from "./transactions";

import Statement from "./statementOfAccount";
import helper from "@src/@core/helper";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { ClipLoader } from "react-spinners";
import { getUserData } from "@utils";
import AllocateAmount from "./AllocateAmount";
import Invoices from "../client-invoices";

const ClientManagement = () => {
  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [stats, setstats] = useState({
    total_drivers: 0,
    total_users: 0,
    total_vehicles: 0,
    total_networks: 0,
  });

  const [pricing, setPricing] = useState([]);

  const [basePrice, setBasePrice] = useState([]);

  const [role, setRole] = useState({
    client: false,
    driver: false,
    vehicle: false,
    gas_station: false,
    transaction: false,
    account_statement: false,
    users: false,
  });

  const setRoles = () => {
    // let roles = getUserData().ability;
    // console.log("rolesss", roles);
    // let arr = role;
    // for (let i = 0; i < roles.length; i++) {
    //   if (roles[i].subject == "client_detail") {
    //     arr.client = true;
    //   } else if (roles[i].subject == "fm.drivers") {
    //     arr.driver = true;
    //   } else if (roles[i].subject == "fm.vehicles") {
    //     arr.vehicle = true;
    //   } else if (roles[i].subject == "fm.gas_station_networks") {
    //     arr.gas_station = true;
    //   }
    //   else if (roles[i].subject == "fm.vehicle_driver_logs") {
    //     arr.viewLog = true;
    //   }
    // }
    // // console.log("arrrrrrrrrrr", arr);
    // setRole(arr);
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const getData = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client`, {
        client: {
          clientId:
            window.location.href.indexOf("/admin/") > -1
              ? helper.getIDfromUrl(window.location.href)
              : getUserData().client_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setstats({
            total_drivers: res.data.total_drivers,
            total_users: res.data.total_users,
            total_vehicles: res.data.total_vehicles,
            total_networks: res.data.total_networks,
          });
          console.log("client dataaaaa", res.data.client);
          setdata(res.data.client);
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

  const getPricing = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client-pricing`, {
        client: {
          client_id:
            window.location.href.indexOf("/admin/") > -1
              ? helper.getIDfromUrl(window.location.href)
              : getUserData().client_id,
          api_type: "dashboard",
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status == 200) {
          console.log("pricing data----------", res.data.data);
          setPricing(helper.checkNullPrice(res.data.data));

          setoverlay(false);
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

        setoverlay(false);
      });
  };

  // const getBasePricing = () => {
  //   console.log("in base price");
  //   setoverlay(true);
  //   axios
  //     .get(`${jwtDefaultConfig.adminBaseUrl}/vehicle-types?pricing=true`, {})
  //     .then((res) => {
  //       helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
  //       if (res.status && res.status == 200) {
  //         console.log(res.data.data, "Pricing base data");
  //         setBasePrice(helper.applyCountID(res.data.data));

  //         setoverlay(false);
  //       } else {
  //         helper.toastNotification(
  //           "Unable to process request.",
  //           "FAILED_MESSAGE"
  //         );
  //         // setdata([]);
  //         setoverlay(false);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error, "error");
  //       // setdata([]);
  //       setoverlay(false);
  //     });
  // };

  useEffect(() => {
    setRoles();
    getData();
    getPricing();
    // getBasePricing();
  }, []);

  return (
    <Fragment>
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
      {data !== null ? (
        <Row>
          <Col xs={12}>
            <Tabs
              className="mb-2"
              activeTab={activeTab}
              toggleTab={toggleTab}
            />

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                {activeTab == 1 ? (
                  <Profile
                    data={data}
                    stats={stats}
                    getData={() => getData()}
                    pricing={pricing}
                    // basePrice={basePrice}
                  />
                ) : (
                  ""
                )}
              </TabPane>
              <TabPane tabId="2">
                {activeTab == 2 ? (
                  <Driver
                    clientName={data.name_en}
                    clientID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().client_id
                    }
                  />
                ) : (
                  ""
                )}
              </TabPane>
              <TabPane tabId="3">
                {activeTab == 3 ? (
                  <Vehicle
                    clientName={data.name_en}
                    clientID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().client_id
                    }
                  />
                ) : (
                  ""
                )}
              </TabPane>
              <TabPane tabId="4">
                {activeTab == 4 ? (
                  <AllocateAmount
                    getData={getData}
                    data={data}
                    clientName={data.name_en}
                    clientID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().client_id
                    }
                  />
                ) : (
                  ""
                )}
              </TabPane>
              <TabPane tabId="5">
                {activeTab == 5 ? (
                  <Station
                    clientName={data.name_en}
                    clientID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().client_id
                    }
                    way={
                      window.location.href.indexOf("/admin/") > -1
                        ? "admin"
                        : "client"
                    }
                  />
                ) : (
                  ""
                )}
              </TabPane>
              <TabPane tabId="6">
                {activeTab == 6 ? (
                  <Transactions
                    clientName={data.name_en}
                    clientID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().client_id
                    }
                  />
                ) : (
                  ""
                )}
              </TabPane>
              <TabPane tabId="7">
                {activeTab == 7 ? (
                  <Statement
                    clientName={data.name_en}
                    clientID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().client_id
                    }
                  />
                ) : (
                  ""
                )}
              </TabPane>
              <TabPane tabId="8">
                {activeTab == 8 ? (
                  <Invoices
                    clientName={data.name_en}
                    clientData={data}
                    clientID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().client_id
                    }
                  />
                ) : (
                  ""
                )}
              </TabPane>
              <TabPane tabId="9">
                {activeTab == 9 ? (
                  <User
                    clientName={data.name_en}
                    clientID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().client_id
                    }
                  />
                ) : (
                  ""
                )}
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      ) : null}
    </Fragment>
  );
};

export default ClientManagement;
