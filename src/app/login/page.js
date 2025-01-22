"use client";
import React, { useState } from "react";
import ADMIN_APIs from "../../services/api/Admin.api.services";
import classes from "./page.module.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "@/utils/Loader";

export const metadata = {
  title: "Login",
  keywords:
    "Best Coworking Offices, Coworking Spaces, Virtual Offices, Cheap Coworking Spaces, Cheapest Coworking Space, Coworking Spaces near me",
  description: "Virtualxcel Login page",
};

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email.length === 0 || password.length === 0) {
      toast("Fill both fields!", {
        icon: "⚠",
      });
      return;
    }
    const body = {
      email,
      password,
    };
    setLoading(true);
    try {
      const data = await ADMIN_APIs.login(body);
      toast.success(data?.message);
      router.replace("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something Went Wrong !");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={classes.container}>
      {loading && <Loader />}
      <form className={classes.form} onSubmit={handleLogin}>
        <p className={classes.formHeading}>Admin Panel</p>
        <input
          className={classes.input}
          type="text"
          placeholder="Enter the email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={classes.input}
          type="password"
          value={password}
          placeholder="Enter the password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={classes.loginButton} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Page;
