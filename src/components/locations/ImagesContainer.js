"use client";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoIcon from "@mui/icons-material/Photo";
import Image from "next/image";
import classes from "./ImagesContainer.module.css";
import LocationApiServices from "@/services/api/Location.api.services";
import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/utils/Loader";
import { useRouter } from "next/navigation";

function ImagesContainer({ locationInfo }) {
  const [fileError, setFileError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdateImage = async (e, photoId) => {
    const file = e.target.files[0];
    if (file && file.size > 300 * 1024) {
      setFileError("File size must be less than 300KB");
      e.target.value = "";
      return;
    }

    setFileError(null);

    if (locationInfo && locationInfo._id && photoId) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("locationId", locationInfo._id);

      setLoading(true);
      try {
        const data = await LocationApiServices.updateLocationImage(
          formData,
          photoId
        );
        setLoading(false);
        toast.success(data.message);
        window.location.reload();
      } catch (error) {
        setLoading(false);
        toast.error("Something Went Wrong !");
        console.log("error: ", error.message);
      }
    } else {
      toast.error("Something Went Wrong !");
    }
  };
  const handleDelete = async (id) => {
    if (locationInfo && locationInfo._id && id) {
      const confirmCancel = window.confirm(
        "Are you sure you want to delete the State?"
      );

      if (confirmCancel) {
        try {
          const data = await LocationApiServices.deleteLocationImage(id, {
            locationId: locationInfo._id,
          });
          toast.success(data?.message);
          window.location.reload();
        } catch (error) {
          toast.error("Something Went Wrong ! second loop");
          console.log(error.message);
        }
      }
    } else {
      toast.error("Something Went Wrong ! first loop");
    }
  };
  return (
    <div className={classes.gridContainer}>
      {loading && <Loader />}
      {locationInfo?.images?.map((img, index) => (
        <div key={index} className={classes.imageContainer}>
          <Image
            src={img?.url}
            alt="Selected city banner"
            className={classes.image}
            fill
          />
          <div className={classes.overlay}>
            <label className={`${classes.button} ${classes.updateButton}`}>
              <PhotoIcon />
              <input
                type="file"
                className={classes.fileInput}
                onChange={(e) => handleUpdateImage(e, img._id)}
                accept="image/*"
              />
            </label>
            <button
              onClick={() => handleDelete(img._id)}
              className={`${classes.button} ${classes.deleteButton}`}
            >
              <DeleteIcon />
            </button>
          </div>
        </div>
      ))}
      {fileError && <p className={classes.errorText}>{fileError}</p>}
    </div>
  );
}

export default ImagesContainer;
