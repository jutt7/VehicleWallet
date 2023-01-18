export default [
  // {
  //   id: "reporting",
  //   title: "Dashboard",
  //   icon: (
  //     <img
  //       src={"/vrp/images/Icons_custom/dashboard.png"}
  //       style={{ width: "20px", marginRight: "15px" }}
  //     />
  //   ),
  //   action: "read",
  //   resource: "reporting",
  //   navLink: "/vrp/supervisor/dashboard",
  // },
  {
    id: "held_transactions",
    title: "Held Transaction",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/held_transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "held_transactions",
    navLink: "/vrp/supervisor/held-transactions",
  },
  {
    id: "summary_by_client",
    title: "Summary by client",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/summary_by_client.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "summary_by_client",
    navLink: "/vrp/supervisor/summary-by-client",
  },
  {
    id: "summary_by_attendent",
    title: "Summary by attendent",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/summary_by_attendent.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "summary_by_attendent",
    navLink: "/vrp/supervisor/summary-by-attendent",
  },
  {
    id: "summary_by_interval",
    title: "Summary by interval",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/summary_by_interval.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "summary_by_interval",
    navLink: "/vrp/supervisor/summary-by-interval",
  },
  {
    id: "manage_attendent",
    title: "Manage Attendents",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/manage_attendents.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "manage_attendent",
    navLink: "/vrp/supervisor/attendents",
  },
];
