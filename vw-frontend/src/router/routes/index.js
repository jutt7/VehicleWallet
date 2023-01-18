// ** Routes Imports
import PagesRoutes from "./Pages";
import Customer from "./Customer";
import Admin from "./Admin";
import Charts from "./Charts";
import GasStation from "./GasStation";
import Supervisor from "./Supervisor";

// ** Document title
const TemplateTitle = "%s - Vehicle Wallet";

// ** Default Route

const getDefaultRoute = () => {
  // console.warn("inside default route");
  if (window.location.href.indexOf("/admin/") > -1)
    return "/vrp/admin/dashboard";
  else if (window.location.href.indexOf("/admin") > -1)
    return "/vrp/admin/dashboard";
  else if (window.location.href.indexOf("/vrp/gas-station/") > -1) {
    let data = JSON.parse(localStorage.getItem("userDataGasStation"));
    if (data && data.role == "gas station") {
      return "/vrp/gas-station/dashboard";
    } else if (data && data.role == "gas station network") {
      return "/vrp/gas-station/dashboard";

      // return "/vrp/gas-station/network-dashboard";
    } else {
      return "/vrp/supervisor/dashboard";
    }
  } else if (window.location.href.indexOf("/gas-station") > -1) {
    let data = JSON.parse(localStorage.getItem("userDataGasStation"));
    if (data && data.role == "gas station") {
      return "/vrp/gas-station/dashboard";
    } else if (data && data.role == "gas station network") {
      return "/vrp/gas-station/dashboard";

      // return "/vrp/gas-station/network-dashboard";
    } else {
      return "/vrp/supervisor/dashboard";
    }
  } else if (window.location.href.indexOf("/supervisor/") > -1)
    return "/vrp/supervisor/dashboard";
  else return "/vrp/dashboard";
};
const DefaultRoute = getDefaultRoute();

// ** Merge Routes
const Routes = [
  ...PagesRoutes,
  ...Customer,
  ...Admin,
  ...Charts,
  ...GasStation,
  ...Supervisor,
];

export { DefaultRoute, TemplateTitle, Routes };
