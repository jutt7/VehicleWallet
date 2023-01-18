module.exports = {
  // adminBaseUrl: "http://192.168.18.26:8000/api",
  // adminBaseUrl: "https://vw.innovotechnologies.com/vw-backend/public/api",
  // clientBaseUrl: "https://vw.innovotechnologies.com/vw-backend/public/api",
  // clientBaseUrl: "http://192.168.18.26:8000/api",
  adminBaseUrl: "https://vw.vehiclewallet.sa/vw-api/public/api",
  clientBaseUrl: "https://vw.vehiclewallet.sa/vw-api/public/api",

  baseImgUrl:
    "https://aqg.innovotechnologies.com/Fleet-Management-Laravel/public",
  loginEndpoint: "/jwt/login",
  registerEndpoint: "/jwt/register",
  refreshEndpoint: "/jwt/refresh-token",
  logoutEndpoint: "/jwt/logout",
  CURRENT_ENVIREMENT: "development",
  tokenType: "bearer",
  customerTokenKeyName: "customerAccessToken",
  adminTokenKeyName: "adminAccessToken",
  storageRefreshTokenKeyName: "refreshToken",
};
