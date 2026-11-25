"use client";

import React, { useState } from "react";
import styles from "./EditQuotationModal.module.css";
import QuotationApiServices from "@/services/api/Quotation.api.services";

function EditQuotationModal({ quotation, setShowEditModal, fetchQuotation }) {
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    items: quotation.items?.map((item) => ({ ...item })) || [],
    taxMode: quotation.taxMode || "exclusive",
    validUntil: quotation.validUntil
      ? new Date(quotation.validUntil).toISOString().split("T")[0]
      : "",
    notes: quotation.notes || "",
    terms: quotation.terms || "",
  });

  const handleItemChange = (index, field, value) => {
    setEditForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const handleSaveQuotation = async () => {
    try {
      setSaving(true);

      const payload = {
        items: editForm.items,
        taxMode: editForm.taxMode,
        validUntil: editForm.validUntil,
        notes: editForm.notes,
        terms: editForm.terms,
      };

      await QuotationApiServices.update(id, payload);
      fetchQuotation();

      setShowEditModal(false);

      toast.success("Quotation updated successfully");
    } catch (error) {
      console.error("Update quotation error:", error);
      toast.error(
        error?.response?.data?.message || "Unable to update quotation",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.editModal}>
        <div className={styles.modalHeader}>
          <div>
            <h2>Edit Quotation</h2>
            <p>Quotation #{quotation?.quotationNumber}</p>
          </div>

          <button
            className={styles.closeModal}
            onClick={() => setShowEditModal(false)}
            type="button"
          >
            Close
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Quotation Items */}
          <div className={styles.modalSection}>
            <h3>Quotation Items</h3>
            {editForm.items.map((item, index) => (
              <div className={styles.itemEditCard} key={item._id || index}>
                <h4>
                  Item {index + 1}:{" "}
                  {item.service || item.serviceName || "Quotation Item"}
                </h4>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Service / Plan</label>
                    <input
                      value={item.planName || item.service || ""}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          item.planName !== undefined ? "planName" : "service",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Duration</label>
                    <input
                      value={item.duration || ""}
                      onChange={(e) =>
                        handleItemChange(index, "duration", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity ?? 1}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Unit Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={item.unitPrice ?? 0}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "unitPrice",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Discount</label>
                    <input
                      type="number"
                      min="0"
                      value={item.discount ?? 0}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "discount",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tax Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      value={item.taxRate ?? 0}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "taxRate",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Other Details */}
          <div className={styles.modalSection}>
            <h3>Other Details</h3>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Valid Until</label>
                <input
                  type="date"
                  value={editForm.validUntil}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      validUntil: e.target.value,
                    }))
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Tax Mode</label>
                <select
                  value={editForm.taxMode}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      taxMode: e.target.value,
                    }))
                  }
                >
                  <option value="exclusive">Tax Exclusive</option>
                  <option value="inclusive">Tax Inclusive</option>
                  <option value="none">No Tax</option>
                </select>
              </div>

              <div className={styles.formGroupFull}>
                <label>Notes</label>
                <textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                />
              </div>

              <div className={styles.formGroupFull}>
                <label>Terms & Conditions</label>
                <textarea
                  rows={5}
                  value={editForm.terms}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      terms: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={() => setShowEditModal(false)}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className={styles.saveButton}
            onClick={handleSaveQuotation}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditQuotationModal;
