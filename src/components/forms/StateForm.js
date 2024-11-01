"use client";
import React, { useEffect, useState } from "react";
import classes from "./StateForm.module.css";
import UploadIcon from "@mui/icons-material/Upload";
import ClearIcon from "@mui/icons-material/Clear";
import StateAPIs from "../../services/api/State.api.services";
import Image from "next/image";
import { useRouter } from "next/navigation";

function StateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");
  const [stateBanner, setStateBanner] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [flag, setFlag] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (
      name.length > 0 &&
      metaDescription.length > 0 &&
      metaTitle.length > 0 &&
      metaKeyword.length > 0 &&
      stateBanner
    )
      setFlag(true);
    else setFlag(false);
  }, [name, metaDescription, metaTitle, metaKeyword, stateBanner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flag) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("metaDescription", metaDescription);
    formData.append("metaTitle", metaTitle);
    formData.append("metaKeyword", metaKeyword);
    formData.append("file", stateBanner);

    try {
      const data = await StateAPIs.addNewState(formData);
      router.push("/states");
      console.log("apiData: ", data);
    } catch (error) {
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
  const handleCancel = () => {
    if (
      name.length === 0 &&
      metaDescription.length === 0 &&
      metaTitle.length === 0 &&
      metaKeyword.length === 0 &&
      !stateBanner
    ) {
      router.push("/states");
      return;
    }
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? All unsaved changes will be lost."
    );

    if (confirmCancel) router.push("/states");
  };
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
        placeholder="Enter the State name"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setMetaTitle(e.target.value);
        }}
        value={metaTitle}
        placeholder="Enter the State meta title"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setMetaKeyword(e.target.value);
        }}
        value={metaKeyword}
        placeholder="Enter the State meta keyword"
      />
      <textarea
        type="text"
        className={`${classes.input} ${classes.textArea}`}
        onChange={(e) => {
          setMetaDescription(e.target.value);
        }}
        value={metaDescription}
        placeholder="Enter the State meta description"
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

export default StateForm;
