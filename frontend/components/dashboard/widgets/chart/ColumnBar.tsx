import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Chart.js Bar Chart",
    },
  },
};
const labels = ["January", "February", "March", "April", "May", "June", "July"];
const data = {
  labels,
  datasets: [
    {
      label: "",
      data: labels.map(() => Math.floor(Math.random() * 100)),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};
const ColumnBar = () => {
  return <Bar options={options} data={data} />;
};

export default ColumnBar;
