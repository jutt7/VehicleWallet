import React, { useEffect, useState, useRef } from "react";
import { Input, Label } from "reactstrap";
import { Check, X, Edit } from "react-feather";
import { Col, Row, Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import Flatpickr from "react-flatpickr";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import Select from "react-select";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Pagination from "react-js-pagination";
import axios from "axios";
import helper from "@src/@core/helper";
import ApproveModal from "./AprroveModal";
import ZoomableImageModal from "../refueling-transactions/imagePopup";
import { getUserData } from "@utils";

import { useTranslation } from "react-i18next";
import DataTableExportButton from "../../components/TableToExcel";

function Approve_Topup() {
  const [data, setdata] = useState([]);

  const [overlay, setoverlay] = useState(false);
  const [sorting_icon, setsorting_icon] = useState();
  const [isPdf, setIsPdf] = useState(false);

  const [transactionPicker, settransactionPicker] = useState("");
  const [status, setstatus] = useState({});
  const [label, setLabel] = useState("");
  const { t } = useTranslation();
  const [paginationStates, setpaginationStates] = useState({
    itemsCountPerPage: "",
    activePage: "",
    totalItemsCount: "",
  });

  const [showApproveModal, setshowApproveModal] = useState(false);

  const [currentPage, setcurrentPage] = useState(1);

  const [searchData, setSearchData] = useState("");

  const [isOpenImgDialog, setisOpenImgDialog] = useState(false);
  const [imgDialog, setimgDialog] = useState("");

  const [approveItem, setApproveItem] = useState("");

  const [dataForTable, setDataForTable] = useState([]);

  useEffect(() => {
    setRoles();
    getData();
  }, []);

  const [role, setRole] = useState({
    approve: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.approved_topup_transaction") {
        arr.approve = true;
      }
    }
    // console.log("arrrrrrrrrrr", arr);
    setRole(arr);
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

  const onCloseApproveModal = () => {
    setshowApproveModal(false);
    // setdeleteIndex("");
    // setdeleteItem("");
    // setonSubmit("");
  };
  const onOpenApproveModal = (rowData, index = 0) => {
    if (rowData.amount == "") {
      helper.toastNotification("Amount cannot be empty", "FAILED_MESSAGE");
    } else {
      setApproveItem(rowData);
      setshowApproveModal(true);
    }
  };

  const submitAction = () => {
    // if (newAmount != "" && newAmount != approveItem.amount) {
    //   approveItem.amount = parseInt(newAmount);
    // }

    Approve(approveItem);
    setshowApproveModal(false);
  };

  const getData = () => {
    setoverlay(true);
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/all-unapproved-topup-transaction`,
        {}
      )
      .then((res) => {
        // alert("get data");
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log(helper.applyCountID(res.data.data), "data");
          setdata(helper.applyCountID(res.data.data));
          FilterDataForTable(res.data.data);

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
        client_name: helper.isObject(item.client) ? item.client.name_en : "",
        transaction_reference: item.reference_number,
        top_up_amount: item.amount,
      });
    });
    setDataForTable(arr);
  };

  const getStatus = (num) => {
    if (num == 2) {
      return "Un-Approved";
    } else {
      return "Approved";
    }
  };

  const filterData = (value) => {
    if (value.length >= 3) {
      setSearchData(value);
    } else {
      setSearchData("");
    }
  };

  const Approve = (args) => {
    console.log("approve item is: ", approveItem);
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/approved-topup-transaction`, {
        transaction: {
          id: args.id,
          amount: args.amount,
        },
      })
      .then((res) => {
        // alert("test");
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          //   setshowAddUpdateModal(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          getData();
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
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
        console.log(error, "errorrrr");
      });
  };
  const hideImageDialog = () => {
    setisOpenImgDialog(false);
    setimgDialog("");
  };
  const handleShowDialog = (imgSrc, check) => {
    setIsPdf(check);
    setisOpenImgDialog(!isOpenImgDialog);
    setimgDialog(imgSrc);
  };

  const get_url_extension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
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
        <Col lg={12} style={{ alignItems: "end" }}>
          <Row style={{ alignItems: "end" }}>
            <Col sm="2">
              <Label className="form-label" for="range-picker2">
                {t("Search")}
              </Label>
              <input
                className="form-control crud-search"
                placeholder={`${t("Search")}...`}
                onChange={(e) => filterData(e.target.value)}
                style={{ width: "auto", background: "white" }}
              />
            </Col>
            <Col sm="3">
              <label>{t("Status")}</label>
              <Select
                name="select-status"
                style={{ height: "40px" }}
                onChange={(e) => {
                  setLabel(e);
                  setstatus(e);
                }}
                options={[
                  {
                    label: "All",
                    value: "all",
                  },
                  {
                    label: "Approved",
                    value: "1",
                  },
                  {
                    label: "Un-Approved",
                    value: "2",
                  },
                ]}
                value={label || []}
                isClearable={true}
              />
            </Col>
            <Col sm="2">
              <Button
                style={{ marginTop: "19px" }}
                onClick={(e) => getSearchData()}
              >
                <i className="fa fa-search"></i>
              </Button>
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
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th className="table-th blackColor" style={{ width: "120px" }}>
                <p>
                  {"Client Name"}
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
                  {t("Transaction Reference ID")}
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
                  {t("Top-up Amount")}
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
                  {t("Transaction Image")}
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
                <p>{t("Transaction Status")}</p>
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
                    item.client.name_en
                      .toLowerCase()
                      .includes(searchData.toLowerCase()) ||
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
                    <td data-tip={item.client.name_en}>
                      <div className="d-flex justify-content-left align-items-center">
                        <div className="avatar me-1 bg-light-success">
                          <span className="avatar-content">
                            {helper.FirstWordFirstChar(item.client.name_en)}
                            {helper.SecondWordFirstChar(item.client.name_en)}
                          </span>
                        </div>
                        <div className="d-flex flex-column">
                          <a className="user_name text-truncate text-body">
                            <span className="fw-bolder">
                              {helper.shortTextWithDots(
                                item.client.name_en,
                                20
                              )}
                            </span>
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      {item.reference_number ? item.reference_number : ""}
                    </td>
                    <td>
                      <input
                        // style={{ borderColor: "red", borderWidth: 1 }}
                        type="text"
                        name="amount"
                        disabled={status == "Approved" ? "true" : ""}
                        value={item.amount}
                        onChange={(e) => {
                          data.filter((element) => {
                            if (element.id === item.id) {
                              let newData = data;
                              newData[index].amount = helper.cleanDecimal(
                                e.target.value,
                                "amount"
                              );
                              setdata([...newData]);
                            }
                          });
                        }}
                        className="form-control"
                        placeholder="Amount"
                        style={{ maxWidth: "100px" }}
                      />
                    </td>

                    <td>
                      {item.transaction_file != null ? (
                        get_url_extension(item.transaction_file) == "pdf" ? (
                          <a href={item.transaction_file} target="_blank">
                            <i
                              class="fa-solid fa-file-pdf fa-3x"
                              // onClick={(e) =>
                              //   handleShowDialog(item.transaction_file, true)
                              // }
                            ></i>
                          </a>
                        ) : (
                          <img
                            onClick={(e) =>
                              handleShowDialog(item.transaction_file)
                            }
                            src={item.transaction_file}
                            style={{ height: "60px", width: "100px" }}
                          />
                        )
                      ) : (
                        <img
                          src="https://www.freeiconspng.com/uploads/no-image-icon-15.png"
                          style={{ height: "50px", width: "80px" }}
                          alt="No Image available"
                        />
                      )}
                    </td>
                    <td>{getStatus(item.transaction_status)}</td>
                    <td>
                      {role.approve && item.transaction_status == 2 ? (
                        <Button
                          color="success"
                          onClick={(e) => onOpenApproveModal(item, index)}
                        >
                          {t("Approve")}
                        </Button>
                      ) : (
                        ""
                      )}
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
      </div>
      <ApproveModal
        show={showApproveModal}
        confirmationText={`Are you sure to Approve the transaction`}
        confirmationHeading={"Approve a transaction"}
        onHide={onCloseApproveModal}
        submitAction={submitAction}
      />
      <ZoomableImageModal
        isOpen={isOpenImgDialog}
        onHide={() => hideImageDialog()}
        imgUrl={imgDialog}
        isPdf={isPdf}
      />
    </div>
  );
}

export default Approve_Topup;

// const InputField = ({ inputRef, item, status }) => {
//   return (

//   );
// };
