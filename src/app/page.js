import HeadingContainer from "@/components/HeadingContainer";
import classes from "./page.module.css";
import CardsContainer from "@/components/dashboard/CardsContainer";

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
          <CardsContainer />
        </div>
      </div>
    </div>
  );
}
