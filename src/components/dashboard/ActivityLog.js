import ActivityCard from "./ActivityCard";
import classes from "./ActivityLog.module.css";

function ActivityLog() {
  const activityData = [
    {
      date: new Date(),
      text: "Text1",
    },
    {
      date: new Date(),
      text: "Text2",
    },
    {
      date: new Date(),
      text: "soindf oisdfo sofisd hfos hif dhofo hsho is",
    },
    {
      date: new Date(),
      text: "Text3",
    },
    {
      date: new Date(),
      text: "lskdnv on osiodbvo iup sdbiuvs   sbj b ssbu dfbsu dusudfb sudfbiu sdb fsdb ",
    },
    {
      date: new Date(),
      text: "Text2",
    },
    {
      date: new Date(),
      text: "Text3",
    },
  ];
  return (
    <div className={classes.container}>
      <h2 className={classes.heading}>Activity Log</h2>
      <div className={classes.line}></div>
      <div className={classes.acivityContainer}>
        {activityData.map((activity, index) => (
          <ActivityCard key={index} text={activity.text} date={activity.date} />
        ))}
      </div>
    </div>
  );
}

export default ActivityLog;
