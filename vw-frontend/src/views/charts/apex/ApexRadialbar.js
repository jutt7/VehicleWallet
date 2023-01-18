// ** Third Party Components
import Chart from "react-apexcharts";

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";

import { useEffect, useState } from "react";

import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import helper from "@src/@core/helper";

import { ClipLoader } from "react-spinners";

const ApexRadialbar = ({ transactionPicker }) => {
  const [serie, setSerie] = useState([]);

  const [data, setData] = useState({
    completed: "",
    held: "",
    scanned: "",
    pending: "",
  });

  const [overlay, setoverlay] = useState(false);

  const donutColors = {
    series1: "#ffe700",
    series2: "#00d4bd",
    series3: "#826bf8",
    series4: "#2b9bf4",
    series5: "#FFA1A1",
  };

  // ** Chart Options
  const options = {
    colors: [
      donutColors.series1,
      donutColors.series5,
      donutColors.series3,
      donutColors.series2,
    ],
    plotOptions: {
      radialBar: {
        size: 185,
        hollow: {
          size: "25%",
        },
        track: {
          margin: 15,
        },
        dataLabels: {
          name: {
            fontSize: "1.2rem",
            fontFamily: "Montserrat",
          },
          value: {
            formatter: function (val) {
              return parseInt(val);
            },
            fontSize: "1rem",
            fontFamily: "Montserrat",
          },
          // total: {
          //   show: true,
          //   fontSize: "1rem",
          //   label: "Comments",
          //   formatter() {
          //     return "80%";
          //   },
          // },
        },
      },
    },
    grid: {
      padding: {
        top: -35,
        bottom: -30,
      },
    },
    legend: {
      show: true,
      position: "bottom",
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Completed", "Held", "Number plate scanned"],
  };

  const series = [
    data.completed != "" ? parseFloat(data.completed) : 0,
    data.held != "" ? parseFloat(data.held) : 0,
    data.scanned != "" ? parseFloat(data.scanned) : 0,
    // data.pending != "" ? parseFloat(data.pending) : 0,
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
    if (transactionPicker && transactionPicker.length == 2) {
      setoverlay(true);
      axios
        .post(`${jwtDefaultConfig.adminBaseUrl}/transaction-pie-graph`, {
          graph: getDetail(),
        })
        .then((res) => {
          // helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 200);
          if (res.status && res.status == 200) {
            let obj = {
              completed: "",
              held: "",
              scanned: "",
              pending: "",
            };
            res.data.data.forEach((element) => {
              if (element.transaction_status == 1) {
                obj.completed = element.total;
              } else if (element.transaction_status == 3) {
                obj.held = element.total;
              } else if (element.transaction_status == 4) {
                obj.scanned = element.total;
              } else {
                obj.pending = element.total;
              }
            });

            setData(obj);

            // let s = [];
            // helper.applyCountID(res.data.data).forEach((element) => {
            //   d.push(element.Date);
            //   s.push(element.total);
            // });

            // setSerie(s);
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

  return (
    <Card>
      <CardHeader className="d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start">
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
          {/* {data.completed != "" ? ( */}
          {data.completed != "" ? (
            <Chart
              options={options}
              series={series}
              type="radialBar"
              height={350}
            />
          ) : (
            <div style={{ height: "350px" }}>
              <p>No data available</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ApexRadialbar;
