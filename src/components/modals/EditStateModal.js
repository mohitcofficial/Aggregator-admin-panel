"use client";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import React, { useEffect, useRef, useState } from "react";
import classes from "./EditStateModal.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import Image from "next/image";
import StateApiServices from "@/services/api/State.api.services";
import Loader from "@/utils/Loader";

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

export default function EditStateModal({ children, stateInfo }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(stateInfo?.name);
  const [rating, setRating] = useState(stateInfo?.rating);
  const [metaDescription, setMetaDescription] = useState(
    stateInfo?.metaData?.metaDescription
  );
  const [metaTitle, setMetaTitle] = useState(stateInfo?.metaData?.metaTitle);
  const [metaKeyword, setMetaKeyword] = useState(
    stateInfo?.metaData?.metaKeyword
  );
  const [stateBanner, setStateBanner] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [flag, setFlag] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (isNaN(rating) || parseFloat(rating) > 5) setFlag(true);
    else if (
      name === stateInfo.name &&
      metaDescription === stateInfo.metaData?.metaDescription &&
      metaTitle === stateInfo.metaData?.metaTitle &&
      metaKeyword === stateInfo.metaData?.metaKeyword &&
      rating === stateInfo?.rating &&
      !stateBanner
    )
      setFlag(true);
    else setFlag(false);
  }, [name, metaDescription, metaTitle, metaKeyword, stateBanner, rating]);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (flag) return;

    const formData = new FormData();
    if (name != stateInfo.name) formData.append("name", name);
    if (metaDescription != stateInfo?.metaData?.metaDescription)
      formData.append("metaDescription", metaDescription);
    if (metaTitle != stateInfo?.metaData?.metaTitle)
      formData.append("metaTitle", metaTitle);
    if (metaKeyword != stateInfo?.metaData?.metaKeyword)
      formData.append("metaKeyword", metaKeyword);
    if (rating != stateInfo?.rating) formData.append("rating", rating);
    if (stateBanner) formData.append("file", stateBanner);

    setLoading(true);
    try {
      const data = await StateApiServices.editState(formData, stateInfo._id);
      toast.success(data?.message);
      router.refresh();
      setLoading(false);
      setOpen(false);
    } catch (error) {
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
      setStateBanner(null);
      setImageUrl(null);
      e.target.value = "";
    } else {
      setFileError(null);
      setStateBanner(file);
      const newUrl = URL.createObjectURL(file);
      setImageUrl(newUrl);
    }
  };
  const clearImage = () => {
    if (imageUrl) URL.revokeObjectURL(stateBanner);
    setStateBanner(null);
    setFileError(null);
    document.querySelector('input[type="file"]').value = "";
  };

  const reset = () => {
    setName(stateInfo?.name);
    setMetaDescription(stateInfo?.metaData?.metaDescription);
    setMetaKeyword(stateInfo?.metaData?.metaKeyword);
    setMetaTitle(stateInfo?.metaData?.metaTitle);
    setRating(stateInfo?.rating);
    setStateBanner(null);
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
            <label htmlFor="" className={classes.label}>
              Name
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className={classes.input}
              type="text"
              placeholder="Enter the new State name"
            />
            <label htmlFor="" className={classes.label}>
              Rating
            </label>
            <input
              value={rating}
              onChange={(e) => {
                setRating(parseFloat(e.target.value));
              }}
              className={classes.input}
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="Enter the new rating"
            />
            <label htmlFor="" className={classes.label}>
              Meta Title
            </label>
            <input
              value={metaTitle}
              onChange={(e) => {
                setMetaTitle(e.target.value);
              }}
              className={classes.input}
              type="text"
              placeholder="Enter the new Meta Title"
            />
            <label htmlFor="" className={classes.label}>
              Meta Keyword
            </label>
            <input
              className={classes.input}
              value={metaKeyword}
              onChange={(e) => {
                setMetaKeyword(e.target.value);
              }}
              type="text"
              placeholder="Enter the new Meta Keyword"
            />
            <label htmlFor="" className={classes.label}>
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => {
                setMetaDescription(e.target.value);
              }}
              className={`${classes.input} ${classes.textArea}`}
              type="text"
              placeholder="Enter the new Meta Description"
            />
            <div className={classes.fileContainer}>
              {stateBanner && (
                <div className={classes.imagePreviewContainer}>
                  <Image
                    width={350}
                    height={100}
                    src={imageUrl}
                    alt="Selected state banner"
                    className={classes.previewImage}
                  />
                </div>
              )}
              {stateBanner && (
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
                Update
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
