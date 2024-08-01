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
  const isDataEmpty = !data || (Object.keys(data).length === 0 && data.constructor === Object);


  return (
    <div className="dashboard w-full mt-3">
      <div className="w-5/6">
        {!isDataEmpty && <Line data={data}/>}
      </div>
    </div>
  );
}

export default HistoryChart;