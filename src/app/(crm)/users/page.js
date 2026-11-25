"use client";

import AddUserModal from "@/components/modals/AddUserModal";
import UpdateUserModal from "@/components/modals/UpdateUserModal";
import UserTable from "@/components/table/UserTable";
import AdminApiServices from "@/services/api/Admin.api.services";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import classes from "./page.module.css";

function Page() {
  const [modal, setModal] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToUpdate, setUserToUpdate] = useState(null);

  const onClose = () => {
    setModal(null);
  };

  const fetchAllUsers = async () => {
    try {
      const data = await AdminApiServices.getAllUsers();
      setUsers(data?.users);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <main className={classes.container}>
      {modal === "add_user" && (
        <AddUserModal fetchAllUsers={fetchAllUsers} onClose={onClose} />
      )}
      {modal === "update_user" && (
        <UpdateUserModal
          currentUser={userToUpdate}
          fetchAllUsers={fetchAllUsers}
          onClose={onClose}
        />
      )}
      <div className={classes.pageHeader}>
        <div>
          <h1 style={{ marginBottom: 0 }} className={classes.title}>
            Users
          </h1>
          <p className={classes.subtitle}>Manage and track all Users</p>
        </div>

        <button
          onClick={() => setModal("add_user")}
          className={classes.newUserBtn}
        >
          <AddIcon />
          <span>New User</span>
        </button>
      </div>
      <UserTable
        fetchAllUsers={fetchAllUsers}
        users={users}
        loading={loading}
        setModal={setModal}
        setUserToUpdate={setUserToUpdate}
      />
    </main>
  );
}

export default Page;
