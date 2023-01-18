import {
  GET_DEFAULT,
  GET_TOWER,
  GET_USER_COMPANIES,
  LOGIN,
  LOGOUT,
  CHANGE_PASSWORD,
  CUSTOMER_CHANGE_PASSWORD,
  CUSTOMER_LOGIN,
  CUSTOMER_LOGOUT
} from "../actionTypes";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  logggedIn: false,
  logggedOut: false,
  token: null,
  companiesList: [],
  addresses: [],
  customerWarehouses: [],
  message: null,
  flagCounter: null,
  codeofdata:0,
  customerLoggedIn: false,
  customerLoggedOut: false,
};
const reducers = (state = initialState, action) => {
  if (action.type === GET_USER_COMPANIES) {
    let loginData = { ...state };
    loginData.companiesList = action.payload.companiesList;
    return { ...loginData };
  }
  if (action.type === LOGIN) {
    let loginData = { ...state };
    loginData.logggedIn = action.payload.loginStatus;
    loginData.token = action.payload.token;
    loginData.message = action.payload.message;
    loginData.flagCounter = action.payload.flagCounter
    return { ...loginData };
  }
  if (action.type === LOGOUT || action.type === CHANGE_PASSWORD) {
    let loginData = { ...state };
    loginData.logggedIn = action.payload.loginStatus;
    loginData.message = action.payload.message;
    loginData.codeofdata = action.payload.code;
    return { ...loginData };
  }
  if (action.type === HYDRATE) {
    return { ...state, ...action.payload.authReducer };
  }
  if (action.type === CUSTOMER_LOGIN) {
    let loginData = { ...state };
    loginData.customerLoggedIn = action.payload.loginStatus;
    loginData.token = action.payload.token;
    loginData.message = action.payload.message;
    loginData.flagCounter = action.payload.flagCounter;
    loginData.addresses = action.payload.addresses;
    loginData.customerWarehouses = action.payload.customerWarehouses;
    return { ...loginData };
  }
  if (action.type === CUSTOMER_LOGOUT || action.type === CUSTOMER_CHANGE_PASSWORD) {
    let loginData = { ...state };
    loginData.customerLoggedIn = action.payload.loginStatus;
    loginData.message = action.payload.message;
    loginData.codeofdata = action.payload.code;
    return { ...loginData };
  }
  return state;
};
export default reducers;
