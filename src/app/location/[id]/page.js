import EditLocationModal from "@/components/modals/EditLocationModal";
import CityApiServices from "@/services/api/City.api.services";
import LocationApiServices from "@/services/api/Location.api.services";
import { getDate, getTime } from "@/utils/convertDate";
import EditIcon from "@mui/icons-material/Edit";
import { headers } from "next/headers";
import Image from "next/image";
import classes from "./page.module.css";
import EditLocationImageModal from "@/components/modals/EditLocationImageModal";
import ImagesContainer from "@/components/locations/ImagesContainer";

export default async function LocationPage({ params }) {
  const { id } = params;
  const reqHeaders = headers();
  const token = reqHeaders.get("cookie")?.split("authToken=")[1];

  if (!id || !token) {
    return (
      <div className={classes.container}>
        <div className={classes.marginContainer}>Invalid request.</div>
      </div>
    );
  }

  try {
    const data = await LocationApiServices.getLocationInfo(id, token);
    const locationInfo = data?.location;
    const data2 = await CityApiServices.getAllCities(token);
    const cityData = data2?.cities?.map((city) => ({
      id: city?._id,
      name: city?.name,
    }));

    return (
      <div className={classes.container}>
        {!locationInfo ? (
          <h2 style={{ margin: "12px 0" }}>Something Went Wrong !</h2>
        ) : (
          <div className={classes.marginContainer}>
            <h1 className={classes.name}>{locationInfo.name}</h1>
            <p className={classes.cityName}>({locationInfo?.cityId?.name})</p>

            <div className={classes.container2}>
              <h3>Location Images</h3>
              <ImagesContainer locationInfo={locationInfo} />
            </div>
            <p className={classes.createdText}>
              Created on :<span>{getDate(locationInfo?.createdAt)}</span>
              at
              <span>{getTime(locationInfo?.createdAt)}</span>
            </p>
            <p className={classes.updatedText}>
              Last Updated on : <span>{getDate(locationInfo?.updatedAt)}</span>
              at
              <span>{getTime(locationInfo?.updatedAt)}</span>
            </p>
            <div className={classes.metaDataContainer}>
              <h3>Metadata</h3>
              <label className={classes.label} htmlFor="">
                Title
              </label>
              <p className={classes.metaText}>
                {locationInfo?.metaData?.metaTitle}
              </p>
              <label className={classes.label} htmlFor="">
                Description
              </label>
              <p className={classes.metaText}>
                {locationInfo?.metaData?.metaDescription}
              </p>
              <label className={classes.label} htmlFor="">
                Keyword
              </label>
              <p className={classes.metaText}>
                {locationInfo?.metaData?.metaKeyword}
              </p>
            </div>
            <div className={classes.priceContainer}>
              <h3>Prices</h3>
              <label className={classes.label} htmlFor="">
                Business Registration (Annually)
              </label>
              <p className={classes.metaText}>
                {locationInfo?.businessRegistrationPrice}
              </p>
              <label className={classes.label} htmlFor="">
                GST Registration (Annually)
              </label>
              <p className={classes.metaText}>
                {locationInfo?.gstRegistrationPrice}
              </p>
              <label className={classes.label} htmlFor="">
                Mailing Address (Annually)
              </label>
              <p className={classes.metaText}>
                {locationInfo?.mailingAddressPrice}
              </p>
            </div>
            <div className={classes.priceContainer}>
              <h3>Address</h3>
              <label className={classes.label} htmlFor="">
                Physical Address
              </label>
              <p className={classes.metaText}>{locationInfo?.address}</p>
              <label className={classes.label} htmlFor="">
                x Coordinate
              </label>
              <p className={classes.metaText}>
                {locationInfo?.locationCoordinates?.coordinates[0]}
              </p>
              <label className={classes.label} htmlFor="">
                y Coordinate
              </label>
              <p className={classes.metaText}>
                {locationInfo?.locationCoordinates?.coordinates[1]}
              </p>
            </div>
            <br />
            <EditLocationModal locationInfo={locationInfo} cityData={cityData}>
              <button className={classes.editButton}>
                Edit Location Info
                <EditIcon sx={{ fontSize: "14px", margin: "0 2px" }} />
              </button>
            </EditLocationModal>
            <br />
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching Location info: ", error.message);

    return (
      <div className={classes.container}>
        <div className={classes.marginContainer}>
          An error occurred while fetching the Location details. Please try
          again later.
        </div>
      </div>
    );
  }
}
