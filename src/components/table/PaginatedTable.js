import React from "react";
import classes from "./PaginatedTable.module.css";
import { getDate } from "@/utils/convertDate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";

function PaginatedTable({ data, handleDelete }) {
  return (
    <table className={classes.table}>
      <thead className={classes.thead}>
        <tr>
          <th className={classes.th}>Name</th>
          <th className={classes.th}>Phone</th>
          <th className={classes.th}>Email</th>
          <th className={classes.th}>Status</th>
          <th className={classes.th}>Location</th>
          <th className={classes.th}>Follow-Ups</th>
          <th className={classes.th}>Assigned</th>
          <th className={classes.th}>Date</th>
          <th className={classes.th}>Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map((lead) => (
          <tr key={lead?._id} className={classes.tr}>
            <td className={classes.td}>{lead?.name}</td>
            <td className={classes.td}>{lead?.phoneNumber}</td>
            <td className={classes.td}>{lead?.email}</td>
            <td className={classes.td}>{lead?.status}</td>
            <td className={classes.td}>{lead?.location}</td>
            <td className={classes.td}>{lead?.followUps?.length}</td>
            <td className={classes.td}>{lead?.assignedTo?.name || "-"}</td>
            <td className={classes.td}>{getDate(lead?.createdAt)}</td>
            <td className={`${classes.td} ${classes.flex}`}>
              <Link href={`/lead/${lead?._id}`} className="linkTag">
                <button className={classes.viewButton}>
                  <VisibilityIcon sx={{ fontSize: 20 }} />
                </button>
              </Link>
              <button
                className={classes.editButton}
                onClick={() => handleDelete(lead?._id)}
              >
                <EditIcon sx={{ fontSize: 20 }} />
              </button>
              <button
                className={classes.deleteBtn}
                onClick={() => handleDelete(lead?._id)}
              >
                <DeleteIcon sx={{ fontSize: 20 }} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PaginatedTable;
