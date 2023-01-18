// ** Third Party Components
import Chart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
import { Calendar } from "react-feather";
import { useEffect, useState } from "react";

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";

import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import helper from "@src/@core/helper";

import { ClipLoader } from "react-spinners";

const ApexColumnCharts = ({ direction, transactionPicker }) => {
  const [date, setDate] = useState([]);

  // const [transactionPicker, settransactionPicker] = useState("");

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

  const [overlay, setoverlay] = useState(false);

  // const columnColors = {
  //   series1: "#826af9",
  //   series2: "#d2b0ff",
  //   bg: "#f8d3ff",
  // };
  const columnColors = {
    series1: "#50C878",
    series2: "#7FFFD4",
    series3: "#097969",
    bg: "#ECFFDC",
  };

  // ** Chart Options
  const options = {
    chart: {
      height: 400,
      type: "bar",
      stacked: true,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "15%",
        colors: {
          backgroundBarColors: [
            columnColors.bg,
            columnColors.bg,
            columnColors.bg,
            columnColors.bg,
            columnColors.bg,
          ],
          backgroundBarRadius: 10,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "start",
    },
    colors: [columnColors.series1, columnColors.series2, columnColors.series3],
    stroke: {
      show: true,
      colors: ["transparent"],
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      // categories: [
      //   "7/12",
      //   "8/12",
      //   "9/12",
      //   "10/12",
      //   "11/12",
      //   "12/12",
      //   "13/12",
      //   "14/12",
      //   "15/12",
      //   "16/12",
      // ],
      categories: date,
    },
    fill: {
      opacity: 1,
    },
    yaxis: {
      opposite: direction === "rtl",
    },
  };

  // ** Chart Series
  // const series = [
  //   {
  //     name: "Assigned",
  //     data: [90, 120, 55, 100, 80, 125, 175, 70, 88, 180],
  //   },
  //   {
  //     name: "Un-assigned",
  //     data: [85, 100, 30, 40, 95, 90, 30, 110, 62, 20],
  //   },
  // ];
  const series = [completed, scanned, pending];

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
      // console.log("inside supervisor else if");
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
    if (transactionPicker.length == 2) {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/transaction-line-graph`, {
          graph: getDetail(),
        })
        .then((res) => {
          helper.redirectToLogin(
            helper.isObject(res.data) ? res.data.code : 200
          );
          if (res.status && res.status == 200) {
            let c = [];
            let s = [];
            let p = [];
            let d = [];
            // console.log("columns harts data", res.data.data);
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

  const setDates = () => {
    var today = new Date().toISOString().slice(0, 10);
    var d = new Date(); // today!
    var x = 7; // go back 7 days!
    d.setDate(d.getDate() - x);
    var prevDate = d.toISOString().slice(0, 10);

    settransactionPicker([prevDate, today]);
  };
  // useEffect(() => {
  //   setDates();
  // }, []);
  useEffect(() => {
    getData();
  }, [transactionPicker]);

  return (
    <Card>
      <CardHeader className="d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-md-center align-items-start">
        <CardTitle className="fw-bolder" tag="h4">
          Transaction Statistics
        </CardTitle>
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
            <Chart options={options} series={series} type="bar" height={400} />
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

export default ApexColumnCharts;
