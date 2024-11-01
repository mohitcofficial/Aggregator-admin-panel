"use client";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import classes from "./EditStateModal.module.css";

import LocationApiServices from "@/services/api/Location.api.services";
import Loader from "@/utils/Loader";
import { useRouter } from "next/navigation";

const style = {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  overflow: "auto",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
  maxHeight: "80%",
};

export default function EditLocationModal({
  children,
  locationInfo,
  cityData,
  reloadFunction,
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(locationInfo?.name);
  const [metaDescription, setMetaDescription] = useState(
    locationInfo?.metaData?.metaDescription
  );
  const [metaTitle, setMetaTitle] = useState(locationInfo?.metaData?.metaTitle);
  const [metaKeyword, setMetaKeyword] = useState(
    locationInfo?.metaData?.metaKeyword
  );
  const [flag, setFlag] = useState(true);
  const [businessRegistrationPrice, setBusinessRegistrationPrice] = useState(
    locationInfo?.businessRegistrationPrice
  );
  const [gstRegistrationPrice, setgstRegistrationPrice] = useState(
    locationInfo?.gstRegistrationPrice
  );
  const [mailingAddressPrice, setMailingAddressPrice] = useState(
    locationInfo?.mailingAddressPrice
  );
  const [address, setAddress] = useState(locationInfo?.address);
  const [xCoordinate, setXCoordinate] = useState(
    locationInfo?.locationCoordinates?.coordinates[0]
  );
  const [yCoordinate, setYCoordinate] = useState(
    locationInfo?.locationCoordinates?.coordinates[1]
  );
  const [selectedCityId, setSelectedCityId] = useState(
    locationInfo?.cityId?._id || ""
  );

  const router = useRouter();

  useEffect(() => {
    if (
      name === locationInfo?.name &&
      metaDescription === locationInfo?.metaData?.metaDescription &&
      metaTitle === locationInfo?.metaData?.metaTitle &&
      metaKeyword === locationInfo?.metaData?.metaKeyword &&
      selectedCityId === locationInfo?.cityId?._id &&
      businessRegistrationPrice === locationInfo?.businessRegistrationPrice &&
      gstRegistrationPrice === locationInfo?.gstRegistrationPrice &&
      mailingAddressPrice === locationInfo?.mailingAddressPrice &&
      address === locationInfo?.address &&
      xCoordinate == locationInfo?.locationCoordinates?.["coordinates"][0] &&
      yCoordinate == locationInfo?.locationCoordinates?.["coordinates"][1]
    )
      setFlag(true);
    else setFlag(false);
  }, [
    name,
    metaDescription,
    metaTitle,
    metaKeyword,
    selectedCityId,
    businessRegistrationPrice,
    gstRegistrationPrice,
    mailingAddressPrice,
    xCoordinate,
    yCoordinate,
    address,
  ]);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (flag) return;

    console.log("type: ", typeof yCoordinate);

    const formData = new FormData();
    if (name != locationInfo.name) formData.append("name", name);
    if (metaDescription != locationInfo?.metaData?.metaDescription)
      formData.append("metaDescription", metaDescription);
    if (metaTitle != locationInfo?.metaData?.metaTitle)
      formData.append("metaTitle", metaTitle);
    if (metaKeyword != locationInfo?.metaData?.metaKeyword)
      formData.append("metaKeyword", metaKeyword);
    if (selectedCityId !== "") formData.append("cityId", selectedCityId);

    if (businessRegistrationPrice != locationInfo?.businessRegistrationPrice)
      formData.append("businessRegistrationPrice", businessRegistrationPrice);
    if (gstRegistrationPrice != locationInfo?.gstRegistrationPrice)
      formData.append("gstRegistrationPrice", gstRegistrationPrice);
    if (mailingAddressPrice != locationInfo?.mailingAddressPrice)
      formData.append("mailingAddressPrice", mailingAddressPrice);
    if (address != locationInfo?.address) formData.append("address", address);
    if (xCoordinate != locationInfo?.locationCoordinates?.coordinates[0])
      formData.append("xCoordinate", xCoordinate);
    if (yCoordinate != locationInfo?.locationCoordinates?.coordinates[1])
      formData.append("yCoordinate", yCoordinate);

    setLoading(true);
    try {
      await LocationApiServices.editLocation(formData, locationInfo._id);
      toast.success("Location Updated Successfully !");
      router.refresh();
      setLoading(false);
      setOpen(false);
      if (reloadFunction) reloadFunction();
      else window.location.reload();
    } catch (error) {
      setLoading(false);
      if (reloadFunction) reloadFunction();
      else window.location.reload();
      console.error("Error submitting form:", error);
    }
  };

  const reset = () => {
    setName(locationInfo?.name);
    setMetaDescription(locationInfo?.metaData?.metaDescription);
    setMetaKeyword(locationInfo?.metaData?.metaKeyword);
    setMetaTitle(locationInfo?.metaData?.metaTitle);
    setBusinessRegistrationPrice(locationInfo?.businessRegistrationPrice);
    setgstRegistrationPrice(locationInfo?.gstRegistrationPrice);
    setMailingAddressPrice(locationInfo?.mailingAddressPrice);
    setAddress(locationInfo?.address);
    setXCoordinate(locationInfo?.locationCoordinates?.["coordinates"][0]);
    setYCoordinate(locationInfo?.locationCoordinates?.["coordinates"][1]);
    setSelectedCityId(locationInfo?.cityId?._id || "");
  };

  const handleClose = () => {
    if (
      name === locationInfo?.name &&
      metaDescription === locationInfo?.metaData?.metaDescription &&
      metaTitle === locationInfo?.metaData?.metaTitle &&
      metaKeyword === locationInfo?.metaData?.metaKeyword &&
      selectedCityId === locationInfo?.cityId?._id &&
      businessRegistrationPrice === locationInfo?.businessRegistrationPrice &&
      gstRegistrationPrice === locationInfo?.gstRegistrationPrice &&
      mailingAddressPrice === locationInfo?.mailingAddressPrice &&
      address === locationInfo?.address &&
      xCoordinate === locationInfo?.locationCoordinates?.["coordinates"][0] &&
      yCoordinate === locationInfo?.locationCoordinates?.["coordinates"][1]
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
              placeholder="Enter the new Location name"
            />
            <label htmlFor="" className={classes.label}>
              City
            </label>
            <select
              id="citySelect"
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              required
              className={classes.selectMenu}
            >
              <option className={classes.menuOption} value="">
                Select City
              </option>
              {cityData?.map((city) => (
                <option
                  className={classes.menuOption}
                  key={city.id}
                  value={city.id}
                >
                  {city?.name}
                </option>
              ))}
            </select>
            <br />
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
            <br />
            <label htmlFor="" className={classes.label}>
              Business Registration &#8377; Price (Annually)
            </label>
            <input
              className={classes.input}
              value={businessRegistrationPrice}
              onChange={(e) => {
                setBusinessRegistrationPrice(parseFloat(e.target.value));
              }}
              type="text"
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
              type="text"
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
              type="text"
              placeholder="Enter the new Mailing Address Price"
            />
            <br />
            <label htmlFor="" className={classes.label}>
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              className={`${classes.input} ${classes.textArea}`}
              type="text"
              placeholder="Enter the new Physical Address"
            />
            <label htmlFor="" className={classes.label}>
              X Coordinate
            </label>
            <input
              className={classes.input}
              value={xCoordinate}
              onChange={(e) => {
                setXCoordinate(parseFloat(e.target.value));
              }}
              type="number"
              step="0.01"
              placeholder="Enter the new X Coordinate of location"
            />
            <label htmlFor="" className={classes.label}>
              Y Coordinate
            </label>
            <input
              className={classes.input}
              value={yCoordinate}
              onChange={(e) => {
                setYCoordinate(parseFloat(e.target.value));
              }}
              type="number"
              step="0.01"
              placeholder="Enter the new Y Coordinate of location"
            />
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
