import { GET_DEFAULT, SELECT_BRANCH } from "../actionTypes";

const initialState = {
  warehouses: [],
  defaultCenter: {lat:24.534964,lng:46.886205},
  selectedBranch: 1000,
  realTimeNotificationData: null
};
const reducers = (state = initialState, action) => {
  if (action.type === GET_DEFAULT) {
    let navState = { ...state };
    navState.warehouses = action.result;
    navState.loadding = false;
    return navState;
  }
  if (action.type === SELECT_BRANCH) {
    let navState = { ...state };
    navState.defaultCenter = action.payload.defaultCenter;
    navState.selectedBranch = action.payload.selectedBranchId;
    navState.loadding = false;
    return navState;
  }

  return state;
}
export default reducers;
