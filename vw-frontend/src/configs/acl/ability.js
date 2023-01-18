import { Ability } from "@casl/ability";
import { initialAbility } from "./initialAbility";

//  Read ability from localStorage
// * Handles auto fetching previous abilities if already logged in user
// ? You can update this if you store user abilities to more secure place
// ! Anyone can update localStorage so be careful and please update this

const userData = () => {
  if (window.location.href.indexOf("/admin/") > -1) {
    return JSON.parse(localStorage.getItem("userDataAdmin"));
  } else if (window.location.href.indexOf("/admin") > -1) {
    return JSON.parse(localStorage.getItem("userDataAdmin"));
  } else if (window.location.href.indexOf("/gas-station/") > -1) {
    return JSON.parse(localStorage.getItem("userDataGasStation"));
  } else if (window.location.href.indexOf("/gas-station") > -1) {
    return JSON.parse(localStorage.getItem("userDataGasStation"));
  } else if (window.location.href.indexOf("/supervisor/") > -1) {
    return JSON.parse(localStorage.getItem("userDataSupervisor"));
  } else {
    return JSON.parse(localStorage.getItem("userDataCustomer"));
  }
};
const checkUser = userData();
const existingAbility =
  checkUser !== null &&
  checkUser !== undefined &&
  checkUser !== "" &&
  checkUser.ability
    ? checkUser.ability
    : null;

console.log(existingAbility, "existingAbility");

export default new Ability(existingAbility || initialAbility);
