import { getDate, getTime } from "@/utils/convertDate";
import classes from "./LeadCard.module.css";
import React from "react";
import EditLeadModal from "../modals/EditLeadModal";

const LeadCard = ({
  id,
  name,
  email,
  phone,
  requirement,
  preferredLocation,
  status,
  origin,
  createdAt,
  handleDelete,
  fetchLeadsData,
}) => {
  return (
    <div className={classes.card}>
      <div className={classes.row}>
        <span className={classes.label}>Name</span>
        <span className={classes.data}>: {name}</span>
      </div>
      <div className={classes.row}>
        <span className={classes.label}>Email</span>
        <span className={classes.data}>: {email}</span>
      </div>
      <div className={classes.row}>
        <span className={classes.label}>Phone Number</span>
        <span className={classes.data}>: {phone}</span>
      </div>
      <div className={classes.row}>
        <span className={classes.label}>Requirement</span>
        <span className={classes.data}>: {requirement}</span>
      </div>
      <div className={classes.row}>
        <span className={classes.label}>Preferred Location</span>
        <span className={classes.data}>: {preferredLocation}</span>
      </div>
      <div className={classes.row}>
        <span className={classes.label}>Origin</span>
        <span className={classes.data}>: {origin}</span>
      </div>
      <div className={classes.row}>
        <span className={classes.label}>Status</span>
        <span className={classes.data}>: {status}</span>
      </div>
      <div className={classes.row}>
        <span className={classes.label}>Date</span>
        <span className={classes.data}>
          : {getDate(createdAt)} at {getTime(createdAt)}
        </span>
      </div>
      <div className={classes.buttonContainer}>
        <button
          onClick={() => handleDelete(id)}
          className={classes.deleteButton}
        >
          Delete
        </button>
        <EditLeadModal
          id={id}
          origin={origin}
          status={status}
          fetchLeadsData={fetchLeadsData}
        >
          <button className={classes.updateButton}>Update</button>
        </EditLeadModal>
      </div>
    </div>
  );
};

export default LeadCard;
