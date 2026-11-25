"use client";
import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  Edit,
  ExternalLink,
  FileText,
  History,
  IndianRupee,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Trash2,
  TrendingUp,
  UserPlus,
  UserRound,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import CustomLayout from "@/components/CustomLayout";
import styles from "./page.module.css";
import LeadApiServices from "@/services/api/Lead.api.services";

const statusLabels = {
  new: "New",
  interested: "Interested",
  not_interested: "Not Interested",
  unreachable: "Unreachable",
  converted: "Converted",
};

const sourceLabels = {
  mail: "Email",
  call: "Call",
  whatsapp: "WhatsApp",
  meta: "Meta Ads",
  referral: "Referral",
};

const serviceLabels = {
  gst_registration: "GST Registration",
  business_registration: "Business Registration",
  mailing_address: "Mailing Address",
  collaboration: "Collaboration",
  coworking: "Coworking",
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

const getInitials = (name = "") => {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "L"
  );
};

const getStatusClass = (status) => {
  const classes = {
    new: styles.new,
    interested: styles.interested,
    not_interested: styles.notInterested,
    unreachable: styles.unreachable,
    converted: styles.converted,
    accepted: styles.converted,
    sent: styles.interested,
    draft: styles.new,
    rejected: styles.notInterested,
    expired: styles.unreachable,
  };

  return classes[status] || styles.new;
};

const LeadDetails = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [lead, setLead] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [followUpSubmitting, setFollowUpSubmitting] = useState(false);

  const openCreateFollowUp = () => {
    setEditingFollowUp(null);
    setFollowUpDate("");
    setFollowUpNote("");
    setShowFollowUpModal(true);
  };

  const openEditFollowUp = (item) => {
    setEditingFollowUp(item);

    const date = new Date(item.date);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);

    setFollowUpDate(localDate);
    setFollowUpNote(item.note || "");
    setShowFollowUpModal(true);
  };

  const handleSaveFollowUp = async (e) => {
    e.preventDefault();

    if (!followUpDate || !followUpNote.trim()) {
      alert("Please enter follow-up date and notes.");
      return;
    }

    try {
      setFollowUpSubmitting(true);

      const payload = {
        date: new Date(followUpDate).toISOString(),
        note: followUpNote.trim(),
      };

      if (editingFollowUp) {
        await LeadApiServices.updateFollowUp(
          lead._id,
          editingFollowUp._id,
          payload,
        );
      } else {
        await LeadApiServices.createFollowUp(lead._id, payload);
      }

      setShowFollowUpModal(false);
      setEditingFollowUp(null);
      setFollowUpDate("");
      setFollowUpNote("");

      await fetchLead();
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Unable to save follow-up",
      );
    } finally {
      setFollowUpSubmitting(false);
    }
  };

  const handleDeleteFollowUp = async (followUpId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this follow-up?",
    );

    if (!confirmed) return;

    try {
      await LeadApiServices.deleteFollowUp(lead._id, followUpId);
      await fetchLead();
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Unable to delete follow-up",
      );
    }
  };

  const fetchLead = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await LeadApiServices.getLeadByID(id);

      if (!data?.lead) {
        setLead(null);
        setQuotations([]);
        setError(data?.message || "Lead not found");
        return;
      }

      setLead(data.lead);
      setQuotations(data.quotations || []);
    } catch (error) {
      console.error(error);
      setError(error?.message || "Unable to load lead");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <RefreshCw className={styles.spinner} size={28} />
          <p>Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <AlertCircle size={36} />
          <h2>Unable to load lead</h2>
          <p>{error || "Lead not found"}</p>
          <button className={styles.primaryButton} onClick={fetchLead}>
            <RefreshCw size={16} />
            Try Again
          </button>
          <button
            className={styles.backButton}
            onClick={() => router.push("/lead")}
          >
            <ArrowLeft size={16} />
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  const followUps = [...(lead.followUps || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const latestFollowUp = followUps[0];

  const totalQuotationValue = quotations.reduce(
    (total, quotation) => total + (Number(quotation.grandTotal) || 0),
    0,
  );

  const handleCreateQuotation = () => {
    router.push(`/quotation?leadId=${lead._id}`);
  };

  const handleEditLead = () => {
    router.push(`/lead/${lead._id}/edit`);
  };

  const phone = (lead.phoneNumber || "").replace(/\D/g, "");

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <button
            className={styles.iconButton}
            onClick={() => router.push("/leads")}
            title="Back to leads"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1>Lead Details</h1>
            <p>View and manage lead information</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.secondaryButton}
            onClick={fetchLead}
            title="Refresh"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>

          <button className={styles.secondaryButton} onClick={handleEditLead}>
            <Edit size={16} />
            <span>Edit Lead</span>
          </button>

          <button
            className={styles.primaryButton}
            onClick={handleCreateQuotation}
          >
            <Plus size={18} />
            <span>Create Quotation</span>
          </button>
        </div>
      </div>

      {/* Lead Profile */}
      <section className={styles.profileCard}>
        <div className={styles.profileTop}>
          <div className={styles.profileIdentity}>
            <div className={styles.avatar}>{getInitials(lead.name)}</div>

            <div className={styles.profileInfo}>
              <div className={styles.nameRow}>
                <h2>{lead.name || "Unnamed Lead"}</h2>

                <span
                  className={`${styles.statusBadge} ${getStatusClass(
                    lead.status,
                  )}`}
                >
                  {statusLabels[lead.status] || lead.status}
                </span>
              </div>

              <p className={styles.leadId}>Lead ID: {lead._id}</p>

              <div className={styles.profileTags}>
                <span>
                  <BriefcaseBusiness size={14} />
                  {serviceLabels[lead.service] || "Service not selected"}
                </span>

                <span>
                  <MessageCircle size={14} />
                  {sourceLabels[lead.source] || lead.source}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.profileActions}>
            {phone && (
              <>
                <a
                  href={`tel:${lead.phoneNumber}`}
                  className={styles.callButton}
                >
                  <Phone size={16} />
                  Call
                </a>

                <a
                  href={`https://wa.me/${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappButton}
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              </>
            )}
          </div>
        </div>

        <div className={styles.profileDivider} />

        <div className={styles.contactGrid}>
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <Phone size={17} />
            </div>
            <div>
              <label>Phone Number</label>
              <strong>{lead.phoneNumber || "—"}</strong>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <Mail size={17} />
            </div>
            <div>
              <label>Email Address</label>
              <strong>{lead.email || "—"}</strong>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <MapPin size={17} />
            </div>
            <div>
              <label>Location</label>
              <strong>{lead.location || "—"}</strong>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <Wallet size={17} />
            </div>
            <div>
              <label>Budget</label>
              <strong>{lead.budget || "—"}</strong>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <UserRound size={17} />
            </div>
            <div>
              <label>Assigned To</label>
              <strong>{lead.assignedTo?.name || "Unassigned"}</strong>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
              <CalendarDays size={17} />
            </div>
            <div>
              <label>Created On</label>
              <strong>{formatDate(lead.createdAt)}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText size={19} />
          </div>
          <div>
            <label>Total Quotations</label>
            <h3>{quotations.length}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <IndianRupee size={19} />
          </div>
          <div>
            <label>Quotation Value</label>
            <h3>{formatCurrency(totalQuotationValue)}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <History size={19} />
          </div>
          <div>
            <label>Total Follow-ups</label>
            <h3>{followUps.length}</h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={19} />
          </div>
          <div>
            <label>Lead Profit</label>
            <h3>{formatCurrency(lead.profit)}</h3>
          </div>
        </div>
      </div>

      {showFollowUpModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowFollowUpModal(false)}
        >
          <div
            className={styles.followUpModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h2>{editingFollowUp ? "Edit Follow-up" : "Add Follow-up"}</h2>
                <p>Schedule and record lead interactions.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowFollowUpModal(false)}
                className={styles.modalClose}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveFollowUp}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Follow-up Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Notes *</label>
                  <textarea
                    rows={5}
                    placeholder="Enter call details, discussion, or next steps..."
                    value={followUpNote}
                    onChange={(e) => setFollowUpNote(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowFollowUpModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={followUpSubmitting}
                >
                  {followUpSubmitting
                    ? "Saving..."
                    : editingFollowUp
                      ? "Update Follow-up"
                      : "Create Follow-up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.contentGrid}>
        <div className={styles.mainColumn}>
          {/* Follow-up History */}
          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <div className={styles.sectionIcon}>
                  <History size={19} />
                </div>

                <div>
                  <h2>Follow-up History</h2>
                  <p>Manage previous and upcoming interactions</p>
                </div>
              </div>

              <button
                className={styles.smallPrimaryButton}
                onClick={openCreateFollowUp}
              >
                <Plus size={16} />
                Add Follow-up
              </button>
            </div>

            {followUps.length === 0 ? (
              <div className={styles.emptyState}>
                <CalendarDays size={35} />
                <h3>No follow-ups recorded</h3>
                <p>Add a follow-up to keep track of your next interaction.</p>

                <button
                  className={styles.primaryButton}
                  onClick={openCreateFollowUp}
                >
                  <Plus size={16} />
                  Create Follow-up
                </button>
              </div>
            ) : (
              <div className={styles.timeline}>
                {followUps.map((item) => (
                  <div className={styles.timelineItem} key={item._id}>
                    <div className={styles.timelineMarker}>
                      <Clock size={15} />
                    </div>

                    <div className={styles.timelineContent}>
                      <div className={styles.timelineTop}>
                        <h3>{formatDate(item.date)}</h3>
                        <span>{item.createdBy?.name || "Team Member"}</span>
                      </div>

                      <p>{item.note || "No notes added."}</p>

                      {item.lastEditedAt && (
                        <small>
                          Last edited: {formatDate(item.lastEditedAt)}
                          {item.lastEditedBy?.name
                            ? ` by ${item.lastEditedBy.name}`
                            : ""}
                        </small>
                      )}

                      <div className={styles.followUpActions}>
                        <button
                          type="button"
                          onClick={() => openEditFollowUp(item)}
                          title="Edit follow-up"
                        >
                          <Edit size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteFollowUp(item._id)}
                          title="Delete follow-up"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* Quotations */}
          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <div className={styles.sectionIcon}>
                  <FileText size={19} />
                </div>
                <div>
                  <h2>Quotations</h2>
                  <p>All quotations generated for this lead</p>
                </div>
              </div>

              <button
                className={styles.smallPrimaryButton}
                onClick={handleCreateQuotation}
              >
                <Plus size={16} />
                New Quotation
              </button>
            </div>

            {quotations.length === 0 ? (
              <div className={styles.emptyState}>
                <FileText size={35} />
                <h3>No quotations yet</h3>
                <p>Create a quotation for this lead to get started.</p>
                <button
                  className={styles.primaryButton}
                  onClick={handleCreateQuotation}
                >
                  <Plus size={16} />
                  Create Quotation
                </button>
              </div>
            ) : (
              <div className={styles.quotationList}>
                {quotations.map((quotation) => (
                  <div className={styles.quotationItem} key={quotation._id}>
                    <div className={styles.quotationMain}>
                      <div className={styles.quotationIcon}>
                        <FileText size={20} />
                      </div>

                      <div className={styles.quotationInfo}>
                        <div className={styles.quotationTitleRow}>
                          <h3>{quotation.quotationNumber || "Quotation"}</h3>

                          <span
                            className={`${styles.statusBadge} ${getStatusClass(
                              quotation.status,
                            )}`}
                          >
                            {quotation.status || "Draft"}
                          </span>
                        </div>

                        <p>Created: {formatDate(quotation.createdAt)}</p>

                        {quotation.items?.length > 0 && (
                          <div className={styles.quotationDescription}>
                            {quotation.items
                              .map((item) =>
                                [item.service, item.locationName, item.cityName]
                                  .filter(Boolean)
                                  .join(" - "),
                              )
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        )}

                        <span className={styles.createdBy}>
                          Created by: {quotation.createdBy?.name || "—"}
                        </span>
                      </div>
                    </div>

                    <div className={styles.quotationRight}>
                      <strong className={styles.quotationAmount}>
                        {formatCurrency(quotation.grandTotal)}
                      </strong>

                      <Link
                        href={`/quotation/${quotation._id}`}
                        className={styles.viewQuotationButton}
                      >
                        View
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className={styles.sideColumn}>
          {/* Lead Information */}
          <section className={styles.card}>
            <div className={styles.sideCardHeader}>
              <h2>Lead Information</h2>
            </div>

            <div className={styles.detailList}>
              <div>
                <label>Lead Status</label>
                <span
                  className={`${styles.statusBadge} ${getStatusClass(
                    lead.status,
                  )}`}
                >
                  {statusLabels[lead.status] || lead.status}
                </span>
              </div>

              <div>
                <label>Service Required</label>
                <strong>{serviceLabels[lead.service] || "—"}</strong>
              </div>

              <div>
                <label>Lead Source</label>
                <strong>
                  {sourceLabels[lead.source] || lead.source || "—"}
                </strong>
              </div>

              <div>
                <label>Created By</label>
                <strong>{lead.createdBy?.name || "—"}</strong>
              </div>

              <div>
                <label>Last Updated</label>
                <strong>{formatDate(lead.updatedAt)}</strong>
              </div>

              {lead.convertedAt && (
                <div>
                  <label>Converted On</label>
                  <strong>{formatDate(lead.convertedAt)}</strong>
                </div>
              )}
            </div>
          </section>

          {/* Next Follow-up */}
          <section className={styles.card}>
            <div className={styles.sideCardHeader}>
              <h2>Latest Follow-up</h2>
            </div>

            {latestFollowUp ? (
              <div className={styles.nextFollowUp}>
                <div className={styles.followUpDate}>
                  <CalendarDays size={18} />
                  <strong>{formatDate(latestFollowUp.date)}</strong>
                </div>
                <p>{latestFollowUp.note || "No notes added."}</p>
                <span>
                  By {latestFollowUp.createdBy?.name || "Team Member"}
                </span>
              </div>
            ) : (
              <div className={styles.noFollowUp}>
                <CalendarDays size={24} />
                <p>No follow-up available</p>
              </div>
            )}
          </section>

          {/* Remark */}
          <section className={styles.card}>
            <div className={styles.sideCardHeader}>
              <h2>Lead Remark</h2>
            </div>

            <div className={styles.remarkContent}>
              {lead.remark || "No remarks have been added for this lead."}
            </div>
          </section>

          {/* Assignment */}
          <section className={styles.card}>
            <div className={styles.sideCardHeader}>
              <h2>Assignment Details</h2>
            </div>

            <div className={styles.assignmentBox}>
              <div className={styles.assignmentAvatar}>
                <UserPlus size={19} />
              </div>
              <div>
                <strong>{lead.assignedTo?.name || "Unassigned"}</strong>
                <p>{lead.assignedTo?.email || "No employee assigned"}</p>
                {lead.assignedTo?.role && <span>{lead.assignedTo.role}</span>}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default LeadDetails;
