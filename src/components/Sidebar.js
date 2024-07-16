"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HelpIcon from "@mui/icons-material/Help";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const fontSize = { xs: 24, sm: 26, md: 28, lg: 30 };
  const fontSize2 = { xs: 28, sm: 30, md: 32, lg: 34 };

  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.marginContainer}>
        <div className={styles.toggleButton} onClick={toggleSidebar}>
          {isOpen ? (
            <CloseIcon
              sx={{
                color: "#fff",
                fontSize: fontSize2,
              }}
            />
          ) : (
            <MenuIcon sx={{ color: "#fff", fontSize: fontSize2 }} />
          )}
        </div>
        <ul className={styles.navLinks}>
          <li className={styles.link}>
            <Link className={styles.linkTag} href="/">
              <DashboardIcon sx={{ fontSize: fontSize }} />
              {isOpen && <span className={styles.text}>Dashboard</span>}
            </Link>
          </li>
          <li className={styles.link}>
            <Link className={styles.linkTag} href="/cities">
              <LocationCityIcon sx={{ fontSize: fontSize }} />
              {isOpen && <span className={styles.text}>Cities</span>}
            </Link>
          </li>
          <li className={styles.link}>
            <Link className={styles.linkTag} href="/locations">
              <LocationOnIcon sx={{ fontSize: fontSize }} />
              {isOpen && <span className={styles.text}>Locations</span>}
            </Link>
          </li>
          <li className={styles.link}>
            <Link className={styles.linkTag} href="/queries">
              <HelpIcon sx={{ fontSize: fontSize }} />
              {isOpen && <span className={styles.text}>Queries</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
