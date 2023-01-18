// ** Icons Import
export default [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/dashboard.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "reporting",
    navLink: "/vrp/admin/dashboard",
  },
  {
    id: "client",
    title: "Client",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/client.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "client_detail",
    navLink: "/vrp/admin/client",
  },
  {
    id: "gas-station-network",
    title: "Gas Station Network",
    action: "read",
    resource: "gas_station_network_detail",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/gas-station.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/admin/gas-station-network",
  },
  {
    id: "handheld-devices",
    title: "Handheld Devices",
    action: "read",
    resource: "fm.hand_held_devices",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/smartphone.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/admin/handheld-devices",
  },
  {
    id: "sim-management",
    title: "Sim Management",
    action: "read",
    resource: "fm.sim_management",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/smartphone.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/admin/sim-management",
  },
  {
    id: "fuel",
    title: "Fuel Types",
    action: "read",
    resource: "fm.fuel_types",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/fuel-station.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/admin/fuel-types",
  },
  {
    id: "vehicle-type",
    title: "Vehicle Type",
    action: "read",
    resource: "fm.vehicle_types",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/car.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/admin/vehicle-types",
  },
  {
    id: "refueling-transactions",
    title: "Refueling Transactions",
    action: "read",
    resource: "fm.all_fuel_requests",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/admin/refueling-transactions",
  },
  {
    id: "approve-topup",
    title: "Approve Top-up",
    action: "read",
    resource: "fm.all_unapproved_topup_transaction",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/admin/approve-topup",
  },
  {
    id: "held-transactions",
    title: "Held Transactions",
    action: "read",
    resource: "approve_held_transaction",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/admin/held-transactions",
  },
  {
    id: "search",
    title: "Search",
    action: "read",
    resource: "fm.search-driver-vehicle",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/search.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/admin/search",
  },
  {
    id: "gas-station-network-payment",
    title: "Gas Station Payment",
    action: "read",
    resource: "fm.network_payment_transactions",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/admin/gas_station_network_payment",
  },
  {
    id: "authorization-matrix",
    title: "Authority Matrix",
    action: "read",
    resource: "fm.group_roles",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/admin/authorization_matrix",
  },
  {
    id: "admin-users",
    title: "User Management",
    action: "read",
    resource: "user_management",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/admin/admin-users",
  },
];
