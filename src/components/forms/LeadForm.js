"use client";
import LeadApiServices from "@/services/api/Lead.api.services";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import classes from "./LeadForm.module.css";
import Loader from "@/utils/Loader";
import { useRouter } from "next/navigation";

const origins = ["Mail", "Phone", "Whatsapp", "Others"];

function LeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [requirement, setRequirement] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("Mail");
  const [flag, setFlag] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (
      name.length > 0 &&
      email.length > 0 &&
      phoneNumber.length > 0 &&
      location.length > 0 &&
      requirement.length > 0
    )
      setFlag(true);
    else setFlag(false);
  }, [name, email, phoneNumber, location, requirement]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flag) return;

    const body = {
      name,
      email,
      phoneNumber,
      location,
      requirement,
      origin: selectedOrigin,
    };
    setLoading(true);
    try {
      const data = await LeadApiServices.createLead(body);
      router.push("/leads");
      toast.success(data?.message);
    } catch (error) {
      toast.error("Something Went Wrong");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (
      name.length === 0 &&
      email.length === 0 &&
      phoneNumber.length === 0 &&
      location.length === 0 &&
      requirement.length === 0
    ) {
      router.push("/leads");
      return;
    }
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel? All unsaved changes will be lost."
    );

    if (confirmCancel) router.push("/leads");
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      {loading && <Loader />}
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
        placeholder="Enter the name"
      />
      <input
        type="email"
        className={classes.input}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        value={email}
        placeholder="Enter the email"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setPhoneNumber(e.target.value);
        }}
        value={phoneNumber}
        placeholder="Enter the Phone Number"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setLocation(e.target.value);
        }}
        value={location}
        placeholder="Enter the location"
      />
      <input
        type="text"
        className={classes.input}
        onChange={(e) => {
          setRequirement(e.target.value);
        }}
        value={requirement}
        placeholder="Enter the requirement"
      />
      <select
        id="stateSelect"
        value={selectedOrigin}
        onChange={(e) => setSelectedOrigin(e.target.value)}
        required
        className={classes.selectMenu}
      >
        {origins.map((origin, index) => (
          <option className={classes.menuOption} key={index} value={origin}>
            {origin}
          </option>
        ))}
      </select>
      <div className={classes.buttonContainer}>
        <button onClick={handleCancel} className={classes.cancelButton}>
          Cancel
        </button>
        <button
          style={{
            backgroundColor: !flag && "#1f6f8ccc",
            cursor: !flag && "not-allowed",
          }}
          disabled={!flag}
          className={classes.createButton}
          type="submit"
        >
          Create
        </button>
      </div>
    </form>
  );
}

export default LeadForm;
