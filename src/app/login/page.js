import LoginForm from "@/components/forms/LoginForm";
import classes from "./page.module.css";

export const metadata = {
  title: "Login",
  keywords:
    "Best Coworking Offices, Coworking Spaces, Virtual Offices, Cheap Coworking Spaces, Cheapest Coworking Space, Coworking Spaces near me",
  description: "Virtualxcel Login page",
};

function Page() {
  return (
    <div className={classes.container}>
      <LoginForm />
    </div>
  );
}

export default Page;
