"use client";

import LeadApiServices from "@/services/api/Lead.api.services";
import {
  AlertCircle,
  ArrowLeft,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FileText,
  Package,
  Plus,
  Receipt,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

const createEmptyItem = () => ({
  stateId: "",
  stateName: "",
  cityId: "",
  cityName: "",
  locationId: "",
  locationName: "",
  service: "",
  planName: "",
  duration: 12,
  durationUnit: "months",
  quantity: 1,
  unitPrice: 0,
  discount: 0,
  discountType: "amount",
  taxRate: 18,
});

const initialForm = {
  leadId: "",
  validUntil: "",
  status: "draft",
  taxMode: "exclusive",
  notes: "",
  terms: "",
  items: [createEmptyItem()],
};

export default function CreateQuotationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlLeadId = searchParams.get("leadId");

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const [leadSearch, setLeadSearch] = useState(urlLeadId || "");
  const [leadSearching, setLeadSearching] = useState(false);
  const [leadValid, setLeadValid] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateItem = (index, name, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [name]: value } : item,
      ),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyItem()],
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculations = useMemo(() => {
    let subtotal = 0;
    let discountTotal = 0;
    let taxableAmount = 0;
    let taxTotal = 0;
    let grandTotal = 0;

    form.items.forEach((item) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
      const gross = quantity * unitPrice;

      const discountValue = Math.max(0, Number(item.discount) || 0);
      const discount =
        item.discountType === "percentage"
          ? Math.min(gross, (gross * discountValue) / 100)
          : Math.min(gross, discountValue);

      const net = Math.max(0, gross - discount);
      const rate = Math.max(0, Number(item.taxRate) || 0);

      let taxable = net;
      let tax = 0;
      let total = net;

      if (form.taxMode === "exclusive") {
        tax = (net * rate) / 100;
        total = net + tax;
      } else if (form.taxMode === "inclusive") {
        tax = net - net / (1 + rate / 100);
        taxable = net - tax;
        total = net;
      }

      subtotal += gross;
      discountTotal += discount;
      taxableAmount += taxable;
      taxTotal += tax;
      grandTotal += total;
    });

    return {
      subtotal,
      discountTotal,
      taxableAmount,
      taxTotal,
      grandTotal,
    };
  }, [form.items, form.taxMode]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.items.length) {
      alert("Please add at least one quotation item.");
      return;
    }

    for (const [index, item] of form.items.entries()) {
      if (!item.stateName || !item.cityName || !item.service) {
        alert(`Please complete State, City and Service in item ${index + 1}.`);
        return;
      }

      if (Number(item.unitPrice) < 0) {
        alert(`Invalid unit price in item ${index + 1}.`);
        return;
      }
    }

    const payload = {
      ...form,
      items: form.items.map((item) => {
        const quantity = Number(item.quantity) || 1;
        const unitPrice = Number(item.unitPrice) || 0;
        const gross = quantity * unitPrice;

        const discount =
          item.discountType === "percentage"
            ? (gross * Number(item.discount || 0)) / 100
            : Number(item.discount || 0);

        const net = Math.max(0, gross - discount);
        const rate = Number(item.taxRate) || 0;

        let taxableAmount = net;
        let taxAmount = 0;
        let total = net;

        if (form.taxMode === "exclusive") {
          taxAmount = (net * rate) / 100;
          total = net + taxAmount;
        } else if (form.taxMode === "inclusive") {
          taxAmount = net - net / (1 + rate / 100);
          taxableAmount = net - taxAmount;
        }

        return {
          ...item,
          duration: Number(item.duration) || 12,
          quantity,
          unitPrice,
          discount: Number(item.discount) || 0,
          taxRate: rate,
          taxableAmount,
          taxAmount,
          total,
        };
      }),
      ...calculations,
    };

    try {
      setSaving(true);

      // Replace this URL with your actual quotation creation endpoint.
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/quotation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add your authentication header here if required.
          },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create quotation.");
      }

      alert("Quotation created successfully!");
      router.push("/quotations");
    } catch (error) {
      alert(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const leadID = leadSearch.trim();

    if (!leadID) {
      setLeadValid(null);
      setSelectedLead(null);
      updateField("leadId", "");
      setLeadSearching(false);
      return;
    }

    // Reset previous validation
    setLeadValid(null);
    setSelectedLead(null);
    updateField("leadId", "");

    const timer = setTimeout(async () => {
      try {
        setLeadSearching(true);

        const response = await LeadApiServices.getLeadByID(leadID);

        if (response?.lead) {
          const lead = response.lead;

          setSelectedLead(lead);
          setLeadValid(true);
          updateField("leadId", lead._id);
        } else {
          setLeadValid(false);
        }
      } catch (error) {
        console.error("Lead search error:", error);
        setLeadValid(false);
      } finally {
        setLeadSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [leadSearch]);

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => router.back()}
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <h1>Create Quotation</h1>
            <p>Create and manage a new customer quotation</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => router.push("/quotations")}
          >
            <X size={16} />
            Cancel
          </button>

          <button
            type="button"
            className={styles.saveButton}
            onClick={() =>
              document.getElementById("quotation-form").requestSubmit()
            }
            disabled={saving}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Create Quotation"}
          </button>
        </div>
      </div>

      <form
        id="quotation-form"
        onSubmit={handleSubmit}
        className={styles.mainLayout}
      >
        {/* LEFT COLUMN */}
        <div className={styles.leftColumn}>
          {/* Quotation Information */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.sectionIcon}>
                <FileText size={19} />
              </div>
              <div>
                <h2>Quotation Information</h2>
                <p>Basic quotation details</p>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Quotation Number</label>
              <div className={styles.autoGenerated}>
                <span>Auto-generated on creation</span>
                <span className={styles.autoTag}>Automatic</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>
                Valid Until <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputIcon}>
                <CalendarDays size={17} />
                <input
                  type="date"
                  value={form.validUntil}
                  onChange={(e) => updateField("validUntil", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Quotation Status</label>
              <div className={styles.selectWrapper}>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown size={16} />
              </div>
            </div>
          </section>

          {/* Lead Information */}

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.sectionIcon}>
                <UserRound size={19} />
              </div>

              <div>
                <h2>Lead Information</h2>
                <p>Link quotation to an existing lead</p>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Search Quotation Number</label>

              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Enter quotation number..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                />

                <div className={styles.validationIcon}>
                  {leadSearching && (
                    <span className={styles.searchLoader}>Searching...</span>
                  )}

                  {!leadSearching && leadValid === true && (
                    <CheckCircle2 size={21} color="#16a34a" />
                  )}

                  {!leadSearching && leadValid === false && (
                    <AlertCircle size={21} color="#dc2626" />
                  )}
                </div>
              </div>

              {!leadSearching && leadValid === true && selectedLead && (
                <div className={styles.validationSuccess}>
                  <CheckCircle2 size={15} />
                  Valid quotation number found
                  <strong>
                    {selectedLead.name || selectedLead.companyName || "Lead"}
                  </strong>
                </div>
              )}

              {!leadSearching && leadValid === false && (
                <div className={styles.validationError}>
                  <AlertCircle size={15} />
                  Invalid quotation number. No matching lead found.
                </div>
              )}

              <small>
                Enter an existing quotation number. We will automatically verify
                it.
              </small>
            </div>
          </section>

          {/* Notes and Terms */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.sectionIcon}>
                <Receipt size={19} />
              </div>
              <div>
                <h2>Notes & Terms</h2>
                <p>Additional quotation information</p>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Notes</label>
              <textarea
                rows={4}
                placeholder="Enter quotation notes..."
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Terms & Conditions</label>
              <textarea
                rows={5}
                placeholder="Enter terms and conditions..."
                value={form.terms}
                onChange={(e) => updateField("terms", e.target.value)}
              />
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightColumn}>
          {/* Quotation Items */}
          <section className={styles.card}>
            <div className={styles.itemsHeader}>
              <div className={styles.cardHeader}>
                <div className={styles.sectionIcon}>
                  <Package size={19} />
                </div>
                <div>
                  <h2>Quotation Items</h2>
                  <p>Add locations and services to this quotation</p>
                </div>
              </div>

              <button
                type="button"
                className={styles.addItemButton}
                onClick={addItem}
              >
                <Plus size={17} />
                Add Item
              </button>
            </div>

            <div className={styles.itemsList}>
              {form.items.map((item, index) => (
                <div className={styles.itemCard} key={index}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemTitle}>
                      <span className={styles.itemNumber}>{index + 1}</span>
                      <div>
                        <h3>Item {index + 1}</h3>
                        <p>Location and service details</p>
                      </div>
                    </div>

                    {form.items.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeItem(index)}
                        title="Remove item"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>

                  <div className={styles.itemGrid}>
                    <div className={styles.formGroup}>
                      <label>State Name *</label>
                      <input
                        type="text"
                        placeholder="Enter state"
                        value={item.stateName}
                        onChange={(e) =>
                          updateItem(index, "stateName", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>City Name *</label>
                      <input
                        type="text"
                        placeholder="Enter city"
                        value={item.cityName}
                        onChange={(e) =>
                          updateItem(index, "cityName", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Location Name</label>
                      <input
                        type="text"
                        placeholder="Enter location"
                        value={item.locationName}
                        onChange={(e) =>
                          updateItem(index, "locationName", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Service *</label>
                      <div className={styles.selectWrapper}>
                        <select
                          value={item.service}
                          onChange={(e) =>
                            updateItem(index, "service", e.target.value)
                          }
                        >
                          <option value="">Select service</option>
                          <option value="Virtual Office">Virtual Office</option>
                          <option value="GST Registration">
                            GST Registration
                          </option>
                          <option value="Business Registration">
                            Business Registration
                          </option>
                          <option value="Mailing Address">
                            Mailing Address
                          </option>
                          <option value="Coworking Space">
                            Coworking Space
                          </option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown size={16} />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Plan Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Premium Plan"
                        value={item.planName}
                        onChange={(e) =>
                          updateItem(index, "planName", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Duration</label>
                      <div className={styles.durationInput}>
                        <input
                          type="number"
                          min="1"
                          value={item.duration}
                          onChange={(e) =>
                            updateItem(index, "duration", e.target.value)
                          }
                        />
                        <select
                          value={item.durationUnit}
                          onChange={(e) =>
                            updateItem(index, "durationUnit", e.target.value)
                          }
                        >
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Unit Price (₹) *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(index, "unitPrice", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Discount</label>
                      <div className={styles.durationInput}>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0"
                          value={item.discount}
                          onChange={(e) =>
                            updateItem(index, "discount", e.target.value)
                          }
                        />
                        <select
                          value={item.discountType}
                          onChange={(e) =>
                            updateItem(index, "discountType", e.target.value)
                          }
                        >
                          <option value="amount">₹ Amount</option>
                          <option value="percentage">%</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Tax Rate (%)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.taxRate}
                        onChange={(e) =>
                          updateItem(index, "taxRate", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.itemFooter}>
                    <span>Item Total</span>
                    <strong>
                      {formatCurrency(
                        (() => {
                          const gross =
                            (Number(item.quantity) || 1) *
                            (Number(item.unitPrice) || 0);
                          const discount =
                            item.discountType === "percentage"
                              ? (gross * (Number(item.discount) || 0)) / 100
                              : Number(item.discount) || 0;
                          const net = Math.max(0, gross - discount);
                          const tax = (Number(item.taxRate) || 0) / 100;

                          if (form.taxMode === "exclusive") {
                            return net + net * tax;
                          }
                          return net;
                        })(),
                      )}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={styles.addAnotherButton}
              onClick={addItem}
            >
              <Plus size={17} />
              Add Another Item
            </button>
          </section>

          {/* Price Summary */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.sectionIcon}>
                <Calculator size={19} />
              </div>
              <div>
                <h2>Price Summary</h2>
                <p>Quotation amount breakdown</p>
              </div>
            </div>

            <div className={styles.taxModeSection}>
              <label>Tax Calculation Mode</label>
              <div className={styles.taxModeOptions}>
                {[
                  { value: "exclusive", label: "Tax Exclusive" },
                  { value: "inclusive", label: "Tax Inclusive" },
                  { value: "none", label: "No Tax" },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    className={`${styles.taxModeButton} ${
                      form.taxMode === mode.value ? styles.activeTaxMode : ""
                    }`}
                    onClick={() => updateField("taxMode", mode.value)}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <strong>{formatCurrency(calculations.subtotal)}</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Total Discount</span>
                <strong className={styles.discountValue}>
                  - {formatCurrency(calculations.discountTotal)}
                </strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Taxable Amount</span>
                <strong>{formatCurrency(calculations.taxableAmount)}</strong>
              </div>

              <div className={styles.summaryRow}>
                <span>Total Tax</span>
                <strong>{formatCurrency(calculations.taxTotal)}</strong>
              </div>
            </div>

            <div className={styles.grandTotal}>
              <div>
                <span>Grand Total</span>
                <small>Final quotation amount</small>
              </div>
              <strong>{formatCurrency(calculations.grandTotal)}</strong>
            </div>
          </section>

          <div className={styles.bottomActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.push("/quotations")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              <Save size={16} />
              {saving ? "Creating..." : "Create Quotation"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
