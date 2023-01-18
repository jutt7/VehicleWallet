import axios from "axios";
import {
  GET_TRIP_DELIVERIES,
  GET_CANCEL_REASONS,
  GET_DELIVERY_SLOTS,
  CANCEL_ORDER,
  UPDATE_DELIVERY_TIME,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  GET_CUSTOMERS_ORDERS
} from "./actionTypes";
import { GET_TRIPS } from "./actionTypes";
import { FOR_LIVE_PAGE_MESSAGES } from "./Constants";
import store from "./store";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"
import helper from '@src/@core/helper';
let states = store.getState();

export const get_customer_orders = (customerId, forPageType = null) => {
  states.live.loading = true;
  return (dispatch) => {
    axios
      .get(`${jwtDefaultConfig.clientBaseUrl}/monitoring/${customerId}`, {
        // headers: {
        //   Authorization: `bearer ${localStorage.getItem("customerauthtoken")}`,
        // },
      })
      .then((res) => {
        states.live.loading = false;
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {

          if (response.data.length > 0) {
            //showSuccessMessage(message, dispatch, forPageType);
          } else {
            showErrorMessage(message, dispatch, forPageType);
          }
          let data = response.data;
          dispatch({
            type: GET_CUSTOMERS_ORDERS,
            payload: {
              orders: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch, forPageType);
        }
      })
      .catch((error) => {
        states.live.loading = false;
        showErrorMessage(error.toString(), dispatch, forPageType);
      });
  };
};

export const get_monitoring_data = () => {
  states.live.loading = true;
  return (dispatch) => {
    axios.get(`${jwtDefaultConfig.adminBaseUrl}/monitoring`, {
    }).then(async (res) => {
      states.live.loading = false;
        let response = res.data.data;
        if (res.status === 200) {
          dispatch({
            type: "GET_ MONITORING_MAP_DATA",
            payload: {
              data: response
            },
          });
        } 
      })
      .catch((error) => {
        states.live.loading = false;
        console.log(error)
      });
  };
};

export const get_trips_list = (currentDate, id, forPageType = null) => {
  console.log('testaction')
  states.live.loading = true;
  return (dispatch) => {
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/trip-listing/${id}/${currentDate}`, {
        // headers: {
        //   Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        // },
      })
      .then((res) => {
        states.live.loading = false;
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {

          if (response.data.length > 0) {
            //showSuccessMessage(message, dispatch, forPageType);
          } else {
            showErrorMessage(message, dispatch, forPageType);
          }
          let data = response.data;
          dispatch({
            type: GET_TRIPS,
            payload: {
              selectedBranchId: id,
              tripList: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch, forPageType);
          dispatch({
            type: GET_TRIPS,
            payload: {
              selectedBranchId: id,
              tripList: response.data,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {
        states.live.loading = false;
        showErrorMessage(error.toString(), dispatch, forPageType);
      });
  };
};

export const get_trip_deliveries = (trip_id, store_id,id, forPage = null) => {
  let url=`${jwtDefaultConfig.adminBaseUrl}/trip-deliveries-listing/${store_id}/${trip_id}`
  let token=`bearer ${localStorage.getItem("authtoken")}`

  console.log(id);
  if(!helper.isEmptyString(id)){
    url=`${jwtDefaultConfig.clientBaseUrl}/trip-deliveries-listing/${store_id}/${trip_id}`
    token=`bearer ${localStorage.getItem("customerauthtoken")}`
  }
  states.live.loading = true;
  
  return (dispatch) => {
    axios
      .get(url, {
        // headers: {
        //   Authorization: token,
        // },
      })
      .then((res,i) => {
        let response = res.data;
        let message = response.message;
        console.log(response,'tesing',message)
        if (response.code === 200) {
          //showSuccessMessage(message, dispatch, forPage);
          let data = response.data;
          let result = dispatch({
            type: GET_TRIP_DELIVERIES,
            payload: {
              deliveriesList: data,
              message: response.message,
            },
          });

        } else {
          showErrorMessage(message, dispatch, forPage);
          dispatch({
            type: GET_TRIP_DELIVERIES,
            payload: {
              deliveriesList: data,
              message: response.message,
            },
          });
        }
      })
      .catch((error) => {
        console.log(error,'action creator')
        showErrorMessage(error.toString(), dispatch, forPage);
        dispatch({
          type: GET_TRIP_DELIVERIES,
          payload: {
            deliveriesList: [],
            message: 'Unable to process Request',
          },
        });
      });
  };
};

export const get_cancel_reasons = (order, store_id) => {
  states.live.loading = true;
  return (dispatch) => {
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/cancel-reasons/${store_id}`, {
        // headers: {
        //   Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        // },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {
          //showSuccessMessage(message, dispatch);
          let data = response.data;
          let result = dispatch({
            type: GET_CANCEL_REASONS,
            payload: {
              cancelReasonList: data,
              selectedOrder: order,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: GET_CANCEL_REASONS,
            payload: {
              cancelReasonList: data,
              selectedOrder: order,
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
export const get_delivery_slots = (order, store_id) => {
  states.live.loading = true;
  return (dispatch) => {
    axios
      .get(`${jwtDefaultConfig.adminBaseUrl}/delivery-slots/${store_id}`, {
        // headers: {
        //   Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        // },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {
          let data = response.data;
          //showSuccessMessage(message, dispatch);

          let result = dispatch({
            type: GET_DELIVERY_SLOTS,
            payload: {
              deliverySlotList: data,
              selectedOrder: order,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: GET_DELIVERY_SLOTS,
            payload: {
              deliverySlotList: data,
              selectedOrder: order,
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

export const cancel_order = (data, store_id) => {
  states.live.loading = true;
  return (dispatch) => {
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/cancel-orders/${store_id}`, data, {
        // headers: {
        //   Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        // },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {
          showSuccessMessage(message, dispatch);
          let data = response.data;
          dispatch({
            type: CANCEL_ORDER,
            payload: {
              cancelOrderData: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: CANCEL_ORDER,
            payload: {
              cancelOrderData: data,
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

export const update_order_delivery_time = (data, store_id) => {
  states.live.loading = true;
  return (dispatch) => {
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/update-delivery-order/${store_id}`, data, {
        // headers: {
        //   Authorization: `bearer ${localStorage.getItem("authtoken")}`,
        // },
      })
      .then((res) => {
        let response = res.data;
        let message = response.message;
        if (response.code === 200) {
          let data = response.data;
          showSuccessMessage(message, dispatch);
          dispatch({
            type: UPDATE_DELIVERY_TIME,
            payload: {
              updateOrderDeliveryResponse: data,
              message: response.message,
            },
          });
        } else {
          showErrorMessage(message, dispatch);
          dispatch({
            type: UPDATE_DELIVERY_TIME,
            payload: {
              updateOrderDeliveryResponse: data,
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

const showErrorMessage = (message, dispatch, forPage = null) => {
  dispatch({
    type: ERROR_MESSAGE,
    payload: {
      message: message,
      forPage: FOR_LIVE_PAGE_MESSAGES,
      forPage: forPage ? forPage : FOR_LIVE_PAGE_MESSAGES,
    },
  });
};
const showSuccessMessage = (message, dispatch, forPage = null) => {
  dispatch({
    type: SUCCESS_MESSAGE,
    payload: {
      message: message,
      forPage: forPage ? forPage : FOR_LIVE_PAGE_MESSAGES,
    },
  });
};
