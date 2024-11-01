import classes from "./ActivityCard.module.css";

function ActivityCard({ date, text }) {
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();

  let formattedDate = `${day}-${month}-${year}`;

  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  let seconds = String(date.getSeconds()).padStart(2, "0");

  let formattedTime = `${hours}:${minutes}:${seconds}`;

  return (
    <div className={classes.container}>
      <div className={classes.timeStampContainer}>
        <p>{formattedDate}</p>
        <p>{formattedTime}</p>
      </div>
      <p className={classes.text}>{text}</p>
    </div>
  );
}

export default ActivityCard;
