"use client";
import React, { useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import classes from "./LeadContainer.module.css";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { getDate } from "@/utils/convertDate";
import LeadsApiServices from "@/services/api/Leads.api.services";
import LeadCard from "./LeadCard";
import CustomSkeleton from "../CustomSkeleton";
import toast from "react-hot-toast";
import Loader from "@/utils/Loader";

function LeadContainer() {
  const fontSize = { xs: 18, sm: 18, md: 20, lg: 20 };
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
      color: "#164f63",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [leadData, setLeadData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);

  const handleDelete = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to delete the Lead?"
    );
    if (confirmCancel) {
      setLoading2(true);
      try {
        const data = await LeadsApiServices.deleteLead(id);
        fetchLeadsData();
        toast.success(data?.message);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading2(false);
      }
    }
  };
  const fetchLeadsData = async () => {
    setLoading(true);
    try {
      const adjustedStartDate = new Date(dateRange[0].startDate);
      const adjustedEndDate = new Date(dateRange[0].endDate);

      const formattedStartDate = adjustedStartDate.toLocaleDateString("en-CA"); // "en-CA" gives you YYYY-MM-DD format
      const formattedEndDate = adjustedEndDate.toLocaleDateString("en-CA");
      const data = await LeadsApiServices.getLeads({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
      setLeadData(data?.leads || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsData();
  }, []);

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
    <div className={classes.container}>
      {loading2 && <Loader />}
      <div className={classes.buttonContainer}>
        <Link className="linkTag" href={"/lead/add"}>
          <button className={classes.addLeadButton}>
            <AddIcon sx={{ fontSize: fontSize }} />
            <span>Add Lead</span>
          </button>
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            gap: "32px",
          }}
        >
          <p className={classes.dateRangeText}>
            From
            <span>{getDate(dateRange[0]?.startDate)}</span>
            to <span>{getDate(dateRange[0].endDate)}</span>
          </p>
          <button
            className={classes.selectRangeButton}
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
              <button className={classes.applyButton} onClick={handleApply}>
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <div style={{ margin: "24px 0" }}>
          <CustomSkeleton height={25} width="120px" />
        </div>
      ) : (
        <p className={classes.leadCountText}>Leads Count : {leadData.length}</p>
      )}

      {loading ? (
        <CustomSkeleton height={450} />
      ) : (
        <div className={classes.leadCardContainer}>
          {leadData.map((lead, index) => (
            <LeadCard
              key={index}
              id={lead?._id}
              name={lead?.name}
              email={lead?.email}
              phone={lead?.phoneNumber}
              requirement={lead?.requirement}
              preferredLocation={lead?.location}
              status={lead?.status}
              createdAt={lead?.createdAt}
              origin={lead?.origin}
              handleDelete={handleDelete}
              fetchLeadsData={fetchLeadsData}
            />
          ))}
        </div>
      )}

      {!loading && leadData.length === 0 && (
        <p
          style={{
            textAlign: "center",
            margin: "24px 0",
            fontWeight: "600",
            fontSize: "18px",
          }}
        >
          No Leads Found within date range !
        </p>
      )}
    </div>
  );
}

export default LeadContainer;
