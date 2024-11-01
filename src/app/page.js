import HeadingContainer from "@/components/HeadingContainer";
import classes from "./page.module.css";
import CardsContainer from "@/components/dashboard/CardsContainer";
import ColumnChart from "@/components/dashboard/ColumnChart";
import ActivityLog from "@/components/dashboard/ActivityLog";
import PieChart from "@/components/dashboard/PiChart";

export const metadata = {
  title: "Dashboard | Virtualxcel",
  keywords:
    "Best Coworking Offices, Coworking Spaces, Virtual Offices, Cheap Coworking Spaces, Cheapest Coworking Space, Coworking Spaces near me",
  description: "Virtualxcel Dashboard",
};

const randomVisitData = [
  { _id: "Converted", count: 3 },
  { _id: "Enquiries", count: 20 },
];

export default function Home() {
  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <HeadingContainer heading={"Dashboard"} />
        <div className={classes.contentContainer}>
          <div className={classes.leftContainer}>
            <CardsContainer />
            <ColumnChart
              actual={[10, 12, 8, 20, 11, 23, 7]}
              categories={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            />
          </div>
          <div className={classes.middleContainer}>
            <PieChart data={randomVisitData} />
          </div>
          <ActivityLog />
        </div>
      </div>
    </div>
  );
}
