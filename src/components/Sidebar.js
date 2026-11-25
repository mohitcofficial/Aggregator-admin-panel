"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import styles from "./Sidebar.module.css";

import DashboardIcon from "@mui/icons-material/Dashboard";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HelpIcon from "@mui/icons-material/Help";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FlagIcon from "@mui/icons-material/Flag";
import PeopleIcon from "@mui/icons-material/People";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

import FaviconImage from "../../public/images/FaviconImage.png";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: DashboardIcon,
  },
  {
    label: "States",
    href: "/states",
    icon: FlagIcon,
  },
  {
    label: "Cities",
    href: "/cities",
    icon: LocationCityIcon,
  },
  {
    label: "Locations",
    href: "/locations",
    icon: LocationOnIcon,
  },
  {
    label: "Users",
    href: "/users",
    icon: PeopleIcon,
  },
  {
    label: "Leads",
    href: "/leads",
    icon: HelpIcon,
  },
  {
    label: "Quotations",
    href: "/quotations",
    icon: RequestQuoteIcon,
  },
];

const ICON_SIZE = {
  xs: 24,
  sm: 26,
  md: 26,
  lg: 28,
};

const TOGGLE_ICON_SIZE = {
  xs: 28,
  sm: 30,
  md: 32,
  lg: 34,
};

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Check active navigation item
  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleClose = () => setIsOpen(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div onClick={handleClose} className={styles.fade} aria-hidden="true" />
      )}

      <nav
        className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
        aria-label="Main navigation"
      >
        <div className={styles.marginContainer}>
          <div className={styles.box1}>
            {/* Header */}
            <div className={styles.topHeader}>
              {isOpen ? (
                <>
                  <div className={styles.logo}>
                    <p className={styles.first}>Virtual</p>
                    <p className={styles.second}>xcel</p>
                  </div>

                  <CloseIcon
                    className={styles.toggleButton}
                    onClick={toggleSidebar}
                    sx={{
                      color: "#fff",
                      fontSize: TOGGLE_ICON_SIZE,
                      cursor: "pointer",
                    }}
                  />
                </>
              ) : (
                <MenuIcon
                  onClick={toggleSidebar}
                  sx={{
                    color: "#fff",
                    fontSize: TOGGLE_ICON_SIZE,
                    cursor: "pointer",
                  }}
                />
              )}
            </div>

            {/* Navigation */}
            <ul className={styles.navLinks}>
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);

                return (
                  <li className={styles.link} key={href}>
                    <Link
                      href={href}
                      onClick={handleClose}
                      aria-current={active ? "page" : undefined}
                      className={`${styles.linkTag} ${
                        active ? styles.active : ""
                      }`}
                      style={!isOpen ? { flexDirection: "column" } : undefined}
                    >
                      <Icon sx={{ fontSize: ICON_SIZE }} />

                      <span className={isOpen ? styles.text : styles.text2}>
                        {label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer Image */}
          <div className={styles.imageContainer}>
            <Image
              className={styles.image}
              src={FaviconImage}
              alt="Virtualxcel"
              fill
              placeholder="blur"
              priority
              sizes="60px"
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
