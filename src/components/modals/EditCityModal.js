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
  const [rating, setRating] = useState(cityInfo?.rating);
  const [metaDescription, setMetaDescription] = useState(
    cityInfo?.metaData?.metaDescription
  );
  const [metaTitle, setMetaTitle] = useState(cityInfo?.metaData?.metaTitle);
  const [metaKeyword, setMetaKeyword] = useState(
    cityInfo?.metaData?.metaKeyword
  );
  const [businessRegistrationPrice, setBusinessRegistrationPrice] = useState(
    cityInfo?.businessRegistrationPrice
  );
  const [gstRegistrationPrice, setgstRegistrationPrice] = useState(
    cityInfo?.gstRegistrationPrice
  );
  const [mailingAddressPrice, setMailingAddressPrice] = useState(
    cityInfo?.mailingAddressPrice
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
      isNaN(mailingAddressPrice) ||
      isNaN(businessRegistrationPrice) ||
      isNaN(gstRegistrationPrice) ||
      isNaN(rating) ||
      rating > 5
    )
      setFlag(true);
    else if (
      name === cityInfo.name &&
      metaDescription === cityInfo.metaData?.metaDescription &&
      metaTitle === cityInfo.metaData?.metaTitle &&
      metaKeyword === cityInfo.metaData?.metaKeyword &&
      selectedStateId === cityInfo?.stateId?._id &&
      businessRegistrationPrice === cityInfo?.businessRegistrationPrice &&
      gstRegistrationPrice === cityInfo?.gstRegistrationPrice &&
      mailingAddressPrice === cityInfo?.mailingAddressPrice &&
      rating === cityInfo?.rating &&
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
    businessRegistrationPrice,
    gstRegistrationPrice,
    mailingAddressPrice,
    selectedStateId,
    rating,
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
    if (businessRegistrationPrice != cityInfo?.businessRegistrationPrice)
      formData.append("businessRegistrationPrice", businessRegistrationPrice);
    if (gstRegistrationPrice != cityInfo?.gstRegistrationPrice)
      formData.append("gstRegistrationPrice", gstRegistrationPrice);
    if (mailingAddressPrice != cityInfo?.mailingAddressPrice)
      formData.append("mailingAddressPrice", mailingAddressPrice);
    if (rating != cityInfo?.rating) formData.append("rating", rating);
    if (selectedStateId !== "") formData.append("stateId", selectedStateId);
    if (cityBanner) formData.append("file", cityBanner);

    setLoading(true);
    try {
      const data = await CityApiServices.editCity(formData, cityInfo._id);
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
    setName(cityInfo?.name);
    setMetaDescription(cityInfo?.metaData?.metaDescription);
    setMetaKeyword(cityInfo?.metaData?.metaKeyword);
    setMetaTitle(cityInfo?.metaData?.metaTitle);
    setBusinessRegistrationPrice(cityInfo?.businessRegistrationPrice);
    setgstRegistrationPrice(cityInfo?.gstRegistrationPrice);
    setMailingAddressPrice(cityInfo?.mailingAddressPrice);
    setRating(cityInfo?.rating);
    setCityBanner(null);
    setSelectedStateId(cityInfo?.stateId?._id || "");
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
            <label htmlFor="" className={classes.label}>
              Business Registration &#8377; Price (Annually)
            </label>
            <input
              className={classes.input}
              value={businessRegistrationPrice}
              onChange={(e) => {
                setBusinessRegistrationPrice(parseFloat(e.target.value));
              }}
              type="number"
              placeholder="Enter the new Business Registration Price"
            />
            <label htmlFor="" className={classes.label}>
              GST Registration &#8377; Price (Annually)
            </label>
            <input
              className={classes.input}
              value={gstRegistrationPrice}
              onChange={(e) => {
                setgstRegistrationPrice(parseFloat(e.target.value));
              }}
              type="number"
              placeholder="Enter the new GST Registration Price"
            />
            <label htmlFor="" className={classes.label}>
              Mailing Address &#8377; Price (Annually)
            </label>
            <input
              className={classes.input}
              value={mailingAddressPrice}
              onChange={(e) => {
                setMailingAddressPrice(parseFloat(e.target.value));
              }}
              type="number"
              placeholder="Enter the new Mailing Address Price"
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
