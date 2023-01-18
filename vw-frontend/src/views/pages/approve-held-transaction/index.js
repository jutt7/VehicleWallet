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

function Approve_held_transaction(props) {
  const [clientShow, setclientShow] = useState(true);
  const [stationShow, setstationShow] = useState(false);
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState([]);
  const [onSubmit, setonSubmit] = useState("");
  const [showAddApproveModal, setshowAddApproveModal] = useState(false);
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

  const [gasStationList, setgasStationList] = useState([]);
  const [fuelTypeList, setfuelTypeList] = useState([]);
  const [requestPicker, setrequestPicker] = useState("");
  const [transactionPicker, settransactionPicker] = useState("");
  const [status, setstatus] = useState("");
  const [isOpenImgDialog, setisOpenImgDialog] = useState(false);
  const [imgDialog, setimgDialog] = useState("");

  const [client_id, setID] = useState("");

  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getID = () => {
    let user = JSON.parse(localStorage.getItem("userDataCustomer"));
    console.log("propsssssssss", user.client_id);
    return user.client_id;
  };

  const submitAction = (args = "") => {
    if (onSubmit == "approve") {
      approve(args);
    } else if (onSubmit == "unapprove") {
      unapprove(args);
    }
    // if (onSubmit == "delete") {
    //   remove();
    // }
  };

  const approve = (args) => {
    console.log("in approve", args);
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/approve-transaction`, {
        comment: {
          comment_id: args.comment_id,
          transaction_id: args.transaction_id,
          client_comment: args.client_comment,
          client_id: args.client_id,
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
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
        setoverlay(false);
      });
  };

  const unapprove = (args) => {
    console.log("in unapprove", args.client_comment);
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/unapprove-transaction`, {
        comment: {
          comment_id: args.comment_id,
          transaction_id: args.transaction_id,
          client_comment: args.client_comment,
          client_id: args.client_id,
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
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
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

  const onCloseAddUpdateModal = () => {
    setshowAddApproveModal(false);
    setupdateIndex(null);
    setonSubmit(null);
    setApproveModalData(null);
  };

  const refreshFilter = () => {
    // settransactionPicker("");
    setstatus("");
    setSearchData("");

    // setoverlay(true);
    // axios
    //   .get(`${jwtDefaultConfig.adminBaseUrl}/expire_requests`)
    //   .then((res) => {
    //     helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
    //     if (res.status && res.status === 200) {
    //       setoverlay(false);
    //       getData();
    //     } else {
    //       helper.toastNotification(
    //         "Unable to process request.",
    //         "FAILED_MESSAGE"
    //       );

    //       setoverlay(false);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error, "error");
    //     setdata([]);
    //     setoverlay(false);
    //   });
  };

  const getData = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/all-comments`, {
        comment: {
          client_id: getID(),
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log("dataaaaa", res.data.data);

          let arr = [];

          res.data.data.forEach((element) => {
            if (helper.isObject(element.transaction)) {
              if (element.transaction.transaction_status == 7) {
                arr.push(element);
              }
            }
          });
          setdata(helper.applyCountID(arr));

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

  const getSearchData = (args) => {
    console.log("----status---", status);
    let s = status;
    if (!helper.isObject(s)) {
      console.log("status is empty");
      s = "all";
    } else {
      s = status.value;
    }
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/search-topup-transaction`, {
        transaction: {
          status: s,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(helper.applyCountID(res.data.data), "data");
          setdata(helper.applyCountID(res.data.data));
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
        setoverlay(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
        console.log(error, "errorrrr");
      });
  };

  const getStatus = (data) => {
    if (helper.isObject(data.transaction)) {
      return data.transaction.transaction_status;
    }
  };
  const filterData = (value) => {
    if (value.length >= 3) {
      setSearchData(value);
    } else {
      setSearchData("");
    }
  };

  const getFilterData = () => {
    console.log("statussssssss", status);
    let arr = [];
    if (status.value == 7) {
      originalData.forEach((item) => {
        if (helper.isObject(item.transaction)) {
          if (item.transaction.transaction_status == 7) {
            arr.push(item);
          }
        }
      });
      console.log("arrifrrr", arr);
      setdata(arr);
    } else {
      originalData.forEach((item) => {
        arr.push(item);
      });
      setdata(arr);
      console.log("arrelserrr", arr);
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
            <Col sm="3">
              <label style={{ fontWeight: "bold", fontSize: "1em" }}>
                Search
              </label>
              <input
                className="form-control crud-search"
                placeholder="Search ..."
                onChange={(e) => filterData(e.target.value)}
                style={{ width: "auto", background: "white" }}
              />
            </Col>
            <Col sm="3">
              <label style={{ fontWeight: "bold", fontSize: "1em" }}>
                Status
              </label>
              <Select
                name="select-status"
                style={{ height: "40px" }}
                onChange={(e) => setstatus(e)}
                options={[
                  {
                    label: "All",
                    value: 1,
                  },
                  {
                    label: "Un-Approved",
                    value: 7,
                  },
                ]}
                value={status || []}
                isClearable={true}
              />
            </Col>
            <Col sm="2">
              <Button
                style={{ marginTop: "19px" }}
                onClick={(e) => getFilterData()}
              >
                <i className="fa fa-search"></i>
              </Button>
              <Button
                style={{ marginTop: "19px", marginLeft: "5px" }}
                onClick={(e) => refreshFilter()}
              >
                <i className="fa fa-refresh"></i>
              </Button>
            </Col>
            <Col sm="4">
              <div className={`fleetPaginator`} style={{ marginTop: "30px" }}>
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
                  Transaction Reference ID #
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
                <p>Gas Station Name</p>
              </th>

              <th className="table-th blackColor">
                <p>Comment by Supervisor</p>
              </th>
              <th className="table-th blackColor">
                <p>Comment by Admin</p>
              </th>

              <th className="table-th blackColor">
                <p>Amount</p>
              </th>

              <th className="table-th blackColor">
                <p>Liter</p>
              </th>
              <th className="table-th blackColor">
                <p
                  style={{
                    marginTop: "1px",

                    textAlign: "center",
                    marginLeft: "50px",
                  }}
                >
                  Action
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
                    item.transaction.reference_number
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
                      {helper.isObject(item.transaction)
                        ? item.transaction.reference_number
                        : ""}
                    </td>
                    <td>
                      {helper.isObject(item.transaction) &&
                      helper.isObject(item.transaction.gas_station)
                        ? item.transaction.gas_station.name_en
                        : ""}
                    </td>
                    <td>{item.supervisor_comment}</td>
                    <td>{item.admin_comment ? item.admin_comment : ""}</td>

                    <td>
                      {helper.isObject(item.transaction)
                        ? item.transaction.amount
                        : ""}
                    </td>
                    <td>
                      {helper.isObject(item.transaction)
                        ? item.transaction.liters
                        : ""}
                    </td>

                    <td>
                      {getStatus(item) == 7 ? (
                        <>
                          <Button
                            color="success"
                            onClick={(e) =>
                              onOpenApproveUnapproveModal(
                                item,
                                index,
                                "approve"
                              )
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            style={{ marginLeft: "5px" }}
                            color="success"
                            onClick={(e) =>
                              onOpenApproveUnapproveModal(
                                item,
                                index,
                                "unapprove"
                              )
                            }
                          >
                            Un-Approve
                          </Button>
                        </>
                      ) : (
                        ""
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
      </div>
    </div>
  );
}

export default Approve_held_transaction;
