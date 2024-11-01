import React from "react";
import classes from "./loading.module.css";
import CustomSkeleton from "@/components/CustomSkeleton";

function loading() {
  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <CustomSkeleton width="100px" height={30} />
        <br />
        <CustomSkeleton width="150px" height={30} />
        <br />
        <CustomSkeleton height={300} />
      </div>
    </div>
  );
}

export default loading;
