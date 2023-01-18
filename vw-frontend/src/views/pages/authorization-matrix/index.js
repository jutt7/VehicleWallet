import React, { useEffect, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { Card, CardBody, CardTitle, CardHeader } from "reactstrap";
import { ClipLoader } from "react-spinners";
import helper from "@src/@core/helper";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import "./styles.css";
import { getUserData } from "@utils";

function AuthMatrix() {
  const [adminData, setAdminData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [gasStationNetworkData, setGasStationNetworkData] = useState([]);
  const [overlay, setoverlay] = useState(false);
  const [roles, setRoles] = useState([]);
  const [remianRoles, setRemainRoles] = useState([]);
  const [checkedRoles, setCheckedRoles] = useState([]);
  const [id, setId] = useState("");
  const [allRole, setAllRole] = useState([]);
  const [rolesArray, setRolesArray] = useState([]);
  const [subCat, setSubCat] = useState([]);
  const [selectedCat, setSelectedCat] = useState();
  const [loginCat, setLoginCat] = useState([]);

  const checkInLogin = (c) => {
    let arr = loginCat;
    let b = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == c) {
        b = true;
      }
    }
    return b;
  };
  const getGroups = () => {
    setoverlay(true);
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/groups?pagination=true`, {})
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(helper.applyCountID(res.data.data), "group data");
          //   setdata(helper.applyCountID(res.data.data.data));
          let ad = [];
          let cl = [];

          let gsn = [];
          res.data.data.forEach((item) => {
            if (item.category == "admin") {
              ad.push(item);
            } else if (item.category == "gas_station_network") {
              gsn.push(item);
            } else if (item.category == "client") {
              cl.push(item);
            }
          });

          setAdminData(ad);
          setClientData(cl);
          setGasStationNetworkData(gsn);

          setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          //   setdata([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        // setdata([]);
        setoverlay(false);
      });
  };

  // const getRoles = () => {
  //   setoverlay(true);
  //   axios
  //     .get(`${jwtDefaultConfig.adminBaseUrl}/distinct-roles`, {})
  //     .then((res) => {
  //       helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
  //       if (res.status && res.status === 200) {
  //         // console.log(helper.applyCountID(res.data), "roles data");
  //         let arr = [];
  //         res.data.categories.forEach((item) => {
  //           let obj = {
  //             name: item.category,
  //             roles: [],
  //             // remRoles: [],
  //           };
  //           arr.push(obj);
  //         });
  //         console.log("roles array", arr);
  //         setRolesArray(arr);
  //         setoverlay(false);
  //       } else {
  //         helper.toastNotification(
  //           "Unable to process request.",
  //           "FAILED_MESSAGE"
  //         );
  //         //   setdata([]);
  //         setoverlay(false);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error, "error");
  //       // setdata([]);
  //       setoverlay(false);
  //     });
  // };
  const getRoles = () => {
    setoverlay(true);
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/distinct-roles`, {})
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log(helper.applyCountID(res.data), "roles data");
          let arr = [];
          res.data.categories.forEach((item) => {
            let obj = {
              name: item.category,
              roles: [],

              // remRoles: [],
            };

            arr.push(obj);
          });
          console.log("roles array", arr);
          setRolesArray(helper.applyCountID(arr));
          setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          //   setdata([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        // setdata([]);
        setoverlay(false);
      });
  };
  const getSubRoles = (cat) => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/distinct-sub-category`, {
        category: cat,
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(helper.applyCountID(res.data), "sub roles data");
          setSubCat(helper.applyCountID(res.data.sub_categories));
          let arr = rolesArray;
          let index = arr.findIndex((x) => x.name == cat);
          // console.log("indexxxxxxxxxx", index);
          if (index >= 0) {
            res.data.sub_categories.forEach((item) => {
              let obj = {
                sub_category: item.sub_category,

                check: checkInLogin(item.sub_category),
              };
              let ind = arr[index].roles.findIndex(
                (x) => x.sub_category == obj.sub_category
              );

              if (ind < 0) {
                arr[index].roles.push(obj);
              }
            });
            console.log("subbbbbbbbbbbbbb", arr);
            setRolesArray(arr);
          }
          setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          //   setdata([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        // setdata([]);
        setoverlay(false);
      });
  };
  const getData = () => {
    setoverlay(true);

    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/group-roles`, {
        group: {
          group_id: id,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log(
          //   helper.applyCountID(res.data.roles),
          //   "sub group datasssssss"
          // );
          let arrSub = [];
          let r = [];
          res.data.roles.forEach((item) => {
            r.push(item.role_id);
            if (
              item.sub_category != null &&
              !arrSub.includes(item.sub_category)
            ) {
              arrSub.push(item.sub_category);
            }
          });
          console.log("subssssssssssss", arrSub);
          console.log("checked roleeeeeeeeeeee", r);
          setLoginCat(arrSub);
          setCheckedRoles(r);
          setoverlay(false);
          // console.log(temp.roles, "temp roles data");
          // setRoles(res.data.roles);
          // setRemainRoles(res.data.remaining_roles);
          //
          // let temp = rolesArray;
          // temp.forEach((i) => {
          //   i.roles = [];
          // });
          // let arr = [];
          // res.data.roles.forEach((item) => {
          //   r.push(item.role_id);
          //   let obj = {
          //     action: item.action,
          //     category: item.category,
          //     created_at: item.created_at,
          //     deleted_at: item.deleted_at,
          //     description_ar: item.description_ar,
          //     description_en: item.description_en,
          //     description_ur: item.description_ur,
          //     menu_url: item.menu_url,
          //     role_id: item.role_id,
          //     role_name_ar: item.role_name_ar,
          //     role_name_en: item.role_name_en,
          //     role_name_ur: item.role_name_ur,
          //     status: item.status,
          //     subject: item.subject,
          //     updated_at: item.update,
          //     check: 1,
          //   };

          //   for (let i = 0; i < temp.length; i++) {
          //     if (temp[i].name == obj.category) {
          //       temp[i].roles.push(obj);
          //       break;
          //     }
          //   }
          // console.log("tempppppppppppp Roles", temp);
          // setRolesArray(temp);
          // arr.push(obj);
          // });

          // setRoles(arr);

          setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          //   setdata([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        // setdata([]);
        setoverlay(false);
      });
  };
  const update = () => {
    // console.log("checked roooooooooooool", checkedRoles);
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/user-group/update`, {
        group: {
          group_id: id,
          role_ids: checkedRoles,
        },
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          helper.toastNotification(
            "Request has been processed successfuly.",
            "SUCCESS_MESSAGE"
          );
          setoverlay(false);
          getData(id);
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

  const setCheckValue = (list) => {
    let arr = checkedRoles;

    for (let i = 0; i < list.length; i++) {
      let index = arr.indexOf(list[i]);

      if (index >= 0) {
        arr.splice(index, 1);
        // break;
      } else {
        arr.push(list[i]);
        // break;
      }
    }

    console.log("listttttttttttt", arr);

    setCheckedRoles(arr);
  };

  const setCheckBox = (element, i, name) => {
    let arr = rolesArray;
    let index = arr.findIndex((x) => x.name == name);
    // console.log("beforeeeeee", arr[index]);
    if (index >= 0) {
      arr[index].roles[i].check = !element.check;
    }
    setRolesArray(arr);
    // console.log("afterrrrrrrrrr", arr[index]);
  };

  // useEffect(() => {
  //   let arr = roles;
  //   let temp = rolesArray;
  //   if (arr && arr.length > 0) {
  //     let r = remianRoles;
  //     r.forEach((item) => {
  //       let obj = {
  //         action: item.action,
  //         category: item.category,
  //         created_at: item.created_at,
  //         deleted_at: item.deleted_at,
  //         description_ar: item.description_ar,
  //         description_en: item.description_en,
  //         description_ur: item.description_ur,
  //         menu_url: item.menu_url,
  //         role_id: item.role_id,
  //         role_name_ar: item.role_name_ar,
  //         role_name_en: item.role_name_en,
  //         role_name_ur: item.role_name_ur,
  //         status: item.status,
  //         subject: item.subject,
  //         updated_at: item.update,
  //         check: 0,
  //       };

  //       for (let i = 0; i < temp.length; i++) {
  //         if (temp[i].name == obj.category) {
  //           temp[i].roles.push(obj);
  //           // temp[i].remRoles.push(obj);
  //           break;
  //         }
  //       }

  //       // console.log(temp, "temp roles data in use effect");
  //       setRolesArray(temp);
  //       arr.push(obj);
  //     });
  //     // setAllRole(arr);
  //     console.log("roles array", temp);
  //   }
  // }, [roles]);
  const getSubCategoreis = (sub) => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/sub-category-roles`, {
        sub_category: sub,
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          console.log(res.data, "sub roles data");
          setCheckValue(res.data.role_ids);
          setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          //   setdata([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        // setdata([]);
        setoverlay(false);
      });
  };
  useEffect(() => {
    if (rolesArray && rolesArray.length > 0) {
      getData();
    }
  }, [rolesArray]);
  useEffect(() => {
    getGroups();
    // getRoles();
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
        loading={overlay}
      />
      <Card style={{ height: "80vh" }}>
        <CardHeader className="border-bottom">
          <CardTitle style={{ fontWeight: "bold" }} tag="h4">
            Authorization Matrix
          </CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <div style={{ height: "65vh" }}>
            <Row>
              <Col sm={4}>
                <p className="clientHeading">
                  <span>Groups</span>
                </p>
                <div style={{ height: "60vh", overflowY: "scroll" }}>
                  {/* Admin Group */}

                  <div>
                    <p
                      style={{
                        fontSize: "2em",
                        paddingTop: "5px",
                        fontWeight: "400",
                      }}
                    >
                      Admin
                    </p>
                    <ul
                      style={{
                        listStyleType: "none",
                        // backgroundColor: "pink",
                        marginTop: "15px",
                      }}
                    >
                      {adminData
                        ? adminData.map((item) => {
                            return (
                              <li
                                className="list"
                                style={{
                                  marginBottom: "12px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  console.log("clicked", item);
                                  // getData(item.group_id);
                                  getRoles();
                                  setId(item.group_id);
                                }}
                              >
                                <p style={{ fontSize: "1.4em" }}>
                                  {item.group_name_en}
                                </p>
                              </li>
                            );
                          })
                        : ""}
                    </ul>
                    <hr></hr>
                  </div>
                  {/* Client Group */}
                  <div>
                    <p
                      style={{
                        fontSize: "2em",
                        paddingTop: "5px",
                        fontWeight: "400",
                      }}
                    >
                      Client
                    </p>
                    <ul
                      style={{
                        listStyleType: "none",
                        // backgroundColor: "pink",
                        marginTop: "15px",
                      }}
                    >
                      {clientData
                        ? clientData.map((item) => {
                            return (
                              <li
                                className="list"
                                style={{
                                  marginBottom: "12px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  console.log("clicked", item);
                                  // getData(item.group_id);
                                  getRoles();

                                  setId(item.group_id);
                                }}
                              >
                                <p style={{ fontSize: "1.4em" }}>
                                  {item.group_name_en}
                                </p>
                              </li>
                            );
                          })
                        : ""}
                    </ul>
                    <hr></hr>
                  </div>
                  {/* Gas Station Network Group */}
                  <div>
                    <p
                      style={{
                        fontSize: "2em",
                        paddingTop: "5px",
                        fontWeight: "400",
                      }}
                    >
                      Gas Station Network
                    </p>
                    <ul
                      style={{
                        listStyleType: "none",
                        // backgroundColor: "pink",
                        marginTop: "15px",
                      }}
                    >
                      {gasStationNetworkData
                        ? gasStationNetworkData.map((item) => {
                            return (
                              <li
                                className="list"
                                style={{
                                  marginBottom: "12px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  console.log("clicked", item);
                                  // getData(item.group_id);
                                  getRoles();

                                  setId(item.group_id);
                                }}
                              >
                                <p style={{ fontSize: "1.4em" }}>
                                  {item.group_name_en}
                                </p>
                              </li>
                            );
                          })
                        : ""}
                    </ul>
                    <hr></hr>
                  </div>
                </div>
              </Col>
              <Col>
                <p className="clientHeading">
                  <span>Roles</span>
                </p>
                <div style={{ height: "60vh", overflowY: "scroll" }}>
                  {rolesArray.length > 0
                    ? rolesArray.map((item, i) => {
                        return (
                          <div>
                            <lable
                              style={{ fontSize: "1.8em", cursor: "pointer" }}
                              onClick={(e) => {
                                console.log("logs", item);
                                // setSelectedCat(item.name);
                                // getSubCategoreis(item.name);
                                getSubRoles(item.name);
                              }}
                            >
                              {item.name}
                            </lable>
                            {item.roles.length > 0
                              ? item.roles.map((element, index) => {
                                  return (
                                    <div
                                      style={{
                                        marginBottom: "5px",
                                        marginLeft: "15px",
                                      }}
                                    >
                                      {element.sub_category ? (
                                        <Row>
                                          <Col sm="6">
                                            <lable
                                              style={{
                                                fontSize: "1.4em",
                                                cursor: "pointer",
                                              }}
                                            >
                                              {element.sub_category}
                                              {/* {element.role_name_en} */}
                                            </lable>
                                          </Col>
                                          <Col>
                                            <input
                                              type="checkbox"
                                              checked={
                                                element.check == 1
                                                  ? true
                                                  : false
                                              }
                                              onChange={() => {
                                                // console.log("changes");
                                                setCheckBox(
                                                  element,
                                                  index,
                                                  item.name
                                                );
                                                // setCheckValue(element.role_id);
                                                getSubCategoreis(
                                                  element.sub_category
                                                );
                                                // item.roles.filter((e) => {
                                                //   if (
                                                //     e.role_id ===
                                                //     element.role_id
                                                //   ) {
                                                //     let newData = rolesArray;
                                                //     console.log(
                                                //       "new dataaaaaa",
                                                //       newData
                                                //     );
                                                //     console.log(
                                                //       "clicked",
                                                //       e,
                                                //       index,
                                                //       element
                                                //     );
                                                //     newData[i].roles[
                                                //       index
                                                //     ].check =
                                                //       e.check == 1 ? 0 : 1;
                                                //     setRolesArray([...newData]);
                                                //   }
                                                // });
                                              }}
                                            ></input>
                                          </Col>
                                        </Row>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  );
                                })
                              : ""}
                          </div>
                        );
                      })
                    : ""}
                </div>
              </Col>
            </Row>
          </div>
        </CardBody>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingBottom: "10px",
            paddingRight: "10px",
          }}
        >
          <Button
            onClick={() => {
              update();
            }}
          >
            Update
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default AuthMatrix;

// {allRole
//   ? allRole.map((item, index) => {
//       return (
//         <div style={{ marginBottom: "5px" }}>
//           <Row>
//             <Col sm="6">
//               <lable style={{ fontSize: "1.4em" }}>
//                 {item.role_name_en}
//               </lable>
//             </Col>
//             <Col>
//               <input
//                 type="checkbox"
//                 checked={item.check == 1 ? true : false}
//                 onChange={() => {
//                   console.log("changes");
//                   setCheckValue(item.role_id);
//                   allRole.filter((element) => {
//                     if (element.role_id === item.role_id) {
//                       let newData = allRole;
//                       newData[index].check =
//                         element.check == 1 ? 0 : 1;
//                       setAllRole([...newData]);
//                     }
//                   });
//                 }}
//               ></input>
//             </Col>
//           </Row>
//         </div>
//       );
//     })
//   : ""}
