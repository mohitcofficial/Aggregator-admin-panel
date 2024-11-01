import classes from "./Header.module.css";
import LogoutIcon from "@mui/icons-material/Logout";

function Header() {
  const fontSize = { xs: 24, sm: 26, md: 26, lg: 28 };

  return (
    <nav className={classes.container}>
      <div></div>
      <div className={classes.logo}>
        <p className={classes.first}>Virtual</p>
        <p className={classes.second}>xcel</p>
      </div>
      <button className={classes.logoutButton}>
        <LogoutIcon sx={{ fontSize: fontSize }} />
      </button>
    </nav>
  );
}

export default Header;
