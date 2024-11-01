import React from "react";
import classes from "./page.module.css";
import HeadingContainer from "@/components/HeadingContainer";
import CityForm from "@/components/forms/CityForm";

function page() {
  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <HeadingContainer heading={"Add New City"} />
        <CityForm />
      </div>
    </div>
  );
}

export default page;
