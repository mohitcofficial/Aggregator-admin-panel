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

export default function EditCityModal({
  children,
  cityInfo,
  stateData,
  reloadFunction,
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(cityInfo?.name);
  const [metaDescription, setMetaDescription] = useState(
    cityInfo?.metaData?.metaDescription
  );
  const [metaTitle, setMetaTitle] = useState(cityInfo?.metaData?.metaTitle);
  const [metaKeyword, setMetaKeyword] = useState(
    cityInfo?.metaData?.metaKeyword
  );
  const [cityBanner, setCityBanner] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [flag, setFlag] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(
    cityInfo?.stateId?._id || ""
  );

  const router = useRouter();

  useEffect(() => {
    if (
      name === cityInfo.name &&
      metaDescription === cityInfo.metaData?.metaDescription &&
      metaTitle === cityInfo.metaData?.metaTitle &&
      metaKeyword === cityInfo.metaData?.metaKeyword &&
      selectedStateId === cityInfo?.stateId?._id &&
      !cityBanner
    )
      setFlag(true);
    else setFlag(false);
  }, [
    name,
    metaDescription,
    metaTitle,
    metaKeyword,
    cityBanner,
    selectedStateId,
  ]);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (flag) return;

    const formData = new FormData();
    if (name != cityInfo.name) formData.append("name", name);
    if (metaDescription != cityInfo?.metaData?.metaDescription)
      formData.append("metaDescription", metaDescription);
    if (metaTitle != cityInfo?.metaData?.metaTitle)
      formData.append("metaTitle", metaTitle);
    if (metaKeyword != cityInfo?.metaData?.metaKeyword)
      formData.append("metaKeyword", metaKeyword);
    if (selectedStateId !== "") formData.append("stateId", selectedStateId);
    if (cityBanner) formData.append("file", cityBanner);

    setLoading(true);
    try {
      await CityApiServices.editCity(formData, cityInfo._id);
      toast.success("City Updated Successfully !");
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
    setName(cityInfo?.name);
    setMetaDescription(cityInfo?.metaData?.metaDescription);
    setMetaKeyword(cityInfo?.metaData?.metaKeyword);
    setMetaTitle(cityInfo?.metaData?.metaTitle);
    setCityBanner(null);
    setSelectedStateId(cityInfo?.stateId?._id || "");
  };

  const handleClose = () => {
    if (
      name === cityInfo.name &&
      metaDescription === cityInfo.metaData?.metaDescription &&
      metaTitle === cityInfo?.metaData?.metaTitle &&
      metaKeyword === cityInfo?.metaData?.metaKeyword &&
      !cityBanner
    ) {
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
              placeholder="Enter the new City name"
            />
            <label htmlFor="" className={classes.label}>
              State
            </label>
            <select
              id="stateSelect"
              value={selectedStateId}
              onChange={(e) => setSelectedStateId(e.target.value)}
              required
              className={classes.selectMenu}
            >
              <option className={classes.menuOption} value="">
                Select State
              </option>
              {stateData?.map((state) => (
                <option
                  className={classes.menuOption}
                  key={state.id}
                  value={state.id}
                >
                  {state.name}
                </option>
              ))}
            </select>
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
                Update
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
