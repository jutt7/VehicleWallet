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
import Select from "react-select";
import { ClipLoader } from "react-spinners";

const ApexColumnCharts1 = ({ direction, transactionPicker }) => {
  const [date, setDate] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [data, setdata] = useState([]);
  const [s, setS] = useState([]);
  const [cColors, setCColors] = useState([]);
  const [type, setType] = useState([]);
  const [id, setId] = useState({});
  const [dvalue, setDValue] = useState({});

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
    colors: [columnColors.series1, columnColors.series2],
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
      // console.warn("id", id);
      if (id) {
        let obj = {
          // from_date: "2022-09-01",
          // to_date: "2022-09-30",
          from_date: from,
          to_date: to,
          type: id.value,
          gas_station_id: null,
          gas_station_network_id: null,
        };
        return obj;
      }
    } else if (
      window.location.pathname.includes("gas-station") &&
      localStorage.getItem("userDataGasStation")
    ) {
      let gid = JSON.parse(localStorage.getItem("userDataGasStation"));
      let obj = {
        from_date: from,
        to_date: to,
        gas_station_id: id.gas_station_id,
        gas_station_network_id: id.gas_station_network_id,
        type: id.value,
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
        type: id.value,
      };
      return obj;
    }
  };

  const getData = () => {
    if (transactionPicker.length == 2 && id) {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/vehicle-type-graph`, {
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
              arr[0].name = item.vehicle_type.name_en;
              arr[0].data.push(item.total);
            });
            // console.log("arrrrr", arr);

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
  const getVehicleTypes = () => {
    setoverlay(true);
    axios
      .post(`${jwtDefaultConfig.adminBaseUrl}/distinct-vehicle-type`, {
        graph: getDetail(),
      })
      .then((res) => {
        helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
        if (res.status && res.status === 200) {
          // console.log(helper.applyCountID(res.data.data), "vehicle types data");

          let arr = [];
          res.data.data.forEach((item) => {
            arr.push({
              label: item.vehicle_type.name_en,
              value: item.type,
            });
          });

          console.log("types", arr);
          setType(arr);
          if (arr.length > 0) {
            setId(arr[0]);
          } else {
            setId([]);
            setS([]);
          }
          setoverlay(false);
        } else {
          setoverlay(false);

          helper.toastNotification(
            "Unable to process request.",
            "FAILED_MESSAGE"
          );
          setType([]);
          setoverlay(false);
        }
      })
      .catch((error) => {
        console.log(error, "error");
        setType([]);
        setoverlay(false);
      });
  };
  useEffect(() => {
    if (id && id.value) {
      getData();
    }
  }, [id]);

  // useEffect(() => {
  //   let color = [];
  //   if (s.length > 0) {
  //     for (let i = 0; i < s.length; i++) {
  //       color.push(getRandomColor());
  //     }
  //     setCColors(color);
  //   }
  // }, [s]);

  useEffect(() => {
    getVehicleTypes();
  }, [transactionPicker]);

  return (
    <Card>
      <CardHeader className="d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-md-center align-items-start">
        <div>
          <CardTitle className="fw-bolder" tag="h4">
            Registered Vehicles by Vehicle Type
          </CardTitle>
        </div>
        <div className="d-flex align-items-center mt-md-0 mt-1">
          <Select
            // name="credit_terms"
            onChange={(e) => {
              if (e) {
                setId(e);
              }
            }}
            options={type}
            value={id ? id : ""}
            // defaultValue={id}
            isClearable={true}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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

export default ApexColumnCharts1;
