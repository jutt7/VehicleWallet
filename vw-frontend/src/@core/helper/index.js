import { toast } from "react-toastify";
import useJwt from "@src/auth/jwt/useJwt";
import "./helper.css";

const helper = {
  toastNotification(message, type) {
    toast(message, {
      type: type === "SUCCESS_MESSAGE" ? "success" : "error",
      autoClose: 5000,
      className:
        type === "SUCCESS_MESSAGE" ? "toastContainerSuccess" : "toastContainer",
    });
  },
  uppercaseFirst(string) {
    let sentence = string.toLowerCase();
    let titleCaseSentence =
      sentence.charAt(0).toUpperCase() + sentence.substring(1, sentence.length);
    return titleCaseSentence;
  },
  getCurrentDate() {
    const currentdate = new Date();
    return `${currentdate.getFullYear()}-${currentdate.getDate()}-${
      currentdate.getMonth() + 1
    }`;
  },
  getDateFrom(days) {
    const currentdate = new Date();
    return new Date(currentdate.setDate(currentdate.getDate() - days));
  },
  formatDateInHashes(date) {
    if (date !== "") {
      const currentdate = new Date(date);
      let month = currentdate.getMonth() + 1;
      let year = currentdate.getFullYear();
      let day = currentdate.getDate();

      if (month < 0) month = "0" + month;

      if (day < 0) day = "0" + day;

      return `${year}-${month}-${day}`;
    } else {
      return "";
    }
  },
  formatDateInSlash(date) {
    if (date === null || date === "" || date === undefined) {
      return "";
    }

    date = new Date(date);
    const currentdate = new Date(date.setDate(date.getDate()));

    const formattedDate = `${
      currentdate.getMonth() + 1
    }/${currentdate.getDate()}/${currentdate.getFullYear()}`;
    return formattedDate;
  },
  formatDate(timestamp, dateformat = "yyyy-MM-ddThh:mm") {
    if (timestamp) {
      const a = new Date(timestamp);
      return a;
    } else {
      const a = new Date();
      return a;
    }
  },
  setDatetimeLocalDate(timestamp) {
    console.log(timestamp, "timestamp");
    if (
      timestamp == null ||
      timestamp == "" ||
      timestamp == "0000-00-00 00:00:00"
    ) {
      return;
    } else {
      return new Date(timestamp).toJSON().slice(0, 19);
    }
  },
  removeTimeFromDate(date) {
    if (date === "" || date === null || date === undefined) {
      return "";
    }

    const currentdate = new Date(date);
    let month = currentdate.getMonth() + 1;
    let day = currentdate.getDate();
    if (month < 10) {
      month = `0${month}`;
    }

    if (day < 10) {
      day = `0${day}`;
    }
    return `${currentdate.getFullYear()}-${month}-${day}`;
  },
  getObjTime(e) {
    if (e !== null) {
      const split = String(e).split(" ");
      if (split[1].length === 8) {
        return split[1];
      } else {
        let hrs = e.getHours();
        let min = e.getMinutes();
        let sec = e.getSeconds();
        if (hrs < 10) hrs = "0" + hrs;
        if (min < 10) min = "0" + min;
        if (sec < 10) sec = "0" + sec;
        return `${hrs}:${min}:${sec}`;
      }
    } else {
      return null;
    }
  },
  stringToJson(string) {
    try {
      return JSON.parse(string);
    } catch (e) {
      return string;
    }
  },
  jsonToString(string) {
    try {
      return JSON.stringify(string);
    } catch (e) {
      return string;
    }
  },
  showArabicText(json) {
    return json.ar ? json.ar : "";
  },
  showEnglishText(json) {
    return json.en ? json.en : "";
  },
  humanReadableDate(timestamp = "") {
    let regExp = /[T]/g;

    if (regExp.test(timestamp)) {
      /* do something if letters are found in your string */
      let splitDateOnTime = timestamp.split("T");
      if (splitDateOnTime.length) {
        let splitHourMin = splitDateOnTime[1].split(":");
        return (
          splitDateOnTime[0] + " " + splitHourMin[0] + ":" + splitHourMin[1]
        );
      } else {
        return splitDateOnTime[0];
      }
    } else {
      /* do something if letters are not found in your string */
      if (timestamp) {
        let date = timestamp.split(":");
        if (date.length) {
          return date[0] + ":" + date[1];
        }
      }
    }

    // console.log(newDate)
    //     if (timestamp) {
    //       let date = timestamp.split(":");
    //       if (date.length) {
    //         return date[0] + ":" + date[1];
    //       }
    //     }
  },
  redirectToLogin(code) {
    if (code === 401) {
      const config = useJwt.jwtConfig;
      localStorage.removeItem(config.storageRefreshTokenKeyName);

      if (window.location.href.indexOf("/admin/") > -1) {
        localStorage.removeItem("userDataAdmin");
        localStorage.removeItem(config.adminTokenKeyName);
        window.location = `${window.location.origin}/vrp/admin/login`;
      } else if (window.location.href.indexOf("/gas-station/") > -1) {
        localStorage.removeItem("userDataGasStation");
        localStorage.removeItem(config.gasStationTokenKeyName);
        window.location = `${window.location.origin}/vrp/gas-station/login`;
      } else if (window.location.href.indexOf("/gas-station-network/") > -1) {
        localStorage.removeItem("userDataGasStationNetwork");
        localStorage.removeItem(config.gasStationNetworkTokenKeyName);
        window.location = `${window.location.origin}/vrp/gas-station/login`;
      } else if (window.location.href.indexOf("/supervisor/") > -1) {
        localStorage.removeItem("userDataSupervisor");
        localStorage.removeItem(config.supervisorTokenKeyName);
        window.location = `${window.location.origin}/vrp/gas-station/login`;
      } else {
        localStorage.removeItem("userDataCustomer");
        localStorage.removeItem(config.customerTokenKeyName);
        window.location = `${window.location.origin}/vrp/client/login`;
      }
      return false;
    }
    return true;
  },
  getIDfromUrl(url) {
    try {
      const id = url.substring(url.lastIndexOf("/") + 1);
      return parseInt(id);
    } catch (e) {
      return false;
    }
  },
  applyCountID(data) {
    if (data !== "" && data !== undefined && data !== null) {
      for (let i = 0; i < data.length; i++) {
        data[i].count_id = i;
      }
    }
    return data;
  },
  checkNullPrice(data) {
    let newData = [];
    if (data !== "" && data !== undefined && data !== null) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].monthly_sub_fee && data[i].registration_fee) {
          newData[i] = data[i];
        }
      }
    }
    return newData;
  },
  applyRowClass(arg, type) {
    if (type) {
      return arg && arg.id % 2 == 0 ? true : false;
    } else {
      return arg && arg.count_id % 2 == 0 ? true : false;
    }
  },
  isEmail(value) {
    if (!value) {
      return false;
    } else {
      if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        return false;
      } else {
        return true;
      }
    }
  },
  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  cleanString(value) {
    // return value.replace(/[|&;$%@"./<>()-={}*`~+,]/g, "");
    return value.replace(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, "");
    // return value.replace(!@#$%^&*()+=-[]\\\';,./{}|\":<>?, "");
    // const filter = value.replace(
    //   /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
    //   ""
    // );
    // if (type === "plate_no") {
    //   if (filter.length > 9) {
    //     return filter.substr(0, 7);
    //   }
    // } else {
    //   return value.replace(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, "");
    // }
  },
  cleanDecimal(value) {
    const pos = value.indexOf(".");
    let result;
    if (pos !== -1) {
      const part1 = value.substr(0, pos);
      const part2 = value.substr(pos + 1);

      result = `${this.cleanDeciamalRegex(part1)}.${this.cleanDeciamalRegex(
        part2
      )}`;
    } else {
      result = this.cleanDeciamalRegex(value);
    }
    return result;
  },
  cleanDeciamalRegex(string) {
    return string.replace(/[^0-9]/g, "");
  },
  cleanInteger(string, type = "") {
    const filter = string.replace(/\D/g, "");
    if (type === "mobile") {
      if (filter.length > 9) {
        return filter.substr(0, 9);
      }
      return filter;
    } else if (type === "civil_id") {
      if (filter.length > 12) {
        return filter.substr(0, 12);
      }
      return filter;
    } else if (type === "driving_license_number") {
      if (filter.length > 15) {
        return filter.substr(0, 15);
      }
      return filter;
    } else if (type === "driver_pin") {
      if (filter.length > 4) {
        return filter.substr(0, 4);
      }

      return filter;
    } else if (type === "vat_no") {
      if (filter.length > 15) {
        return filter.substr(0, 15);
      }

      return filter;
    } else if (type === "cr_number") {
      if (filter.length > 12) {
        return filter.substr(0, 12);
      }

      return filter;
    } else {
      console.log(filter, "filter");
      return filter;
    }
  },
  addSecondsInDate(newDate, sec) {
    const date = new Date(newDate);
    return date.setSeconds(date.getSeconds() + sec);
  },
  addHourInCurrentDate(hour) {
    var dt = new Date();
    return dt.setHours(dt.getHours() + hour);
  },
  formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;
    return strTime;
  },
  shortTextWithDots(text, character) {
    const string = text.substring(0, character);
    return text.length > character ? `${string} ...` : string;
  },
  FirstWordFirstChar(text) {
    if (text === null || text === "" || text === undefined) {
      return "";
    }
    const string = text.split(" ");
    return string[0].charAt(0).toUpperCase();
  },
  SecondWordFirstChar(text) {
    if (text === null || text === "" || text === undefined) {
      return "";
    }
    const string = text.split(" ");
    if (typeof string[1] !== "undefined") {
      return string[1].charAt(0).toUpperCase();
    } else {
      return "";
    }
  },
  isObject(value) {
    if (value === null || value === undefined || value === "") {
      return false;
    } else if (Object.keys(value).length !== 0) {
      return true;
    } else {
      return false;
    }
  },
  isArray(data) {
    try {
      if (data.length) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },
  isEmptyString(str) {
    if (str === "" || str === undefined || str === null) {
      return true;
    }
    return false;
  },
  isSpecialCharacters(str) {
    let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(str)) {
      return true;
    } else {
      return false;
    }
  },
  isEmptyArrayReplaceWithNull(str) {
    if (str.length === 0) {
      return null;
    }
    return str;
  },
  isEmptyReplaceWithArray(str) {
    if (str.length === 0) {
      return [];
    }
    return str;
  },
  timeDifference(time1, time2) {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    const diff = date2.getTime() - date1.getTime();
    let msec = diff;
    const hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    const mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    const ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    return `${hh}:${mm}:${ss}`;
  },
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const Lat1 = this.toRad(lat1);
    const Lat2 = this.toRad(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(Lat1) * Math.cos(Lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  },
  toRad(Value) {
    return (Value * Math.PI) / 180;
  },
  isTrueReplaceWith1(str) {
    if (str === true) {
      return 1;
    } else {
      return 0;
    }
  },
  isEmptyReplaceWithNull(val) {
    if (val === "" || val === undefined || val === null) {
      return null;
    }
    return val;
  },
  getStoreID() {
    // if (localStorage.getItem("authtoken")) {
    //     const jwtString = jwt.decode(localStorage.getItem("authtoken"))
    //     return jwtString.store_id
    // }
    // return '',
    return 1000;
  },
  toTimestamp(strDate) {
    const datum = Date.parse(strDate);
    return datum / 1000;
  },
  timeInHrsMins(mins) {
    var hours = mins / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    if (rhours == 0) {
      return rminutes + "Min";
    } else if (rminutes == 0) {
      return rhours + "Hr ";
    } else {
      return rhours + "Hr " + rminutes + "Min";
    }
  },
  findTimeDiference(strDate) {
    let datum;
    if (strDate === "" || strDate === undefined || strDate === null) {
      datum = new Date().getTime();
    } else {
      datum = Date.parse(strDate);
    }

    const seconds = new Date().getTime() / 1000;
    const timestamp = datum / 1000;

    let ago = parseInt(seconds - timestamp);
    if (ago > 59) {
      ago = parseInt(ago / 60);

      if (ago > 59) {
        ago = parseInt(ago / 60);

        if (ago > 23) {
          ago = parseInt(ago / 24);

          if (ago > 1) {
            ago += " days ago";
          } else {
            ago += " day ago";
          }
        } else {
          if (ago > 1) {
            ago += " hours ago";
          } else {
            ago += " hour ago";
          }
        }
      } else {
        if (ago > 1) {
          ago += " minutes ago";
        } else {
          ago += " minute ago";
        }
      }
    } else {
      if (ago > 1) {
        ago += " seconds ago";
      } else {
        ago += " second ago";
      }
    }

    return ago;
  },
  checkinteger(integer) {
    if (isNaN(integer)) {
      return integer;
    } else {
      return parseInt(integer);
    }
  },
  checkRole(role, user_roles) {
    if (user_roles) {
      if (
        user_roles !== null &&
        user_roles !== undefined &&
        user_roles.length === 0
      ) {
        return true;
      }

      if (
        user_roles !== null &&
        user_roles !== undefined &&
        user_roles.indexOf(role) > -1
      ) {
        return true;
      }
    }

    return false;
  },
  checkGroup(group, user_group) {
    if (user_group) {
      if (
        user_group !== null &&
        user_group !== undefined &&
        user_group === group
      ) {
        return true;
      }
    }

    return false;
  },
  isPathOms(pathname) {
    if (pathname && pathname.length) {
      if (pathname.indexOf("oms") > -1) {
        return true;
      }
    }

    return false;
  },
  isCancelableOrder(id) {
    // placed = 5,waiting for approval = 15,
    if (id === 5 || id === 15) {
      return true;
    }
    return false;
  },
  isPlanningOrder(id) {
    // waiting for approval = 15, approved = 17
    if (id === 15 || id === 17 || id === 16) {
      return true;
    }
    return false;
  },
  isPlacedOrder(id) {
    if (id === 5) {
      return true;
    }
    return false;
  },
  redirectToCustomerLogin(code) {
    if (code === 401) {
      const config = useJwt.jwtConfig;
      localStorage.removeItem("userDataCustomer");
      localStorage.removeItem(config.customerTokenKeyName);
      localStorage.removeItem(config.storageRefreshTokenKeyName);

      window.location = `${window.location.origin}/vrp/client/login`;
      return false;
    }
    return true;
  },
  getStatusName(status) {
    let title = "";
    if (status == "request_pending") {
      title = "Refuel Request";
    } else if (status == "request_approved") {
      title = "Approved";
    } else if (status == "transaction_initiated") {
      title = "Scan Number Plate";
    } else if (status == "transaction_held") {
      title = "Refueling";
    } else if (status == "transaction_completed") {
      title = "Request Completed";
    } else if (status == "transaction_pending_with_client") {
      title = "Request Pending With Client";
    } else if (status == "transaction_pending_with_vw") {
      title = "Request Pending With Vehicle Wallet";
    } else if (status == "number_plate_scan") {
      title = "Number Plate Scan";
    } else if (status == "refueling") {
      title = "Refueling";
    }
    return title;
  },
};

export default helper;
