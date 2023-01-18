import { lazy } from "react";

const Customer = [
  // Dashboards
  // {
  //   path: "/vrp/supervisor/dashboard",
  //   component: lazy(() => import("../../views/charts/apex/supervisor")),
  //   meta: {
  //     action: "read",
  //     resource: "reporting",
  //   },
  // },
  {
    path: "/vrp/supervisor/held-transactions",
    component: lazy(() =>
      import("../../views/pages/supervisor/held_transactions")
    ),
    meta: {
      action: "read",
      resource: "held_transactions",
    },
  },
  {
    path: "/vrp/supervisor/summary-by-client",
    component: lazy(() =>
      import("../../views/pages/supervisor/summary_by_client/index")
    ),
    meta: {
      action: "read",
      resource: "summary_by_client",
    },
  },
  {
    path: "/vrp/supervisor/summary-by-attendent",
    component: lazy(() =>
      import("../../views/pages/supervisor/summary_by_attendent/index")
    ),
    meta: {
      action: "read",
      resource: "summary_by_attendent",
    },
  },
  {
    path: "/vrp/supervisor/summary-by-interval",
    component: lazy(() =>
      import("../../views/pages/supervisor/summary_by_interval")
    ),
    meta: {
      action: "read",
      resource: "summary_by_interval",
    },
  },
  {
    path: "/vrp/supervisor/attendents",
    component: lazy(() => import("../../views/pages/supervisor/attendents")),
    meta: {
      action: "read",
      resource: "manage_attendent",
    },
  },
];

export default Customer;
