// ** React Imports
import { useEffect, useState } from "react";

// ** Third Party Components
import axios from "axios";
import held from "@src/assets/images/icons/held.png";

// ** Custom Components
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";

import { useTranslation } from "react-i18next";

const SubscribersGained = ({
  kFormatter,
  transactionCount,
  transactionData,
}) => {
  // ** State

  const [data, setData] = useState(null);
  const [series, setSeries] = useState([]);
  const { t } = useTranslation();

  const countingSeries = () => {
    let newSerries = [];
    for (let i = 0; i < transactionData.length; i++) {
      newSerries.push(transactionData[i].held);
    }
    setSeries([{ name: "Held", data: newSerries }]);
  };

  useEffect(() => {
    countingSeries();
    axios.get("/card/card-statistics/subscribers").then((res) => {
      setData(res.data);
    });
    return () => setData(null);
  }, [transactionData]);

  return data !== null ? (
    <StatsWithAreaChart
      icon={<img src={held} style={{ width: "30px" }} />}
      color="primary"
      stats={kFormatter(transactionCount.total_held)}
      statTitle={t("Held Transactions")}
      series={[]}
      type="area"
    />
  ) : null;
};

export default SubscribersGained;
