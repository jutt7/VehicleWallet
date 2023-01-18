// ** Third Party Components
import Chart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
import { Calendar } from "react-feather";
import { useEffect, useState } from "react";
import Select from "react-select";

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";

import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import helper from "@src/@core/helper";

import { ClipLoader } from "react-spinners";

const ApexColumnChartsFuelType = ({ direction, transactionPicker }) => {
  const [date, setDate] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [data, setdata] = useState([]);
  const [s, setS] = useState([]);
  const [cColors, setCColors] = useState([]);
  const [id, setId] = useState({ label: "fuel_91", value: 1 });

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
    name: "Pending",
    data: [],
  });

  const [overlay, setoverlay] = useState(false);
  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const [fuel, setFuel] = useState([]);

  const columnColors = {
    series1: "#50C878",
    series2: "#d2b0ff",
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
    // colors: cColors,
    colors: [columnColors.series1],
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
      type: "date",
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
  const series = s;

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
        fueltype_id: id.value,
        gas_station_id: null,
        gas_station_network_id: null,
      };
      return obj;
    } else if (
      window.location.pathname.includes("gas-station") &&
      localStorage.getItem("userDataGasStation")
    ) {
      let gid = JSON.parse(localStorage.getItem("userDataGasStation"));
      let obj = {
        from_date: from,
        to_date: to,
        gas_station_id: gid.gas_station_id,
        gas_station_network_id: gid.gas_station_network_id,
        fueltype_id: id.value,
      };
      return obj;
    } else if (
      !window.location.pathname.includes("gas-station") &&
      !window.location.pathname.includes("admin") &&
      localStorage.getItem("userDataCustomer")
    ) {
      // console.log("inside supervisor else if");
      let cid = JSON.parse(localStorage.getItem("userDataCustomer"));
      let obj = {
        from_date: from,
        to_date: to,
        client_id: cid.client_id,
        fueltype_id: id.value,
      };

      return obj;
    }
  };

  const getData = () => {
    if (transactionPicker.length == 2) {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/transaction-by-fueltype`, {
          graph: getDetail(),
        })
        .then((res) => {
          helper.redirectToLogin(
            helper.isObject(res.data) ? res.data.code : 200
          );
          if (res.status && res.status == 200) {
            let d = [];

            // console.log("columns fuel data harts data", res.data.data);
            let arr = [];
            let obj = {
              name: "",
              data: [],
            };
            arr.push(obj);
            res.data.data.forEach((item) => {
              if (!d.includes(item.Date)) {
                d.push(item.Date);
              }
              arr[0].name = id.label;
              arr[0].data.push(item.total);
            });

            setS(arr);
            // setS(arr);
            setDate(d);

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
  const getFuelTypes = () => {
    setoverlay(true);
    axios
      .get(
        `${jwtDefaultConfig.adminBaseUrl}/fuel-types?page=${currentPage}&pagination=true`,
        {}
      )
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log(helper.applyCountID(res.data.data.data), "data");
          let arr = [];
          res.data.data.data.forEach((item) => {
            arr.push({
              label: item.title_en,
              value: item.id,
            });
          });
          setFuel(arr);
          // setFuel(helper.applyCountID(res.data.data.data));

          setoverlay(false);
        } else {
          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setFuel([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setFuel([]);
        setoverlay(false);
      });
  };

  useEffect(() => {
    getFuelTypes();
  }, [transactionPicker]);
  useEffect(() => {
    getData();
  }, [id, fuel]);

  return (
    <Card>
      <CardHeader className="d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-md-center align-items-start">
        <CardTitle className="fw-bolder" tag="h4">
          Transaction by Fuel Type
          <Select
            name="credit_terms"
            onChange={(e) => {
              // console.log(e.value);
              if (e) {
                setId(e);
              }
            }}
            options={fuel}
            // value={props.stations.name_en}
            defaultValue={{ label: "fuel_91", value: 1 }}
            isClearable={true}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
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

export default ApexColumnChartsFuelType;
