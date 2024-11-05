import React from "react";
import classes from "./page.module.css";
import HeadingContainer from "@/components/HeadingContainer";
import LeadForm from "@/components/forms/LeadForm";
import CustomLayout from "@/components/CustomLayout";

function page() {
  return (
    <CustomLayout>
      <div className={classes.container}>
        <div className={classes.marginContainer}>
          <HeadingContainer heading={"Add Lead"} />
          <LeadForm />
        </div>
      </div>
    </CustomLayout>
  );
}

export default page;
