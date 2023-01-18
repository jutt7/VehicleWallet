import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import liveReducer from "./reducer/liveReducers";
import controltowerReducer from "./reducer/controltowerReducer";
import routesPlanReducer from "./reducer/routesandPlanReducer";
import navBarReducer from "./reducer/navbarReducer";
import authorizationReducer from "./reducer/authorizationReducer";
import toastReducer from "./reducer/toastReducer";
import mapReducer from "./reducer/mapReducer";
import monitoringMapData from "./reducer/monitoringMapData";
import triplistReducer from "./reducer/TriplistReducer"
import Navmenu from "./reducer/Navmenu";
import navbar from '../redux/navbar'
import layout from '../redux/layout'
import auth from '../redux/authentication'
import todo from '@src/views/apps/todo/store'
import chat from '@src/views/apps/chat/store'
import users from '@src/views/apps/user/store'
import email from '@src/views/apps/email/store'
import invoice from '@src/views/apps/invoice/store'
import calendar from '@src/views/apps/calendar/store'
import ecommerce from '@src/views/apps/ecommerce/store'
import dataTables from '@src/views/tables/data-tables/store'
import permissions from '@src/views/apps/roles-permissions/store'

const logger = (store) => {
  return (next) => {
    return (action) => {
      const result = next(action);
      console.log("CHECK ACTION RESULT", result);
      return result;
    };
  };
};
const composeEnhancers =
  (typeof window != "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
const combinedReducer = combineReducers({
  auth,
  todo,
  chat,
  email,
  users,
  navbar,
  layout,
  invoice,
  calendar,
  ecommerce,
  dataTables,
  permissions,
  live: liveReducer,
  controltower: controltowerReducer,
  navBar: navBarReducer,
  routesplan: routesPlanReducer,
  authorization: authorizationReducer,
  triplist: triplistReducer,
  NavMenu:Navmenu,
  toastmessages: toastReducer,
  map: mapReducer,
  monitoringMapData:monitoringMapData,
});

const store = createStore(
  combinedReducer,
  composeEnhancers(applyMiddleware(logger, thunkMiddleware))
);

export default store;
