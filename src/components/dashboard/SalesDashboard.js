"use client";
import React, { useState } from "react";
import styles from "./SalesDashboard.module.css";
import { DateRange } from "react-date-range";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { getDate } from "@/utils/convertDate";
import SalesCards from "./SalesCards";
import DashboardCharts from "./DashboardCharts";

function SalesDashboard() {
  const fontSize = { xs: 16, sm: 16, md: 18, lg: 18 };
  const [employee, setEmployee] = useState("all");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const isAll = employee === "all";

  const employees = ["Aditya", "Mansoor", "Mayank", "Sumit"];

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleApply = () => {
    setShowDatePicker(false);
    fetchLeadsData();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Sales Dashboard</h2>

        <div className={styles.filtersContainer}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              gap: "6px",
            }}
          >
            <p className={styles.dateRangeText}>
              From
              <span>{getDate(dateRange[0]?.startDate)}</span>
              to <span>{getDate(dateRange[0].endDate)}</span>
            </p>
            <button
              className={styles.selectRangeButton}
              onClick={toggleDatePicker}
            >
              Select Range
              <CalendarMonthIcon sx={{ fontSize: fontSize }} />
            </button>
            {showDatePicker && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  position: "absolute",
                  zIndex: 1000,
                  right: "0",
                  top: "100%",
                }}
              >
                <DateRange
                  ranges={dateRange}
                  onChange={handleSelect}
                  moveRangeOnFirstSelection={false}
                  minDate={new Date(2024, 0, 1)}
                  maxDate={new Date()}
                  color="#164f63"
                />
                <button className={styles.applyButton} onClick={handleApply}>
                  Apply
                </button>
              </div>
            )}
          </div>
          <div className={styles.filters}>
            <select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
            >
              <option value="all">All Employees</option>
              <option value="rahul">Rahul</option>
              <option value="aman">Aman</option>
              <option value="priya">Priya</option>
            </select>
          </div>
        </div>
      </div>

      <SalesCards />

      <DashboardCharts isAll={isAll} employees={employees} />
    </div>
  );
}

export default SalesDashboard;
