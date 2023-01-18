import axios from "axios";
import jwtDefaultConfig from "./jwtDefaultConfig";

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig };

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false;

  // ** For Refreshing Token
  subscribers = [];

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };

    // ** Request Interceptor
    axios.interceptors.request.use(
      (config) => {
        // ** Get token from localStorage
        const accessToken = this.getToken();

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // ** const { config, response: { status } } = error
        const { config, response } = error;
        const originalRequest = config;

        // ** if (status === 401) {
        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true;
            this.refreshToken().then((r) => {
              this.isAlreadyFetchingAccessToken = false;
              console.log(response, "response");
              // ** Update accessToken in localStorage
              this.setToken(r.data.accessToken);
              this.setRefreshToken(r.data.refreshToken);

              this.onAccessTokenFetched(r.data.accessToken);
            });
          }
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken) => {
              // ** Make sure to assign accessToken according to your response.
              // ** Check: https://pixinvent.ticksy.com/ticket/2413870
              // ** Change Authorization header
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
              resolve(this.axios(originalRequest));
            });
          });
          return retryOriginalRequest;
        }
        return Promise.reject(error);
      }
    );
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  getToken() {
    if (window.location.href.indexOf("/admin/") > -1) {
      return localStorage.getItem(this.jwtConfig.adminTokenKeyName);
    } else if (window.location.href.indexOf("/admin") > -1) {
      return localStorage.getItem(this.jwtConfig.adminTokenKeyName);
    } else if (window.location.href.indexOf("/gas-station/") > -1) {
      return localStorage.getItem(this.jwtConfig.gasStationTokenKeyName);
    } else if (window.location.href.indexOf("/gas-station") > -1) {
      return localStorage.getItem(this.jwtConfig.gasStationTokenKeyName);
    } else if (window.location.href.indexOf("/supervisor/") > -1) {
      return localStorage.getItem(this.jwtConfig.supervisorTokenKeyName);
    } else {
      return localStorage.getItem(this.jwtConfig.customerTokenKeyName);
    }
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  setToken(value) {
    console.warn("set token called");
    if (window.location.href.indexOf("/admin/") > -1) {
      localStorage.setItem(this.jwtConfig.adminTokenKeyName, value);
    } else if (window.location.href.indexOf("/admin") > -1) {
      return localStorage.setItem(this.jwtConfig.adminTokenKeyName);
    } else if (window.location.href.indexOf("/gas-station/") > -1) {
      return localStorage.setItem(this.jwtConfig.gasStationTokenKeyName, value);
    } else if (window.location.href.indexOf("/gas-station") > -1) {
      return localStorage.setItem(this.jwtConfig.gasStationTokenKeyName, value);
    } else if (window.location.href.indexOf("/supervisor/") > -1) {
      return localStorage.setItem(this.jwtConfig.supervisorTokenKeyName, value);
    } else {
      localStorage.setItem(this.jwtConfig.customerTokenKeyName, value);
    }
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value);
  }

  login(...args) {
    // console.log(this.jwtConfig.loginEndpoint, 'endpoint')

    console.log(args[1], "...args login");
    let url = "";
    if (args[1] == "admin") {
      url = `${this.jwtConfig.adminBaseUrl}/admin-login`;
    } else if (args[1] == "client") {
      url = `${this.jwtConfig.adminBaseUrl}/client-login`;
    } else if (args[1] == "gas_station") {
      url = `${this.jwtConfig.adminBaseUrl}/gas_station-login`;
    } else if (args[1] == "supervisor") {
      url = `${this.jwtConfig.adminBaseUrl}/supervisor-login`;
    }

    // }

    //const url = this.jwtConfig.loginEndpoint

    const credentials = { ...args };
    let postBody = "";
    if (window.location.href.indexOf("/supervisor/") > -1) {
      postBody = {
        staff: credentials[0],
      };
    } else if (
      window.location.href.indexOf("/gas-station/") > -1 &&
      args[1] == "supervisor"
    ) {
      postBody = {
        staff: credentials[0],
      };
    } else {
      postBody = {
        user: credentials[0],
      };
    }
    return axios.post(url, postBody);
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args);
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    });
  }
}
