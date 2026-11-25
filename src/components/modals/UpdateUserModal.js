import { useState } from "react";
import styles from "./AddUserModal.module.css";
import { toast } from "react-toastify";
import AdminApiServices from "@/services/api/Admin.api.services";

function UpdateUserModal({ currentUser, onClose, fetchAllUsers }) {
  const [user, setUser] = useState(currentUser);

  const [loading, setLoading] = useState(false);
  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateUser = () => {
    const trimmedUser = {
      ...user,
      name: user?.name.trim(),
      email: user?.email.trim(),
      phone: user?.phone.trim(),
    };

    if (!trimmedUser.name) {
      toast.error("Name is required");
      return false;
    }

    if (!trimmedUser.email) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedUser.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!trimmedUser.phone) {
      toast.error("Phone number is required");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(trimmedUser.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };

  const submitHandler = async () => {
    if (!validateUser()) return;
    setLoading(true);
    console.log(user);
    try {
      const data = await AdminApiServices.updateUser(user);
      toast.success(data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
      fetchAllUsers();
      onClose();
    }
  };
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}

        <div className={styles.header}>
          <div className={styles.headingContainer}>
            <h2 className={styles.heading}>Add New User</h2>

            <p className={styles.subHeading}>
              Be very careful the with Credentials
            </p>
          </div>

          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}

        <div className={styles.grid3}>
          <div className={styles.box}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.inputField}
              type="text"
              name="name"
              placeholder="Enter name"
              value={user?.name}
              onChange={handleUserChange}
            />
          </div>

          <div className={styles.box}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.inputField}
              placeholder="Enter email"
              type="text"
              name="email"
              value={user?.email}
              onChange={handleUserChange}
            />
          </div>
          <div className={styles.box}>
            <label className={styles.label}>Phone</label>
            <input
              className={styles.inputField}
              placeholder="Enter phone number"
              type="text"
              name="phone"
              value={user?.phone}
              onChange={handleUserChange}
            />
          </div>
        </div>
        <div className={styles.grid3}>
          <div className={styles.box}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.inputField}
              placeholder="Enter New Password"
              type="text"
              name="password"
              value={user?.password}
              onChange={handleUserChange}
            />
          </div>
          <div className={styles.box}>
            <label className={styles.label}>Type</label>

            <select
              className={styles.selectOption}
              name="role"
              value={user?.role}
              onChange={handleUserChange}
            >
              <option value="operation">Operation</option>
              <option value="accounts">Accounts</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <label className={styles.checkBoxLabel}>
            <input
              type="checkbox"
              name="isActive"
              checked={user?.isActive}
              onChange={handleUserChange}
            />
            Active
          </label>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            disabled={loading}
            className={styles.saveBtn}
            onClick={submitHandler}
          >
            {loading ? "Adding..." : "Update User"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateUserModal;
