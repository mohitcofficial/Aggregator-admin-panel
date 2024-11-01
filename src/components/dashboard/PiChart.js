"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import classes from "./PiChart.module.css";
import axios from "axios";

const PieChart = ({ data = [] }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL);
        console.log("data: ", data);
      } catch (error) {
        console.log("error: ", error);
      }
    };
    fetchData();
    console.log("HI");
  }, []);
  const [options, setOptions] = useState({
    chart: {
      type: "pie",
      height: 400,
    },
    title: {
      text: "Weekly Visit Report",
      style: {
        fontSize: "20px",
        fontWeight: "600",
        fontFamily: "inherit",
      },
    },
    series: [
      {
        name: "Visits",
        colorByPoint: true,
        data: data.map((item) => ({
          name: item._id,
          y: item.count,
        })),
      },
    ],
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
        },
      },
    },
    credits: {
      enabled: false,
    },
  });

  return (
    <div className={classes.container}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PieChart;
