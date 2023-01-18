// ** Icons Import
export default [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: (
      <img
        src={"/images/Icons_custom/dashboard.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "ACL",
    navLink: "/admin/dashboard",
  },
  {
    id: "client",
    title: "Client",
    icon: (
      <img
        src={"/images/Icons_custom/client.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "ACL",
    navLink: "/admin/client",
  },
  {
    id: "gas-station-network",
    title: "Gas Station Network",
    action: "read",
    resource: "ACL",
    icon: (
      <img
        src={"/images/Icons_custom/gas-station.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/admin/gas-station-network",
  },
  {
    id: "handheld-devices",
    title: "Handheld Devices",
    action: "read",
    resource: "ACL",
    icon: (
      <img
        src={"/images/Icons_custom/smartphone.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/admin/handheld-devices",
  },
  {
    id: "fuel",
    title: "Fuel Types",
    action: "read",
    resource: "ACL",
    icon: (
      <img
        src={"/images/Icons_custom/fuel-station.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/admin/fuel-types",
  },
  {
    id: "vehicle-type",
    title: "Vehicle Type",
    action: "read",
    resource: "ACL",
    icon: (
      <img
        src={"/images/Icons_custom/car.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/admin/vehicle-types",
  },
  {
    id: "refueling-transactions",
    title: "Refueling Transactions",
    action: "read",
    resource: "ACL",
    icon: (
      <img
        src={"/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/admin/refueling-transactions",
  },
  {
    id: "approve-topup",
    title: "Approve Top-up",
    action: "read",
    resource: "ACL",
    icon: (
      <img
        src={"/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/admin/approve-topup",
  },
  {
    id: "held-transactions",
    title: "Held Transactions",
    action: "read",
    resource: "ACL",
    icon: (
      <img
        src={"/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/admin/held-transactions",
  },
  {
    id: "search",
    title: "Search",
    action: "read",
    resource: "ACL",
    icon: (
      <img
        src={"/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/admin/search",
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
