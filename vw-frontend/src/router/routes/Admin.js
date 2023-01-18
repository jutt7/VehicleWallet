import { lazy } from "react";
const Admin = [
  // Dashboards

  {
    path: "/vrp/admin/dashboard",
    //component: lazy(() => import("../../views/pages/admin-dashboard")),
    component: lazy(() => import("../../views/charts/apex/admin")),
    meta: {
      action: "read",
      resource: "reporting",
    },
  },
  {
    path: "/vrp/admin/client",
    component: lazy(() => import("../../views/pages/client/index")),
    meta: {
      action: "read",
      resource: "client_detail",
    },
  },
  {
    path: "/vrp/admin/drivers",
    component: lazy(() => import("../../views/pages/drivers/index")),
    meta: {
      action: "read",
      resource: "ACL",
    },
  },
  {
    path: "/vrp/admin/gas-station/:id",
    component: lazy(() => import("../../views/pages/gas-station")),
    meta: {
      action: "read",
      resource: "gas_station_network_detail",
    },
  },
  {
    path: "/vrp/admin/gas-station-network",
    component: lazy(() => import("../../views/pages/gas-station-network")),
    meta: {
      action: "read",
      resource: "gas_station_network_detail",
    },
  },
  {
    path: "/vrp/admin/gas-station-staff",
    component: lazy(() => import("../../views/pages/gas-station-staff")),
    meta: {
      action: "read",
      resource: "ACL",
    },
  },
  {
    path: "/vrp/admin/fuel",
    component: lazy(() => import("../../views/pages/fuel")),
    meta: {
      action: "read",
      resource: "ACL",
    },
  },
  {
    path: "/vrp/admin/fuel-types",
    component: lazy(() => import("../../views/pages/fuel-types")),
    meta: {
      action: "read",
      resource: "fm.fuel_types",
    },
  },
  {
    path: "/vrp/admin/fuel-prices",
    component: lazy(() => import("../../views/pages/fuel-prices")),
    meta: {
      action: "read",
      resource: "ACL",
    },
  },
  {
    path: "/vrp/admin/handheld-devices",
    component: lazy(() => import("../../views/pages/handheld-devices")),
    meta: {
      action: "read",
      resource: "fm.hand_held_devices",
    },
  },
  {
    path: "/vrp/admin/sim-management",
    component: lazy(() => import("../../views/pages/sim/index")),
    meta: {
      action: "read",
      resource: "fm.sim_management",
    },
  },
  {
    path: "/vrp/admin/vehicle-types",
    component: lazy(() => import("../../views/pages/vehicle-types")),
    meta: {
      action: "read",
      resource: "fm.vehicle_types",
    },
  },
  {
    path: "/vrp/admin/vehicles",
    component: lazy(() => import("../../views/pages/vehicles")),
    meta: {
      action: "read",
      resource: "ACL",
    },
  },
  {
    path: "/vrp/admin/sources",
    component: lazy(() => import("../../views/pages/sources")),
    meta: {
      action: "read",
      resource: "ACL",
    },
  },
  {
    path: "/vrp/admin/roles",
    component: lazy(() => import("../../views/apps/roles-permissions/roles")),
    meta: {
      action: "read",
      resource: "ACL",
    },
  },
  {
    path: "/vrp/admin/refueling-transactions",
    component: lazy(() => import("../../views/pages/refueling-transactions")),
    meta: {
      action: "read",
      resource: "fm.all_fuel_requests",
    },
  },
  {
    path: "/vrp/admin/manage-client/:id",
    component: lazy(() => import("../../views/pages/client/clientManagement")),
    meta: {
      action: "read",
      resource: "client_detail",
    },
  },
  {
    path: "/vrp/admin/gas-station-detail/:id",
    component: lazy(() =>
      import("../../views/pages/gas-station/gasStationDetail")
    ),
    meta: {
      action: "read",
      resource: "gas_station_detail",
    },
  },
  {
    path: "/vrp/admin/approve-topup",
    component: lazy(() => import("../../views/pages/approve-topup/index")),
    meta: {
      action: "read",
      resource: "fm.all_unapproved_topup_transaction",
    },
  },
  {
    path: "/vrp/admin/held-transactions",
    component: lazy(() =>
      import("../../views/pages/admin-held-transaction/index")
    ),
    meta: {
      action: "read",
      resource: "approve_held_transaction",
    },
  },
  {
    path: "/vrp/admin/search",
    component: lazy(() => import("../../views/pages/search/index")),
    meta: {
      action: "read",
      resource: "fm.search-driver-vehicle",
    },
  },
  {
    path: "/vrp/admin/gas_station_network_payment",
    component: lazy(() =>
      import("../../views/pages/gas-station-network-payment/index")
    ),
    meta: {
      action: "read",
      resource: "fm.network_payment_transactions",
    },
  },
  {
    path: "/vrp/admin/payment",
    component: lazy(() =>
      import("../../views/pages/gas-station-network-payment/payment")
    ),
    meta: {
      action: "read",
      resource: "fm.network_payment_transactions",
    },
  },
  {
    path: "/vrp/admin/authorization_matrix",
    component: lazy(() =>
      import("../../views/pages/authorization-matrix/index")
    ),
    meta: {
      action: "read",
      resource: "fm.group_roles",
    },
  },
  {
    path: "/vrp/admin/network-account-statement/:id",
    component: lazy(() =>
      import("../../views/pages/gas-station/statementOfAccount")
    ),
    meta: {
      action: "read",
      resource: "gas_station_network_detail",
    },
  },
  {
    path: "/vrp/admin/network-invoices/:id",
    component: lazy(() =>
      import("../../views/pages/Gas-station-network-invoices/index")
    ),
    meta: {
      action: "read",
      resource: "gas_station_network_detail",
    },
  },
  {
    path: "/vrp/admin/amount-topup",
    component: lazy(() => import("../../views/pages/amount-topup/index")),
    meta: {
      action: "read",
      resource: "fm.all_unapproved_topup_transaction",
    },
  },
  {
    path: "/vrp/admin/top-ups",
    component: lazy(() => import("../../views/pages/client/client_topup_list")),
    meta: {
      action: "read",
      resource: "fm.all_unapproved_topup_transaction",
    },
  },
  {
    path: "/vrp/admin/admin-users",
    component: lazy(() => import("../../views/pages/admin-user/index")),
    meta: {
      action: "read",
      resource: "user_management",
    },
  },
];
export default Admin;
