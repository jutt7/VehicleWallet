// ** Auth Endpoints

import {
  adminBaseUrl,
  clientBaseUrl,
  baseImgUrl,
} from "../../../constants/env";

export default {
  adminBaseUrl: adminBaseUrl,
  clientBaseUrl: clientBaseUrl,
  baseImgUrl: baseImgUrl,
  loginEndpoint: "/jwt/login",
  registerEndpoint: "/jwt/register",
  refreshEndpoint: "/jwt/refresh-token",
  logoutEndpoint: "/jwt/logout",
  CURRENT_ENVIREMENT: "development",
  tokenType: "bearer",
  customerTokenKeyName: "customerAccessToken",
  adminTokenKeyName: "adminAccessToken",
  supervisorTokenKeyName: "supervisorAccessToken",
  gasStationTokenKeyName: "gasStationTokenKeyName",
  storageRefreshTokenKeyName: "refreshToken",
};
