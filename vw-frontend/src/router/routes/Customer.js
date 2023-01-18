import { lazy } from "react";

const Customer = [
  // Dashboards

  {
    path: "/vrp/dashboard",
    component: lazy(() => import("../../views/charts/apex/customer")),
    meta: {
      action: "read",
      resource: "reporting",
    },
  },
  {
    path: "/vrp/client-detail",
    component: lazy(() => import("../../views/pages/client/clientManagement")),
    meta: {
      action: "read",
      resource: "client_detail",
    },
  },
  {
    path: "/vrp/client/refueling-transactions",
    component: lazy(() => import("../../views/pages/client/transactions")),
    meta: {
      action: "read",
      resource: "client_refueling_transaction",
    },
  },
  {
    path: "/vrp/client/amount-topup",
    component: lazy(() => import("../../views/pages/amount-topup/index")),
    meta: {
      action: "read",
      resource: "amount_topup",
    },
  },

  {
    path: "/vrp/client/approve-held-transaction",
    component: lazy(() =>
      import("../../views/pages/approve-held-transaction/index")
    ),
    meta: {
      action: "read",
      resource: "approve_held_transaction",
    },
  },
  {
    path: "/vrp/client/client-chat",
    component: lazy(() => import("../../views/pages/client-chat/index")),
    meta: {
      action: "read",
      resource: "client-chat",
    },
  },
  {
    path: "/vrp/client/allocate-amount",
    component: lazy(() => import("../../views/pages/client/AllocateAmount")),
    meta: {
      action: "read",
      resource: "fm.transfer_balance",
    },
  },
  {
    path: "/vrp/client/top-ups",
    component: lazy(() => import("../../views/pages/client/client_topup_list")),
    meta: {
      action: "read",
      resource: "amount_topup",
    },
  },
];

export default Customer;
