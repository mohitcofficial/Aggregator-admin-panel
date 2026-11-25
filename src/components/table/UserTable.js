"use client";

import { roleMap } from "@/data/Maps";
import classes from "./UserTable.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminApiServices from "@/services/api/Admin.api.services";
import { toast } from "react-toastify";

export default function UserTable({
  setModal,
  fetchAllUsers,
  users,
  setUserToUpdate,
  loading = false,
}) {
  const fontSize = { lg: 30, md: 22, sm: 20, xs: 18 };

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      const data = await AdminApiServices.deleteUser(id);
      toast.success(data?.message);
      fetchAllUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div className={classes.tableContainer}>
      <div className={classes.tableWrapper}>
        {loading && (
          <div className={classes.loaderContainer}>
            <div className={classes.loader}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <circle
                  fill="#4D32B3"
                  stroke="#4D32B3"
                  strokeWidth="15"
                  r="15"
                  cx="40"
                  cy="100"
                >
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="2"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.4"
                  ></animate>
                </circle>
                <circle
                  fill="#4D32B3"
                  stroke="#4D32B3"
                  strokeWidth="15"
                  r="15"
                  cx="100"
                  cy="100"
                >
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="2"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.2"
                  ></animate>
                </circle>
                <circle
                  fill="#4D32B3"
                  stroke="#4D32B3"
                  strokeWidth="15"
                  r="15"
                  cx="160"
                  cy="100"
                >
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="2"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="0"
                  ></animate>
                </circle>
              </svg>
            </div>
          </div>
        )}
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>CreatedBy</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users?.map((user, index) => (
              <tr key={index}>
                <td>
                  <span className={classes.employeeID}>{user._id}</span>
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span className={classes.highlight}>
                    {roleMap[user.role]}
                  </span>
                </td>
                <td>
                  <span className={user.createdBy && classes.highlight}>
                    {user.createdBy?.name}
                  </span>
                </td>
                <td>
                  <span
                    className={`${classes.type}
                    ${user.isActive ? classes.active : classes.inactive}`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className={classes.buttonsContainer}>
                    <button
                      onClick={() => {
                        setModal("update_user");
                        setUserToUpdate(user);
                      }}
                      className={classes.button}
                    >
                      <EditIcon
                        className={classes.editButton}
                        sx={{ fontSize: fontSize }}
                      />
                    </button>
                    <button
                      className={classes.button}
                      onClick={() => deleteUser(user._id)}
                    >
                      <DeleteIcon
                        className={classes.deleteButton}
                        sx={{ fontSize: fontSize }}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
