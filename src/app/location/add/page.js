import React from "react";
import classes from "./page.module.css";
import HeadingContainer from "@/components/HeadingContainer";
import LocationForm from "@/components/forms/LocationForm";
import CustomLayout from "@/components/CustomLayout";

function page() {
  return (
    <CustomLayout>
      <div className={classes.container}>
        <div className={classes.marginContainer}>
          <HeadingContainer heading={"Add New Location"} />
          <LocationForm />
        </div>
      </div>
    </CustomLayout>
  );
}

export default page;
