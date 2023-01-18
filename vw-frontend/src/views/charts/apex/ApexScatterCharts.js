// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Components
import Chart from "react-apexcharts";

import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import helper from "@src/@core/helper";

import { ClipLoader } from "react-spinners";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  ButtonGroup,
  Button,
} from "reactstrap";

const ApexScatterCharts = ({
  direction,
  warning,
  primary,
  success,
  transactionPicker,
}) => {
  // ** States
  const [active, setActive] = useState("year");
  const [overlay, setoverlay] = useState(false);
  const [date, setDate] = useState([]);

  const [completed, setCompleted] = useState({
    name: "Completed Transactions",
    data: [],
  });
  const [scanned, setScanned] = useState({
    name: "Number plate scanned",
    data: [],
  });
  const [pending, setPending] = useState({
    name: "Refuel Request",
    data: [],
  });

  const getDetail = () => {
    let to = "";
    let from = "";

    if (helper.isObject(transactionPicker)) {
      from = helper.formatDateInHashes(transactionPicker[0]);
      to = helper.formatDateInHashes(transactionPicker[1]);
    }
    if (window.location.pathname.includes("admin")) {
      // console.log("inside admin if");
      let obj = {
        from_date: from,
        to_date: to,
        gas_station_id: null,
        gas_station_network_id: null,
      };
      return obj;
    } else if (
      window.location.pathname.includes("gas-station") &&
      localStorage.getItem("userDataGasStation")
    ) {
      let id = JSON.parse(localStorage.getItem("userDataGasStation"));
      let obj = {
        from_date: from,
        to_date: to,
        gas_station_id: id.gas_station_id,
        gas_station_network_id: id.gas_station_network_id,
      };
      return obj;
    } else if (
      !window.location.pathname.includes("gas-station") &&
      !window.location.pathname.includes("admin") &&
      localStorage.getItem("userDataCustomer")
    ) {
      console.log("inside supervisor else if");
      let id = JSON.parse(localStorage.getItem("userDataCustomer"));
      let obj = {
        from_date: from,
        to_date: to,
        client_id: id.client_id,
      };
      return obj;
    }
  };

  const getData = () => {
    if (transactionPicker && transactionPicker.length == 2) {
      setoverlay(true);

      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/transaction-dot-graph`, {
          graph: getDetail(),
        })
        .then((res) => {
          // helper.redirectToLogin(
          //   helper.isObject(res.data) ? res.data.code : 200
          // );
          if (res.status && res.status == 200) {
            let c = [];
            let s = [];
            let p = [];
            let d = [];

            res.data.data.forEach((element) => {
              if (!d.includes(element.Date)) {
                d.push(element.Date);
              }
              if (element.transaction_status == 1) {
                c.push(element.total);
              } else if (element.transaction_status == 4) {
                s.push(element.total);
              } else {
                p.push(element.total);
              }
            });

            setDate(d);
            setCompleted({
              name: "Completed Transactions",
              data: c,
            });
            setScanned({
              name: "Number plate scanned",
              data: s,
            });
            setPending({
              name: "Refuel Request",
              data: p,
            });
            setoverlay(false);
          } else {
            helper.toastNotification(
              "Unable to process request.",
              "FAILED_MESSAGE"
            );
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  };

  const donutColors = {
    series1: "#ffe700",
    series3: "#826bf8",
    series5: "#FFA1A1",
  };

  // ** Chart Options
  const options = {
    chart: {
      zoom: {
        enabled: true,
        type: "xy",
      },
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "start",
    },
    colors: [donutColors.series1, donutColors.series5, donutColors.series3],

    xaxis: {
      categories: date,
    },
    yaxis: {
      opposite: direction === "rtl",
    },
  };

  const series = [completed, scanned, pending];

  useEffect(() => {
    getData();
  }, [transactionPicker]);

  return (
    <Card>
      <CardHeader className="d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-md-center align-items-start">
        <CardTitle className="fw-bolder" tag="h4">
          Transaction Statistics
        </CardTitle>
        {/* <ButtonGroup className="mt-md-0 mt-1">
          <Button
            active={active === "day"}
            color="primary"
            outline
            onClick={() => setActive("day")}
          >
            Daily
          </Button>
          <Button
            active={active === "month"}
            color="primary"
            outline
            onClick={() => setActive("month")}
          >
            Monthly
          </Button>
          <Button
            active={active === "year"}
            color="primary"
            outline
            onClick={() => setActive("year")}
          >
            Yearly
          </Button>
        </ButtonGroup> */}
      </CardHeader>
      <CardBody>
        <div>
          <ClipLoader
            css={`
              position: absolute;
              top: 20%;
              left: 40%;
              right: 40%;
              bottom: 20%;
              z-index: 999999;
              display: block;
            `}
            size={"200px"}
            this
            also
            works
            color={"#196633"}
            height={100}
            loading={overlay ? true : false}
          />
          {date.length > 0 && series.length > 0 ? (
            <Chart
              options={options}
              series={series}
              type="scatter"
              height={400}
            />
          ) : (
            <div style={{ height: "400px" }}>
              <p>No data available</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ApexScatterCharts;
