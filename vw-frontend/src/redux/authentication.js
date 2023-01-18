// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

// ** UseJWT import to get config
import useJwt from "@src/auth/jwt/useJwt";

const config = useJwt.jwtConfig;

const initialUser = () => {
  if (window.location.href.indexOf("/admin/") > -1) {
    const item = window.localStorage.getItem("userDataAdmin");
    return item ? JSON.parse(item) : {};
  } else if (window.location.href.indexOf("/admin") > -1) {
    const item = window.localStorage.getItem("userDataAdmin");
    return item ? JSON.parse(item) : {};
  } else if (window.location.href.indexOf("/gas-station/") > -1) {
    const item = window.localStorage.getItem("userDataGasStation");
    return item ? JSON.parse(item) : {};
  } else if (window.location.href.indexOf("/gas-station") > -1) {
    const item = window.localStorage.getItem("userDataGasStation");
    return item ? JSON.parse(item) : {};
  } else if (window.location.href.indexOf("/gas-station-network/") > -1) {
    const item = window.localStorage.getItem("userDataGasStationNetwork");
    return item ? JSON.parse(item) : {};
  } else if (window.location.href.indexOf("/gas-station-network") > -1) {
    const item = window.localStorage.getItem("userDataGasStationNetwork");
    return item ? JSON.parse(item) : {};
  } else if (window.location.href.indexOf("/supervisor/") > -1) {
    const item = window.localStorage.getItem("userDataSupervisor");
    return item ? JSON.parse(item) : {};
  } else {
    const item = window.localStorage.getItem("userDataCustomer");
    return item ? JSON.parse(item) : {};
  }
  // const item = (window.location.href.indexOf("/admin/") > -1) ? window.localStorage.getItem('userDataAdmin') : window.localStorage.getItem('userDataCustomer')
  // //** Parse stored json or if none return initialValue
  // return item ? JSON.parse(item) : {}
};

export const authSlice = createSlice({
  name: "authentication",
  initialState: {
    userData: initialUser(),
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload;
      if (action.payload.role === "admin") {
        state[config.adminTokenKeyName] =
          action.payload[config.adminTokenKeyName];
        localStorage.setItem(
          config.adminTokenKeyName,
          action.payload.accessToken
        );
        localStorage.setItem("userDataAdmin", JSON.stringify(action.payload));
      } else if (
        action.payload.role === "gas station" ||
        action.payload.role === "gas station network"
      ) {
        state[config.gasStationTokenKeyName] =
          action.payload[config.gasStationTokenKeyName];
        localStorage.setItem(
          config.gasStationTokenKeyName,
          action.payload.accessToken
        );
        localStorage.setItem(
          "userDataGasStation",
          JSON.stringify(action.payload)
        );
      } else if (action.payload.role === "supervisor") {
        console.log(action.payload, "action.payload");
        state[config.supervisorTokenKeyName] =
          action.payload[config.supervisorTokenKeyName];
        localStorage.setItem(
          config.supervisorTokenKeyName,
          action.payload.accessToken
        );
        localStorage.setItem(
          "userDataSupervisor",
          JSON.stringify(action.payload)
        );
      } else {
        state[config.customerTokenKeyName] =
          action.payload[config.customerTokenKeyName];
        localStorage.setItem(
          config.customerTokenKeyName,
          action.payload.accessToken
        );
        localStorage.setItem(
          "userDataCustomer",
          JSON.stringify(action.payload)
        );
      }
      state[config.storageRefreshTokenKeyName] =
        action.payload[config.storageRefreshTokenKeyName];
      localStorage.setItem(
        config.storageRefreshTokenKeyName,
        JSON.stringify(action.payload.refreshToken)
      );
    },
    handleLogout: (state) => {
      state.userData = {};
      if (window.location.href.indexOf("/admin/") > -1) {
        state[config.adminTokenKeyName] = null;
        localStorage.removeItem(config.adminTokenKeyName);
        localStorage.removeItem("userDataAdmin");
        localStorage.removeItem("mapKey");
        localStorage.removeItem("map_key");
      } else if (window.location.href.indexOf("/gas-station/") > -1) {
        state[config.gasStationTokenKeyName] = null;
        localStorage.removeItem(config.gasStationTokenKeyName);
        localStorage.removeItem("userDataGasStation");
      } else if (window.location.href.indexOf("/supervisor/") > -1) {
        state[config.supervisorTokenKeyName] = null;
        localStorage.removeItem(config.supervisorTokenKeyName);
        localStorage.removeItem("userDataSupervisor");
      } else {
        state[config.customerTokenKeyName] = null;
        localStorage.removeItem(config.customerTokenKeyName);
        localStorage.removeItem("userDataCustomer");
      }

      // ** Remove user, accessToken & refreshToken from localStorage
      state[config.storageRefreshTokenKeyName] = null;
      localStorage.removeItem(config.storageRefreshTokenKeyName);
    },
    handleLogout1: (state) => {
      state.userData = {};

      state[config.adminTokenKeyName] = null;
      localStorage.removeItem(config.adminTokenKeyName);
      localStorage.removeItem("userDataAdmin");
      localStorage.removeItem("mapKey");
      localStorage.removeItem("map_key");

      state[config.gasStationTokenKeyName] = null;
      localStorage.removeItem(config.gasStationTokenKeyName);
      localStorage.removeItem("userDataGasStation");

      state[config.supervisorTokenKeyName] = null;
      localStorage.removeItem(config.supervisorTokenKeyName);
      localStorage.removeItem("userDataSupervisor");

      state[config.customerTokenKeyName] = null;
      localStorage.removeItem(config.customerTokenKeyName);
      localStorage.removeItem("userDataCustomer");

      // ** Remove user, accessToken & refreshToken from localStorage
      state[config.storageRefreshTokenKeyName] = null;
      localStorage.removeItem(config.storageRefreshTokenKeyName);
    },
  },
});

export const { handleLogin, handleLogout, handleLogout1 } = authSlice.actions;

export default authSlice.reducer;
