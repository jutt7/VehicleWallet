// ** Third Party Components
import Chart from "react-apexcharts";
import { ArrowDown } from "react-feather";
import Flatpickr from "react-flatpickr";
import { Calendar } from "react-feather";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import helper from "@src/@core/helper";

import { ClipLoader } from "react-spinners";

import { useEffect, useState } from "react";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardSubtitle,
  Badge,
} from "reactstrap";

const ApexLineChart = ({ direction, warning, transactionPicker }) => {
  const [serie, setSerie] = useState([]);
  const [date, setDate] = useState([]);

  // const [transactionPicker, settransactionPicker] = useState("");

  const [data, setData] = useState([]);

  const [overlay, setoverlay] = useState(false);

  // ** Chart Options
  const options = {
    chart: {
      zoom: {
        enabled: false,
      },
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },

    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      strokeColors: ["#fff"],
      colors: [warning],
    },
    dataLabels: {
      enabled: false,
    },
    // stroke: {
    //   curve: "smooth",
    // },
    stroke: {
      curve: "straight",
    },
    colors: [warning],
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      custom(data) {
        return `<div class='px-1 py-50'>
              <span>${
                data.series[data.seriesIndex][data.dataPointIndex]
              }%</span>
            </div>`;
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
      //   "17/12",
      //   "18/12",
      //   "19/12",
      //   "20/12",
      //   "21/12",
      // ],
      categories: date,
    },
    yaxis: {
      opposite: direction === "rtl",
    },
  };

  const series = [
    {
      name: "Total",
      data: serie,
    },
  ];

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
        .post(`${jwtDefaultConfig.adminBaseUrl}/transaction-bar-graph`, {
          graph: getDetail(),
        })
        .then((res) => {
          // helper.redirectToLogin(
          //   helper.isObject(res.data) ? res.data.code : 200
          // );
          if (res.status && res.status == 200) {
            setData(helper.applyCountID(res.data.data));
            let d = [];
            let s = [];
            helper.applyCountID(res.data.data).forEach((element) => {
              d.push(element.Date);
              s.push(element.total);
            });
            setDate(d);
            setSerie(s);
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

  useEffect(() => {
    getData();
  }, [transactionPicker]);

  return (
    <Card>
      <CardHeader className="d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start">
        <div>
          <CardTitle className="fw-bolder" tag="h4">
            Transaction Statistics
          </CardTitle>
          <CardSubtitle className="text-muted"></CardSubtitle>
        </div>
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
            <Chart options={options} series={series} type="line" height={400} />
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

export default ApexLineChart;
