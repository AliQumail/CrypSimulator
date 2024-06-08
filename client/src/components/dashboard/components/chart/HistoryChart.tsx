// import React, { useRef } from "react";
// import type { Line } from "react-chartjs-2";

import '../../Dashboard.css'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HistoryChart = ({ price, data }: any) => {  
  console.log("data")
  console.log(data);

  if (price === "0.00") {
    return <h2>please select a currency pair</h2>;
  }
  return (
    <div className="dashboard">
      <h2>{`$${price}`}</h2>

      <div className="chart-container">
        {data && <Line data={data}/>}
      </div>
    </div>
  );
}

export default HistoryChart;