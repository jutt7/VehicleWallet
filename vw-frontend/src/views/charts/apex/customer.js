// ** React Imports
import { Fragment, useContext, useEffect, useState } from "react";

// ** Reactstrap Imports
import { Row, Col } from "reactstrap";

// ** Custom Hooks
import { useRTL } from "@hooks/useRTL";

// ** Custom Components
import Breadcrumbs from "@components/breadcrumbs";

// ** Context
import { ThemeColors } from "@src/utility/context/ThemeColors";

// ** Charts
import ApexBarChart from "./ApexBarChart";
import ApexLineChart from "./ApexLineChart";
import ApexAreaChart from "./ApexAreaCharts";
import ApexRadarChart from "./ApexRadarChart";
import ApexDonutChart from "./ApexDonutChart";
import ApexRadialBarChart from "./ApexRadialbar";
import ApexColumnChart from "./ApexColumnCharts";
import ApexHeatmapChart from "./ApexHeatmapChart";
import ApexScatterChart from "./ApexScatterCharts";
import ApexCandlestickChart from "./ApexCandlestickChart";

import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import helper from "@src/@core/helper";

import Flatpickr from "react-flatpickr";
import { Calendar } from "react-feather";

// ** Styles
import "@styles/react/libs/charts/apex-charts.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { getData } from "../../apps/invoice/store";
import ApexBarChart1 from "./ApexBarChart1";
import ApexColumnCharts1 from "./ApexColumnCharts1";
import ApexLineChartAmount from "./ApexLineChartAmount";
import ApexColumnChartsFuelType from "./ApexColumnChartsFuelType";

// ** Styles
import "@styles/react/libs/charts/apex-charts.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";

const ApexCharts = () => {
  const [transactionPicker, settransactionPicker] = useState("");
  // ** Hooks
  const [isRtl] = useRTL();

  // ** Theme Colors
  const { colors } = useContext(ThemeColors);

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

  return (
    <Fragment>
      <Row className="match-height">
        <Col
          style={{
            display: "flex",

            alignItems: "flex-end",
          }}
        >
          <div
            className="d-flex align-items-center mt-md-0 mt-1"
            style={{ marginBottom: "10px" }}
          >
            <Calendar size={37} />
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
        </Col>
        <Col sm="12">
          <ApexAreaChart
            direction={isRtl ? "rtl" : "ltr"}
            transactionPicker={transactionPicker}
          />
        </Col>
        {/* <Col sm="12">
          <ApexLineChart
            direction={isRtl ? "rtl" : "ltr"}
            warning={colors.warning.main}
            transactionPicker={transactionPicker}
            type="stats"
          />
        </Col> */}
        <Col sm="12">
          <ApexScatterChart
            direction={isRtl ? "rtl" : "ltr"}
            primary={colors.primary.main}
            success={colors.success.main}
            warning={colors.warning.main}
            transactionPicker={transactionPicker}
          />
        </Col>
        <Col sm="12">
          <ApexColumnChart
            direction={isRtl ? "rtl" : "ltr"}
            transactionPicker={transactionPicker}
          />
        </Col>
        {window.location.pathname.includes("gas-station") ? (
          " "
        ) : (
          <Col sm="12">
            <ApexColumnCharts1
              direction={isRtl ? "rtl" : "ltr"}
              transactionPicker={transactionPicker}
            />
          </Col>
        )}

        {/* <Amount /> */}
        <Col xl="6" lg="12">
          <ApexLineChartAmount
            direction={isRtl ? "rtl" : "ltr"}
            warning={colors.warning.main}
            transactionPicker={transactionPicker}
            type="amount"
          />
        </Col>
        {/* <Liters /> */}
        <Col xl="6" lg="12">
          <ApexLineChartAmount
            direction={isRtl ? "rtl" : "ltr"}
            warning={colors.warning.main}
            transactionPicker={transactionPicker}
            type="liters"
          />
        </Col>
        {/* <Fue;l type /> */}
        <Col xl="6" lg="12">
          <ApexColumnChartsFuelType
            direction={isRtl ? "rtl" : "ltr"}
            transactionPicker={transactionPicker}
          />
        </Col>
        <Col xl="6" lg="12">
          <ApexBarChart
            direction={isRtl ? "rtl" : "ltr"}
            info={colors.info.main}
            transactionPicker={transactionPicker}
            vehicle={"no"}
          />
        </Col>
        {window.location.pathname.includes("gas-station") ? (
          " "
        ) : (
          <Col xl="6" lg="12">
            <ApexBarChart1
              direction={isRtl ? "rtl" : "ltr"}
              primary={colors.primary.main}
              transactionPicker={transactionPicker}
              vehicle={"yes"}
            />
          </Col>
        )}
        <Col xl="6" lg="12">
          {/* <ApexCandlestickChart
            direction={isRtl ? "rtl" : "ltr"}
            success={colors.success.main}
            danger={colors.danger.main}
          /> */}
          <ApexDonutChart transactionPicker={transactionPicker} />
        </Col>
        <Col xl="6" lg="12">
          <ApexRadialBarChart transactionPicker={transactionPicker} />
          {/* <ApexHeatmapChart /> */}
        </Col>

        <Col xl="6" lg="12">
          {/* <ApexRadialBarChart /> */}
        </Col>
        <Col xl="6" lg="12">
          {/* <ApexRadarChart /> */}
        </Col>
        <Col xl="6" lg="12"></Col>
      </Row>
    </Fragment>
  );
};

export default ApexCharts;
