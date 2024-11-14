"use client";
import ClearIcon from "@mui/icons-material/Clear";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import classes from "./EditStateModal.module.css";

import CityApiServices from "@/services/api/City.api.services";
import Loader from "@/utils/Loader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LocationApiServices from "@/services/api/Location.api.services";

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

export default function AddLocationImageModal({
  children,
  locationInfo,
  reloadFunction,
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [loading, setLoading] = useState(false);
  const [cityBanner, setCityBanner] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [flag, setFlag] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!cityBanner) setFlag(true);
    else setFlag(false);
  }, [cityBanner]);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (flag) return;

    const formData = new FormData();
    if (cityBanner) formData.append("file", cityBanner);

    setLoading(true);
    try {
      const data = await LocationApiServices.addMoreLocationImage(
        formData,
        locationInfo._id
      );
      toast.success(data?.message);
      router.refresh();
      setLoading(false);
      if (reloadFunction) reloadFunction();
      else window.location.reload();
      setOpen(false);
    } catch (error) {
      toast.error("Something Went Wrong !");
      if (reloadFunction) reloadFunction();
      else window.location.reload();
      setLoading(false);
      console.error("Error submitting form:", error);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    if (file && file.size > 300 * 1024) {
      setFileError("File size must be less than 300KB");
      setCityBanner(null);
      setImageUrl(null);
      e.target.value = "";
    } else {
      setFileError(null);
      setCityBanner(file);
      const newUrl = URL.createObjectURL(file);
      setImageUrl(newUrl);
    }
  };
  const clearImage = () => {
    if (imageUrl) URL.revokeObjectURL(cityBanner);
    setCityBanner(null);
    setFileError(null);
    document.querySelector('input[type="file"]').value = "";
  };

  const reset = () => {
    setCityBanner(null);
  };

  const handleClose = () => {
    if (flag) {
      setOpen(false);
      reset();
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
            <div className={classes.fileContainer}>
              {cityBanner && (
                <div className={classes.imagePreviewContainer}>
                  <Image
                    width={350}
                    height={100}
                    src={imageUrl}
                    alt="Selected city banner"
                    className={classes.previewImage}
                  />
                </div>
              )}
              {cityBanner && (
                <ClearIcon
                  onClick={clearImage}
                  className={classes.clearButton}
                />
              )}
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className={classes.fileInput}
              />
              {fileError && <p className={classes.errorText}>{fileError}</p>}
            </div>
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
                Upload
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
