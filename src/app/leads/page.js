import React from "react";
import classes from "./page.module.css";
import HeadingContainer from "@/components/HeadingContainer";
import LeadContainer from "@/components/leads/LeadContainer";

function page() {
  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <HeadingContainer heading={"Leads"} />
        <LeadContainer />
      </div>
    </div>
  );
}

export default page;
