import React from "react";
import classes from "./page.module.css";
import HeadingContainer from "@/components/HeadingContainer";
import CityForm from "@/components/forms/CityForm";
import CustomLayout from "@/components/CustomLayout";

function page() {
  return (
    <CustomLayout>
      <div className={classes.container}>
        <div className={classes.marginContainer}>
          <HeadingContainer heading={"Add New City"} />
          <CityForm />
        </div>
      </div>
    </CustomLayout>
  );
}

export default page;
