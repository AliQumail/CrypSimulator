// import React, { useRef } from "react";
// import { Line } from "react-chartjs-2";

const HistoryChart = ({ price, data }: any) => {
 
  const opts: any = {
    tooltips: {
      intersect: false,
      mode: "index"
    },
    responsive: true,
    maintainAspectRatio: false
  };
  console.log(price)
  console.log("data inside history chart")
  console.log(data);
  if (price === "0.00") {
    return <h2>please select a currency pair</h2>;
  }
  return (
    <div className="dashboard">
      <h2>{`$${price}`}</h2>

      <div className="chart-container">
        {/* <Line data={data}/> */}
        {/* opts={opts} */}
       

      </div>
    </div>
  );
}

export default HistoryChart;