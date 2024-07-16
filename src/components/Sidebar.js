"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HelpIcon from "@mui/icons-material/Help";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { usePathname } from "next/navigation";
import Image from "next/image";
import FaviconImage from "../../public/images/FaviconImage.png";

const Sidebar = () => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("");

  useEffect(() => {
    const parts = path.split("/").filter((part) => part !== "");
    const lastElement = parts[parts.length - 1];
    if (!lastElement) {
      setActiveNavItem("dashboard");
    } else if (lastElement === "cities") {
      setActiveNavItem("cities");
    } else if (lastElement === "locations") {
      setActiveNavItem("locations");
    } else if (lastElement === "queries") {
      setActiveNavItem("queries");
    } else {
      setActiveNavItem("");
    }
  }, [path]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const fontSize = { xs: 24, sm: 26, md: 28, lg: 30 };
  const fontSize2 = { xs: 28, sm: 30, md: 32, lg: 34 };

  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.marginContainer}>
        <div className={styles.box1}>
          <div className={styles.toggleButton} onClick={toggleSidebar}>
            {isOpen ? (
              <>
                <div className={styles.logo}>
                  <p className={styles.first}>Virtual</p>
                  <p className={styles.second}>xcel</p>
                </div>
                <CloseIcon
                  sx={{
                    color: "#fff",
                    fontSize: fontSize2,
                  }}
                />
              </>
            ) : (
              <MenuIcon sx={{ color: "#fff", fontSize: fontSize2 }} />
            )}
          </div>
          <ul className={styles.navLinks}>
            <li className={styles.link}>
              <Link
                className={`${styles.linkTag} ${
                  activeNavItem === "dashboard" && styles.active
                }`}
                href="/"
              >
                <DashboardIcon sx={{ fontSize: fontSize }} />
                {isOpen && <span className={styles.text}>Dashboard</span>}
              </Link>
            </li>
            <li className={styles.link}>
              <Link
                className={`${styles.linkTag} ${
                  activeNavItem === "cities" && styles.active
                }`}
                href="/cities"
              >
                <LocationCityIcon sx={{ fontSize: fontSize }} />
                {isOpen && <span className={styles.text}>Cities</span>}
              </Link>
            </li>
            <li className={styles.link}>
              <Link
                className={`${styles.linkTag} ${
                  activeNavItem === "locations" && styles.active
                }`}
                href="/locations"
              >
                <LocationOnIcon sx={{ fontSize: fontSize }} />
                {isOpen && <span className={styles.text}>Locations</span>}
              </Link>
            </li>
            <li className={styles.link}>
              <Link
                className={`${styles.linkTag} ${
                  activeNavItem === "queries" && styles.active
                }`}
                href="/queries"
              >
                <HelpIcon sx={{ fontSize: fontSize }} />
                {isOpen && <span className={styles.text}>Queries</span>}
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.imageContainer}>
          <Image
            className={styles.image}
            src={FaviconImage}
            alt="Image"
            fill={true}
            placeholder="blur"
            priority={true}
            quality={true}
          />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
