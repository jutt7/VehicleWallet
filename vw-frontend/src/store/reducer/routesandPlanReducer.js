import {
  GET_ROUTES_PLAN,
  GET_ROUTES_CAPACITY,
  GET_AVAILABLE_VEHICLES,
  GET_AVAILABLE_USERS,
  CREATE_TRIP,
  CREATE_STATIC_TRIP,
  ADD_DELIVERY,
  REMOVE_DELIVERY,
  CLEAR_ROUTES_PLAN,
  UPDATE_DELIVERY,
  DELETE_DELIVERY,
  GET_DYNAMIC_CONSTRAINTS,
  CREATE_DYNAMIC_TRIP,
} from "../actionTypes";

const initialState = {
  routesPlan: [],
  orders: [],
  routeOrders: [],
  summaryStats: null,
  constraints: null,
  routesPlanLoaded: false,
  vehicleList: [],
  message: null,
  code: null,
  tripCode: null,
  staticTripData: null,
  dynamicTripData: null,
  customTripData: null,
  routesAndPlanData: null,
  foravailableDeliveries: null,
  flag: false,
  modal: {},
  msg: null,
  code: null
};

const reducers = (state = initialState, action) => {
  if (action.type === GET_ROUTES_CAPACITY) {
    let currState = { ...state };
    if (typeof action.payload.routesAndPlanData !== "undefined") {
      currState.routesAndPlanData = action.payload.routesAndPlanData;
    } else {
      currState.foravailableDeliveries = action.payload.foravailabledeliveries;
    }
    currState.message = action.payload.message;
    return currState;
  }
  if (action.type === GET_AVAILABLE_VEHICLES) {
    let currState = { ...state };
    currState.vehicleList = action.payload.vehicleList;
    //currState.message = action.payload.message;
    return currState;
  }

  if (action.type === GET_AVAILABLE_USERS) {
    let currState = { ...state };
    currState.users = action.payload.users;
    //currState.message = action.payload.message;
    return currState;
  }

  if (action.type === CREATE_TRIP) {
    let currState = { ...state };
    currState.message = action.payload.message;
    currState.customTripData = action.payload.customTripData;
    currState.code = action.payload.code;
    currState.tripCode = action.payload.tripCode;
    return currState;
  }
  if (action.type === CREATE_STATIC_TRIP) {
    let currState = { ...state };
    currState.message = action.payload.message;
    currState.staticTripData = action.payload.staticTripData;
    currState.tripCode = action.payload.statictripData.trip_code;
    return currState;
  }
  if (action.type === CREATE_DYNAMIC_TRIP) {
    let currState = { ...state };
    currState.message = action.payload.message;
    currState.code = action.payload.code
    currState.dynamicTripData = action.payload.dynamicTripData;
    currState.tripCode = action.payload.dynamicTripData.trip_code;
    currState.flag = action.payload.dynamicTripData.trip_code;
    if (action.payload.flag) {
      currState.modal = { show: true };
    }
    currState.msg = action.payload.message

    return currState;
  }
  if (action.type === ADD_DELIVERY) {
    currState.message = action.payload.message;
    return currState;
  }
  if (action.type === REMOVE_DELIVERY) {
    let currState = { ...state };
    currState.message = action.payload.message;
    return currState;
  }
  if (action.type === CLEAR_ROUTES_PLAN) {
    let currState = { ...state };
    currState.routesAndPlanData = null;
    currState.message = null;
    return currState;
  }
  if (action.type === UPDATE_DELIVERY) {
    let currState = { ...state };
    currState.message = action.payload.message;
    return currState;
  }
  if (action.type === DELETE_DELIVERY) {
    let currState = { ...state };
    currState.message = action.payload.message;
    return currState;
  }
  if (action.type === GET_DYNAMIC_CONSTRAINTS) {
    let currState = { ...state };
    currState.message = action.payload.message;
    currState.constraints = action.payload.constraints;
    return currState;
  }
  return state;
};
export default reducers;