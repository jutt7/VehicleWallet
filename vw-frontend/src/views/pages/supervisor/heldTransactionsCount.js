// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Components
import axios from "axios";
import complete from "@src/assets/images/icons/complete.png";

// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";

const SubscribersGained = ({ kFormatter, heldTransaction }) => {
  // ** State
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/card/card-statistics/subscribers").then((res) => {
      setData(res.data);
    });
    return () => setData(null);
  }, [heldTransaction]);

  return data !== null ? (
    <StatsWithAreaChart
      icon={
        <i
          class="fa fa-check"
          style={{ color: "#2d7337", fontSize: "23px" }}
        ></i>
      }
      color="primary"
      stats={kFormatter(heldTransaction)}
      statTitle="Held Transaction"
      series={[]}
      type="area"
    />
  ) : null;
};

export default SubscribersGained;
