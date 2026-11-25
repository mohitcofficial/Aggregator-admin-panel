"use client";

import {
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Layers,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Send,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import QuotationApiServices from "@/services/api/Quotation.api.services";
import Link from "next/link";
import styles from "./page.module.css";

const STATUSES = [
  "all",
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
  "cancelled",
];

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getLeadName = (quotation) =>
  quotation.createdBy?.name || "Manual Quotation";

const getLeadEmail = (quotation) => quotation.createdBy?.email || "";

const getServices = (items = []) => {
  const services = [
    ...new Set(items.map((item) => item.service).filter(Boolean)),
  ];

  return services.length ? services.join(", ") : "—";
};

const getLocations = (items = []) => {
  const locations = [
    ...new Set(
      items
        .map((item) =>
          [item.cityName, item.stateName].filter(Boolean).join(", "),
        )
        .filter(Boolean),
    ),
  ];

  if (!locations.length) return "—";

  return locations.length > 1
    ? `${locations[0]} +${locations.length - 1} more`
    : locations[0];
};

const handleDownload = async (quotation) => {
  try {
    // setDownloading(true);

    const blob = await QuotationApiServices.downloadQuotation(quotation._id);

    const pdfBlob = new Blob([blob], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${quotation.quotationNumber || quotation._id}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    console.error("Download quotation failed:", error);
    toast.error("Unable to download quotation");
  } finally {
    // setDownloading(false);
  }
};

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Server-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch quotations
  const fetchQuotations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await QuotationApiServices.getAllQuotations({
        page: currentPage,
        limit: rowsPerPage,
        search: search.trim(),
      });

      setQuotations(result.data || []);

      setPagination({
        total: result.pagination?.total || 0,
        page: result.pagination?.page || currentPage,
        limit: result.pagination?.limit || rowsPerPage,
        totalPages: result.pagination?.totalPages || 0,
        hasNextPage: result.pagination?.hasNextPage || false,
        hasPrevPage: result.pagination?.hasPrevPage || false,
        nextPage: result.pagination?.nextPage || null,
        prevPage: result.pagination?.prevPage || null,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to fetch quotations.",
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, search]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, startDate, endDate, rowsPerPage]);

  // Client-side status and date filtering
  // Search is already handled by the backend.
  const filteredQuotations = useMemo(() => {
    return quotations?.filter((q) => {
      const matchesStatus = status === "all" || q.status === status;

      const createdDate = q.createdAt
        ? new Date(q.createdAt).toISOString().split("T")[0]
        : "";

      const matchesStart = !startDate || createdDate >= startDate;

      const matchesEnd = !endDate || createdDate <= endDate;

      return matchesStatus && matchesStart && matchesEnd;
    });
  }, [quotations, status, startDate, endDate]);

  // Current page statistics
  const stats = useMemo(() => {
    return {
      total: pagination.total,
      draft: quotations.filter((q) => q.status === "draft").length,
      sent: quotations.filter((q) => q.status === "sent").length,
      accepted: quotations.filter((q) => q.status === "accepted").length,
      expired: quotations.filter((q) => q.status === "expired").length,
    };
  }, [quotations, pagination.total]);

  const getStatusClass = (value) => {
    return styles[`status_${value}`] || styles.status_default;
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1>Quotations</h1>
          <p>Manage, track and monitor all your quotations.</p>
        </div>

        <div className={styles.buttonContainer}>
          <button
            className={styles.refreshButton}
            onClick={fetchQuotations}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? styles.spinning : ""} />
            Refresh
          </button>
          <Link className={styles.newQuotationButton} href={"/quotation"}>
            <Plus size={18} />
            New Booking
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Total Quotations"
          value={stats.total}
          icon={<FileText />}
          color="blue"
        />

        <StatCard
          title="Draft"
          value={stats.draft}
          icon={<Clock />}
          color="orange"
        />

        <StatCard
          title="Sent"
          value={stats.sent}
          icon={<Send />}
          color="purple"
        />

        <StatCard
          title="Accepted"
          value={stats.accepted}
          icon={<CheckCircle />}
          color="green"
        />

        <StatCard
          title="Expired"
          value={stats.expired}
          icon={<XCircle />}
          color="red"
        />
      </div>

      {/* Main Table Section */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <div>
            <h2>All Quotations</h2>
            <p>
              Showing {filteredQuotations.length} of {pagination.total}{" "}
              quotations
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={18} />

            <input
              type="text"
              placeholder="Search quotation, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.filterControl}>
            <Filter size={16} />

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item === "all"
                    ? "All Statuses"
                    : item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.dateFilter}>
            <CalendarDays size={16} />

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              aria-label="Start date"
            />

            <span>to</span>

            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              aria-label="End date"
            />
          </div>
        </div>

        {/* Table */}
        {error ? (
          <div className={styles.messageState}>
            <XCircle size={30} />
            <p>{error}</p>
            <button onClick={fetchQuotations}>Try Again</button>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Quotation</th>
                  <th>Customer</th>
                  <th>Services / Locations</th>
                  <th>Items</th>
                  <th>Grand Total</th>
                  <th>Valid Until</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className={styles.emptyState}>
                      <RefreshCw size={22} className={styles.spinning} />
                      <p>Loading quotations...</p>
                    </td>
                  </tr>
                ) : filteredQuotations.length === 0 ? (
                  <tr>
                    <td colSpan="9" className={styles.emptyState}>
                      <FileText size={36} />
                      <h3>No quotations found</h3>
                      <p>Try changing your filters or search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredQuotations.map((quotation) => (
                    <tr key={quotation._id}>
                      <td>
                        <span className={styles.quotationNumber}>
                          {quotation.quotationNumber || "—"}
                        </span>
                      </td>

                      <td>
                        <div className={styles.customerCell}>
                          <strong>{getLeadName(quotation)}</strong>
                          <span>{getLeadEmail(quotation) || "—"}</span>
                        </div>
                      </td>

                      <td>
                        <div className={styles.serviceCell}>
                          <strong>{getServices(quotation.items)}</strong>

                          <span>
                            <MapPin size={12} />
                            {getLocations(quotation.items)}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className={styles.itemCount}>
                          <Layers size={14} />
                          {quotation.items?.length || 0}
                        </span>
                      </td>

                      <td>
                        <strong className={styles.amount}>
                          {currency(quotation.grandTotal)}
                        </strong>
                      </td>

                      <td>{formatDate(quotation.validUntil)}</td>

                      <td>{formatDate(quotation.createdAt)}</td>

                      <td>
                        <span
                          className={`${styles.statusBadge} ${getStatusClass(
                            quotation.status,
                          )}`}
                        >
                          {quotation.status || "Unknown"}
                        </span>
                      </td>

                      <td>
                        <div className={styles.actionButtons}>
                          <Link href={`/quotation/${quotation._id}`}>
                            <button
                              title="View quotation"
                              className={styles.viewButton}
                            >
                              <Eye size={17} />
                            </button>
                          </Link>

                          <button
                            title="Download quotation PDF"
                            className={styles.downloadButton}
                            onClick={() => {
                              handleDownload(quotation);
                            }}
                          >
                            <Download size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <div className={styles.pagination}>
            <div className={styles.rowsSelector}>
              Rows per page:
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className={styles.paginationControls}>
              <span>
                Page {pagination.page} of {Math.max(1, pagination.totalPages)}
              </span>

              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statInfo}>
        <span>{title}</span>
        <h3>{value}</h3>
      </div>

      <div className={`${styles.statIcon} ${styles[color]}`}>{icon}</div>
    </div>
  );
}
