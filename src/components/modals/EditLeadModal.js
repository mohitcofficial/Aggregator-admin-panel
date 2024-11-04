"use client";
import LeadsApiServices from "@/services/api/Lead.api.services";
import Loader from "@/utils/Loader";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import classes from "./EditStateModal.module.css";

const style = {
  position: "absolute",
  overflow: "auto",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const originOptions = ["Mail", "Phone", "Whatsapp", "Others"];
const statusOptions = ["Unseen", "Contacted", "Converted", "Not Interested"];

function EditLeadModal({ id, origin, status, fetchLeadsData, children }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [loading, setLoading] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState(origin);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    if (selectedOrigin === origin && selectedStatus === status) setFlag(true);
    else setFlag(false);
  }, [selectedOrigin, selectedStatus]);

  const reset = () => {
    setSelectedOrigin(origin);
    setSelectedStatus(status);
  };

  const handleClose = () => {
    if (selectedOrigin === origin && selectedStatus === status) {
      setOpen(false);
      return;
    }
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? All unsaved changes will be lost."
    );

    if (confirmCancel) {
      setOpen(false);
      reset();
    }
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const body = {};
    if (selectedOrigin !== origin) body.origin = selectedOrigin;
    if (selectedStatus !== status) body.status = selectedStatus;
    try {
      const data = await LeadsApiServices.updateLead(body, id);
      fetchLeadsData();
      setOpen(false);
      toast.success(data?.message);
    } catch (error) {
      toast.error("Something Went Wrong !");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {loading && <Loader />}
      <div onClick={handleOpen}>{children}</div>
      <Modal
        open={open}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className={classes.modalInnerContainer}>
          <form
            className={classes.form}
            onSubmit={formSubmitHandler}
            method="POST"
          >
            <label htmlFor="" className={classes.label}>
              Origin
            </label>
            <select
              id="originSelect"
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              required
              className={classes.selectMenu}
            >
              {originOptions?.map((origin, index) => (
                <option
                  className={classes.menuOption}
                  key={index}
                  value={origin}
                >
                  {origin}
                </option>
              ))}
            </select>
            <label htmlFor="" className={classes.label}>
              Status
            </label>
            <select
              id="statusSelect"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
              className={classes.selectMenu}
            >
              {statusOptions?.map((status, index) => (
                <option
                  className={classes.menuOption}
                  key={index}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>
            <div className={classes.buttonContainer}>
              <button onClick={handleClose} className={classes.cancelButton}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={flag}
                style={{
                  cursor: flag && "not-allowed",
                  backgroundColor: flag && "#1f6f8ccc",
                }}
                className={classes.updateButton}
              >
                Update
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default EditLeadModal;
