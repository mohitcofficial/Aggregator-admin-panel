import React from "react";
import classes from "./loading.module.css";
import CustomSkeleton from "@/components/CustomSkeleton";

function loading() {
  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <CustomSkeleton width="150px" height={30} />
        <br />
        <CustomSkeleton width="350px" height={100} />
        <br />
        <CustomSkeleton height={20} />
        <CustomSkeleton height={20} />
        <br />
        <CustomSkeleton height={30} />
        <br />
        <CustomSkeleton height={200} />
        <br />
        <CustomSkeleton height={35} width="100px" />
      </div>
    </div>
  );
}

export default loading;
