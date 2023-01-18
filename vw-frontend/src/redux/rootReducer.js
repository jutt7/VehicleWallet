// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import todo from '@src/views/apps/todo/store'
import chat from '@src/views/apps/chat/store'
import users from '@src/views/apps/user/store'
import email from '@src/views/apps/email/store'
import invoice from '@src/views/apps/invoice/store'
import calendar from '@src/views/apps/calendar/store'
import ecommerce from '@src/views/apps/ecommerce/store'
import dataTables from '@src/views/tables/data-tables/store'
import permissions from '@src/views/apps/roles-permissions/store'
import liveReducer from "../store/reducer/liveReducers";
import controltowerReducer from "../store/reducer/controltowerReducer";
import routesPlanReducer from "../store/reducer/routesandPlanReducer";
import navBarReducer from "../store/reducer/navbarReducer";
import authorizationReducer from "../store/reducer/authorizationReducer";
import triplistReducer from "../store/reducer/TriplistReducer"
import Navmenu from "../store/reducer/Navmenu";

const rootReducer = {
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
}

export default rootReducer
