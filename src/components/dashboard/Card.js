import Link from "next/link";
import classes from "./Card.module.css";

function Card({ heading, value, color, icon, redirection }) {
  return (
    <Link className="linkTag" href={redirection}>
      <div
        style={{ borderLeft: `5px solid ${color}` }}
        className={classes.container}
      >
        <div className={classes.leftBox}>
          <p className={classes.cardValue}>{value}</p>
          <p className={classes.cardHeading}>{heading}</p>
        </div>
        <div className={classes.rightBox}>{icon}</div>
      </div>
    </Link>
  );
}

export default Card;
