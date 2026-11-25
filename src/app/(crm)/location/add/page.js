import HeadingContainer from "@/components/HeadingContainer";
import LocationForm from "@/components/forms/LocationForm";
import classes from "./page.module.css";

function page() {
  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <HeadingContainer heading={"Add New Location"} />
        <LocationForm />
      </div>
    </div>
  );
}

export default page;
