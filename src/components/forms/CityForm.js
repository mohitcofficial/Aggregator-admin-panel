"use client";
import React, { useEffect, useState } from "react";
import classes from "./CityForm.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import StateAPIs from "../../services/api/State.api.services";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CityApiServices from "@/services/api/City.api.services";
import toast from "react-hot-toast";
import Loader from "@/utils/Loader";

function CityForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");
  const [cityBanner, setCityBanner] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [flag, setFlag] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [businessRegistrationPrice, setBusinessRegistrationPrice] =
    useState("");
  const [gstRegistrationPrice, setgstRegistrationPrice] = useState("");
  const [mailingAddressPrice, setMailingAddressPrice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const data = await StateAPIs.getAllStates();
        const stateData = data.states.map((state) => ({
          id: state?._id,
          name: state?.name,
        }));
        setStates(stateData);
      } catch (error) {
        console.log("error", error.message);
      }
    };
    fetchStateData();
  }, []);

  useEffect(() => {
    if (
      name.length > 0 &&
      metaDescription.length > 0 &&
      metaTitle.length > 0 &&
      metaKeyword.length > 0 &&
      cityBanner &&
      selectedStateId.length > 0 &&
      businessRegistrationPrice.length > 0 &&
      gstRegistrationPrice.length > 0 &&
      mailingAddressPrice.length > 0
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
    businessRegistrationPrice,
    gstRegistrationPrice,
    mailingAddressPrice,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flag) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("metaDescription", metaDescription);
    formData.append("stateId", selectedStateId);
    formData.append("metaTitle", metaTitle);
    formData.append("metaKeyword", metaKeyword);
    formData.append("businessRegistrationPrice", businessRegistrationPrice);
    formData.append("gstRegistrationPrice", gstRegistrationPrice);
    formData.append("mailingAddressPrice", mailingAddressPrice);
    formData.append("file", cityBanner);

    setLoading(true);

    try {
      const data = await CityApiServices.addNewCity(formData);
      toast.success(data?.message);
      router.push("/cities");
      setLoading(false);
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
  const handleCancel = () => {
    if (
      name.length === 0 &&
      metaDescription.length === 0 &&
      metaTitle.length === 0 &&
      metaKeyword.length === 0 &&
      !cityBanner &&
      selectedStateId.length === 0
    ) {
      router.push("/cities");
      return;
    }
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? All unsaved changes will be lost."
    );

    if (confirmCancel) router.push("/cities");
  };
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {loading && <Loader />}
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
        {states.map((state) => (
          <option
            className={classes.menuOption}
            key={state.id}
            value={state.id}
          >
            {state.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
        placeholder="Enter the City name"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setMetaTitle(e.target.value);
        }}
        value={metaTitle}
        placeholder="Enter the City meta title"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setMetaKeyword(e.target.value);
        }}
        value={metaKeyword}
        placeholder="Enter the City meta keyword"
      />
      <textarea
        type="text"
        className={`${classes.input} ${classes.textArea}`}
        onChange={(e) => {
          setMetaDescription(e.target.value);
        }}
        value={metaDescription}
        placeholder="Enter the City meta description"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setBusinessRegistrationPrice(e.target.value);
        }}
        value={businessRegistrationPrice}
        placeholder="Enter the starting Businsess Registration Price (INR) (Annual)"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setgstRegistrationPrice(e.target.value);
        }}
        value={gstRegistrationPrice}
        placeholder="Enter the starting GST Registration Price (INR) (Annual)"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setMailingAddressPrice(e.target.value);
        }}
        value={mailingAddressPrice}
        placeholder="Enter the starting Mailing Address Price (INR) (Annual)"
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
          <ClearIcon onClick={clearImage} className={classes.clearButton} />
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
        <button onClick={handleCancel} className={classes.cancelButton}>
          Cancel
        </button>
        <button
          style={{
            backgroundColor: !flag && "#1f6f8ccc",
            cursor: !flag && "not-allowed",
          }}
          disabled={!flag}
          className={classes.createButton}
          type="submit"
        >
          Create
        </button>
      </div>
    </form>
  );
}

export default CityForm;
