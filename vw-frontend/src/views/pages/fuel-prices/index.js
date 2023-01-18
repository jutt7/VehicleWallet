import React, { useEffect, useState } from "react";
import { Table } from "rsuite";
import { Input, Label } from "reactstrap";
import { Check, X, Edit } from "react-feather";
import { Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import AddUpdateModal from "./AddUpdateModal";
import DeleteModal from "../../components/modal/DeleteModal";
import helper from "@src/@core/helper";
import Pagination from "react-js-pagination";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";
import { Card, CardBody, CardTitle, CardHeader } from "reactstrap";
import UpdateModal from "./UpdateModal";
import { isUserLoggedIn, getUserData } from "@utils";
import { useTranslation } from "react-i18next";
import DataTableExportButton from "../../components/TableToExcel";

export default function client(props) {
  const { t } = useTranslation();

  const [clientShow, setclientShow] = useState(true);
  const [stationShow, setstationShow] = useState(false);
  const [overlay, setoverlay] = useState(false);
  const [data, setdata] = useState(1);
  const [onSubmit, setonSubmit] = useState("");
  const [showAddUpdateModal, setshowAddUpdateModal] = useState(false);
  const [showUpdateModal, setshowUpdateModal] = useState(false);
  const [updateModalData, setupdateModalData] = useState(null);
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
  const [dataForTable, setDataForTable] = useState([]);

  const [en, setEn] = useState(false);

  const [searchData, setSearchData] = useState("");

  const [gasStationList, setgasStationList] = useState([]);
  const [fuelTypeList, setfuelTypeList] = useState([]);

  const [role, setRole] = useState({
    addFuelPrice: false,
    updateFuelPrice: false,
    deleteFuelPrice: false,
  });

  const setRoles = () => {
    let roles = getUserData().ability;
    // console.log("rolesss", roles);
    let arr = role;
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].subject == "fm.fuel_price.store") {
        arr.addFuelPrice = true;
      } else if (roles[i].subject == "fm.fuel_price.update") {
        arr.updateFuelPrice = true;
      } else if (roles[i].subject == "fm.fuel_price.delete") {
        arr.deleteFuelPrice = true;
      }
    }
    setRole(arr);
  };

  const submitAction = (args = "") => {
    // if (onSubmit == "create") {
    //   create(args);
    // }
    console.log("argsssssss", args);
    if (onSubmit == "update") {
      update(args);
    }
    if (onSubmit == "delete") {
      remove();
    }
  };

  const getTypes = (pricing) => {
    create(pricing);
  };

  const sortAscending = (icon, sortType, colsort) => {
    if (colsort == "price") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            a[colsort] > b[colsort] && sortType === "asc" ? 1 : -1
          )
        )
      );
    } else if (colsort == "gas_station") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            helper.isObject(a.gas_station) &&
            helper.isObject(b.gas_station) &&
            b.gas_station.name_en &&
            a.gas_station.name_en &&
            a.gas_station.name_en.toLowerCase() >
              b.gas_station.name_en.toLowerCase() &&
            sortType === "asc"
              ? 1
              : -1
          )
        )
      );
    } else if (colsort == "fuel_type") {
      setsorting_icon(icon);
      setdata(
        helper.applyCountID(
          data.sort((a, b) =>
            helper.isObject(a.fuel_type) &&
            helper.isObject(b.fuel_type) &&
            b.fuel_type.title_en &&
            a.fuel_type.title_en &&
            a.fuel_type.title_en.toLowerCase() >
              b.fuel_type.title_en.toLowerCase() &&
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

    setshowUpdateModal(true);
    setupdateIndex(index);
    setonSubmit("update");
  };

  const onCloseAddUpdateModal = () => {
    setshowAddUpdateModal(false);
    setshowUpdateModal(false);
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
      .post(
        `${jwtDefaultConfig.adminBaseUrl}/fuel-prices?page=${currentPage}&pagination=true`,
        {
          gas_station: {
            gas_station_id: props.stationID
              ? props.stationID
              : helper.getIDfromUrl(window.location.href),
          },
        }
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
          // setoverlay(false);
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
        gas_station: helper.isObject(item.gas_station)
          ? item.gas_station.name_en
          : "",
        price: item.price,
        fuel_type: helper.isObject(item.fuel_type)
          ? item.fuel_type.title_en
          : "",

        status: item.status,

        created_at: item.created_at,
      });
    });
    setDataForTable(arr);
  };
  const getGasStation = () => {
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/stations?pagination=false&lang=ar`)
      .then(async (res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setgasStationList(res.data.data);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setgasStationList([]);
        }
      })
      .catch((error) => {
        setgasStationList([]);
      });
  };

  const getFuelType = () => {
    setoverlay(true);
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/fuel-types?page=${currentPage}&pagination=true`
      )
      .then(async (res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          setoverlay(false);
          console.log("fuel type list", res.data.data);
          let arr = [];
          if (data && data.length > 0) {
            res.data.data.data.forEach((item) => {
              let c = 0;
              for (let i = 0; i < data.length; i++) {
                if (
                  helper.isObject(data[i].fuel_type) &&
                  data[i].fuel_type.title_en == item.title_en
                ) {
                  c++;
                }
              }
              if (c == 0) {
                arr.push(item);
              }
            });
            console.log("arrrrr", arr);
            setfuelTypeList(arr);
          }
          // else {
          //   console.log("arrrrr", arr);
          //   setfuelTypeList(res.data.data.data);
          // }
        } else {
          setoverlay(false);

          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setfuelTypeList([]);
        }
      })
      .catch((error) => {
        setoverlay(false);

        setfuelTypeList([]);
      });
  };

  const create = (pricing) => {
    let arr = [];
    pricing.forEach((element) => {
      let obj = {
        gas_station_id: props.stationID
          ? props.stationID
          : helper.getIDfromUrl(window.location.href),
        price: parseFloat(element.price) + parseFloat(element.extra_price),
        fuel_type_id: element.id,
        extra_price: element.extra_price,
      };
      arr.push(obj);
    });
    console.log("args create ", arr);
    // console.log("price", pricing);
    // return;

    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/fuel-price/store`, {
        fuel_price: arr,
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
          setoverlay(false);
          helper.toastNotification("Something went wrong.", "FAILED_MESSAGE");
        }
      })
      .catch((error) => {
        setoverlay(false);
        helper.toastNotification(
          "Unable to process request.",
          "FAILED_MESSAGE"
        );
      });
  };

  const update = (args) => {
    console.log("update", args);
    // return;
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/fuel-price/update`, {
        fuel_price: {
          id: args.id,
          gas_station_id: props.stationID
            ? props.stationID
            : helper.getIDfromUrl(window.location.href),
          price: args.price
            ? parseFloat(args.price) + parseFloat(args.extra_price)
            : "",
          fuel_type_id: args.fuel_type_id,
          extra_price: args.extra_price ? args.extra_price : 0,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.data.code && res.data.code === 200) {
          setshowUpdateModal(false);
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          getData();
        } else {
          setoverlay(false);
          if (res.data.data.email) {
            helper.toastNotification(res.data.data.email[0]);
          }
          if (res.data.data.mobile) {
            helper.toastNotification(res.data.data.mobile[0]);
          }
          if (res.data.data.driving_license_number) {
            helper.toastNotification(res.data.data.driving_license_number[0]);
          }
          if (res.data.data.driving_license_number) {
            helper.toastNotification(res.data.data.driving_license_number[0]);
          }
          if (res.data.data.driving_license_number) {
            helper.toastNotification(
              res.data.data.civil_record_or_resident_permit_number[0]
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
      });
  };

  const remove = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/fuel-price/delete`, {
        fuel_price: {
          id: deleteItem.id,
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
    if (data != 1) {
      getFuelType();
    }
  }, [data]);

  useEffect(() => {
    setRoles();
    getData();
    // getGasStation();
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

      <Card>
        <CardHeader className="border-bottom">
          <CardTitle style={{ fontWeight: "bold" }} tag="h4">
            {t("Fuel Prices")} {props.gasStationName}
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Row>
            <Col lg={12}>
              <Row>
                <Col style={{ display: "flex" }}>
                  {role.addFuelPrice ? (
                    <Button
                      disabled={data && data.length >= 3 ? true : false}
                      onClick={(e) => openCreateModal()}
                    >
                      <i className="fas fa-plus"></i>{" "}
                      {t("Update Gas Station Price")}
                    </Button>
                  ) : (
                    ""
                  )}
                  <input
                    className="form-control crud-search"
                    placeholder="Search ..."
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
            </Col>
          </Row>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th
                    className="table-th blackColor"
                    style={{ width: "120px" }}
                  >
                    <p>
                      {t("Gas Station")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col1_asc", "asc", "gas_station")
                          }
                          className={
                            sorting_icon == "Col1_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col1_des", "des", "gas_station")
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
                      {t("Price")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col2_asc", "asc", "price")
                          }
                          className={
                            sorting_icon == "Col2_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col2_des", "des", "price")
                          }
                          className={
                            sorting_icon == "Col2_des"
                              ? "fas fa-long-arrow-alt-down sort-color"
                              : "fas fa-long-arrow-alt-down"
                          }
                        ></i>
                      </span>
                    </p>
                  </th>

                  <th className="table-th blackColor">
                    <p>
                      {t("Fuel Type")}
                      <span>
                        <i
                          onClick={(e) =>
                            sortAscending("Col2_asc", "asc", "order_number")
                          }
                          className={
                            sorting_icon == "Col2_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col3_des", "des", "order_number")
                          }
                          className={
                            sorting_icon == "Col3_des"
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
                            sortAscending("Col3_asc", "asc", "created_at")
                          }
                          className={
                            sorting_icon == "Col3_asc"
                              ? "fas fa-long-arrow-alt-up sort-color"
                              : "fas fa-long-arrow-alt-up"
                          }
                        ></i>
                        <i
                          onClick={(e) =>
                            sortAscending("Col3_des", "des", "created_at")
                          }
                          className={
                            sorting_icon == "Col3_des"
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
                    .filter((item, index) => {
                      if (searchData == "") {
                        return item;
                      } else if (
                        item.gas_station.name_en
                          .toLowerCase()
                          .includes(searchData.toLowerCase()) ||
                        item.fuel_type.title_en
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
                          {helper.isObject(item.gas_station) ? (
                            <div class="d-flex justify-content-left align-items-center">
                              <div class="avatar me-1 bg-light-success">
                                <span class="avatar-content">
                                  {helper.FirstWordFirstChar(
                                    item.gas_station.name_en
                                  )}
                                  {helper.SecondWordFirstChar(
                                    item.gas_station.name_en
                                  )}
                                </span>
                              </div>
                              <div class="d-flex flex-column">
                                <a class="user_name text-truncate text-body">
                                  <span class="fw-bolder">
                                    {helper.shortTextWithDots(
                                      item.gas_station.name_en,
                                      20
                                    )}
                                  </span>
                                </a>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </td>
                        <td>
                          {(
                            parseFloat(item.price) +
                            parseFloat(item.extra_price * 0.01)
                          ).toFixed(2)}
                        </td>
                        <td>
                          {helper.isObject(item.fuel_type)
                            ? item.fuel_type.title_en
                            : ""}
                        </td>
                        <td>{helper.humanReadableDate(item.created_at)}</td>
                        <td>
                          {role.deleteFuelPrice ? (
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
                        <td>
                          {window.location.href.indexOf("/admin/") > -1 ||
                          window.location.pathname.split("/").splice(-2)[0] ==
                            "network-gas-station-detail" ? (
                            <div style={{ display: "flex" }}>
                              {role.updateFuelPrice ? (
                                <Edit
                                  data-tip="Update"
                                  size={15}
                                  onClick={(e) =>
                                    onOpenUpdateModal(item, index)
                                  }
                                  style={{
                                    marginTop: "4px",
                                    marginRight: "5px",
                                  }}
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                          <ReactTooltip />
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={6}>No Records found</td>
                  </tr>
                )}
              </tbody>
            </table>

            <AddUpdateModal
              show={showAddUpdateModal}
              updateModalData={updateModalData}
              onHide={onCloseAddUpdateModal}
              submitAction={submitAction}
              disableBtn={overlay}
              gasStationList={gasStationList}
              fuelTypeList={fuelTypeList}
              gasStationName={props.gasStationName}
              getTypes={getTypes}
              gas_station_id={props.gas_station_id}
            />
            <UpdateModal
              show={showUpdateModal}
              updateModalData={updateModalData}
              onHide={onCloseAddUpdateModal}
              submitAction={submitAction}
              disableBtn={overlay}
              gasStationName={props.gasStationName}
            />
            <DeleteModal
              show={showDeleteModal}
              confirmationText={`Are you sure to ${deleteMessage} a fuel price`}
              confirmationHeading={`${helper.uppercaseFirst(
                deleteMessage
              )} a fuel price`}
              onHide={onCloseDeleteModal}
              submitAction={submitAction}
              disableBtn={overlay}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// [
//   {
//     gas_station_id: props.stationID,
//     price: type1.price,
//     fuel_type_id: type1.fuel_type_id,
//   },
//   {
//     gas_station_id: props.stationID,
//     price: type2.price,
//     fuel_type_id: type2.fuel_type_id,
//   },
//   {
//     gas_station_id: props.stationID,
//     price: type3.price,
//     fuel_type_id: type3.fuel_type_id,
//   },
// ],
