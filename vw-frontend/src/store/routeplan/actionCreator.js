import {
  GET_ROUTES_CAPACITY,
  GET_AVAILABLE_VEHICLES,
  CREATE_TRIP,
  CREATE_STATIC_TRIP,
  REMOVE_DELIVERY,
  ADD_DELIVERY,
  DELETE_DELIVERY,
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  UPDATE_DELIVERY,
  GET_DYNAMIC_CONSTRAINTS,
  SAVE_GEO_FENCE,
  REMOVE_GEO_FENCE,
  CREATE_DYNAMIC_TRIP,
  APPROVE_DELIVERY_TRIP,
  nav_menu,
} from "../actionTypes";
import axios from "axios";
import { data } from "jquery";
import { FOR_ROUTES_PALN_PAGE_MESSAGES } from "../Constants";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"
export const get_routes_and_capacity = (
  form_date,
  to_date,
  branchId,
  type,
  pageFor = ""
) => {
  return (dispatch) => {
    let url
    if (type == 'static') {
      url = `${jwtDefaultConfig.LOCAL_API_URL_CT}api/routing/${branchId}/${type}/${form_date}/${to_date}`
    }
    /* else if (type == 'custom') {
      url = `api/routing/${branchId}/${type}/${form_date}/${to_date}`
    } */

    else if (type == 'custom') {
      url = `${jwtDefaultConfig.LOCAL_API_URL_CT}api/routing/${branchId}/${type}/${form_date}/${to_date}`
    }

    else if (type == 'dynamic') {
      url = `${jwtDefaultConfig.LOCAL_API_URL_CT}api/routing/${branchId}/${type}/${form_date}/${to_date}`
    }
    axios
      .get(url, {
        // headers: {
        //   Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        // },
      })
      .then((res) => {
        let response = res.data;
        let data = response.data;
        let message = response.message;
        console.log(response,'response')
        if (response.code === 200 || response.code === 404) {
          ////showSuccessMessage(message, dispatch);
          if (pageFor === "available_deliveries") {
            dispatch({
              type: GET_ROUTES_CAPACITY,
              payload: {
                foravailabledeliveries: data.orders,
                message: response.message,
              },
            });
          } else {
            dispatch({
              type: GET_ROUTES_CAPACITY,
              payload: {
                routesAndPlanData: data,
                message: response.message,
              },
            });
          }
        } else {
          showErrorMessage(message, dispatch);
          if (pageFor === "available_deliveries") {
            dispatch({
              type: GET_ROUTES_CAPACITY,
              payload: {
                foravailabledeliveries: data.orders,
                message: response.message,
              },
            });
          } else {
            dispatch({
              type: GET_ROUTES_CAPACITY,
              payload: {
                routesAndPlanData: data,
                message: response.message,
              },
            });
          }
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
        dispatch({
          type: GET_ROUTES_CAPACITY,
          payload: {
            routesAndPlanData: {orders :[]},
            message: "No Data",
          },
        });
      });
  };
};
export const get_available_vehciles = (branchId, date, order_id = '', shipping_address = '') => {
  // console.log(branchId, 'branchId')
  // console.log(date, 'date')
  // console.log(order_id, 'order_id')
  // console.log(shipping_address, 'shipping_address')
  if (order_id && shipping_address) {
    return (dispatch) => {
      axios
        .post(`${jwtDefaultConfig.LOCAL_API_URL_CT}api/get-available-vehicles`,
          {
            store_id: branchId,
            route_date: date,
            order_id: order_id,
            shipping_address_id: shipping_address
          }
          , {
            headers: {
              Authorization: `bearer ${localStorage.getItem("authtoken")}`,
            },
          })
        .then((res) => {
          let response = res.data;
          let message = response.message;
          if (response.code === 200 || response.code === 404) {
            //showSuccessMessage(message, dispatch);
            let data = response.data;
            dispatch({
              type: GET_AVAILABLE_VEHICLES,
              payload: {
                vehicleList: data.vehicles,
                message: response.message,
              },
            });
          } else {
            showErrorMessage(message, dispatch);
          }
        })
        .catch((error) => {
          showErrorMessage(error.toString(), dispatch);
        });
    };
  }
  return (dispatch) => {
    dispatch({
      type: GET_AVAILABLE_VEHICLES,
      payload: {
        vehicleList: [],
        message: '',
      },
    });
  }

};

export const get_available_users = (branchId, date) => {
  return (dispatch) => {
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/viewdriver/1000`, {
        // headers: {
        //   Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        // },
      })
      .then((res) => {
        let response = res.data;
        console.log(response, 'response');
        let message = response.message;
        if (response.code === 200 || response.code === 404) {
          //showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: GET_AVAILABLE_USERS,
            payload: {

              users: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
        }
      })
      .catch((error) => {
        console.log(error, 'errorrr')
        showErrorMessage(error.toString(), dispatch);
      });
  };
};

export const create_trip = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/create-trip/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;

        let result = []
        if (response.code === 200) {
          //showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: CREATE_TRIP,
            payload: {
              code: data.code,
              message: response.message,
              customTripData: data,
              tripCode: data.trip_code,
            },
          });
        } else {
          if (parseInt(response.code) === 300) {
            let myData = response.data
            for (var i in myData) {
              result.push([i, myData[i]]);
            }
            if (result.length > 0) {
              showErrorMessage(result[0][1][0], dispatch);
            }
          }
          else {
            showErrorMessage(message, dispatch);
          }
          dispatch({
            type: CREATE_TRIP,
            payload: {
              code: data.code,
              customTripData: data,
              message: response.message,
              tripCode: null,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const create_static_trip = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/create-static-trip/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;

        let result = []
        if (response.code === 200) {
          //showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: CREATE_STATIC_TRIP,
            payload: {
              statictripData: data,
              staticTripData: data,
              message: response.message,
            },
          });
        }
        else {
          if (parseInt(response.code) === 300) {
            let myData = response.data
            for (var i in myData) {
              result.push([i, myData[i]]);
            }
            if (result.length > 0) {
              showErrorMessage(result[0][1][0], dispatch);
            }
          }
          else {
            showErrorMessage(message, dispatch);
          }
          dispatch({
            type: CREATE_STATIC_TRIP,
            payload: {
              statictripData: data,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const remove_delivery = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/remove-delivery/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {
          //showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: REMOVE_DELIVERY,
            payload: {
              // statictripData: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: REMOVE_DELIVERY,
            payload: {
              // statictripData: data,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const add_delivery = (branchId, data, forPage = null) => {
  return (dispatch) => {
    axios
      .post(`api/add-delivery/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {
          //showSuccessMessage(message, dispatch, forPage);
          let data = response.data;
          dispatch({
            type: ADD_DELIVERY,
            payload: {
              statictripData: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch, forPage);
          dispatch({
            type: ADD_DELIVERY,
            payload: {
              statictripData: data,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch, forPage);
      });
  };
};

export const update_delivery = (branchId, data, forPage = null) => {
  return (dispatch) => {
    axios
      .post(`api/update-delivery-trip/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (response.code == 200) {
          if (message) {
            showSuccessMessage(message, dispatch, forPage);
            let data = response.data;
            //Router.push("/trip-list");
            dispatch({
              type: UPDATE_DELIVERY,
              payload: {
                message: response.message,
              },
            });
          }

        } else {
          if (message) {
            showErrorMessage(message, dispatch, forPage);
            dispatch({
              type: UPDATE_DELIVERY,
              payload: {
                message: response.message,
              },
            });
          }
          else {
            showErrorMessage("No response message received.", dispatch, forPage);
            dispatch({
              type: UPDATE_DELIVERY,
              payload: {
                message: "No response message received.",
              },
            });
          }
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch, forPage);
      });
  };
};
export const delete_delivery = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/delete-trip/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {
          showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: DELETE_DELIVERY,
            payload: {
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: DELETE_DELIVERY,
            payload: {
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const get_dynamic_constraints = (branchId) => {
  return (dispatch) => {
    axios
      .get(`api/get-store-constraints/${branchId}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {
          //showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: GET_DYNAMIC_CONSTRAINTS,
            payload: {
              message: response.message,
              constraints: data,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: GET_DYNAMIC_CONSTRAINTS,
            payload: {
              message: response.message,
              constraints: data,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const save_geo_fence = (branchId, data, overlay, accessKey) => {
  return (dispatch) => {
    axios
      .post(`api/save-geo-fence/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        let data = response.data;
        let shapeData = {
          data: data,
          // overlay: overlay,
          accessKey: accessKey,
        };
        if (response.code === 200) {
          //showSuccessMessage(message, dispatch);

          dispatch({
            type: SAVE_GEO_FENCE,
            payload: {
              message: response.message,
              geofenceData: shapeData,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: SAVE_GEO_FENCE,
            payload: {
              message: response.message,
              geofenceData: shapeData,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const remove_geo_fence = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/remove-geo-fence/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {
          //showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: REMOVE_GEO_FENCE,
            payload: {
              message: response.message,
              geofenceData: data,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: REMOVE_GEO_FENCE,
            payload: {
              message: response.message,
              geofenceData: data,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const create_dynamic_trip = (branchId, data) => {
  return (dispatch) => {
    axios
      .post(`api/create-dynamic-trip/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        let result = []
        if (parseInt(response.code) === 200) {
          //showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: CREATE_DYNAMIC_TRIP,
            payload: {
              message: response.message,
              code: response.code,
              dynamicTripData: data,
              flag: true
            },
          });
          //Router.push("/trip-list");
        } else {
          if (parseInt(response.code) === 300) {
            let myData = response.data
            for (var i in myData) {
              result.push([i, myData[i]]);
            }
            if (result.length > 0) {

              showErrorMessage(result[0][1][0], dispatch);
            }

          }
          else {
            showErrorMessage(message, dispatch);
          }

          dispatch({
            type: CREATE_DYNAMIC_TRIP,
            payload: {
              message: response.message,
              dynamicTripData: data,
              flag: false
            },
          });
          // Router.push("/trip-list");
        }
      })
      .catch((error) => {
        console.log(error)
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
export const approve_delivery_trip = (data, branchId) => {
  return (dispatch) => {
    axios
      .post(`api/approve-reject-delivery_trip/${branchId}`, data, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (parseInt(response.code) === 200) {
          //showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: APPROVE_DELIVERY_TRIP,
            payload: {
              message: response.message,
              // dynamicTripData: data,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: APPROVE_DELIVERY_TRIP,
            payload: {
              message: response.message,
              // dynamicTripData: data,
            },
          });
        }
      })
      .catch((error) => {
        showErrorMessage(error.toString(), dispatch);
      });
  };
};
const showErrorMessage = (message, dispatch) => {
  dispatch({
    type: ERROR_MESSAGE,
    payload: {
      message: message,
      forPage: FOR_ROUTES_PALN_PAGE_MESSAGES,
    },
  });
};
const showSuccessMessage = (message, dispatch) => {
  dispatch({
    type: SUCCESS_MESSAGE,
    payload: {
      message: message,
      forPage: FOR_ROUTES_PALN_PAGE_MESSAGES,
    },
  });
};

export const navMenu = (data) =>{
  console.log(data,'action')
  return {
    type:nav_menu,
    data:data
  }
}