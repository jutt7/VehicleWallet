// ** Reactstrap Imports
import React, { useEffect, useState } from "react";

import { Nav, NavItem, NavLink, Button } from "reactstrap";
import driverGreen from "@src/assets/images/icons/driver-icon.png";
import driverWhite from "@src/assets/images/icons/driver-white.png";
import usersWhite from "@src/assets/images/icons/users-white.png";
import usersGreen from "@src/assets/images/icons/users.png";
import transactionGreen from "@src/assets/images/icons/client-transactions.png";
import transactionWhite from "@src/assets/images/icons/transaction-white.png";
import invoicesGreen from "@src/assets/images/icons/dollor-green.png";
import invoicesWhite from "@src/assets/images/icons/dollar-white.png";
import fuelPriceGreen from "@src/assets/images/icons/client-station.png";
import fuelPriceWhite from "@src/assets/images/icons/gas-station-white.png";
import clientsGreen from "@src/assets/images/icons/clients-green.png";
import clientsWhite from "@src/assets/images/icons/clients-white.png";
import homeGreen from "@src/assets/images/icons/home-green.png";
import homeWhite from "@src/assets/images/icons/home-white.png";
import ReactTooltip from "react-tooltip";
import { getUserData } from "@utils";

import { useTranslation } from "react-i18next";

const Tabs = ({ activeTab, toggleTab }) => {
  const { t } = useTranslation();

  const [role, setRole] = useState({
    staff: false,
    fuel: false,
    transactions: false,
    account_statement: false,
    users: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.gas_station_staffs") {
        arr.staff = true;
      } else if (roles[i].subject == "fm.fuel_prices") {
        arr.fuel = true;
      } else if (roles[i].subject == "fm.gas station transaction") {
        arr.transactions = true;
      } else if (roles[i].subject == "fm.gas_station_user") {
        arr.users = true;
      }
    }
    // console.log("arrrrrrrrrrr", arr);
    setRole(arr);
  };

  useEffect(() => {
    setRoles();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <ReactTooltip />
      <i
        style={{ cursor: "pointer" }}
        onClick={() => {
          history.back();
        }}
        class="fa-solid fa-circle-arrow-left fa-2xl"
      ></i>
      <Nav
        style={{ marginTop: "10px", marginLeft: "10px" }}
        pills
        className="mb-2"
      >
        <NavItem>
          <NavLink active={activeTab === "1"} onClick={() => toggleTab("1")}>
            {activeTab === "1" ? (
              <img src={homeWhite} style={{ marginRight: "5px" }} />
            ) : (
              <img src={homeGreen} style={{ marginRight: "5px" }} />
            )}
            <span className="fw-bold">{t("My Vehicle Wallet")}</span>
          </NavLink>
        </NavItem>
        {role.staff ? (
          <NavItem>
            <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
              {activeTab === "2" ? (
                <img src={driverWhite} style={{ marginRight: "5px" }} />
              ) : (
                <img src={driverGreen} style={{ marginRight: "5px" }} />
              )}
              <span className="fw-bold">{t("Staff")}</span>
            </NavLink>
          </NavItem>
        ) : (
          ""
        )}
        {/* <NavItem>
        <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")}>
          {activeTab === "3" ? (
            <img src={clientsWhite} style={{ marginRight: "5px" }} />
          ) : (
            <img src={clientsGreen} style={{ marginRight: "5px" }} />
          )}
          <span className="fw-bold">Clients</span>
        </NavLink>
      </NavItem> */}
        {role.fuel ? (
          <NavItem>
            <NavLink active={activeTab === "4"} onClick={() => toggleTab("4")}>
              {activeTab === "4" ? (
                <img src={fuelPriceWhite} style={{ marginRight: "5px" }} />
              ) : (
                <img src={fuelPriceGreen} style={{ marginRight: "5px" }} />
              )}
              <span className="fw-bold">{t("Fuel Prices")}</span>
            </NavLink>
          </NavItem>
        ) : (
          ""
        )}
        {role.transactions ? (
          <NavItem>
            <NavLink active={activeTab === "5"} onClick={() => toggleTab("5")}>
              {activeTab === "5" ? (
                <img src={transactionWhite} style={{ marginRight: "5px" }} />
              ) : (
                <img src={transactionGreen} style={{ marginRight: "5px" }} />
              )}
              <span className="fw-bold">{t("Gas Station Transaction")}</span>
            </NavLink>
          </NavItem>
        ) : (
          ""
        )}
        <NavItem>
          <NavLink active={activeTab === "6"} onClick={() => toggleTab("6")}>
            {activeTab === "6" ? (
              <img src={invoicesWhite} style={{ marginRight: "5px" }} />
            ) : (
              <img src={invoicesGreen} style={{ marginRight: "5px" }} />
            )}
            <span className="fw-bold">{t("Account Statement")}</span>
          </NavLink>
        </NavItem>
        {/* {role.users ? (
          <NavItem>
            <NavLink active={activeTab === "7"} onClick={() => toggleTab("7")}>
              {activeTab === "7" ? (
                <img src={usersWhite} style={{ marginRight: "5px" }} />
              ) : (
                <img src={usersGreen} style={{ marginRight: "5px" }} />
              )}
              <span className="fw-bold"> {t("Users")}</span>
            </NavLink>
          </NavItem>
        ) : (
          ""
        )} */}
        {window.location.pathname.split("/")[1] != "admin" ? (
          <></>
        ) : (
          <Button
            color="primary"
            style={{ marginLeft: "150px" }}
            onClick={(e) => {
              history.back();
            }}
          >
            {t("Back")}
          </Button>
        )}
      </Nav>
    </div>
  );
};

export default Tabs;
