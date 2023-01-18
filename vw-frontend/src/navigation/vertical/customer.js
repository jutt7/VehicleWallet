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
    navLink: "/vrp/dashboard",
  },
  {
    id: "client-detail",
    title: "Client Detail",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/client.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    action: "read",
    resource: "client_detail",
    navLink: "/vrp/client-detail",
  },
  {
    id: "refueling-transactions",
    title: "Refueling Transactions",
    action: "read",
    resource: "client_refueling_transaction",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/client/refueling-transactions",
  },

  {
    id: "amount-topup",
    title: "Amount Topup",
    action: "read",
    resource: "amount_topup",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/top-up.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/client/amount-topup",
  },
  {
    id: "approve-held-transaction",
    title: "Held Transacions",
    action: "read",
    resource: "approve_held_transaction",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/client/approve-held-transaction",
  },
  {
    id: "fm.transfer_balance",
    title: "Fuel Allocation",
    action: "read",
    resource: "fm.transfer_balance",
    icon: (
      <img
        src={"/vrp/images/Icons_custom/transaction.png"}
        style={{ width: "20px", marginRight: "15px" }}
      />
    ),
    navLink: "/vrp/client/allocate-amount",
  },
];
