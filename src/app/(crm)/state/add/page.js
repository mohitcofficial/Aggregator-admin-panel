import HeadingContainer from "@/components/HeadingContainer";
import StateForm from "@/components/forms/StateForm";
import classes from "./page.module.css";

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
