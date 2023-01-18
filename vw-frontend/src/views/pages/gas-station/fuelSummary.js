// ** Third Party Components
import Chart from "react-apexcharts";
import { ArrowDown } from "react-feather";
import { Calendar } from "react-feather";
import Flatpickr from "react-flatpickr";
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

const ApexLineChart = ({ direction, warning }) => {
  const [serie, setSerie] = useState([]);
  const [date, setDate] = useState([]);

  const [transactionPicker, settransactionPicker] = useState("");

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
              <span>${data.series[data.seriesIndex][data.dataPointIndex]}</span>
            </div>`;
      },
    },
    xaxis: {
      categories: date,
    },
    yaxis: {
      opposite: direction === "rtl",
    },
  };

  // ** Chart Series

  const series = [
    {
      name: "Total",
      data: serie,
    },
  ];

  const getData = () => {
    let to = "";
    let from = "";

    if (helper.isObject(transactionPicker)) {
      from = helper.formatDateInHashes(transactionPicker[0]);
      to = helper.formatDateInHashes(transactionPicker[1]);
    }
    if (transactionPicker.length == 2) {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/transaction-bar-graph`, {
          graph: {
            from_date: from,
            to_date: to,
            gas_station_id: getID(),
          },
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

  const getID = () => {
    let s = window.location.href;

    s = s.split("/").splice(-1);
    return s[0];
  };

  const setDates = () => {
    var today = new Date().toISOString().slice(0, 10);
    var d = new Date(); // today!
    var x = 7; // go back 7 days!
    d.setDate(d.getDate() - x);
    var prevDate = d.toISOString().slice(0, 10);

    settransactionPicker([prevDate, today]);
  };
  useEffect(() => {
    setDates();
  }, []);
  useEffect(() => {
    getData();
  }, [transactionPicker]);

  return (
    <Card>
      <CardHeader className="d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start">
        <div>
          <CardTitle className="mb-75" tag="h4">
            Transaction Statistics
          </CardTitle>
          <CardSubtitle className="text-muted"></CardSubtitle>
        </div>

        <div className="d-flex align-items-center mt-md-0 mt-1">
          <Calendar size={40} />
          <Flatpickr
            placeholder="Select date"
            color={"red"}
            value={transactionPicker}
            id="range-picker2"
            className="form-control"
            onChange={(date) => settransactionPicker(date)}
            options={{
              mode: "range",
            }}
          />
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
