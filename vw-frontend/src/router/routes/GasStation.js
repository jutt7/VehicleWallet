import { lazy } from "react";

const Customer = [
  // Dashboards
  {
    path: "/vrp/gas-station/dashboard",
    component: lazy(() => import("../../views/charts/apex/customer")),
    meta: {
      action: "read",
      resource: "reporting",
    },
  },
  {
    path: "/vrp/gas-station/gas-station-detail",
    component: lazy(() =>
      import("../../views/pages/gas-station/gasStationDetail")
    ),
    meta: {
      action: "read",
      resource: "gas_station_detail",
    },
  },
  {
    path: "/vrp/gas-station/refueling-transactions",
    component: lazy(() => import("../../views/pages/refueling-transactions")),
    meta: {
      action: "read",
      resource: "gasstation_refueling_transaction",
    },
  },

  //---Gas Station network Menu
  // {
  //   path: "/vrp/gas-station/network-dashboard",
  //   component: lazy(() => import("../../views/charts/apex/customer")),
  //   meta: {
  //     action: "read",
  //     resource: "view_network_dashboard",
  //   },
  // },
  {
    path: "/vrp/gas-station/gas-station-network-detail",
    component: lazy(() => import("../../views/pages/gas-station/gasStation")),
    meta: {
      action: "read",
      resource: "gas_station_network_detail",
    },
  },
  {
    path: "/vrp/gas-station/network-refueling-transaction",
    component: lazy(() => import("../../views/pages/refueling-transactions")),
    meta: {
      action: "read",
      resource: "gas_station_network_refueling_transaction",
    },
  },
  {
    path: "/vrp/gas-station/network-account-statement",
    component: lazy(() =>
      import("../../views/pages/gas-station/statementOfAccount")
    ),
    meta: {
      action: "read",
      resource: "gas_station_network_account_statement",
    },
  },
  {
    path: "/vrp/gas-station/network-gas-station-detail/:id",
    component: lazy(() =>
      import("../../views/pages/gas-station/gasStationDetail")
    ),
    meta: {
      action: "read",
      resource: "gas_station_network_detail",
    },
  },
  {
    path: "/vrp/gas-station/network-detail",
    component: lazy(() =>
      import("../../views/pages/gas-station-network-detail/index")
    ),
    meta: {
      action: "read",
      resource: "network_detail",
    },
  },
  {
    path: "/vrp/gas-station/network-staff-management",
    component: lazy(() =>
      import("../../views/pages/gas-station-network-staff/index")
    ),
    meta: {
      action: "read",
      resource: "fm.staff_management",
    },
  },
  {
    path: "/vrp/gas-station/network-staff-transfer",
    component: lazy(() =>
      import("../../views/pages/gas-station-staff-transfer/index")
    ),
    meta: {
      action: "read",
      resource: "fm.transfer_staff",
    },
  },
];

export default Customer;
