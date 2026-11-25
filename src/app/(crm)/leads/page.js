import HeadingContainer from "@/components/HeadingContainer";
import LeadContainer from "@/components/leads/LeadContainer";
import classes from "./page.module.css";

export const metadata = {
  title: "Leads",
  keywords:
    "Best Coworking Offices, Coworking Spaces, Virtual Offices, Cheap Coworking Spaces, Cheapest Coworking Space, Coworking Spaces near me",
  description: "Virtualxcel Leads page",
};

function page() {
  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <HeadingContainer heading={"Leads"} />
        <LeadContainer />
      </div>
    </div>
  );
}

export default page;
