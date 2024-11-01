"use client";
import React, { useEffect, useState } from "react";
import classes from "./ColumnChart.module.css";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ColumnChart = ({ actual = [], categories = [] }) => {
  const [state, setState] = useState({
    chart: {
      type: "column",
      height: 275,
      toolbar: {
        show: false,
      },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: categories,
      labels: {
        style: {
          color: "#404040",
          fontSize: "13px",
          // fontWeight: "600",
        },
      },
    },
    yAxis: {
      tickAmount: 6,
      title: "",
      labels: {
        format: "{text}",
        style: {
          color: "#404040",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: false,
        },
      },
      bar: {
        pointWidth: 16,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{point.y}%",
        },
      },
    },
    series: [
      {
        maxPointWidth: 16,
        showInLegend: false,
        name: "Actual",
        data: actual,
        color: "#0077B6",
      },
    ],
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      xAxis: {
        ...prev.xAxis,
        categories: categories,
      },
      series: [
        {
          maxPointWidth: 16,
          showInLegend: false,
          name: "Actual",
          data: actual,
          color: "#6101EC",
        },
      ],
    }));
  }, [actual, categories]);

  return (
    <div className={classes.container} id="chart">
      <h2 className={classes.chartHeading}>Query Submission Data</h2>
      <HighchartsReact highcharts={Highcharts} options={state} />
    </div>
  );
};

export default ColumnChart;
