import useJwt from "@src/@core/auth/jwt/useJwt";

/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
// eslint-disable-next-line arrow-body-style
export const isUserLoggedIn = () => {
  console.warn(
    "inside is user gas station",
    localStorage.getItem("userDataGasStationNetwork")
  );
  if (window.location.href.indexOf("/admin/") > -1) {
    return (
      localStorage.getItem("userDataAdmin") &&
      localStorage.getItem(useJwt.jwtConfig.adminTokenKeyName)
    );
  } else if (window.location.href.indexOf("/gas-station/") > -1) {
    console.warn("inside gas station user");
    return (
      localStorage.getItem("userDataGasStation") &&
      localStorage.getItem(useJwt.jwtConfig.gasStationTokenKeyName)
    );
  } else if (window.location.href.indexOf("/supervisor/") > -1) {
    return (
      localStorage.getItem("userDataSupervisor") &&
      localStorage.getItem(useJwt.jwtConfig.supervisorTokenKeyName)
    );
  } else {
    return (
      localStorage.getItem("userDataCustomer") &&
      localStorage.getItem(useJwt.jwtConfig.customerTokenKeyName)
    );
  }
};

export const getUserData = () => {
  console.warn("inside gas station user");
  if (window.location.href.indexOf("/admin/") > -1) {
    return JSON.parse(localStorage.getItem("userDataAdmin"));
  } else if (window.location.href.indexOf("/gas-station/") > -1) {
    return JSON.parse(localStorage.getItem("userDataGasStation"));
  } else if (window.location.href.indexOf("/supervisor/") > -1) {
    return JSON.parse(localStorage.getItem("userDataSupervisor"));
  } else {
    return JSON.parse(localStorage.getItem("userDataCustomer"));
  }
};
/**
 * This function is used for demo purpose route navigation
 * In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 * Please note role field is just for showing purpose it's not used by anything in frontend
 * We are checking role just for ease
 * NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  console.warn("inside gas station role", userRole);
  if (userRole === "admin") return { name: "/vrp/admin/dashboard" };
  if (userRole === "client") return { name: "/vrp/dashboard" };
  if (userRole === "gas station") return { name: "/vrp/gas-station/dashboard" };
  if (userRole === "supervisor")
    return { name: "/vrp/supervisor/held-transactions" };
  return { name: "auth-login" };
};
