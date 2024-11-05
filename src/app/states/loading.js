import React from "react";
import classes from "./loading.module.css";
import CustomSkeleton from "@/components/CustomSkeleton";
import CustomLayout from "@/components/CustomLayout";

function loading() {
  return (
    <CustomLayout>
      <div className={classes.container}>
        <div className={classes.marginContainer}>
          <CustomSkeleton width="100px" height={30} />
          <br />
          <CustomSkeleton width="150px" height={30} />
          <br />
          <CustomSkeleton height={300} />
        </div>
      </div>
    </CustomLayout>
  );
}

export default loading;
