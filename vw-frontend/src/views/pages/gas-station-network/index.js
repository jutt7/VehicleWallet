import React, { useEffect, useState, useContext } from "react";
import { Input, Label } from "reactstrap";
import { Check, X, Edit, User } from "react-feather";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import AddUpdateModal from "./AddUpdateModal";
import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import CompletedTransactions from "./completedTransactions";
import HeldTransactions from "./heldTransactions";
import { kFormatter } from "@utils";
import { ThemeColors } from "@src/utility/context/ThemeColors";
import detailIcon from "@src/assets/images/icons/details.png";
import { Link } from "react-router-dom";
import transactionGreen from "@src/assets/images/icons/client-transactions.png";
import invoicesGreen from "@src/assets/images/icons/dollor-green.png";
import invoice from "@src/assets/images/icons/bill.png";
import Maps from "./Map";
import { useTranslation } from "react-i18next";
import Transfer from "./transferModal";
import usersGreen from "@src/assets/images/icons/users.png";
import NetworkUser from "./networkUser";
import { getUserData } from "@utils";
import DataTableExportButton from "../../components/TableToExcel";
import InvoiceModal from "./InvoiceModal";
export default function client(props) {
  const { colors } = useContext(ThemeColors);

  const { t } = useTranslation();

  const [clientShow, setclientShow] = useState(true);
  const [stationShow, setstationShow] = useState(false);
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [onSubmit, setonSubmit] = useState("");
  const [showAddUpdateModal, setshowAddUpdateModal] = useState(false);
  const [updateModalData, setupdateModalData] = useState(null);
  const [showNetworkUserModal, setShowNetworkUserModal] = useState(false);
  const [updateIndex, setupdateIndex] = useState("");
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteIndex, setdeleteIndex] = useState("");
  const [deleteItem, setdeleteItem] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [deleteMessage, setdeleteMessage] = useState("");
  const [sorting_icon, setsorting_icon] = useState();
  const [paginationStates, setpaginationStates] = useState({
    itemsCountPerPage: "",
    activePage: "",
    totalItemsCount: "",
  });

  const [showInvoiceModal, setshowInvoiceModal] = useState(false);

  const [mapData, setMapData] = useState([]);
  const [mapKey, setMapKey] = useState("");

  const [searchData, setSearchData] = useState("");

  const [transactionData, settransactionData] = useState([]);
  const [transactionCount, settransactionCount] = useState({
    total_complete: 0,
    total_held: 0,
  });

  let users = [];

  const [fuelData, setFuelData] = useState([]);

  const [dataForTable, setDataForTable] = useState([]);

  const [showMapModal, setShowMapModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [comissionSubmit, setComissionSubmit] = useState([]);
  const [role, setRole] = useState({
    addNetwork: false,
    updateNetwork: false,
    deleteNetwork: false,
    viewStations: false,
    transfer_staff: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.gas_station_network.store") {
        arr.addNetwork = true;
      } else if (roles[i].subject == "fm.gas_station_network.update") {
        arr.updateNetwork = true;
      } else if (roles[i].subject == "fm.gas_station_network.delete") {
        arr.deleteNetwork = true;
      } else if (roles[i].subject == "fm.stations") {
        arr.viewStations = true;
      } else if (roles[i].subject == "fm.transfer_staff") {
        arr.transfer_staff = true;
      }
    }
    // console.log("arrrrrrrrrrr", arr);
    setRole(arr);
  };

  const submitAction = (args = "") => {
    if (onSubmit == "create") {
      create(args);
    }
    if (onSubmit == "update") {
      update(args);
    }
    if (onSubmit == "delete") {
      remove();
    }
  };

  const sortAscending = (icon, sortType, colsort) => {
    if (
      colsort == "name_en" ||
      colsort == "name_ar" ||
      colsort == "name_ur" ||
      colsort == "address" ||
      colsort == "cr_number" ||
      colsort == "vw_deposited_amount" ||
      colsort == "vat_no"
    ) {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            helper.checkinteger(a[colsort]) > helper.checkinteger(b[colsort]) &&
            sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    } else {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            helper.checkinteger(a[colsort]) > helper.checkinteger(b[colsort]) &&
            sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    }
  };

  const onCurrPageChange = async (page) => {
    await setcurrentPage(page);
    getData(page);
    console.log(page, "testing data", currentPage);
  };

  const openCreateModal = () => {
    setupdateModalData(null);
    setonSubmit("create");
    setshowAddUpdateModal(true);
  };

  const onOpenUpdateModal = (item, index) => {
    setupdateModalData(item);
    setshowAddUpdateModal(true);
    setupdateIndex(index);
    setonSubmit("update");
  };
  const onOpenInvoiceModal = (item, index) => {
    setupdateModalData(item);
    setshowInvoiceModal(true);
  };
  const onOpenNetworkModalModal = (item, index) => {
    if (item.users && item.users.length > 0) {
      item.users.forEach((user) => {
        if (user.designation == "gas_station_network_manager") {
          setupdateModalData(user);

          setShowNetworkUserModal(true);
          setupdateIndex(index);
          setonSubmit("update");
        }
      });
    }
  };
  const onOpenMapModal = (item, index) => {
    if (helper.isObject(item) && item.gas_stations) {
      setMapData(item.gas_stations);
      setShowMapModal(true);
    }
  };
  const onOpenTransferModal = (item, index) => {
    setupdateModalData(item);
    setShowTransferModal(true);
  };
  const onCloseAddUpdateModal = () => {
    setshowAddUpdateModal(false);
    setShowNetworkUserModal(false);
    setupdateIndex(null);
    setonSubmit(null);
    setupdateModalData(null);
  };

  const onOpenDeleteModal = (rowData, index) => {
    setdeleteItem(rowData);
    setdeleteIndex(index);
    setonSubmit("delete");
    setdeleteMessage(rowData.status === 1 ? "Deactivate" : "activate");
    setshowDeleteModal(true);
  };

  const onCloseDeleteModal = () => {
    setshowDeleteModal(false);
    setdeleteIndex("");
    setdeleteItem("");
    setonSubmit("");
  };

  const getData = () => {
    setoverlay(true);
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/gas-station-networks?page=${currentPage}&pagination=true`,
        {}
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log(helper.applyCountID(res.data.data.data), "data");
          FilterDataForTable(res.data.data.data);

          setdata(helper.applyCountID(res.data.data.data));
          setpaginationStates({
            activePage: res.data.data.current_page,
            itemsCountPerPage: res.data.data.per_page,
            totalItemsCount: res.data.data.total,
          });
          setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setdata([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setdata([]);
        setoverlay(false);
      });
  };
  const FilterDataForTable = (data) => {
    let arr = [];
    data.forEach((item) => {
      arr.push({
        name: item.name_en,
        no_of_gas_stations:
          item.gas_stations && item.gas_stations.length > 0
            ? item.gas_stations.length
            : 0,
        completed_transactions: findCompletedTransaction(
          item.gas_station_network_id
        ),
        held_transactions: findHeldTransaction(item.gas_station_network_id),

        created_at: item.created_at,
      });
    });
    setDataForTable(arr);
  };

  const createUserArray = (data) => {
    let arr = [];
    arr.push({
      first_name: data.admin_contact_person,
      email: data.admin_contact_email,
      password: data.admin_password,
      mobile: data.admin_contact_number,
      group_id: 10,
      designation: "gas_station_network_manager",
    });
    if (
      data.billing_contact_email != "" &&
      data.billing_contact_number != "" &&
      data.billing_contact_person != "" &&
      data.billing_password != ""
    )
      arr.push({
        first_name: data.billing_contact_person,
        email: data.billing_contact_email,
        password: data.billing_password,
        mobile: data.billing_contact_number,
        group_id: 19,
        designation: "gas_station_network_billing",
      });
    if (
      data.operation_contact_email != "" &&
      data.operation_contact_number != "" &&
      data.operation_contact_person != "" &&
      data.operation_password != ""
    )
      arr.push({
        first_name: data.operation_contact_person,
        email: data.operation_contact_email,
        password: data.operation_password,
        mobile: data.operation_contact_number,
        group_id: 10,
        designation: "gas_station_network_operation",
      });
    return arr;
  };
  const updateUserArray = (data) => {
    let arr = [];
    arr.push({
      first_name: data.admin_contact_person,
      email: data.admin_contact_email,
      password: data.admin_password,
      mobile: data.admin_contact_number,
      group_id: 10,
      designation: "gas_station_network_manager",
      user_id: data.admin_id,
    });
    if (
      data.billing_contact_email != "" &&
      data.billing_contact_number != "" &&
      data.billing_contact_person != ""
      // &&
      // data.billing_password != ""
    )
      arr.push({
        first_name: data.billing_contact_person,
        email: data.billing_contact_email,
        password: data.billing_password,
        mobile: data.billing_contact_number,
        group_id: 19,
        designation: "gas_station_network_billing",
        user_id: data.bill_id,
      });
    if (
      data.operation_contact_email != "" &&
      data.operation_contact_number != "" &&
      data.operation_contact_person != ""
      // &&
      // data.operation_password != ""
    )
      arr.push({
        first_name: data.operation_contact_person,
        email: data.operation_contact_email,
        password: data.operation_password,
        mobile: data.operation_contact_number,
        group_id: 10,
        designation: "gas_station_network_operation",
        user_id: data.op_id,
      });
    return arr;
  };

  const create = (args) => {
    // console.log("argsssssssss", args);
    const usersArray = createUserArray(args);

    let arr = [];
    comissionSubmit.forEach((item) => {
      arr.push({
        fuel_type_id: item.id,
        vw_commision: item.comission,
        // price_id: item.price_id,
      });
    });
    // console.log("arrrrrrrrrr", usersArray);

    // return;
    // let arr = [];

    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/gas-station-network/store`, {
        gas_station_network: {
          name_en: args.name_en,
          name_ar: args.name_ar,
          name_ur: args.name_ur,
          address: args.address,
          vat_no: args.vat_no,
          cr_number: args.cr_number,
          location_id: null,
          // operation_contact_person: args.operation_contact_person,
          // operation_contact_number: args.operation_contact_number,
          // operation_contact_email: args.operation_contact_email,
          // admin_contact_person: args.admin_contact_person,
          // admin_contact_email: args.admin_contact_email,
          // admin_contact_number: args.admin_contact_number,
          // billing_contact_person: args.billing_contact_person,
          // billing_contact_email: args.billing_contact_email,
          // billing_contact_number: args.billing_contact_number,
          payment_terms: args.payment_terms.value,
          credit_terms: args.credit_terms.value,
          // vw_deposited_amount: args.vw_deposited_amount,
          cr_photo: args.cr_photo,
          vat_photo: args.vat_photo,
          contract_no: args.contract_no,
          contract_start_date: args.contract_start_date,
          contract_end_date: args.contract_end_date,
        },
        user: usersArray,
        pricing: arr,
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setshowAddUpdateModal(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          getData();
        } else {
          console.log("in else", res);
          let msg = res.data.message_en;
          if (msg.includes("already exist")) {
            setoverlay(false);
            helper.toastNotification(msg, "FAILED_MESSAGE");
          } else {
            setoverlay(false);
            helper.toastNotification(
              "Unable to process request.",
              "FAILED_MESSAGE"
            );
          }
        }
      })
      .catch((error) => {
        setoverlay(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
        console.log(error, "errorrrr");
      });
  };

  const update = (args) => {
    // console.log("argsssssssss", args);
    const usersArray = updateUserArray(args);
    // console.log("usersarrrrrrrrrrr", usersArray);
    // return;

    let arr = [];
    comissionSubmit.forEach((item) => {
      arr.push({
        fuel_type_id: item.id,
        vw_commision: item.comission,
        price_id: item.price_id,
      });
    });
    console.log("arrrrrrrrrr", arr);

    // return;
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/gas-station-network/update`, {
        gas_station_network: {
          gas_station_network_id: updateModalData.gas_station_network_id,
          name_en: args.name_en,
          name_ar: args.name_ar,
          name_ur: args.name_ur,
          address: args.address,
          vat_no: args.vat_no,
          cr_number: args.cr_number,
          location_id: null,
          // operation_contact_person: args.operation_contact_person,
          // operation_contact_number: args.operation_contact_number,
          // operation_contact_email: args.operation_contact_email,
          // admin_contact_person: args.admin_contact_person,
          // admin_contact_email: args.admin_contact_email,
          // admin_contact_number: args.admin_contact_number,
          // billing_contact_person: args.billing_contact_person,
          // billing_contact_email: args.billing_contact_email,
          // billing_contact_number: args.billing_contact_number,
          payment_terms: args.payment_terms.value,
          credit_terms: args.credit_terms.value,
          // vw_deposited_amount: args.vw_deposited_amount,
          cr_photo: args.cr_photo,
          vat_photo: args.vat_photo,
          contract_no: args.contract_no,
          contract_start_date: args.contract_start_date,
          contract_end_date: args.contract_end_date,
        },
        user: usersArray,
        pricing: arr,
      })
      .then((res) => {
        console.log("catch res", res);
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code == 200) {
          setoverlay(false);
          setshowAddUpdateModal(false);
          setShowNetworkUserModal(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          if (props.data) {
            props.getSearchData();
          } else {
            getData();
          }
        } else {
          setoverlay(false);

          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
        }
      })
      .catch((error) => {
        setoverlay(false);
        console.log("catch error", error);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
      });
  };

  const remove = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/gas-station-network/delete`, {
        gas_station_network: {
          gas_station_network_id: deleteItem.gas_station_network_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setshowDeleteModal(false);
          getData();
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
        } else {
          setoverlay(false);
          setshowDeleteModal(false);
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
        }
      })
      .catch((error) => {
        setoverlay(false);
        setshowDeleteModal(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
      });
  };

  const getTransactionsCount = () => {
    setoverlay(true);
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/network-refueling-transactions`)
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setoverlay(false);
          settransactionData(res.data.data);
          settransactionCount({
            total_complete: res.data.total_complete,
            total_held: res.data.total_held,
          });
        } else {
          setoverlay(false);
          setshowDeleteModal(false);
          // helper.toastNotification(
          //   "Unable to get transactions.",
          //   "FAILED_MESSAGE"
          // );
        }
      })
      .catch((error) => {
        console.log("error", error);
        setoverlay(false);
        setshowDeleteModal(false);
        helper.toastNotification(
          "Unable to get transactions.",
          "FAILED_MESSAGE"
        );
      });
  };
  const CustomLabel = ({ htmlFor }) => {
    return (
      <Label className="form-check-label" htmlFor={htmlFor}>
        <span className="switch-icon-left">
          <Check size={14} />
        </span>
        <span className="switch-icon-right">
          <X size={14} />
        </span>
      </Label>
    );
  };

  const findCompletedTransaction = (id) => {
    const transaction = transactionData.find(function (item) {
      return item.gas_station_network_id === id;
    });

    if (helper.isObject(transaction)) {
      return transaction.completed;
    }
    return 0;
  };

  const findHeldTransaction = (id) => {
    const transaction = transactionData.find(function (item) {
      return item.gas_station_network_id === id;
    });

    if (helper.isObject(transaction)) {
      return transaction.held;
    }
    return 0;
  };

  const filterData = (value) => {
    if (value.length >= 3) {
      setSearchData(value);
    } else {
      setSearchData("");
    }
  };
  const getFuelTypeData = () => {
    setoverlay(true);
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/fuel-types?page=${currentPage}&pagination=true`,
        {}
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(
            helper.applyCountID(res.data.data.data),
            "fuel type data"
          );
          setFuelData(helper.applyCountID(res.data.data.data));
          setpaginationStates({
            activePage: res.data.data.current_page,
            itemsCountPerPage: res.data.data.per_page,
            totalItemsCount: res.data.data.total,
          });
          setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setdata([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setdata([]);
        setoverlay(false);
      });
  };

  useEffect(() => {
    getFuelTypeData();
    setRoles();
    if (props.data) {
      setdata(props.data);
      getTransactionsCount();
    } else {
      getData();
      getTransactionsCount();
    }
  }, []);

  return (
    <div>
      <ClipLoader
        css={`
          position: fixed;
          top: 40%;
          left: 40%;
          right: 40%;
          bottom: 20%;
          z-index: 999999;
          display: block;
        `}
        size={"200px"}
        this
        also
        works
        color={"#196633"}
        height={100}
        loading={overlay ? true : false}
      />
      {window.location.pathname.split("/").splice(-1) !=
      "gas-station-network" ? (
        ""
      ) : (
        <Row>
          <Col md={6}>
            <CompletedTransactions
              kFormatter={kFormatter}
              transactionCount={transactionCount}
              transactionData={[]}
            />
          </Col>
          <Col md={6}>
            <HeldTransactions
              kFormatter={kFormatter}
              transactionCount={transactionCount}
              transactionData={[]}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={12}>
          {window.location.pathname.split("/").splice(-1) !=
          "gas-station-network" ? (
            ""
          ) : (
            <Row>
              <Col style={{ display: "flex" }}>
                {role.addNetwork ? (
                  <Button onClick={(e) => openCreateModal()}>
                    <i className="fas fa-plus"></i>{" "}
                    {t("Add Gas Station Network")}
                  </Button>
                ) : (
                  ""
                )}
                <input
                  className="form-control crud-search"
                  placeholder={`${t("Search")}...`}
                  onChange={(e) => filterData(e.target.value)}
                />
              </Col>
              <Col
                style={{
                  display: "flex",
                  alignItems: "center",

                  justifyContent: "end",
                }}
              >
                <DataTableExportButton
                  className={""}
                  style={""}
                  color={"primary"}
                  data={dataForTable}
                  t={t}
                />
                <div className={`fleetPaginator`}>
                  <Pagination
                    activePage={
                      paginationStates.activePage
                        ? parseInt(paginationStates.activePage)
                        : 1
                    }
                    itemsCountPerPage={
                      paginationStates.itemsCountPerPage
                        ? parseInt(paginationStates.itemsCountPerPage)
                        : 1
                    }
                    totalItemsCount={
                      paginationStates.totalItemsCount
                        ? parseInt(paginationStates.totalItemsCount)
                        : 1
                    }
                    pageRangeDisplayed={5}
                    prevPageText="<"
                    nextPageText=">"
                    onChange={(e) => onCurrPageChange(e)}
                    itemClassFirst={`itemClassFirst`}
                    itemClassPrev={`itemClassPrev`}
                    itemClassLast={`itemClassLast`}
                    disabledClass={`disabledClass`}
                    linkClass={`linkClass`}
                  />{" "}
                </div>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th className="table-th blackColor" style={{ width: "120px" }}>
                <p>
                  {t("Name")}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col1_asc", "asc", "name_en")
                      }
                      className={
                        sorting_icon == "Col1_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col1_des", "des", "name_en")
                      }
                      className={
                        sorting_icon == "Col1_des"
                          ? "fas fa-long-arrow-alt-down sort-color"
                          : "fas fa-long-arrow-alt-down"
                      }
                    ></i>
                  </span>
                </p>
              </th>

              <th className="table-th blackColor">
                <p>
                  {t(" No. of Gas Stations")}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col6_asc", "asc", "vw_deposited_amount")
                      }
                      className={
                        sorting_icon == "Col6_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col6_des", "des", "vw_deposited_amount")
                      }
                      className={
                        sorting_icon == "Col6_des"
                          ? "fas fa-long-arrow-alt-down sort-color"
                          : "fas fa-long-arrow-alt-down"
                      }
                    ></i>
                  </span>
                </p>
              </th>

              <th className="table-th blackColor">
                <p>
                  {t("Completed Transactions")}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col7_asc", "asc", "vat_no")
                      }
                      className={
                        sorting_icon == "Col7_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col7_des", "des", "vat_no")
                      }
                      className={
                        sorting_icon == "Col7_des"
                          ? "fas fa-long-arrow-alt-down sort-color"
                          : "fas fa-long-arrow-alt-down"
                      }
                    ></i>
                  </span>
                </p>
              </th>

              <th className="table-th blackColor">
                <p>
                  {t("Held Transactions")}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col7_asc", "asc", "vat_no")
                      }
                      className={
                        sorting_icon == "Col7_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col7_des", "des", "vat_no")
                      }
                      className={
                        sorting_icon == "Col7_des"
                          ? "fas fa-long-arrow-alt-down sort-color"
                          : "fas fa-long-arrow-alt-down"
                      }
                    ></i>
                  </span>
                </p>
              </th>
              {window.location.pathname.split("/").splice(-1) ==
                "gas-station-network" ||
              window.location.pathname.split("/").splice(-1) == "search" ? (
                <th className="table-th blackColor">
                  <p>{t("Status")}</p>
                </th>
              ) : (
                ""
              )}

              <th className="table-th blackColor">
                <p>
                  {t("Created at")}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col8_asc", "asc", "created_at")
                      }
                      className={
                        sorting_icon == "Col8_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col8_des", "des", "created_at")
                      }
                      className={
                        sorting_icon == "Col8_des"
                          ? "fas fa-long-arrow-alt-down sort-color"
                          : "fas fa-long-arrow-alt-down"
                      }
                    ></i>
                  </span>
                </p>
              </th>

              <th className="table-th blackColor">
                <p>{t("Action")}</p>
              </th>
            </tr>
          </thead>

          <tbody>
            {data &&
              data
                .filter((item) => {
                  if (searchData == "") {
                    return item;
                  } else if (
                    item.name_en
                      .toLowerCase()
                      .includes(searchData.toLowerCase())
                  ) {
                    return item;
                  }
                })
                .map((item, index) => (
                  <tr
                    key={index}
                    className={
                      helper.applyRowClass(item) === true
                        ? `evenRowColor`
                        : "oddRowColor"
                    }
                  >
                    <td>
                      <div class="d-flex justify-content-left align-items-center">
                        <div class="avatar me-1 bg-light-success">
                          <Link
                            to={{
                              pathname: `/vrp/admin/gas-station/${item.gas_station_network_id}`,
                              state: { foo: "bar" },
                            }}
                          >
                            <span class="avatar-content">
                              {helper.FirstWordFirstChar(item.name_en)}
                              {helper.SecondWordFirstChar(item.name_en)}
                            </span>
                          </Link>
                        </div>
                        <div class="d-flex flex-column">
                          <Link
                            to={`/vrp/admin/gas-station/${item.gas_station_network_id}`}
                          >
                            <a class="user_name text-truncate text-body">
                              <span class="fw-bolder">
                                {helper.shortTextWithDots(
                                  `${item.name_en}`,
                                  50
                                )}
                              </span>
                            </a>
                          </Link>
                          {/* <small class="text-truncate text-muted mb-0">
                          {item.email}
                        </small> */}
                        </div>
                      </div>
                    </td>
                    <td>{item.gas_stations ? item.gas_stations.length : 0}</td>
                    <td>
                      {findCompletedTransaction(item.gas_station_network_id)}
                    </td>
                    <td>{findHeldTransaction(item.gas_station_network_id)}</td>

                    {window.location.pathname.split("/").splice(-1) ==
                      "gas-station-network" ||
                    window.location.pathname.split("/").splice(-1) ==
                      "search" ? (
                      <td>
                        {role.deleteNetwork ? (
                          <div className="form-switch form-check-success">
                            <Input
                              type="switch"
                              // defaultChecked={item.status === 1 ? true : false}
                              checked={item.status === 1 ? true : false}
                              id={`icon-success${index}`}
                              name={`icon-success${index}`}
                              onChange={(e) => onOpenDeleteModal(item, index)}
                              data-tip="Update Status"
                            />
                            <CustomLabel htmlFor={`icon-success${index}`} />
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                    ) : (
                      ""
                    )}
                    <td>{helper.humanReadableDate(item.created_at)}</td>
                    <td>
                      <div style={{ display: "flex" }}>
                        {role.viewStations ? (
                          <Link
                            data-tip="Gas Station Network Detail"
                            to={
                              window.location.pathname.split("/").splice(-1) ==
                              "gas_station_network_payment"
                                ? `/vrp/admin/payment/${item.gas_station_network_id}`
                                : `/vrp/admin/gas-station/${item.gas_station_network_id}`
                            }
                          >
                            <img
                              src={detailIcon}
                              style={{ marginTop: "4px" }}
                            />
                          </Link>
                        ) : (
                          ""
                        )}
                        {window.location.pathname.split("/").splice(-1) ==
                          "gas-station-network" ||
                        window.location.pathname.split("/").splice(-1) ==
                          "search" ? (
                          <>
                            {role.updateNetwork ? (
                              <Edit
                                data-tip="Update"
                                size={16}
                                onClick={(e) => onOpenUpdateModal(item, index)}
                                style={{ marginTop: "4px", marginLeft: "10px" }}
                              />
                            ) : (
                              ""
                            )}

                            <i
                              class="fa-solid fa-location-dot"
                              data-tip="Location"
                              style={{
                                fontSize: "18px",
                                color: "#1b663e",
                                alignSelf: "center",
                                marginLeft: "8px",
                                marginTop: "2px",
                              }}
                              onClick={() => {
                                // setShowMapModal(true);
                                onOpenMapModal(item, index);
                              }}
                            ></i>
                            {role.transfer_staff ? (
                              <img
                                style={{
                                  fontSize: "18px",
                                  alignSelf: "center",
                                  marginLeft: "6px",
                                  marginTop: "2px",
                                }}
                                data-tip="Transfer Staff"
                                src={usersGreen}
                                // style={{ marginRight: "5px" }}
                                onClick={() => {
                                  onOpenTransferModal(item, index);
                                }}
                              />
                            ) : (
                              ""
                            )}
                            {role.updateNetwork ? (
                              <User
                                data-tip="Gas Staton Network User"
                                size={20}
                                color="#2D7337"
                                onClick={(e) =>
                                  onOpenNetworkModalModal(item, index)
                                }
                                style={{ marginTop: "0px", marginLeft: "5px" }}
                              />
                            ) : (
                              ""
                            )}
                            <Link
                              data-tip="Statement of Account"
                              to={`/vrp/admin/network-account-statement/${item.gas_station_network_id}`}
                            >
                              <img
                                src={transactionGreen}
                                style={{ marginLeft: "5px", marginTop: "3px" }}
                              />
                            </Link>
                            <Link
                              data-tip="Invoices"
                              onClick={(e) => onOpenInvoiceModal(item, index)}
                            >
                              <img
                                src={invoice}
                                style={{ marginLeft: "5px", marginTop: "3px" }}
                              />
                            </Link>
                            {/* <Link
                              data-tip="Invoices"
                              to={`/vrp/admin/network-account-statement/${item.gas_station_network_id}`}
                            >
                              <img
                                src={transactionGreen}
                                style={{ marginLeft: "5px", marginTop: "3px" }}
                              />
                            </Link> */}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      <ReactTooltip />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        <AddUpdateModal
          show={showAddUpdateModal}
          updateModalData={updateModalData}
          setupdateModalData={setupdateModalData}
          onHide={onCloseAddUpdateModal}
          submitAction={submitAction}
          disableBtn={overlay}
          fuelData={fuelData}
          setFuelData={setFuelData}
          setComissionSubmit={setComissionSubmit}
          users={users}
        />
        <InvoiceModal
          show={showInvoiceModal}
          updateModalData={updateModalData}
          disableBtn={overlay}
          onHide={() => setshowInvoiceModal(false)}
        />
        <Maps
          show={showMapModal}
          onCloseModal={() => setShowMapModal(false)}
          disableBtn={overlay}
          data={mapData}
        />
        <NetworkUser
          show={showNetworkUserModal}
          onHide={onCloseAddUpdateModal}
          disableBtn={overlay}
          updateModalData={updateModalData}
          submitAction={() => setShowNetworkUserModal(false)}
        />

        <Transfer
          show={showTransferModal}
          onCloseModal={() => setShowTransferModal(false)}
          disableBtn={overlay}
          transferModalData={updateModalData}
          setShowTransferModal={setShowTransferModal}
        />
        <DeleteModal
          show={showDeleteModal}
          confirmationText={`Are you sure to ${deleteMessage} a gas station network`}
          confirmationHeading={`${helper.uppercaseFirst(
            deleteMessage
          )} a gas station network`}
          onHide={onCloseDeleteModal}
          submitAction={submitAction}
          disableBtn={overlay}
        />
      </div>
    </div>
  );
}
