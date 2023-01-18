// ** React Imports
import { useContext, Fragment, useState } from "react";
import { Link, useHistory } from "react-router-dom";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import useJwt from "@src/auth/jwt/useJwt";

// ** Third Party Components
import { useDispatch } from "react-redux";
import { toast, Slide } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import helper from "@src/@core/helper";
import { fireBaseToken } from "../../../firebaseNotifications/Firebase";

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
    //  source = require(`@src/assets/images/pages/${illustration}`).default
    source = require("@src/assets/images/pages/loginBg.png").default;

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      setOverlay(true);
      useJwt
        .login(
          {
            email: data.loginEmail,
            password: data.password,
            // designation: "admin",
            fcm_token: fireBaseToken,
          },
          "admin"
        )
        .then((res) => {
          //const data = { ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
          console.log(res, "res");
          if (res.data.code === 200) {
            console.log(res.data, "admin data");
            if (helper.isObject(res.data.map_info)) {
              localStorage.setItem("map_key", res.data.map_info.option_value);
            }
            const data = {
              ability: res.data.roles,
              // ability: [{ action: "manage", subject: "all" }],
              accessToken: res.data.token,
              avatar: "/avatar-blank.png",
              email: res.data.email,
              extras: { eCommerceCartItemsCount: 0 },
              fullName: res.data.first_name,
              admin_id: res.data.admin_id,
              refreshToken: res.data.token,
              role: "admin",
              username: res.data.first_name,
              map_key: res.data.map_key,
              expires_in: 180000, //logout after 18000 seconds
              logged_in_at: new Date(),
            };

            dispatch(handleLogin(data));
            ability.update(data.ability);
            history.push(getHomeRouteForLoggedInUser("admin"));
            toast.success(
              <ToastContent
                name={data.fullName || data.username || "John Doe"}
                role={data.role || "admin"}
              />,
              {
                icon: false,
                transition: Slide,
                hideProgressBar: true,
                autoClose: 2000,
              }
            );
          } else {
            if (res.data.message.includes("Unauthorized")) {
              helper.toastNotification(
                "Incorrect Email or Password",
                "FAILURE_MESSAGE"
              );
            } else if (helper.isObject(res.data) && res.data.message) {
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
            // marginRight: "1px",
          }}
        >
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5"></div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-2"
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
              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  {/* <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link> */}
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
              {/* <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div> */}
              <Button type="submit" color="primary" block>
                Sign in
              </Button>
            </Form>
            {/* <p className='text-center mt-2'>
              <span className='me-25'>New on our platform?</span>
              <Link to='/register'>
                <span>Create an account</span>
              </Link>
            </p>
            <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-center'>
              <Button color='facebook'>
                <Facebook size={14} />
              </Button>
              <Button color='twitter'>
                <Twitter size={14} />
              </Button>
              <Button color='google'>
                <Mail size={14} />
              </Button>
              <Button className='me-0' color='github'>
                <GitHub size={14} />
              </Button>
            </div> */}
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
