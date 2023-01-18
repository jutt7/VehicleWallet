// ** React Imports
import { useContext, Fragment, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import helper from "@src/@core/helper";
// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import useJwt from "@src/auth/jwt/useJwt";
import { fireBaseToken } from "../../../firebaseNotifications/Firebase";

// ** Third Party Components
import { useDispatch } from "react-redux";
import { toast, Slide } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import {
  Facebook,
  Twitter,
  Mail,
  GitHub,
  HelpCircle,
  Coffee,
} from "react-feather";

// ** Actions
import { handleLogin } from "@store/authentication";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";

// ** Custom Components
import Avatar from "@components/avatar";
import InputPasswordToggle from "@components/input-password-toggle";

// ** Utils
import { getHomeRouteForLoggedInUser } from "@utils";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Alert,
  Button,
  CardText,
  CardTitle,
  UncontrolledTooltip,
  Spinner,
} from "reactstrap";

import { ClipLoader } from "react-spinners";
import themeConfig from "@configs/themeConfig";

// ** Styles
import "@styles/react/pages/page-authentication.scss";

const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className="toastify-header">
      <div className="title-wrapper">
        <Avatar size="sm" color="success" icon={<Coffee size={12} />} />
        <h6 className="toast-title fw-bold">Welcome, {name}</h6>
      </div>
    </div>
    <div className="toastify-body">
      <span>
        You have successfully logged in as an {role} user to Vehicle Wallet. Now
        you can start to explore. Enjoy!
      </span>
    </div>
  </Fragment>
);

const defaultValues = {
  password: "",
  loginEmail: "",
};

const Login = () => {
  const [check, setCheck] = useState(false);

  // ** Hooks
  const { skin } = useSkin();
  const dispatch = useDispatch();
  const history = useHistory();
  const ability = useContext(AbilityContext);
  const [overlay, setOverlay] = useState(false);
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
    source = require("@src/assets/images/pages/loginBg.png").default;

  const getLogin = (data) => {
    if (!check) {
      return {
        email: data.loginEmail,
        password: data.password,
        // designation: "gas_station_manager",
        fcm_token: fireBaseToken,
      };
    } else {
      return {
        civil_record_or_resident_permit_number: data.loginEmail,
        password: data.password,
        fcm_token: fireBaseToken,
      };
    }
  };

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      setOverlay(true);
      console.log(data, "datatta");
      // .login(getLogin(data), check ? 1 : "")
      useJwt
        .login(getLogin(data), check ? "supervisor" : "gas_station")
        .then((res) => {
          //const data = { ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
          if (res.data.code === 200) {
            if (!check) {
              let role = "";
              console.log(res.data, "response");
              if (
                helper.isObject(res.data.group) &&
                res.data.group.group_id == 10
              ) {
                role = "gas station network";
              } else {
                role = "gas station";
              }

              const data = {
                ability: res.data.roles,
                accessToken: res.data.token,
                avatar: "/avatar-blank.png",
                email: res.data.email,
                extras: { eCommerceCartItemsCount: 0 },
                fullName: res.data.first_name,
                client_id: res.data.client_id,
                gas_station_id: res.data.gas_station_id,
                gas_station_network_id: res.data.gas_station_network_id,
                refreshToken: res.data.token,
                role: role,
                username: res.data.first_name,
                map_key: res.data.map_key,
                expires_in: 180000, //logout after 18000 seconds
                logged_in_at: new Date(),
              };

              dispatch(handleLogin(data));
              console.log(data, "ability");
              ability.update(data.ability);
              if (role == "gas station") {
                history.push(getHomeRouteForLoggedInUser("gas station"));
              } else {
                console.warn(
                  getHomeRouteForLoggedInUser("gas station network")
                );
                history.push(
                  getHomeRouteForLoggedInUser("gas station network")
                );
              }
              toast.success(
                <ToastContent
                  name={data.fullName || data.username || "John Doe"}
                  role={data.role || "gas station"}
                />,
                {
                  icon: false,
                  transition: Slide,
                  hideProgressBar: true,
                  autoClose: 2000,
                }
              );
            } else {
              const data = {
                ability: [
                  { subject: "reporting", action: "read" },
                  { subject: "held_transactions", action: "read" },
                  { subject: "summary_by_client", action: "read" },
                  { subject: "summary_by_attendent", action: "read" },
                  { subject: "summary_by_interval", action: "read" },
                  { subject: "manage_attendent", action: "read" },
                ],
                accessToken: res.data.access_token,
                avatar: "/avatar-blank.png",
                email: res.data.staff.email,
                extras: { eCommerceCartItemsCount: 0 },
                fullName: res.data.staff.first_name,
                staff_id: res.data.staff.staff_id,
                refreshToken: res.data.access_token,
                role: "supervisor",
                username: res.data.staff.first_name,
                expires_in: 180000, //logout after 18000 seconds
                logged_in_at: new Date(),
              };
              // console.log("supervisor dataaaaaaaaa", data);

              dispatch(handleLogin(data));
              ability.update(data.ability);
              history.push(getHomeRouteForLoggedInUser("supervisor"));
              toast.success(
                <ToastContent
                  name={data.fullName || data.username || "John Doe"}
                  role={data.role || "Supervisor"}
                />,
                {
                  icon: false,
                  transition: Slide,
                  hideProgressBar: true,
                  autoClose: 2000,
                }
              );
            }
          } else {
            if (helper.isObject(res.data) && res.data.message) {
              helper.toastNotification(res.data.message, "FAILURE_MESSAGE");
            } else {
              helper.toastNotification(
                "Request has been failed",
                "FAILURE_MESSAGE"
              );
            }
          }

          setOverlay(false);
        })
        .catch((err) => {
          console.log(err, "error");
          helper.toastNotification("Some error occured", "FAILURE_MESSAGE");
          setOverlay(false);
        });
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: "manual",
          });
        }
      }
    }
  };

  return (
    <div className="auth-wrapper auth-cover">
      <ClipLoader
        css={`
          position: fixed;
          top: 40%;
          left: 40%;
          right: 40%;
          bottom: 20%;
          z-index: 999999;
          display: block;
        `}
        size={"200px"}
        color={"#196633"}
        height={100}
        loading={overlay}
      />
      <Row className="auth-inner m-0">
        <Col
          className="d-none d-lg-flex align-items-center admin"
          lg="8"
          sm="12"
          style={{
            backgroundImage: `url(${source})`,
            backgroundSize: "cover",
            backgroundRepeat: `no-repeat`,
          }}
        >
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5"></div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <div style={{ textAlign: "center" }}>
              <img
                style={{ width: "100px" }}
                src={themeConfig.app.appMainLogo}
                alt="logo"
              />
            </div>
            <CardTitle tag="h3" className="fw-bold mb-1">
              Welcome to Vehicle Wallet!
            </CardTitle>
            <CardText className="mb-2">Please sign-in to your account</CardText>
            <Alert color="primary">
              <div
                className="alert-body font-small-2"
                style={{ display: "none" }}
              >
                <p>
                  <small className="me-50">
                    <span className="fw-bold">Admin:</span> admin@demo.com |
                    admin
                  </small>
                </p>
                <p>
                  <small className="me-50">
                    <span className="fw-bold">Client:</span> client@demo.com |
                    client
                  </small>
                </p>
              </div>
            </Alert>
            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Row style={{ marginBottom: "10px" }}>
                <Col>
                  <Button
                    outline={check ? true : false}
                    color="primary"
                    block
                    onClick={() => {
                      setCheck(false);
                    }}
                  >
                    <label color="primary">Gas Station Network Manager</label>
                  </Button>
                </Col>
                <Col>
                  <Button
                    outline={check ? false : true}
                    color="primary"
                    block
                    onClick={() => {
                      setCheck(true);
                    }}
                  >
                    <label>Supervisor</label>
                  </Button>
                </Col>
              </Row>

              {!check ? (
                <div className="mb-1">
                  <Label className="form-label" for="login-email">
                    Email
                  </Label>
                  <Controller
                    id="loginEmail"
                    name="loginEmail"
                    control={control}
                    render={({ field }) => (
                      <Input
                        autoFocus
                        type="email"
                        placeholder="Enter your email"
                        invalid={errors.loginEmail && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              ) : (
                <div className="mb-1">
                  <Label className="form-label" for="login-email">
                    Civil Record / Resident Permit #
                  </Label>
                  <Controller
                    id="loginEmail"
                    name="loginEmail"
                    control={control}
                    render={({ field }) => (
                      <Input
                        autoFocus
                        type="number"
                        placeholder="Enter civil record / resident permit #"
                        invalid={errors.loginEmail && true}
                        {...field}
                      />
                    )}
                  />
                </div>
              )}

              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                </div>
                <Controller
                  id="password"
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      className="input-group-merge"
                      invalid={errors.password && true}
                      {...field}
                    />
                  )}
                />
              </div>

              <Button type="submit" color="primary" block>
                Sign in
              </Button>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
