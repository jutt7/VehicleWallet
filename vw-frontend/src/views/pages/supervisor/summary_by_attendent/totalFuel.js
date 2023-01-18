// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Components
import axios from "axios";

// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";

const Counter = ({ kFormatter, Count }) => {
  // ** State
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/card/card-statistics/subscribers").then((res) => {
      setData(res.data);
    });
    return () => setData(null);
  }, [Count]);

  return data !== null ? (
    <StatsWithAreaChart
      icon={
        <i
          class="fa fa-tint"
          style={{ color: "#2d7337", fontSize: "23px" }}
        ></i>
      }
      color="primary"
      stats={Count + " Liter"}
      statTitle="Total Fuel"
      series={[]}
      type="area"
    />
  ) : null;
};

export default Counter;
