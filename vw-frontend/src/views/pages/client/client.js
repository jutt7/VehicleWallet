import React, { useEffect, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import { Check, X, LogIn, Edit, Navigation } from "react-feather";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import AddUpdateModal from "./AddUpdateModal";
import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import detailIcon from "@src/assets/images/icons/details.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTranslation } from "react-i18next";
import { getUserData } from "@utils";
import DataTableExportButton from "../../components/TableToExcel";

export default function client(props) {
  const { t } = useTranslation();

  const [clientShow, setclientShow] = useState(true);
  const [stationShow, setstationShow] = useState(false);
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [onSubmit, setonSubmit] = useState("");
  const [showAddUpdateModal, setshowAddUpdateModal] = useState(false);
  const [updateModalData, setupdateModalData] = useState(null);
  const [updateIndex, setupdateIndex] = useState("");
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [deleteIndex, setdeleteIndex] = useState("");
  const [deleteItem, setdeleteItem] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [sorting_icon, setsorting_icon] = useState();
  const [deleteMessage, setdeleteMessage] = useState("");
  const [paginationStates, setpaginationStates] = useState({
    itemsCountPerPage: "",
    activePage: "",
    totalItemsCount: "",
  });
  const [searchData, setSearchData] = useState("");

  const [pricing, setPricing] = useState([]);

  const [check, setCheck] = useState(false);

  const [modalLoader, setModalLoader] = useState(false);

  const [dataForTable, setDataForTable] = useState([]);

  // const [newPricing, setNewPricing] = useState([]);
  let newPricing = [];

  let isNewData = "";

  const [enable, setEnable] = useState(false);

  const [role, setRole] = useState({
    addClient: false,
    updateClient: false,
    deleteClient: false,
    viewClient: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.client.store") {
        arr.addClient = true;
      } else if (roles[i].subject == "fm.client.update") {
        arr.updateClient = true;
      } else if (roles[i].subject == "fm.client.delete") {
        arr.deleteClient = true;
      } else if (roles[i].subject == "client_detail") {
        arr.viewClient = true;
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
      colsort == "name_ar" ||
      colsort == "name_en" ||
      colsort == "name_ur" ||
      colsort == "address"
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
    } else if (
      colsort == "deposited_amount" ||
      colsort == "reserved_amount" ||
      colsort == "vat_no"
    ) {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            a[colsort] > b[colsort] && sortType === "asc" ? 1 : -1
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

  const onCloseAddUpdateModal = () => {
    setshowAddUpdateModal(false);
    setupdateIndex(null);
    setonSubmit(null);
    setupdateModalData(null);
  };

  const onOpenDeleteModal = (rowData, index = 0) => {
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
        `${jwtDefaultConfig.adminBaseUrl}/clients?page=${currentPage}&pagination=true`,
        {}
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log(helper.applyCountID(res.data.data.data), "data");
          setdata(helper.applyCountID(res.data.data.data));
          FilterDataForTable(res.data.data.data);
          setpaginationStates({
            activePage: res.data.data.current_page,
            itemsCountPerPage: res.data.data.per_page,
            totalItemsCount: res.data.data.total,
          });
          setoverlay(false);
          setEnable(true);
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
        client_name: item.name_en,
        current_balance: item.current_balance,
        reserved_amount: item.reserved_amount,
        vat_number: item.vat_no,
        created_at: item.created_at,
      });
    });
    setDataForTable(arr);
  };
  const setNewData = (arr) => {
    console.log("set new data called");
    isNewData = arr;
  };
  const setNewPricing = (arr) => {
    console.log("set new pricing called");
    newPricing = arr;
  };
  const createUserArray = (data) => {
    let arr = [];
    arr.push({
      first_name: data.admin_contact_person,
      email: data.admin_contact_email,
      password: data.admin_password,
      mobile: data.admin_contact_number,
      group_id: 9,
      designation: "client_manager",
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
        group_id: 18,
        designation: "client_billing",
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
        group_id: 17,
        designation: "client_operation",
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
      group_id: 9,
      designation: "client_manager",
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
        group_id: 18,
        designation: "client_billing",
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
        group_id: 17,
        designation: "client_operation",
        user_id: data.op_id,
      });
    return arr;
  };

  const create = (args) => {
    // console.log("argsssssssss", args);

    const usersArray = createUserArray(args);
    // console.log("arrrrrrrrrr", usersArray);

    // return;
    let arr = [];
    newPricing.forEach((item) => {
      let obj = {
        monthly_sub_fee: item.monthly_sub_fee,
        registration_fee: item.registration_fee,
        vehicle_type_id: item.vehicle_type_id,
      };
      arr.push(obj);
    });
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client/store`, {
        client: {
          name_en: args.name_en,
          name_ar: args.name_ar,
          name_ur: args.name_ur,
          address: args.address,
          vat_no: args.vat_no,
          cr_number: args.cr_number,
          // billing_contact_person: args.billing_contact_person,
          // billing_contact_email: args.billing_contact_email,
          // billing_contact_number: args.billing_contact_number,
          // admin_contact_person: args.admin_contact_person,
          // admin_contact_email: args.admin_contact_email,
          // admin_contact_number: args.admin_contact_number,
          // operation_contact_person: args.operation_contact_person,
          // operation_contact_email: args.operation_contact_email,
          // operation_contact_number: args.operation_contact_number,
          billing_period: args.billing_period,
          virtual_bank_account: args.virtual_bank_account
            ? args.virtual_bank_account
            : "",
          min_amount_notification: args.min_amount_notification
            ? args.min_amount_notification
            : "",
          cr_photo: args.cr_photo,
          vat_photo: args.vat_photo,
          designation: args.designation,
          // admin_password: args.admin_password,
          // billing_password: args.billing_password,
          // operation_password: args.operation_password,
          // registration_fee: args.registration_fee,
          // monthly_subs_fee: args.monthly_subs_fee,
          client_source: args.client_source,
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
          setModalLoader(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );

          getData();
        } else {
          setModalLoader(false);

          if (res.data.message_en) {
            setoverlay(false);
            helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
            setCheck(true);
          }
          if (res.data.virtual_bank_account) {
            setoverlay(false);
            helper.toastNotification(
              res.data.data.virtual_bank_account[0],
              "FAILED_MESSAGE"
            );
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
        setModalLoader(false);
        setoverlay(false);
        setCheck(true);
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
    console.log("usersarrrrrrrrrrr", usersArray);
    // return;
    let arr = [];
    newPricing.forEach((item) => {
      let obj = {
        monthly_sub_fee: item.monthly_sub_fee,
        registration_fee: item.registration_fee,
        vehicle_type_id: item.vehicle_type_id,
        id: item.id,
      };
      arr.push(obj);
    });

    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client/update`, {
        client: {
          client_id: updateModalData.client_id,
          name_en: args.name_en,
          name_ar: args.name_ar,
          name_ur: args.name_ur,
          address: args.address,
          vat_no: args.vat_no,
          cr_number: args.cr_number,
          // billing_contact_person: args.billing_contact_person,
          // billing_contact_email: args.billing_contact_email,
          // billing_contact_number: args.billing_contact_number,
          // admin_contact_person: args.admin_contact_person,
          // admin_contact_email: args.admin_contact_email,
          // admin_contact_number: args.admin_contact_number,
          // operation_contact_person: args.operation_contact_person,
          // operation_contact_email: args.operation_contact_email,
          // operation_contact_number: args.operation_contact_number,
          billing_period: args.billing_period,
          virtual_bank_account: args.virtual_bank_account
            ? args.virtual_bank_account
            : "",
          min_amount_notification: args.min_amount_notification
            ? args.min_amount_notification
            : "",
          cr_photo: args.cr_photo,
          vat_photo: args.vat_photo,
          // admin_password: args.admin_password,
          // billing_password: args.billing_password,
          // operation_password: args.operation_password,
          registration_fee: args.registration_fee,
          monthly_subs_fee: args.monthly_subs_fee,
          contract_no: args.contract_no,
          contract_start_date: args.contract_start_date,
          contract_end_date: args.contract_end_date,
          client_source: args.client_source,

          // admin_group_id: 9,
          // billing_group_id: 18,
          // operation_group_id: 17,
        },
        user: usersArray,
        pricing: arr,
        // data: isNewData,
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setModalLoader(false);
          setshowAddUpdateModal(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          if (props.data) {
            setModalLoader(false);
            setoverlay(false);

            props.getSearchData();
          } else {
            getData();
          }
        } else {
          setModalLoader(false);

          if (res.data.message_en) {
            setoverlay(false);
            helper.toastNotification(res.data.message_en, "FAILED_MESSAGE");
            setCheck(true);
          }
          if (res.data.virtual_bank_account) {
            setoverlay(false);
            helper.toastNotification(
              res.data.data.virtual_bank_account[0],
              "FAILED_MESSAGE"
            );
          }
          // else {
          //   setoverlay(false);
          //   helper.toastNotification(
          //     "Unable to process request.",
          //     "FAILED_MESSAGE"
          //   );
          // }
        }
      })
      .catch((error) => {
        setModalLoader(false);
        setoverlay(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
      });
  };

  const remove = () => {
    console.log(deleteItem, "deleteItem");
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/client/delete`, {
        client: {
          clientId: deleteItem.client_id,
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

  const getPricing = () => {
    setoverlay(true);
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/vehicle-types?pricing=true`, {})
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status == 200) {
          console.log(helper.applyCountID(res.data.data), "Pricing data");
          setPricing(helper.applyCountID(res.data.data));

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

  const filterData = (value) => {
    if (value.length >= 3) {
      setSearchData(value);
    } else {
      setSearchData("");
    }
  };

  useEffect(() => {
    setRoles();
    if (props.data) {
      setdata(props.data);
      getPricing();
    } else {
      getData();
      getPricing();
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

      <Row>
        <Col lg={12}>
          {props.data ? (
            ""
          ) : (
            <Row>
              <Col style={{ display: "flex" }}>
                {role.addClient ? (
                  <Button
                    // disabled={enable ? "" : "true"}
                    onClick={(e) => openCreateModal()}
                  >
                    <i className="fas fa-plus"></i> {t("Add Client")}
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
                  {t("Current Balance")}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col5_asc", "asc", "deposited_amount")
                      }
                      className={
                        sorting_icon == "Col5_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col5_des", "des", "deposited_amount")
                      }
                      className={
                        sorting_icon == "Col5_des"
                          ? "fas fa-long-arrow-alt-down sort-color"
                          : "fas fa-long-arrow-alt-down"
                      }
                    ></i>
                  </span>
                </p>
              </th>

              <th className="table-th blackColor">
                <p>
                  {t("Reserved Amount")}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col6_asc", "asc", "reserved_amount")
                      }
                      className={
                        sorting_icon == "Col6_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col6_des", "des", "reserved_amount")
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
                  {t("Vat Number")}
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
                <p>{t("Status")}</p>
              </th>

              <th className="table-th blackColor">
                <p>{t("Action")}</p>
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data &&
              data
                .filter((item) => {
                  if (searchData == "") {
                    return item;
                  } else if (
                    item.name_en
                      .toLowerCase()
                      .includes(searchData.toLowerCase()) ||
                    item.vat_no.toLowerCase().includes(searchData.toLowerCase())
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
                    <td data-tip={item.name_en}>
                      <div className="d-flex justify-content-left align-items-center">
                        <div className="avatar me-1 bg-light-success">
                          <Link
                            to={`/vrp/admin/manage-client/${item.client_id}`}
                          >
                            <span className="avatar-content">
                              {helper.FirstWordFirstChar(item.name_en)}
                              {helper.SecondWordFirstChar(item.name_en)}
                            </span>
                          </Link>
                        </div>
                        <div className="d-flex flex-column">
                          <a className="user_name text-truncate text-body">
                            <Link
                              to={`/vrp/admin/manage-client/${item.client_id}`}
                            >
                              <span className="fw-bolder">
                                {helper.shortTextWithDots(item.name_en, 20)}
                              </span>
                            </Link>
                          </a>
                          {/* <small class="text-truncate text-muted mb-0">
                          vkoschek17@abc.net.au
                        </small> */}
                        </div>
                      </div>
                    </td>
                    <td>
                      {item.current_balance ? item.current_balance : "0.00"}
                    </td>
                    <td>{item.reserved_amount}</td>
                    <td>{item.vat_no}</td>
                    <td>{helper.humanReadableDate(item.created_at)}</td>
                    <td>
                      {role.deleteClient ? (
                        <div className="form-switch form-check-success">
                          <Input
                            type="switch"
                            // defaultChecked={item.status === 1 ? true : false}
                            checked={item.status === 1 ? true : false}
                            id={`icon-success${index}`}
                            name={`icon-success${index}`}
                            onChange={(e) => onOpenDeleteModal(item, index)}
                          />
                          <CustomLabel htmlFor={`icon-success${index}`} />
                        </div>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex" }}>
                        {role.updateClient ? (
                          <Edit
                            data-tip="Update"
                            size={16}
                            onClick={(e) => onOpenUpdateModal(item, index)}
                            style={{ marginTop: "4px", marginRight: "5px" }}
                          />
                        ) : (
                          ""
                        )}
                        {role.viewClient ? (
                          <Link
                            to={`/vrp/admin/manage-client/${item.client_id}`}
                          >
                            <img
                              src={detailIcon}
                              style={{ marginTop: "4px" }}
                            />
                          </Link>
                        ) : (
                          ""
                        )}

                        {/* <Navigation
                          data-tip="Map"
                          size={16}
                          // onClick={(e) => onOpenUpdateModal(item, index)}
                          style={{ marginTop: "4px", marginLeft: "5px" }}
                        /> */}
                        {/* <i
                          class="fa-solid fa-location-dot"
                          style={{
                            fontSize: "18px",
                            color: "#1b663e",
                            alignSelf: "center",
                            marginLeft: "8px",
                            marginTop: "2px",
                          }}
                        ></i> */}
                      </div>
                      <ReactTooltip />
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={7}>{t("No Records found")}</td>
              </tr>
            )}
          </tbody>
        </table>

        <AddUpdateModal
          show={showAddUpdateModal}
          updateModalData={updateModalData}
          onHide={onCloseAddUpdateModal}
          submitAction={submitAction}
          pricing={pricing}
          setNewPricing={setNewPricing}
          setNewData={setNewData}
          check={check}
          modalLoader={modalLoader}
          setModalLoader={setModalLoader}
        />
        <DeleteModal
          show={showDeleteModal}
          confirmationText={`Are you sure to ${deleteMessage} a client`}
          confirmationHeading={`${helper.uppercaseFirst(
            deleteMessage
          )} a client`}
          onHide={onCloseDeleteModal}
          submitAction={submitAction}
        />
      </div>
    </div>
  );
}
