"use client";
import toast from "react-hot-toast";
import classes from "./Header.module.css";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminApiServices from "@/services/api/Admin.api.services";
import { useRouter } from "next/navigation";

function Header() {
  const fontSize = { xs: 24, sm: 26, md: 26, lg: 28 };
  const router = useRouter();

  const handleLogout = async () => {
    const confirmCancel = window.confirm("Are you sure you want to logout?");
    if (confirmCancel) {
      try {
        const data = await AdminApiServices.logout();
        toast.success(data?.message);
        router.push("/login");
      } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong !");
      }
    }
  };

  return (
    <nav className={classes.container}>
      <div></div>
      <div className={classes.logo}>
        <p className={classes.first}>Virtual</p>
        <p className={classes.second}>xcel</p>
      </div>
      <button onClick={handleLogout} className={classes.logoutButton}>
        <LogoutIcon sx={{ fontSize: fontSize }} />
      </button>
    </nav>
  );
}

export default Header;
