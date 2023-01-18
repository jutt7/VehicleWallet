// ** Third Party Components
import Chart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
import { Calendar } from "react-feather";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardSubtitle,
} from "reactstrap";

// const areaColors = {
//   series1: "#50C878",
//   series2: "#7FFFD4",
//   series3: "#097969",
//   bg: "#ECFFDC",
// };
const areaColors = {
  series1: "#f1fff0",
  series2: "#e0f9de",
  series3: "#d2f7cf",
  bg: "#ECFFDC",
};

import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import helper from "@src/@core/helper";

import { ClipLoader } from "react-spinners";

const ApexAreaCharts = ({ direction, transactionPicker }) => {
  const [date, setDate] = useState([]);

  const { t } = useTranslation();

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

  // ** Chart Options
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
      curve: "straight",
    },
    legend: {
      position: "top",
      horizontalAlign: "start",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    colors: [areaColors.series3, areaColors.series2, areaColors.series1],
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
      // ],
      categories: date,
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    tooltip: {
      shared: false,
    },
    yaxis: {
      opposite: direction === "rtl",
    },
  };

  // ** Chart Series
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

  useEffect(() => {
    getData();
  }, [transactionPicker]);

  return (
    <Card>
      <CardHeader className="d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-md-center align-items-start">
        <div>
          <CardTitle className="fw-bolder" tag="h4">
            {t("Total Transactions")}
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
            <Chart options={options} series={series} type="area" height={400} />
          ) : (
            <div style={{ height: "400px" }}>
              <p>{t("No data available")}</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
export default ApexAreaCharts;
