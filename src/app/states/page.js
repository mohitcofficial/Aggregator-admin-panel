import PaginatedTable from "@/components/PaginatedTable";
import classes from "./page.module.css";
import HeadingContainer from "@/components/HeadingContainer";
import "../../app/globals.css";
import AddIcon from "@mui/icons-material/Add";
import StateApiServices from "@/services/api/State.api.services";
import { headers } from "next/headers";
import Link from "next/link";

export default async function page() {
  const reqHeaders = headers();
  const token = reqHeaders.get("cookie")?.split("authToken=")[1];

  if (!token) {
    return (
      <div className={classes.container}>
        <div className={classes.marginContainer}>Invalid request.</div>
      </div>
    );
  }

  try {
    const response = await StateApiServices.getAllStates(token);

    const fontSize = { xs: 18, sm: 20, md: 22, lg: 20 };

    return (
      <div className={classes.container}>
        <div className={classes.marginContainer}>
          <HeadingContainer heading={"States"} />
          <div
            style={{
              margin: "8px 2px",
              display: "inline-block",
              alignSelf: "flex-start",
              width: "auto",
            }}
          >
            <Link href={"/state/add"} className="linkTag">
              <button className={classes.addCityButton}>
                <AddIcon sx={{ fontSize: fontSize }} />
                <span>Add State</span>
              </button>
            </Link>
          </div>
          <PaginatedTable data={response?.states} itemsPerPage={20} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching state info: ", error.message);

    return (
      <div className={classes.container}>
        <div className={classes.marginContainer}>
          An error occurred while fetching the state details. Please try again
          later.
        </div>
      </div>
    );
  }
}
