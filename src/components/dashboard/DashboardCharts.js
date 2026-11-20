import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import styles from "./DashboardCharts.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
);

const commonOptions = {
  responsive: true,
  plugins: {
    legend: {},
    tooltip: {
      callbacks: {
        title: (tooltipItems) => {
          const date = new Date(tooltipItems[0].label);
          return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        // color: "#fff",
        callback: function (value) {
          const date = new Date(this.getLabelForValue(value));
          return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          });
        },
      },
      grid: {
        color: "rgba(255,255,255,0.1)",
      },
    },
    y: {
      ticks: {
        // color: "#fff",
      },
      grid: {
        color: "rgba(255,255,255,0.1)",
      },
    },
  },
};

function DashboardCharts({ isAll, employees }) {
  const dates = ["1 Apr", "2 Apr", "3 Apr", "4 Apr", "5 Apr"];

  const conversionByEmp = {
    labels: employees,
    datasets: [
      {
        label: "Conversion %",
        data: [15, 10, 22, 5],
        backgroundColor: "#F7AC02",
      },
    ],
  };

  const leadsVsConversion = {
    labels: employees,
    datasets: [
      {
        label: "Leads",
        data: [100, 150, 120, 25],
        backgroundColor: "#4dabf7",
      },
      {
        label: "Conversions",
        data: [15, 10, 25, 36],
        backgroundColor: "#002c8a",
      },
    ],
  };

  const profitByEmp = {
    labels: employees,
    datasets: [
      {
        label: "Profit",
        data: [80000, 50000, 120000],
        backgroundColor: "rgb(0, 122, 0)",
      },
    ],
  };

  const conversionTrendAll = {
    labels: dates,
    datasets: [
      {
        label: "Rahul",
        data: [10, 15, 12, 18, 20],
        borderColor: "#fcab14",
      },
      {
        label: "Aman",
        data: [8, 10, 9, 11, 13],
        borderColor: "#4dabf7",
      },
      {
        label: "Priya",
        data: [15, 18, 20, 22, 25],
        borderColor: "#51cf66",
      },
    ],
  };

  const profitTrendAll = {
    labels: dates,
    datasets: [
      {
        label: "Rahul",
        data: [10000, 20000, 15000, 25000, 30000],
        borderColor: "#fcab14",
      },
      {
        label: "Aman",
        data: [8000, 12000, 10000, 14000, 18000],
        borderColor: "#4dabf7",
      },
      {
        label: "Priya",
        data: [20000, 25000, 30000, 35000, 40000],
        borderColor: "#51cf66",
      },
    ],
  };

  const pieData = {
    labels: ["New", "Contacted", "Interested", "Converted"],
    datasets: [
      {
        data: [30, 50, 25, 15],
        backgroundColor: ["#339af0", "#ffd43b", "#845ef7", "#51cf66"],
      },
    ],
  };

  const comboData = {
    labels: dates,
    datasets: [
      {
        type: "bar",
        label: "Leads",
        data: [100, 120, 90, 140, 160],
        backgroundColor: "#4dabf7",
      },
      {
        type: "line",
        label: "Conversion %",
        data: [10, 15, 12, 18, 20],
        borderColor: "#51cf66",
      },
      {
        type: "line",
        label: "Profit",
        data: [20000, 30000, 25000, 40000, 45000],
        borderColor: "#fcab14",
      },
    ],
  };

  const singleTrend = {
    labels: dates,
    datasets: [
      {
        type: "bar",
        label: "Leads",
        data: [50, 60, 40, 70, 80],
        backgroundColor: "#4dabf7",
      },
      {
        type: "line",
        label: "Conversions",
        data: [5, 8, 6, 10, 12],
        borderColor: "#51cf66",
      },
      {
        type: "line",
        label: "Profit",
        data: [10000, 15000, 12000, 20000, 25000],
        borderColor: "#fcab14",
      },
    ],
  };

  const conversionTrendSingle = {
    labels: dates,
    datasets: [
      {
        label: "Conversion %",
        data: [10, 15, 12, 18, 20],
        borderColor: "#fcab14",
      },
    ],
  };

  const profitTrendSingle = {
    labels: dates,
    datasets: [
      {
        label: "Profit",
        data: [10000, 15000, 12000, 20000, 25000],
        borderColor: "#51cf66",
      },
    ],
  };

  const leadsTrendSingle = {
    labels: dates,
    datasets: [
      {
        label: "Leads",
        data: [50, 60, 40, 70, 80],
        backgroundColor: "#4dabf7",
      },
    ],
  };

  const statusTrendSingle = {
    labels: dates,
    datasets: [
      {
        label: "New",
        data: [10, 12, 8, 15, 18],
        backgroundColor: "#339af0",
      },
      {
        label: "Converted",
        data: [5, 6, 4, 8, 10],
        backgroundColor: "#51cf66",
      },
    ],
  };
  return (
    <div className={styles.container}>
      <div className={styles.chartGrid}>
        {isAll ? (
          <>
            {/* SNAPSHOT */}
            <div className={styles.chartBox}>
              <Bar data={conversionByEmp} />
            </div>
            <div className={styles.chartBox}>
              <Bar data={leadsVsConversion} />
            </div>

            <div className={styles.chartBox}>
              <Bar data={profitByEmp} />
            </div>
            <div className={styles.chartBox}>
              <Pie data={pieData} />
            </div>

            {/* TREND */}
            <div className={styles.chartBox}>
              <Line data={conversionTrendAll} options={commonOptions} />
            </div>
            <div className={styles.chartBox}>
              <Line data={profitTrendAll} options={commonOptions} />
            </div>

            {/* COMBO */}
            <div className={`${styles.chartBox} ${styles.fullWidth}`}>
              <Bar data={comboData} options={commonOptions} />
            </div>
          </>
        ) : (
          <>
            <div className={`${styles.chartBox} ${styles.fullWidth}`}>
              <Bar data={singleTrend} />
            </div>

            <div className={styles.chartBox}>
              <Line data={conversionTrendSingle} />
            </div>
            <div className={styles.chartBox}>
              <Line data={profitTrendSingle} />
            </div>

            <div className={styles.chartBox}>
              <Bar data={leadsTrendSingle} />
            </div>
            <div className={styles.chartBox}>
              <Bar data={statusTrendSingle} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardCharts;
