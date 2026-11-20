"use client";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import classes from "./LeadContainer.module.css";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { getDate } from "@/utils/convertDate";
import LeadsApiServices from "@/services/api/Lead.api.services";
import AdminApiServices from "@/services/api/Admin.api.services";
import CustomSkeleton from "../CustomSkeleton";
import toast from "react-hot-toast";
import Loader from "@/utils/Loader";
import PaginatedTable from "../table/PaginatedTable";

function LeadContainer() {
  const fontSize = { xs: 18, sm: 18, md: 20, lg: 20 };

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [leadData, setLeadData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalLeads, setTotalLeads] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete the Lead?")) {
      setLoading2(true);
      try {
        const data = await LeadsApiServices.deleteLead(id);
        toast.success(data?.message);
        fetchLeadsData();
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
      const formattedStartDate = new Date(
        dateRange[0].startDate,
      ).toLocaleDateString("en-CA");

      const formattedEndDate = new Date(
        dateRange[0].endDate,
      ).toLocaleDateString("en-CA");

      const data = await LeadsApiServices.getLeads({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status: statusFilter,
        assignedTo: assignedToFilter,
        page,
        limit,
      });

      setLeadData(data?.leads || []);
      setTotalLeads(data?.total || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchSalesEmployee = async () => {
    setLoading(true);
    try {
      const data = await AdminApiServices.getSalesEmployees();
      setEmployees(data?.users || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsData();
  }, [page, limit, statusFilter, assignedToFilter]);

  useEffect(() => {
    fetchSalesEmployee();
  }, []);

  return (
    <div className={classes.container}>
      {loading2 && <Loader />}

      <div className={classes.buttonContainer}>
        <Link className="linkTag" href="/lead/add">
          <button className={classes.addLeadButton}>
            <AddIcon sx={{ fontSize }} />
            <span>Add Lead</span>
          </button>
        </Link>

        <div className={classes.filtersContainer}>
          <p className={classes.dateRangeText}>
            From <span>{getDate(dateRange[0].startDate)}</span> to{" "}
            <span>{getDate(dateRange[0].endDate)}</span>
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              gap: "6px",
            }}
          >
            <button
              className={classes.selectRangeButton}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              Select Range <CalendarMonthIcon sx={{ fontSize }} />
            </button>
            {showDatePicker && (
              <div className={classes.datePicker}>
                <DateRange
                  ranges={dateRange}
                  onChange={(ranges) => setDateRange([ranges.selection])}
                  minDate={new Date(2024, 0, 1)}
                  maxDate={new Date()}
                  color="#164f63"
                />
                <button
                  className={classes.applyButton}
                  onClick={() => {
                    setShowDatePicker(false);
                    fetchLeadsData();
                  }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
          <div className={classes.filters}>
            <select
              className={classes.select}
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
            >
              <option value="">Status</option>
              <option value="new">New</option>
              <option value="interested">Interested</option>
              <option value="not_interested">Not Interested</option>
              <option value="unreachable">Unreachable</option>
              <option value="converted">Converted</option>
            </select>
          </div>
          <div className={classes.filters}>
            <select
              className={classes.select}
              value={assignedToFilter}
              onChange={(e) => {
                setPage(1);
                setAssignedToFilter(e.target.value);
              }}
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <CustomSkeleton height={300} />
      ) : (
        <>
          <p className={classes.leadCountText}>Leads Count: {totalLeads}</p>

          <PaginatedTable data={leadData} handleDelete={handleDelete} />

          <div className={classes.paginationWrapper}>
            <div className={classes.paginationControls}>
              <span>Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
                className={classes.select}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className={classes.pagination}>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={classes.pageBtn}
              >
                Prev
              </button>

              <span>
                Page {page} of {Math.ceil(totalLeads / limit)}
              </span>

              <button
                disabled={page * limit >= totalLeads}
                onClick={() => setPage(page + 1)}
                className={classes.pageBtn}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LeadContainer;
