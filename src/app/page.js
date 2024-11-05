import HeadingContainer from "@/components/HeadingContainer";
import classes from "./page.module.css";
import CardsContainer from "@/components/dashboard/CardsContainer";
import CustomLayout from "@/components/CustomLayout";

export const metadata = {
  title: "Dashboard | Virtualxcel",
  keywords:
    "Best Coworking Offices, Coworking Spaces, Virtual Offices, Cheap Coworking Spaces, Cheapest Coworking Space, Coworking Spaces near me",
  description: "Virtualxcel Dashboard",
};

export default function Home() {
  return (
    <CustomLayout>
      <div className={classes.container}>
        <div className={classes.marginContainer}>
          <HeadingContainer heading={"Dashboard"} />
          <div className={classes.contentContainer}>
            <CardsContainer />
          </div>
        </div>
      </div>
    </CustomLayout>
  );
}
