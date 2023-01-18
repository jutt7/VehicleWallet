// ** Third Party Components
import Chart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
import { Calendar } from "react-feather";
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
  CardSubtitle,
} from "reactstrap";
import { useEffect, useState } from "react";

// let date = [];
// let serie = [];

const ApexBarChartNetwork = ({ primary, direction, transactionPicker }) => {
  const [serie, setSerie] = useState([]);
  const [date, setDate] = useState([]);

  // const [transactionPicker, settransactionPicker] = useState("");

  const [data, setData] = useState([]);

  const [overlay, setoverlay] = useState(false);

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
      };
      return obj;
    }
    // else if (
    //   window.location.pathname.includes("gas-station") &&
    //   localStorage.getItem("userDataGasStation")
    // ) {
    //   let id = JSON.parse(localStorage.getItem("userDataGasStation"));
    //   let obj = {
    //     from_date: from,
    //     to_date: to,
    //     gas_station_id: id.gas_station_id,
    //     gas_station_network_id: id.gas_station_network_id,
    //   };
    //   return obj;
    // } else if (
    //   !window.location.pathname.includes("gas-station") &&
    //   !window.location.pathname.includes("admin") &&
    //   localStorage.getItem("userDataCustomer")
    // ) {
    //   // console.log("inside supervisor else if");
    //   let id = JSON.parse(localStorage.getItem("userDataCustomer"));
    //   let obj = {
    //     from_date: from,
    //     to_date: to,
    //     client_id: id.client_id,
    //   };
    //   return obj;
    // }
  };

  const getData = () => {
    if (transactionPicker.length == 2) {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/transaction-by-network`, {
          graph: getDetail(),
        })
        .then((res) => {
          helper.redirectToLogin(
            helper.isObject(res.data) ? res.data.code : 200
          );
          if (res.status && res.status == 200) {
            // console.log("charts network data -------------", res.data.data);

            setData(helper.applyCountID(res.data.data));

            let d = [];
            let s = [];
            helper.applyCountID(res.data.data).forEach((element) => {
              d.push(element.gas_station_network.name_en);
              s.push(element.total);
            });
            // console.log("ddddddddd", d);
            // console.log("ssssssssss", s);
            setDate(d);
            setSerie(s);
            setoverlay(false);
          } else {
            setoverlay(false);
            helper.toastNotification(
              "Unable to process request.",
              "FAILED_MESSAGE"
            );
          }
        })
        .catch((error) => {
          setoverlay(false);
          console.log(error, "error");
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
        });
    }
  };

  useEffect(() => {
    getData();
  }, [transactionPicker]);

  // ** Chart Options
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "30%",
        columnWidth: "10%",
        borderRadius: [10],
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    colors: "#2bdac7",
    dataLabels: {
      enabled: false,
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
      name: "Completed Transactions",
      data: serie,
    },
  ];

  return (
    <Card>
      <CardHeader className="d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start">
        <div>
          <CardSubtitle className="text-muted mb-25"></CardSubtitle>
          <CardTitle className="fw-bolder" tag="h4">
            Completed Transactions by Gas Station Network
          </CardTitle>
        </div>
      </CardHeader>
      <CardBody style={{ height: "420px" }}>
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
              // series={[{ data: cat }]}
              series={series}
              type="bar"
              height={400}
            />
          ) : (
            <p>No data available</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ApexBarChartNetwork;
