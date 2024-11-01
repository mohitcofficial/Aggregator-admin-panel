import classes from "./HeadingContainer.module.css";

function HeadingContainer({ heading }) {
  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>{heading}</h1>
    </div>
  );
}

export default HeadingContainer;
