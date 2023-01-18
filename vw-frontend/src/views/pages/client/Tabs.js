// ** Reactstrap Imports
import React, { useEffect, useState } from "react";
import { Button, Nav, NavItem, NavLink } from "reactstrap";
import driverGreen from "@src/assets/images/icons/driver-icon.png";
import driverWhite from "@src/assets/images/icons/driver-white.png";
import usersWhite from "@src/assets/images/icons/users-white.png";
import usersGreen from "@src/assets/images/icons/users.png";
import transactionGreen from "@src/assets/images/icons/client-transactions.png";
import transactionWhite from "@src/assets/images/icons/transaction-white.png";
import invoicesGreen from "@src/assets/images/icons/dollor-green.png";
import invoicesWhite from "@src/assets/images/icons/dollar-white.png";
import vehiclesGreen from "@src/assets/images/icons/vehicles.png";
import vehiclesWhite from "@src/assets/images/icons/vehicles-white.png";
import stationGreen from "@src/assets/images/icons/client-station.png";
import stationWhite from "@src/assets/images/icons/gas-station-white.png";
import homeGreen from "@src/assets/images/icons/home-green.png";
import homeWhite from "@src/assets/images/icons/home-white.png";
import currentBalance from "@src/assets/images/icons/current-balance.png";
import invoice from "@src/assets/images/icons/bill.png";
import invoiceWhite from "@src/assets/images/icons/bill-white.png";

import ReactTooltip from "react-tooltip";
import { getUserData } from "@utils";

import { useTranslation } from "react-i18next";

const Tabs = ({ activeTab, toggleTab }) => {
  const { t } = useTranslation();

  const [role, setRole] = useState({
    driver: false,
    vehicle: false,
    fuel: false,
    networks: false,
    transactions: false,
    account_statement: false,
    invoices: false,
    users: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.drivers") {
        arr.driver = true;
      } else if (roles[i].subject == "fm.vehicles") {
        arr.vehicle = true;
      } else if (roles[i].subject == "fm.transfer_balance") {
        arr.fuel = true;
      } else if (roles[i].subject == "fm.client_stations") {
        arr.networks = true;
      } else if (roles[i].subject == "fm.client transactions") {
        arr.transactions = true;
      } else if (roles[i].subject == "fm.client transactions") {
        arr.transactions = true;
      } else if (roles[i].subject == "fm.client_users") {
        arr.users = true;
      } else if (roles[i].subject == "fm.create_invoice") {
        arr.invoices = true;
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
        {role.driver ? (
          <NavItem>
            <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
              {activeTab === "2" ? (
                <img src={driverWhite} style={{ marginRight: "5px" }} />
              ) : (
                <img src={driverGreen} style={{ marginRight: "5px" }} />
              )}
              <span className="fw-bold">{t("Drivers")}</span>
            </NavLink>
          </NavItem>
        ) : (
          ""
        )}
        {role.vehicle ? (
          <NavItem>
            <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")}>
              {activeTab === "3" ? (
                <img src={vehiclesWhite} style={{ marginRight: "5px" }} />
              ) : (
                <img src={vehiclesGreen} style={{ marginRight: "5px" }} />
              )}
              <span className="fw-bold">{t("Vehicles")}</span>
            </NavLink>
          </NavItem>
        ) : (
          ""
        )}
        {role.fuel ? (
          <NavItem>
            <NavLink active={activeTab === "4"} onClick={() => toggleTab("4")}>
              {activeTab === "4" ? (
                <img src={stationWhite} style={{ marginRight: "5px" }} />
              ) : (
                <img src={stationGreen} style={{ marginRight: "5px" }} />
              )}
              <span className="fw-bold">{t("Fuel Allocation")}</span>
            </NavLink>
          </NavItem>
        ) : (
          ""
        )}
        {role.networks ? (
          <NavItem>
            <NavLink active={activeTab === "5"} onClick={() => toggleTab("5")}>
              {activeTab === "5" ? (
                <img src={stationWhite} style={{ marginRight: "5px" }} />
              ) : (
                <img src={stationGreen} style={{ marginRight: "5px" }} />
              )}
              <span className="fw-bold">{t("Gas Station Networks")}</span>
            </NavLink>
          </NavItem>
        ) : (
          ""
        )}
        {role.transactions ? (
          <NavItem>
            <NavLink active={activeTab === "6"} onClick={() => toggleTab("6")}>
              {activeTab === "6" ? (
                <img src={transactionWhite} style={{ marginRight: "5px" }} />
              ) : (
                <img src={transactionGreen} style={{ marginRight: "5px" }} />
              )}
              <span className="fw-bold">{t("Transactions")}</span>
            </NavLink>
          </NavItem>
        ) : (
          ""
        )}
        <NavItem>
          <NavLink active={activeTab === "7"} onClick={() => toggleTab("7")}>
            {activeTab === "7" ? (
              <img src={invoicesWhite} style={{ marginRight: "5px" }} />
            ) : (
              <img src={invoicesGreen} style={{ marginRight: "5px" }} />
            )}
            <span className="fw-bold">{t("Statement of Account")}</span>
          </NavLink>
        </NavItem>
        {role.invoices ? (
          <NavItem>
            <NavLink active={activeTab === "8"} onClick={() => toggleTab("8")}>
              {activeTab === "8" ? (
                <img src={invoiceWhite} style={{ marginRight: "5px" }} />
              ) : (
                <img src={invoice} style={{ marginRight: "5px" }} />
              )}
              <span className="fw-bold"> {t("Invoices")}</span>
            </NavLink>
          </NavItem>
        ) : (
          ""
        )}
        {role.users ? (
          <NavItem>
            <NavLink active={activeTab === "9"} onClick={() => toggleTab("9")}>
              {activeTab === "9" ? (
                <img src={usersWhite} style={{ marginRight: "5px" }} />
              ) : (
                <img src={usersGreen} style={{ marginRight: "5px" }} />
              )}
              <span className="fw-bold"> {t("Users")}</span>
            </NavLink>
          </NavItem>
        ) : (
          ""
        )}
      </Nav>
    </div>
  );
};

export default Tabs;
