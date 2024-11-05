import React from "react";
import classes from "./page.module.css";
import { headers } from "next/headers";
import Image from "next/image";
import { getDate, getTime } from "@/utils/convertDate";
import EditIcon from "@mui/icons-material/Edit";
import CityApiServices from "@/services/api/City.api.services";
import EditCityModal from "@/components/modals/EditCityModal";
import StateApiServices from "@/services/api/State.api.services";
import CustomLayout from "@/components/CustomLayout";

export default async function CityPage({ params }) {
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
    const data = await CityApiServices.getCityInfo(id, token);
    const data2 = await StateApiServices.getAllStates(token);
    const cityInfo = data?.city;
    const stateData = data2?.states?.map((state) => ({
      id: state?._id,
      name: state?.name,
    }));

    return (
      <CustomLayout>
        <div className={classes.container}>
          {!cityInfo ? (
            <h2 style={{ margin: "12px 0" }}>Something Went Wrong !</h2>
          ) : (
            <div className={classes.marginContainer}>
              <h1 className={classes.name}>{cityInfo.name}</h1>
              <p className={classes.stateName}>({cityInfo?.stateId?.name})</p>
              {cityInfo.bannerImage[0]?.url && (
                <div className={classes.imageContainer}>
                  <Image
                    width={350}
                    height={100}
                    src={cityInfo?.bannerImage[0]?.url}
                    alt="Selected city banner"
                    className={classes.image}
                  />
                </div>
              )}
              <p className={classes.createdText}>
                Created on :<span>{getDate(cityInfo?.createdAt)}</span>
                at
                <span>{getTime(cityInfo?.createdAt)}</span>
              </p>
              <p className={classes.updatedText}>
                Last Updated on : <span>{getDate(cityInfo?.updatedAt)}</span>
                at
                <span>{getTime(cityInfo?.updatedAt)}</span>
              </p>
              <div className={classes.metaDataContainer}>
                <h3>Metadata</h3>
                <label className={classes.label} htmlFor="">
                  Title
                </label>
                <p className={classes.metaText}>
                  {cityInfo?.metaData?.metaTitle}
                </p>
                <label className={classes.label} htmlFor="">
                  Description
                </label>
                <p className={classes.metaText}>
                  {cityInfo?.metaData?.metaDescription}
                </p>
                <label className={classes.label} htmlFor="">
                  Keyword
                </label>
                <p className={classes.metaText}>
                  {cityInfo?.metaData?.metaKeyword}
                </p>
              </div>
              <div className={classes.priceContainer}>
                <h3>Starting Prices</h3>
                <label className={classes.label} htmlFor="">
                  Business Registration (Annually)
                </label>
                <p className={classes.metaText}>
                  {cityInfo?.businessRegistrationPrice}
                </p>
                <label className={classes.label} htmlFor="">
                  GST Registration (Annually)
                </label>
                <p className={classes.metaText}>
                  {cityInfo?.gstRegistrationPrice}
                </p>
                <label className={classes.label} htmlFor="">
                  Mailing Address (Annually)
                </label>
                <p className={classes.metaText}>
                  {cityInfo?.mailingAddressPrice}
                </p>
              </div>
              <br />
              <EditCityModal cityInfo={cityInfo} stateData={stateData}>
                <button className={classes.editButton}>
                  Edit City
                  <EditIcon sx={{ fontSize: "14px", margin: "0 2px" }} />
                </button>
              </EditCityModal>
              <br />
            </div>
          )}
        </div>
      </CustomLayout>
    );
  } catch (error) {
    console.error("Error fetching city info: ", error.message);

    return (
      <CustomLayout>
        <div className={classes.container}>
          <div className={classes.marginContainer}>
            An error occurred while fetching the City details. Please try again
            later.
          </div>
        </div>
      </CustomLayout>
    );
  }
}
