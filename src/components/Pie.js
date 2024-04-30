import React from "react";
import { VictoryPie, VictoryTooltip } from "victory";

const PieChartComponent = ({ totalAmounts }) => {

  const data = Object.keys(totalAmounts).map((cryptoName) => ({
    x: cryptoName.toUpperCase(), 
    y: totalAmounts[cryptoName],
  }));
  

  return (
    <VictoryPie
    data={data}
    colorScale={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]}
    labels={({ datum }) => `${datum.x}: ${datum.y}`}
    labelComponent={<VictoryTooltip 
      style={{ fontSize: 30 }}
    />}
  />
  );
};

export default PieChartComponent;
