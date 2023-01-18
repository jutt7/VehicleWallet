// ** React Imports
import { Fragment, useState, useEffect } from "react";
// ** Third Party Components
import axios from "axios";
// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from "reactstrap";
// ** Demo Components
import Tabs from "./Tabs";
import Profile from "./Profile";
import Client from "./clients";
import Staff from "../gas-station-staff";
import FuelPrice from "../fuel-prices";
import Transactions from "./transactions";
import Statement from "./statementOfAccount";
import User from "./users";
import helper from "@src/@core/helper";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { ClipLoader } from "react-spinners";
import { getUserData } from "@utils";

const ClientManagement = () => {
  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [stats, setstats] = useState({
    total_staff: 0,
    total_users: 0,
  });

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const getData = () => {
    console.log("get data called");
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/station`, {
        gas_station: {
          gas_station_id:
            window.location.href.indexOf("/admin/") > -1
              ? helper.getIDfromUrl(window.location.href)
              : getUserData().gas_station_id
              ? getUserData().gas_station_id
              : // window.location.pathname.split("/").splice(-2) ==
                //   "network-gas-station-detail"
                //     ?
                helper.getIDfromUrl(window.location.href),
          // : getUserData().gas_station_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setstats({
            total_staff: res.data.total_staff,
            total_users: res.data.total_users,
          });
          setdata(res.data.gas_station);
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

  useEffect(() => {
    getData();
  }, []);

  const toggleSwitch = () => {
    setdata({ ...data, status: !data.status });
    console.log(data, "data");
  };
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
                    toggleSwitch={() => toggleSwitch()}
                  />
                ) : (
                  ""
                )}
              </TabPane>
              <TabPane tabId="2">
                {activeTab == 2 ? (
                  <Staff
                    data={data}
                    gasStationName={data.name_en}
                    stationID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().gas_station_id
                    }
                  />
                ) : (
                  ""
                )}
              </TabPane>
              {/* <TabPane tabId="3">
                {activeTab == 3 ? (
                  <Client
                    stationID={helper.getIDfromUrl(window.location.href)}
                    gasStationNetworkID={data.gas_station_network_id}
                  />
                ) : (
                  ""
                )}
              </TabPane> */}
              <TabPane tabId="4">
                {activeTab == 4 ? (
                  <FuelPrice
                    gasStationName={data.name_en}
                    stationID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().gas_station_id
                    }
                  />
                ) : (
                  ""
                )}
              </TabPane>
              <TabPane tabId="5">
                {activeTab == 5 ? (
                  <Transactions
                    gasStationName={data.name_en}
                    stationID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().gas_station_id
                    }
                  />
                ) : (
                  ""
                )}
              </TabPane>
              <TabPane tabId="6">
                {activeTab == 6 ? (
                  <Statement
                    gasStationName={data.name_en}
                    stationID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().gas_station_id
                    }
                  />
                ) : (
                  ""
                )}
              </TabPane>
              <TabPane tabId="7">
                {activeTab == 7 ? (
                  <User
                    gasStationName={data.name_en}
                    stationID={
                      window.location.href.indexOf("/admin/") > -1
                        ? helper.getIDfromUrl(window.location.href)
                        : getUserData().gas_station_id
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
