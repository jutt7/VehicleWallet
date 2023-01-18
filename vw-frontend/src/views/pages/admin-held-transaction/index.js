import React, { useEffect, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";

import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import Select from "react-select";
import { getUserData } from "@utils";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { getUser } from "../../apps/user/store";
import ApproveUnapproveModal from "./ApproveUnapproveModal";

import { useTranslation } from "react-i18next";
import AddCommentModal from "./AddCommentModal";
import DataTableExportButton from "../../components/TableToExcel";

function Admin_held_transactions() {
  const [clientShow, setclientShow] = useState(true);
  const [stationShow, setstationShow] = useState(false);
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [onSubmit, setonSubmit] = useState("");
  const [showAddApproveModal, setshowAddApproveModal] = useState(false);
  const [addCommentModal, setAddCommentModal] = useState(false);
  const [approveModalData, setApproveModalData] = useState(null);
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

  const [searchData, setSearchData] = useState("");

  const [dataForTable, setDataForTable] = useState([]);

  const [gasStationList, setgasStationList] = useState([]);
  const [fuelTypeList, setfuelTypeList] = useState([]);
  const [requestPicker, setrequestPicker] = useState("");
  const [transactionPicker, settransactionPicker] = useState("");
  const [status, setstatus] = useState("");
  const [isOpenImgDialog, setisOpenImgDialog] = useState(false);
  const [imgDialog, setimgDialog] = useState("");

  const [originalData, setOriginalData] = useState([]);

  const { t } = useTranslation();

  const [client_id, setID] = useState("");

  useEffect(() => {
    setRoles();
    getData();
  }, []);

  const [role, setRole] = useState({
    approve: false,
    comment: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.admin-approve-transaction") {
        arr.approve = true;
      } else if (roles[i].subject == "fm.admin-comment") {
        arr.comment = true;
      }
    }
    // console.log("arrrrrrrrrrr", arr);
    setRole(arr);
  };

  const submitAction = (args = "") => {
    approve(args);
  };
  const submitComments = (args = "") => {
    AddComment(args);
  };

  const approve = (args) => {
    console.log("in approve", args.client_comment);
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/admin-approve-transaction`, {
        comment: {
          client_id: args.client_id,
          transaction_id: args.transaction_id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setoverlay(false);
          setshowAddApproveModal(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );

          getData();
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );

          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");

        setoverlay(false);
      });
  };

  const sortAscending = (icon, sortType, colsort) => {
    if (
      colsort == "title_ar" ||
      colsort == "title_en" ||
      colsort == "title_ur"
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
    } else if (colsort == "weight") {
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

  const onOpenApproveUnapproveModal = (item, index, type) => {
    setApproveModalData(item);
    setshowAddApproveModal(true);
    setupdateIndex(index);
    setonSubmit(type);
  };
  const onAddCommentModal = (item, index) => {
    setApproveModalData(item);
    setAddCommentModal(true);
    setupdateIndex(index);
    // setonSubmit(type);
  };

  const onCloseAddUpdateModal = () => {
    setshowAddApproveModal(false);
    setupdateIndex(null);
    setonSubmit(null);
    setApproveModalData(null);
  };
  const onCloseAddCommentModal = () => {
    setAddCommentModal(false);
    setupdateIndex(null);
    // setonSubmit(null);
    setApproveModalData(null);
  };

  const refreshFilter = () => {
    setSearchData("");
    settransactionPicker("");
    setstatus("");
    getData();
  };

  const getData = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/all-comments`)
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // let arr = [];

          // res.data.data.forEach((element) => {
          //   if (helper.isObject(element.transaction)) {
          //     if (
          //       element.transaction.transaction_status == 8 ||
          //       element.transaction.transaction_status == 7
          //     ) {
          //       arr.push(element);
          //     }
          //   }
          // });
          // console.log("arrrrr", arr);
          setdata(helper.applyCountID(res.data.data));
          FilterDataForTable(res.data.data);

          setOriginalData(helper.applyCountID(res.data.data));

          //   setpaginationStates({
          //     activePage: res.data.data.current_page,
          //     itemsCountPerPage: res.data.data.per_page,
          //     totalItemsCount: res.data.data.total,
          //   });
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
        transaction_reference: item.reference_number,
        gas_station_name: item.gas_station_name,
        client_comment: item.client_comment,
        admin_comment: item.admin_comment,
        amount: item.amount,
        liters: item.liters,
      });
    });
    setDataForTable(arr);
  };

  const AddComment = (args) => {
    setoverlay(true);
    // console.log("argssssssss", args);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/admin-comment`, {
        comment: {
          comment_id: args.comment_id,
          admin_comment: args.admin_comment,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        // console.log("res", res);
        if (res.data.code && res.data.code == 200) {
          setAddCommentModal(false);
          getData();
          // setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );

          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");

        setoverlay(false);
      });
  };

  const getStatus = (data) => {
    if (helper.isObject(data.transaction)) {
      return data.transaction.transaction_status;
    }
  };

  const getFilterData = () => {
    console.log("statussssssss", status);
    let arr = [];
    if (status.value == 8) {
      originalData.forEach((item) => {
        if (helper.isObject(item.transaction)) {
          if (item.transaction.transaction_status == 8) {
            arr.push(item);
          }
        }
      });
      // console.log("arrifrrr", arr);
      setdata(arr);
    } else {
      originalData.forEach((item) => {
        arr.push(item);
      });
      setdata(arr);
      // console.log("arrelserrr", arr);
    }
  };
  const filterData = (value) => {
    if (value.length >= 3) {
      setSearchData(value);
    } else {
      setSearchData("");
    }
  };

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
          <Row>
            <Col sm="2">
              <label style={{ fontWeight: "bold", fontSize: "1em" }}>
                {t("Search")}
              </label>
              <input
                className="form-control crud-search"
                placeholder="Search ..."
                onChange={(e) => filterData(e.target.value)}
                style={{ width: "auto", background: "white" }}
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
              <div className={`fleetPaginator`} style={{ marginTop: "15px" }}>
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
        </Col>
      </Row>
      <div
        className="table-responsive"
        style={{ overflowY: "hidden", overflowX: "auto", whiteSpace: "nowrap" }}
      >
        <table className="table">
          <thead>
            <tr>
              <th className="table-th blackColor">
                <p>
                  {`${t("Transaction Reference ID")} #`}
                  <span>
                    <i
                      onClick={(e) =>
                        sortAscending("Col4_asc", "asc", "weight")
                      }
                      className={
                        sorting_icon == "Col4_asc"
                          ? "fas fa-long-arrow-alt-up sort-color"
                          : "fas fa-long-arrow-alt-up"
                      }
                    ></i>
                    <i
                      onClick={(e) =>
                        sortAscending("Col4_des", "des", "weight")
                      }
                      className={
                        sorting_icon == "Col4_des"
                          ? "fas fa-long-arrow-alt-down sort-color"
                          : "fas fa-long-arrow-alt-down"
                      }
                    ></i>
                  </span>
                </p>
              </th>

              <th className="table-th blackColor">
                <p>{t("Gas Station Name")}</p>
              </th>

              <th className="table-th blackColor">
                <p>{t("Comment by Client")}</p>
              </th>
              <th className="table-th blackColor">
                <p>{t("Comment by Admin")}</p>
              </th>

              <th className="table-th blackColor">
                <p>{t("Amount")}</p>
              </th>

              <th className="table-th blackColor">
                <p>{t("Liter")}</p>
              </th>
              <th className="table-th blackColor">
                <p
                  style={{
                    marginTop: "1px",

                    textAlign: "center",
                    marginLeft: "50px",
                  }}
                >
                  {t("Action")}
                </p>
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
                    item.reference_number
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
                      {item.reference_number ? item.reference_number : ""}
                    </td>
                    <td>
                      {item.gas_station_name ? item.gas_station_name : ""}
                    </td>
                    <td>{item.client_comment ? item.client_comment : ""}</td>
                    <td>{item.admin_comment ? item.admin_comment : ""}</td>
                    <td>{item.amount ? item.amount : ""}</td>
                    <td>{item.liters ? item.liters : ""}</td>
                    <td>
                      {role.comment && item.admin_comment ? (
                        <></>
                      ) : (
                        <Button
                          color="success"
                          onClick={(e) => {
                            // if (getStatus(item) == 8) {
                            // } else {
                            // }
                            onAddCommentModal(item, index);
                          }}
                          style={{ marginRight: "10px" }}
                        >
                          {t("Comment")}
                        </Button>
                      )}
                      {/* {console.log("aproooooooove", role.approve)} */}
                      {role.approve ? (
                        <Button
                          color="success"
                          onClick={(e) => {
                            // if (getStatus(item) == 8) {
                            // } else {
                            // }
                            onOpenApproveUnapproveModal(item, index, "approve");
                          }}
                        >
                          {t("Approve")}
                        </Button>
                      ) : (
                        " "
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={7}>No Records found</td>
              </tr>
            )}
          </tbody>
        </table>
        <ApproveUnapproveModal
          show={showAddApproveModal}
          approveModalData={approveModalData}
          onHide={onCloseAddUpdateModal}
          submitAction={submitAction}
          disableBtn={overlay}
          type={onSubmit}
        />
        <AddCommentModal
          show={addCommentModal}
          approveModalData={approveModalData}
          onHide={onCloseAddCommentModal}
          submitAction={submitComments}
        />
      </div>
    </div>
  );
}

export default Admin_held_transactions;
