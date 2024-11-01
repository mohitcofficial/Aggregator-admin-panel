"use client";
import CityApiServices from "@/services/api/City.api.services";
import LocationApiServices from "@/services/api/Location.api.services";
import ClearIcon from "@mui/icons-material/Clear";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import classes from "./LocationForm.module.css";
import Loader from "@/utils/Loader";

function LocationForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");
  const [flag, setFlag] = useState(false);
  const [locationImages, setLocationImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [businessRegistrationPrice, setBusinessRegistrationPrice] =
    useState("");
  const [gstRegistrationPrice, setgstRegistrationPrice] = useState("");
  const [mailingAddressPrice, setMailingAddressPrice] = useState("");
  const [address, setAddress] = useState("");
  const [xCoordinate, setXCoordinate] = useState("");
  const [yCoordinate, setYCoordinate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const data = await CityApiServices.getAllCities();
        const cityData = data.cities.map((city) => ({
          id: city?._id,
          name: city?.name,
        }));
        setCities(cityData);
      } catch (error) {
        console.log("error", error.message);
      }
    };
    fetchCityData();
  }, []);

  useEffect(() => {
    if (
      name.length > 0 &&
      metaDescription.length > 0 &&
      metaTitle.length > 0 &&
      metaKeyword.length > 0 &&
      locationImages.length > 0 &&
      selectedCityId.length > 0 &&
      businessRegistrationPrice.length > 0 &&
      gstRegistrationPrice.length > 0 &&
      mailingAddressPrice.length > 0 &&
      address.length > 0 &&
      xCoordinate.length > 0 &&
      yCoordinate.length > 0
    )
      setFlag(true);
    else setFlag(false);
  }, [
    name,
    metaDescription,
    metaTitle,
    metaKeyword,
    locationImages,
    selectedCityId,
    businessRegistrationPrice,
    gstRegistrationPrice,
    mailingAddressPrice,
    address,
    xCoordinate,
    yCoordinate,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flag) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("metaDescription", metaDescription);
    formData.append("cityId", selectedCityId);
    formData.append("metaTitle", metaTitle);
    formData.append("metaKeyword", metaKeyword);
    formData.append("businessRegistrationPrice", businessRegistrationPrice);
    formData.append("gstRegistrationPrice", gstRegistrationPrice);
    formData.append("mailingAddressPrice", mailingAddressPrice);
    formData.append("address", address);
    formData.append("xCoordinate", xCoordinate);
    formData.append("yCoordinate", yCoordinate);

    locationImages.forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);
    try {
      const data = await LocationApiServices.addNewLocation(formData);
      toast.success(data?.message);
      router.push("/locations");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message);
      console.error("Error submitting form:", error);
    }
  };
  const handleFileChange = (e) => {
    const fileSizeLimit = 300 * 1024;
    const files = Array.from(e.target.files);
    const totalFiles = files.length + locationImages.length;

    if (totalFiles > 6) {
      setFileError("You can only upload a maximum of 6 files.");
      return;
    }

    const validFiles = files.filter((file) => file.size <= fileSizeLimit);
    const invalidFilesCount = files.length - validFiles.length;
    if (invalidFilesCount > 0)
      setFileError(
        `${invalidFilesCount} files were larger than 300KB and not added.`
      );
    else setFileError(null);

    setLocationImages((prevImages) => [...prevImages, ...validFiles]);
    setImageUrls((prevUrls) => [
      ...prevUrls,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const clearImage = () => {
    imageUrls.forEach((url) => URL.revokeObjectURL(url));
    setLocationImages([]);
    setImageUrls([]);
    setFileError(null);
    document.querySelector('input[type="file"]').value = "";
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? All unsaved changes will be lost."
    );

    if (confirmCancel) router.push("/locations");
  };
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {loading && <Loader />}
      <select
        id="stateSelect"
        value={selectedCityId}
        onChange={(e) => setSelectedCityId(e.target.value)}
        required
        className={classes.selectMenu}
      >
        <option className={classes.menuOption} value="">
          Select City
        </option>
        {cities.map((state) => (
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
        placeholder="Enter the Location name"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setBusinessRegistrationPrice(e.target.value);
        }}
        value={businessRegistrationPrice}
        placeholder="Enter the Businsess Registration Price (INR) (Annual)"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setgstRegistrationPrice(e.target.value);
        }}
        value={gstRegistrationPrice}
        placeholder="Enter the GST Registration Price (INR) (Annual)"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setMailingAddressPrice(e.target.value);
        }}
        value={mailingAddressPrice}
        placeholder="Enter the Mailing Address Price (INR) (Annual)"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setMetaTitle(e.target.value);
        }}
        value={metaTitle}
        placeholder="Enter the Location meta title"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setMetaKeyword(e.target.value);
        }}
        value={metaKeyword}
        placeholder="Enter the Location meta keyword"
      />
      <textarea
        type="text"
        className={`${classes.input} ${classes.textArea}`}
        onChange={(e) => {
          setMetaDescription(e.target.value);
        }}
        value={metaDescription}
        placeholder="Enter the Location meta description"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setXCoordinate(e.target.value);
        }}
        value={xCoordinate}
        placeholder="Enter the X Coordinate of Map"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setYCoordinate(e.target.value);
        }}
        value={yCoordinate}
        placeholder="Enter the X Coordinate of Map"
      />
      <textarea
        type="text"
        className={`${classes.input} ${classes.textArea}`}
        onChange={(e) => {
          setAddress(e.target.value);
        }}
        value={address}
        placeholder="Enter the Address of the Location"
      />
      <div className={classes.fileContainer}>
        {locationImages.length > 0 &&
          imageUrls.map((image, index) => (
            <div key={index} className={classes.imagePreviewContainer}>
              <Image
                fill
                src={image}
                alt="Selected Location banner"
                className={classes.previewImage}
              />
            </div>
          ))}
      </div>
      {locationImages.length > 0 && (
        <ClearIcon onClick={clearImage} className={classes.clearButton} />
      )}
      {locationImages.length > 0 && (
        <p>Total Images Selected: {locationImages.length}</p>
      )}
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        multiple
        onChange={handleFileChange}
        className={classes.fileInput}
        disabled={locationImages.length >= 6}
      />
      {fileError && <p className={classes.errorText}>{fileError}</p>}
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

export default LocationForm;
