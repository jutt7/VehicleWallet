// ** React Imports
import { Suspense, useContext, lazy, Fragment } from "react";
import { handleLogout } from "@store/authentication";

// ** Utils
import { isUserLoggedIn, getUserData } from "@utils";
import { useLayout } from "@hooks/useLayout";
import { AbilityContext } from "@src/utility/context/Can";
import { useRouterTransition } from "@hooks/useRouterTransition";
// ** Custom Components
import LayoutWrapper from "@layouts/components/layout-wrapper";

// ** Router Components
import {
  BrowserRouter as AppRouter,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

// ** Routes & Default Routes
import { DefaultRoute, Routes } from "./routes";

// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import helper from "../@core/helper";

const Router = () => {
  // ** Hooks
  const { layout, setLayout, setLastLayout } = useLayout();
  const { transition, setTransition } = useRouterTransition();

  // ** OMS Ability Context
  const ability = useContext(AbilityContext);

  // ** Default Layout
  const DefaultLayout =
    layout === "horizontal" ? "HorizontalLayout" : "VerticalLayout";

  // ** All of the available layouts
  const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout };

  // ** Current Active Item
  const currentActiveItem = null;

  // ** Return Filtered Array of Routes & Paths
  const LayoutRoutesAndPaths = (layout) => {
    const LayoutRoutes = [];
    const LayoutPaths = [];
    if (Routes) {
      Routes.filter((route) => {
        // ** Checks if Route layout or Default layout matches current layout
        if (
          route.layout === layout ||
          (route.layout === undefined && DefaultLayout === layout)
        ) {
          LayoutRoutes.push(route);
          LayoutPaths.push(route.path);
        }
      });
    }
    // console.log(LayoutRoutes, 'LayoutRoutes')
    // console.log(LayoutPaths,'LayoutPaths')
    return { LayoutRoutes, LayoutPaths };
  };

  const NotAuthorized = lazy(() =>
    import("@src/views/pages/misc/NotAuthorized")
  );

  // ** Init Error Component
  const Error = lazy(() => import("@src/views/pages/misc/Error"));

  /**
   ** Final Route Component Checks for Login & User Role and then redirects to the route
   */

  const redirectLogin = () => {
    if (window.location.href.indexOf("/admin/") > -1) {
      return "/vrp/admin/login";
    } else if (window.location.href.indexOf("/gas-station/") > -1) {
      return "/vrp/gas-station/login";
    } else if (window.location.href.indexOf("/supervisor/") > -1) {
      return "/vrp/gas-station/login";
    } else if (window.location.href.indexOf("/admin") > -1) {
      return "/vrp/admin/login";
    } else if (window.location.href.indexOf("/client") > -1) {
      return "/vrp/client/login";
    } else if (window.location.href.indexOf("/gas-station") > -1) {
      return "/vrp/gas-station/login";
    }
    // else if (window.location.href.indexOf("/gas-station-network") > -1) {
    //   return "/gas-station/login";
    // } else if (window.location.href.indexOf("/gas-station-network/") > -1) {
    //   return "/gas-station/login";
    // }
    else {
      return "/vrp/client/login";
    }
  };

  const FinalRoute = (props) => {
    if (getUserData()) {
      let current_time = new Date();
      let logged_in_at = new Date(getUserData().logged_in_at);
      //console.log('this is navbar', current_time, logged_in_at);
      let diff_in_seconds = Math.abs(
        (current_time.getTime() - logged_in_at.getTime()) / 1000
      );
      //console.log(diff_in_seconds, getUserData().expires_in);
      if (diff_in_seconds >= getUserData().expires_in) {
        helper.redirectToLogin(401);
      } else {
        console.log(diff_in_seconds, "diff_in_seconds");
        console.log(getUserData().expires_in, "expires_in");
      }
    }

    const route = props.route;
    let action, resource;
    // ** Assign vars based on route meta
    if (route.meta) {
      action = route.meta.action ? route.meta.action : null;
      resource = route.meta.resource ? route.meta.resource : null;
      // console.warn("action", action);
      // console.warn("route", route);
      // console.warn("resourse", resource);
    }

    if (
      (!isUserLoggedIn() && route.meta === undefined) ||
      (!isUserLoggedIn() &&
        route.meta &&
        !route.meta.authRoute &&
        !route.meta.publicRoute)
    ) {
      /**
       ** If user is not Logged in & route meta is undefined
       ** OR
       ** If user is not Logged in & route.meta.authRoute, !route.meta.publicRoute are undefined
       ** Then redirect user to login
      
       */
      console.warn("isUserLoggedIn", isUserLoggedIn());

      return <Redirect to={redirectLogin()} />;
    } else if (route.meta && route.meta.authRoute && isUserLoggedIn()) {
      // ** If route has meta and authRole and user is Logged in then redirect user to home page (DefaultRoute)
      const user = JSON.parse(isUserLoggedIn());
      console.warn(user, "isUserLoggedIn");
      return <Redirect to={DefaultRoute} />;
    } else if (isUserLoggedIn() && !ability.can(action || "read", resource)) {
      // ** If user is Logged in and doesn't have ability to visit the page redirect the user to Not Authorized
      console.log(action, "action");
      console.log(resource, "resource");
      return <Redirect to="/misc/not-authorized" />;
      // dispatch(handleLogout());
      // return <Redirect to={redirectLogin()} />;
    } else {
      // ** If none of the above render component
      return <route.component {...props} />;
    }
  };

  // ** Return Route to Render
  const ResolveRoutes = () => {
    return Object.keys(Layouts).map((layout, index) => {
      // ** Convert Layout parameter to Layout Component
      // ? Note: make sure to keep layout and component name equal

      const LayoutTag = Layouts[layout];

      // ** Get Routes and Paths of the Layout
      const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths(layout);

      // ** We have freedom to display different layout for different route
      // ** We have made LayoutTag dynamic based on layout, we can also replace it with the only layout component,
      // ** that we want to implement like VerticalLayout or HorizontalLayout
      // ** We segregated all the routes based on the layouts and Resolved all those routes inside layouts

      // ** RouterProps to pass them to Layouts
      const routerProps = {};

      return (
        <Route path={LayoutPaths} key={index}>
          <LayoutTag
            layout={layout}
            setLayout={setLayout}
            transition={transition}
            routerProps={routerProps}
            setLastLayout={setLastLayout}
            setTransition={setTransition}
            currentActiveItem={currentActiveItem}
          >
            <Switch>
              {LayoutRoutes.map((route) => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact === true}
                    render={(props) => {
                      // ** Assign props to routerProps
                      Object.assign(routerProps, {
                        ...props,
                        meta: route.meta,
                      });

                      return (
                        <Fragment>
                          {/* Layout Wrapper to add classes based on route's layout, appLayout and className */}

                          {route.layout === "BlankLayout" ? (
                            <Fragment>
                              <FinalRoute route={route} {...props} />
                            </Fragment>
                          ) : (
                            <LayoutWrapper
                              layout={DefaultLayout}
                              transition={transition}
                              setTransition={setTransition}
                              /* Conditional props */
                              /*eslint-disable */
                              {...(route.appLayout
                                ? {
                                    appLayout: route.appLayout,
                                  }
                                : {})}
                              {...(route.meta
                                ? {
                                    routeMeta: route.meta,
                                  }
                                : {})}
                              {...(route.className
                                ? {
                                    wrapperClass: route.className,
                                  }
                                : {})}
                              /*eslint-enable */
                            >
                              <Suspense fallback={null}>
                                <FinalRoute route={route} {...props} />
                              </Suspense>
                            </LayoutWrapper>
                          )}
                        </Fragment>
                      );
                    }}
                  />
                );
              })}
            </Switch>
          </LayoutTag>
        </Route>
      );
    });
  };

  return (
    <AppRouter basename={process.env.REACT_APP_BASENAME}>
      <Switch>
        {/* If user is logged in Redirect user to DefaultRoute else to login */}
        <Route
          exact
          path="/vrp"
          render={() => {
            if (isUserLoggedIn()) {
              //alert(DefaultRoute);
              return <Redirect to={DefaultRoute} />;
            } else {
              //              alert("here 2");
              return <Redirect to={redirectLogin()} />;
            }
          }}
        />
        {/* Not Auth Route */}
        <Route
          exact
          path="/misc/not-authorized"
          render={() => (
            <Layouts.BlankLayout>
              <NotAuthorized />
            </Layouts.BlankLayout>
          )}
        />
        <Route
          exact
          path="/vrp/admin"
          render={() => {
            return <Redirect to={redirectLogin()} />;
          }}
        />
        <Route
          exact
          path="/vrp/client"
          render={() => {
            return <Redirect to={redirectLogin()} />;
          }}
        />

        <Route
          exact
          path="/vrp/gas-station"
          render={() => {
            return <Redirect to={redirectLogin()} />;
          }}
        />
        {ResolveRoutes()}

        {/* NotFound Error page */}
        <Route path="*" component={Error} />
      </Switch>
    </AppRouter>
  );
};

export default Router;
