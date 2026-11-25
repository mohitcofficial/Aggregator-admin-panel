import CardsContainer from "@/components/dashboard/CardsContainer";
import SalesDashboard from "@/components/dashboard/SalesDashboard";
import HeadingContainer from "@/components/HeadingContainer";
import classes from "./page.module.css";

export const metadata = {
  title: "Dashboard | Virtualxcel",
  keywords:
    "Best Coworking Offices, Coworking Spaces, Virtual Offices, Cheap Coworking Spaces, Cheapest Coworking Space, Coworking Spaces near me",
  description: "Virtualxcel Dashboard Home page",
};

export default function Home() {
  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <HeadingContainer heading={"Dashboard"} />
        <div className={classes.contentContainer}>
          <CardsContainer />
          <SalesDashboard />
        </div>
      </div>
    </div>
  );
}
