"use client";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { motion } from "framer-motion";
import classes from "./PaginatedTable.module.css";
import "../app/globals.css";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useRouter } from "next/navigation";
import StateAPIs from "../services/api/State.api.services";
import EditStateModal from "./modals/EditStateModal";
import toast from "react-hot-toast";

const PaginatedTable = ({ data, itemsPerPage = 20 }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  const handleEdit = (e) => {
    e.stopPropagation();
  };
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const confirmCancel = window.confirm(
      "Are you sure you want to delete the State?"
    );

    if (confirmCancel) {
      try {
        const data = await StateAPIs.deleteState(id);
        router.refresh();
        toast.success(data?.message);
      } catch (error) {
        toast.error("Something Went Wrong !");
        console.log(error.message);
      }
    }
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = data.slice(offset, offset + itemsPerPage);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const fontSize = { xs: 24, sm: 26, md: 28, lg: 30 };
  const fontSize2 = { xs: 18, sm: 20, md: 22, lg: 20 };

  return (
    <div className={classes.container}>
      <motion.div
        key={currentPage}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <table className={classes.table}>
          <thead className={classes.thead}>
            <tr className={classes.tr}>
              <th className={`${classes.th} ${classes.leftText}`}>Name</th>
              <th className={`${classes.th} ${classes.rightText}`}>Action</th>
            </tr>
          </thead>
          <motion.tbody className={classes.tbody}>
            {currentPageData.map((item, index) => (
              <motion.tr
                className={classes.tr2}
                key={index}
                variants={itemVariants}
                onClick={() => router.push(`/state/${item._id}`)}
              >
                <td className={`${classes.td} ${classes.left}`}>{item.name}</td>
                <td
                  className={`${classes.td} ${classes.right} ${classes.buttonContainer}`}
                >
                  <div onClick={(e) => handleEdit(e)}>
                    <EditStateModal stateInfo={item}>
                      <button
                        className={`${classes.button} ${classes.editButton}`}
                      >
                        <EditIcon sx={{ fontSize: fontSize2 }} />
                        <span>Edit</span>
                      </button>
                    </EditStateModal>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, item._id)}
                    className={`${classes.button} ${classes.deleteButton}`}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: fontSize2 }} />
                    <span>Delete</span>
                  </button>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>
      {data.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={
            <KeyboardDoubleArrowLeftIcon sx={{ fontSize: fontSize }} />
          }
          nextLabel={
            <KeyboardDoubleArrowRightIcon sx={{ fontSize: fontSize }} />
          }
          breakLabel={"..."}
          pageCount={Math.ceil(data.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={classes.pagination}
          activeClassName={classes.active}
          forcePage={currentPage}
        />
      )}
    </div>
  );
};

export default PaginatedTable;
