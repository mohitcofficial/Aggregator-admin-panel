"use client";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Clock,
  FileText,
  IndianRupee,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Printer,
  Receipt,
  User,
  UserRound,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import EditQuotationModal from "@/components/modals/EditQuotationModal";
import QuotationApiServices from "@/services/api/Quotation.api.services";
import toast from "react-hot-toast";
import styles from "./page.module.css";

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getStatusClass = (status) =>
  styles[`status_${status}`] || styles.status_default;

export default function QuotationDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchQuotation = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await QuotationApiServices.getQuotationByID(id);
      const response = result.data || result;

      const quotationData =
        response.data?.quotation ||
        response.data ||
        response.quotation ||
        response;

      setQuotation(quotationData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to fetch quotation details.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchQuotation();
  }, [id, fetchQuotation]);

  const handlePreview = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/quotation/${id}/preview`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const blob = await QuotationApiServices.downloadQuotation(id);

      const pdfBlob = new Blob([blob], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${quotation.quotationNumber || id}.pdf`;

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
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.centerState}>
        <Loader2 size={32} className={styles.spin} />
        <p>Loading quotation details...</p>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className={styles.centerState}>
        <AlertCircle size={36} />
        <h2>Unable to load quotation</h2>
        <p>{error || "Quotation not found."}</p>
        <button onClick={() => router.push("/quotations")}>
          <ArrowLeft size={16} />
          Back to Quotations
        </button>
      </div>
    );
  }

  const items = quotation.items || [];

  const lead =
    quotation.leadId && typeof quotation.leadId === "object"
      ? quotation.leadId
      : null;

  const subtotal = Number(quotation.subtotal || 0);

  const discountTotal = Number(
    quotation.discountTotal ?? quotation.discountAmount ?? 0,
  );

  const taxableAmount = Number(
    quotation.taxableAmount ?? subtotal - discountTotal,
  );

  const taxTotal = Number(quotation.taxTotal ?? quotation.taxAmount ?? 0);

  const grandTotal = Number(quotation.grandTotal || 0);

  return (
    <>
      {showEditModal && (
        <EditQuotationModal
          quotation={quotation}
          setShowEditModal={setShowEditModal}
          fetchQuotation={fetchQuotation}
        />
      )}

      <div className={styles.container}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <button
              className={styles.backButton}
              onClick={() => router.push("/quotations")}
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1>Quotation Details</h1>
              <p>Manage and review your quotation information</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button
              className={styles.editButton}
              onClick={() => setShowEditModal(true)}
            >
              <FileText size={17} />
              Edit
            </button>

            <button className={styles.previewButton} onClick={handlePreview}>
              <FileText size={17} />
              Preview
            </button>

            <button
              className={styles.printButton}
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 size={17} className={styles.spin} />
              ) : (
                <Printer size={17} />
              )}

              {downloading ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Main Two Column Layout */}
        <div className={styles.mainLayout}>
          {/* LEFT COLUMN */}
          <div className={styles.leftColumn}>
            {/* Quotation Reference */}

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.sectionIcon}>
                  <FileText size={19} />
                </div>

                <div>
                  <h3>Quotation Reference</h3>
                  <p>Basic quotation information</p>
                </div>
              </div>

              <div className={styles.referenceNumber}>
                {quotation.quotationNumber || "—"}
              </div>

              <div className={styles.referenceStatus}>
                <span
                  className={`${styles.statusBadge} ${getStatusClass(
                    quotation.status,
                  )}`}
                >
                  {quotation.status || "Unknown"}
                </span>
              </div>

              <div className={styles.referenceDetails}>
                <InfoRow
                  icon={<CalendarDays size={17} />}
                  label="Created Date"
                  value={formatDate(quotation.createdAt)}
                />

                <InfoRow
                  icon={<Clock size={17} />}
                  label="Valid Until"
                  value={formatDate(quotation.validUntil)}
                />

                <InfoRow
                  icon={<Layers size={17} />}
                  label="Total Items"
                  value={`${items.length} Items`}
                />

                <InfoRow
                  icon={<Receipt size={17} />}
                  label="Tax Mode"
                  value={
                    quotation.taxMode === "exclusive"
                      ? "Tax Exclusive"
                      : quotation.taxMode === "inclusive"
                        ? "Tax Inclusive"
                        : quotation.taxMode === "none"
                          ? "No Tax"
                          : "—"
                  }
                />

                <InfoRow
                  icon={<UserRound size={17} />}
                  label="Created By"
                  value={quotation.createdBy?.name || "—"}
                />

                <InfoRow
                  icon={<UserRound size={17} />}
                  label="Last Updated By"
                  value={quotation.updatedBy?.name || "—"}
                />

                <InfoRow
                  icon={<Clock size={17} />}
                  label="Last Updated"
                  value={formatDate(quotation.updatedAt)}
                />
              </div>

              {/* Notes */}
              <div className={styles.referenceTextSection}>
                <h4>Notes</h4>
                <p>{quotation.notes || "No notes added."}</p>
              </div>

              {/* Terms */}
              <div className={styles.referenceTextSection}>
                <h4>Terms & Conditions</h4>
                <p>{quotation.terms || "No terms and conditions added."}</p>
              </div>
            </section>

            {/* Lead Information */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.sectionIcon}>
                  <User size={19} />
                </div>

                <div>
                  <h3>Lead Information</h3>
                  <p>Associated lead details</p>
                </div>
              </div>

              {lead ? (
                <div className={styles.infoList}>
                  <InfoRow
                    icon={<User size={17} />}
                    label="Lead Name"
                    value={lead.name}
                  />

                  <InfoRow
                    icon={<Mail size={17} />}
                    label="Lead Email"
                    value={lead.email}
                  />

                  <InfoRow
                    icon={<Phone size={17} />}
                    label="Lead Phone"
                    value={lead.phoneNumber}
                  />
                  <InfoRow
                    icon={<Phone size={17} />}
                    label="Location"
                    value={lead.location}
                  />
                </div>
              ) : (
                <div className={styles.manualLead}>
                  <FileText size={25} />
                  <strong>Manual Quotation</strong>
                  <span>
                    This quotation was created without linking a lead.
                  </span>
                </div>
              )}
            </section>

            {/* Notes and Terms */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.sectionIcon}>
                  <FileText size={19} />
                </div>

                <div>
                  <h3>Notes & Terms</h3>
                  <p>Additional quotation information</p>
                </div>
              </div>

              <div className={styles.notesBlock}>
                <h4>Notes</h4>
                <p>{quotation.notes || "No additional notes."}</p>
              </div>

              <div className={styles.notesBlock}>
                <h4>Terms & Conditions</h4>
                <p>
                  {quotation.terms ||
                    quotation.termsAndConditions ||
                    "No terms and conditions specified."}
                </p>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className={styles.rightColumn}>
            {/* Quotation Items */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.sectionIcon}>
                  <Layers size={19} />
                </div>

                <div>
                  <h3>Quotation Items</h3>
                  <p>Detailed breakdown of services and pricing</p>
                </div>

                <span className={styles.itemBadge}>{items.length} Items</span>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Service / Plan</th>
                      <th>Location</th>
                      <th>Duration</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Discount</th>
                      <th>Tax</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.length > 0 ? (
                      items.map((item, index) => (
                        <tr key={item._id || index}>
                          <td>{String(index + 1).padStart(2, "0")}</td>

                          <td>
                            <div className={styles.serviceInfo}>
                              <strong>
                                {item.serviceName || item.service || "Service"}
                              </strong>
                              <span>
                                {item.planName || item.description || "—"}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className={styles.locationInfo}>
                              <MapPin size={14} />
                              <span>
                                {[
                                  item.locationName,
                                  item.cityName,
                                  item.stateName,
                                ]
                                  .filter(Boolean)
                                  .join(", ") || "—"}
                              </span>
                            </div>
                          </td>

                          <td>
                            {item.duration
                              ? `${item.duration} ${item.durationUnit || ""}`
                              : "—"}
                          </td>

                          <td>{item.quantity || 1}</td>

                          <td>{currency(item.unitPrice)}</td>

                          <td>
                            {item.discount
                              ? item.discountType === "percentage"
                                ? `${item.discount}%`
                                : currency(item.discount)
                              : "—"}
                          </td>

                          <td>
                            {item.taxRate || item.gstRate
                              ? `${item.taxRate || item.gstRate}%`
                              : "—"}
                          </td>

                          <td className={styles.totalCell}>
                            {currency(item.total)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className={styles.emptyTable}>
                          No quotation items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Price Summary */}
            <section className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <div>
                  <h3>Price Summary</h3>
                  <p>Quotation amount breakdown</p>
                </div>

                <div className={styles.summaryIcon}>
                  <IndianRupee size={22} />
                </div>
              </div>

              <div className={styles.summaryBody}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <strong>{currency(subtotal)}</strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>Discount</span>
                  <strong className={styles.discountValue}>
                    - {currency(discountTotal)}
                  </strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>Taxable Amount</span>
                  <strong>{currency(taxableAmount)}</strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>
                    GST / Tax
                    {quotation.taxMode ? ` (${quotation.taxMode})` : ""}
                  </span>
                  <strong>{currency(taxTotal)}</strong>
                </div>
              </div>

              <div className={styles.grandTotal}>
                <span>Grand Total</span>
                <strong>{currency(grandTotal)}</strong>
              </div>

              <div className={styles.amountFooter}>
                <IndianRupee size={14} />
                All amounts are in Indian Rupees (INR).
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className={styles.infoRow}>
      <div className={styles.infoIcon}>{icon}</div>

      <div className={styles.infoContent}>
        <span>{label}</span>
        <strong>{value || "—"}</strong>
      </div>
    </div>
  );
}
