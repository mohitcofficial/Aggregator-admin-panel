import React from "react";
import classes from "./page.module.css";
import HeadingContainer from "@/components/HeadingContainer";
import StateForm from "@/components/forms/StateForm";

function page() {
  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <HeadingContainer heading={"Add New State"} />
        <StateForm />
      </div>
    </div>
  );
}

export default page;