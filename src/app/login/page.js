"use client";
import React, { useState } from "react";
import ADMIN_APIs from "../../services/api/Admin.api.services";
import classes from "./page.module.css";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "@/utils/Loader";

function Page() {
  const [email, setEmail] = useState("mohitchandraofficial@gmail.com");
  const [password, setPassword] = useState("mausi@1234567");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const body = {
      email,
      password,
    };
    setLoading(true);
    try {
      const data = await ADMIN_APIs.login(body);
      router.push("/");
      toast.success(data?.message);
    } catch (error) {
      toast.error("Invalid Email or Password !");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={classes.container}>
      {loading && <Loader />}
      <form className={classes.form} onSubmit={handleLogin}>
        <p className={classes.formHeading}>Admin Login P</p>
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
