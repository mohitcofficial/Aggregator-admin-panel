"use client";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { motion } from "framer-motion";
import classes from "./PaginatedTable2.module.css";
import "../app/globals.css";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditCityModal from "./modals/EditCityModal";
import CityApiServices from "@/services/api/City.api.services";
import { useRouter } from "next/navigation";
import StateApiServices from "@/services/api/State.api.services";
import toast from "react-hot-toast";
import EditLocationModal from "./modals/EditLocationModal";
import LocationApiServices from "@/services/api/Location.api.services";

const itemsPerPage = 10;

const PaginatedTable2 = ({
  data,
  refresh,
  middleName = "State",
  reloadFunction,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const router = useRouter();

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };
  useEffect(() => {
    const fetchStateData = async () => {
      const data = await StateApiServices.getAllStates();
      const arrayData = data?.states?.map((state) => ({
        id: state?._id,
        name: state?.name,
      }));
      setStateData(arrayData);
    };
    fetchStateData();
  }, []);
  useEffect(() => {
    const fetchCityData = async () => {
      const data = await CityApiServices.getAllCities();
      const arrayData = data?.cities?.map((city) => ({
        id: city?._id,
        name: city?.name,
      }));
      setCityData(arrayData);
    };
    fetchCityData();
  }, []);
  useEffect(() => {
    setCurrentPage(0);
  }, [refresh]);

  const handleEdit = (e) => {
    e.stopPropagation();
  };
  const handleCityDelete = async (e, id) => {
    e.stopPropagation();
    const confirmCancel = window.confirm(
      "Are you sure you want to delete the City?"
    );

    if (confirmCancel) {
      try {
        const data = await CityApiServices.deleteCity(id);
        window.location.reload();
        toast.success(data?.message);
      } catch (error) {
        toast.error("Something Went Wrong !");
        console.log(error.message);
      }
    }
  };
  const handleLocationDelete = async (e, id) => {
    e.stopPropagation();
    const confirmCancel = window.confirm(
      "Are you sure you want to delete the Location?"
    );

    if (confirmCancel) {
      try {
        const data = await LocationApiServices.deleteLocation(id);
        window.location.reload();
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
        key={`${currentPage}-${refresh}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <table className={classes.table}>
          <thead className={classes.thead}>
            <tr className={classes.tr}>
              <th className={`${classes.th} ${classes.leftText}`}>Name</th>
              <th className={`${classes.th} ${classes.centerText}`}>
                {middleName}
              </th>
              <th className={`${classes.th} ${classes.rightText}`}>Action</th>
            </tr>
          </thead>
          <motion.tbody className={classes.tbody}>
            {currentPageData.map((item, index) => (
              <motion.tr
                className={classes.tr2}
                key={index}
                variants={itemVariants}
                onClick={() => {
                  if (middleName === "State") router.push(`/city/${item._id}`);
                  else router.push(`/location/${item._id}`);
                }}
              >
                <td className={`${classes.td} ${classes.left}`}>{item.name}</td>
                <td className={`${classes.td} ${classes.center}`}>
                  {middleName === "State"
                    ? item?.stateId?.name
                    : item?.cityId?.name}
                </td>
                <td
                  className={`${classes.td} ${classes.right} ${classes.buttonContainer}`}
                >
                  <div onClick={(e) => handleEdit(e)}>
                    {middleName === "State" && (
                      <EditCityModal
                        cityInfo={item}
                        stateData={stateData}
                        reloadFunction={reloadFunction}
                      >
                        <button
                          className={`${classes.button} ${classes.editButton}`}
                        >
                          <EditIcon sx={{ fontSize: fontSize2 }} />
                          <span>Edit</span>
                        </button>
                      </EditCityModal>
                    )}
                    {middleName === "City" && (
                      <EditLocationModal
                        locationInfo={item}
                        cityData={cityData}
                        reloadFunction={reloadFunction}
                      >
                        <button
                          className={`${classes.button} ${classes.editButton}`}
                        >
                          <EditIcon sx={{ fontSize: fontSize2 }} />
                          <span>Edit</span>
                        </button>
                      </EditLocationModal>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      if (middleName === "State") handleCityDelete(e, item._id);
                      else handleLocationDelete(e, item._id);
                    }}
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
      <ReactPaginate
        previousLabel={
          <KeyboardDoubleArrowLeftIcon sx={{ fontSize: fontSize }} />
        }
        nextLabel={<KeyboardDoubleArrowRightIcon sx={{ fontSize: fontSize }} />}
        breakLabel={"..."}
        pageCount={Math.ceil(data.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={classes.pagination}
        activeClassName={classes.active}
        forcePage={currentPage}
      />
    </div>
  );
};

export default PaginatedTable2;
