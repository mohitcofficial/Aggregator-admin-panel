"use client";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import classes from "./EditStateModal.module.css";

import Loader from "@/utils/Loader";
import { useRouter } from "next/navigation";

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

export default function EditLocationImageModal({
  children,
  cityInfo,
  stateData,
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const reset = () => {};

  const handleClose = () => {
    reset();
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
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
            images
          </form>
        </Box>
      </Modal>
    </div>
  );
}
