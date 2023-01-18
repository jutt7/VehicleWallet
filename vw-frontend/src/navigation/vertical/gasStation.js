export default [
  {
    id: "reporting",
    title: "Dashboard",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/dashboard.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "reporting",
    navLink: "/vrp/gas-station/dashboard",
  },

  {
    id: "gas-station-detail",
    title: "Gas Station Detail",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/gas-station.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "gas_station_detail",
    navLink: "/vrp/gas-station/gas-station-detail",
  },
  {
    id: "refueling-transactions",
    title: "Refueling Transactions",
    action: "read",
    resource: "gasstation_refueling_transaction",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/gas-station/refueling-transactions",
  },
  /** Gas Station Menu - Start  **/
  // {
  //   id: "gas-station-network-reporting",
  //   title: "Dashboard",
  //   icon: (
  //     <img
  //       src={"/vrp/images/Icons_custom/dashboard.png"}
  //       style={{ width: "20px", marginRight: "15px" }}
  //     />
  //   ),
  //   action: "read",
  //   resource: "view_network_dashboard",
  //   navLink: "/vrp/gas-station/network-dashboard",
  // },
  // {
  //   id: "gas-station-network-reporting",
  //   title: "Dashboard",
  //   icon: (
  //     <img
  //       src={"/vrp/images/Icons_custom/dashboard.png"}
  //       style={{ width: "20px", marginRight: "15px" }}
  //     />
  //   ),
  //   action: "read",
  //   resource: "view_network_dashboard",
  //   navLink: "/vrp/gas-station/network-dashboard",
  // },

  {
    id: "network-detail",
    title: "Network Detail",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/gas-station.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "network_detail",
    navLink: "/vrp/gas-station/network-detail",
  },

  {
    id: "gas-station-network-detail",
    title: "All Gas Stations",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/gas-station.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "gas_station_network_detail",
    navLink: "/vrp/gas-station/gas-station-network-detail",
  },
  {
    id: "gas-station-network-refueling-transaction",
    title: "Refueling Transactions",
    action: "read",
    resource: "gas_station_network_refueling_transaction",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/gas-station/network-refueling-transaction",
  },
  {
    id: "gas-station-network-account-statement",
    title: "Statement of Account",
    action: "read",
    resource: "gas_station_network_account_statement",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/gas-station/network-account-statement",
  },
  {
    id: "gas-station-network-staff-management",
    title: "Staff Management",
    action: "read",
    resource: "fm.staff_management",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/gas-station/network-staff-management",
  },
  {
    id: "gas-station-network-staff-transfer",
    title: "Staff Transfer",
    action: "read",
    resource: "fm.transfer_staff",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/gas-station/network-staff-transfer",
  },
];
