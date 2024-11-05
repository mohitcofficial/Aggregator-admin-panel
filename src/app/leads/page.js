import React from "react";
import classes from "./page.module.css";
import HeadingContainer from "@/components/HeadingContainer";
import LeadContainer from "@/components/leads/LeadContainer";
import CustomLayout from "@/components/CustomLayout";

function page() {
  return (
    <CustomLayout>
      <div className={classes.container}>
        <div className={classes.marginContainer}>
          <HeadingContainer heading={"Leads"} />
          <LeadContainer />
        </div>
      </div>
    </CustomLayout>
  );
}

export default page;
