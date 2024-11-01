import React from "react";
import classes from "./page.module.css";
import STATEAPIs from "../../../services/api/State.api.services";
import { headers } from "next/headers";
import Image from "next/image";
import { getDate, getTime } from "@/utils/convertDate";
import EditStateModal from "@/components/modals/EditStateModal";
import EditIcon from "@mui/icons-material/Edit";

export default async function StatePage({ params }) {
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
    const response = await STATEAPIs.getStateInfo(id, token);
    const stateInfo = response?.state;

    return (
      <div className={classes.container}>
        {!stateInfo ? (
          <h2 style={{ margin: "12px 0" }}>Something Went Wrong !</h2>
        ) : (
          <div className={classes.marginContainer}>
            <h1 className={classes.name}>{stateInfo.name}</h1>
            {stateInfo.bannerImage[0]?.url && (
              <div className={classes.imageContainer}>
                <Image
                  width={350}
                  height={100}
                  src={stateInfo?.bannerImage[0]?.url}
                  alt="Selected state banner"
                  className={classes.image}
                />
              </div>
            )}
            <p className={classes.createdText}>
              Created on :<span>{getDate(stateInfo?.createdAt)}</span>
              at
              <span>{getTime(stateInfo?.createdAt)}</span>
            </p>
            <p className={classes.updatedText}>
              Last Updated on : <span>{getDate(stateInfo?.updatedAt)}</span>
              at
              <span>{getTime(stateInfo?.updatedAt)}</span>
            </p>
            <div className={classes.metaDataContainer}>
              <h3>Metadata</h3>
              <label className={classes.label} htmlFor="">
                Title
              </label>
              <p className={classes.metaText}>
                {stateInfo?.metaData?.metaTitle}
              </p>
              <label className={classes.label} htmlFor="">
                Description
              </label>
              <p className={classes.metaText}>
                {stateInfo?.metaData?.metaDescription}
              </p>
              <label className={classes.label} htmlFor="">
                Keyword
              </label>
              <p className={classes.metaText}>
                {stateInfo?.metaData?.metaKeyword}
              </p>
            </div>
            <EditStateModal stateInfo={stateInfo}>
              <button className={classes.editButton}>
                Edit State
                <EditIcon sx={{ fontSize: "14px", margin: "0 2px" }} />
              </button>
            </EditStateModal>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching state info: ", error.message);

    return (
      <div className={classes.container}>
        <div className={classes.marginContainer}>
          An error occurred while fetching the state details. Please try again
          later.
        </div>
      </div>
    );
  }
}
