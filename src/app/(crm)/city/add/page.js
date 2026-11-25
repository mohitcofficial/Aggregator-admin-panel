import HeadingContainer from "@/components/HeadingContainer";
import CityForm from "@/components/forms/CityForm";
import classes from "./page.module.css";

function page() {
  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <HeadingContainer heading={"Add New City"} />
        <CityForm />
      </div>
    </div>
  );
}

export default page;
