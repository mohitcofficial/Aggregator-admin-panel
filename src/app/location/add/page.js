import React from "react";
import classes from "./page.module.css";
import HeadingContainer from "@/components/HeadingContainer";
import LocationForm from "@/components/forms/LocationForm";

function page() {
  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <HeadingContainer heading={"Add New Location"} />
        <LocationForm />
      </div>
    </div>
  );
}

export default page;
