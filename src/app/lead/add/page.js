import React from "react";
import classes from "./page.module.css";
import HeadingContainer from "@/components/HeadingContainer";
import LeadForm from "@/components/forms/LeadForm";

function page() {
  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <HeadingContainer heading={"Add Lead"} />
        <LeadForm />
      </div>
    </div>
  );
}

export default page;
