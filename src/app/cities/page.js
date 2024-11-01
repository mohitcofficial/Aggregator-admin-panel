"use client";
import classes from "./page.module.css";
import HeadingContainer from "@/components/HeadingContainer";
import "../../app/globals.css";
import AddIcon from "@mui/icons-material/Add";
import CityApiServices from "@/services/api/City.api.services";
import PaginatedTable2 from "@/components/PaginatedTable2";
import { useEffect, useState } from "react";
import MultipleSelectDropdown from "@/components/MultipleSelectDropdown";
import Link from "next/link";
import CustomSkeleton from "@/components/CustomSkeleton";

const page = () => {
  const [selectedCities, setSelectedCities] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [cityData, setCityData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [names, setNames] = useState([]);
  const [loading, setloading] = useState(true);
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    const fetchCityData = async () => {
      setloading(true);
      try {
        const data = await CityApiServices.getAllCities();
        setFilteredData(data?.cities || []);
        setCityData(data?.cities || []);

        const stateNames = data.cities.map((city) => city.stateId.name);
        const uniqueStates = [...new Set(stateNames)];

        setNames(uniqueStates);
        setloading(false);
      } catch (error) {
        setloading(false);
        console.log(error?.message);
      }
    };

    fetchCityData();
  }, [flag]);

  const reloadCityData = () => {
    setFlag((prev) => !prev);
  };

  const fontSize = { xs: 18, sm: 20, md: 22, lg: 20 };

  const handleFilter = (event) => {
    const button = event.target;
    button.classList.remove(classes.bouncy);
    void button.offsetWidth;
    button.classList.add(classes.bouncy);
    if (selectedCities.length === 0) {
      setFilteredData(cityData);
      return;
    }
    let newFilteredData = [];

    selectedCities.map((item) => {
      const temp = cityData.filter((it) => it.stateId.name === item);
      newFilteredData.push(...temp);
    });
    setFilteredData(newFilteredData);
    setRefresh((prev) => !prev);
  };

  const handleResetInput = () => {
    setRefresh((prev) => !prev);
    setFilteredData(cityData);
  };

  return (
    <div className={classes.container}>
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "96%",
            margin: "12px 0",
          }}
        >
          <br />
          <CustomSkeleton height={30} width="100px" />
          <br />
          <CustomSkeleton height={50} />
          <br />
          <CustomSkeleton height={30} />
          <br />
          <CustomSkeleton height={400} />
        </div>
      ) : (
        <div className={classes.marginContainer}>
          <HeadingContainer heading={"Cities"} />
          <div className={classes.buttonContainer}>
            <Link className="linkTag" href={"/city/add"}>
              <button className={classes.addCityButton}>
                <AddIcon sx={{ fontSize: fontSize }} />
                <span>Add City</span>
              </button>
            </Link>
            <MultipleSelectDropdown
              selectedItems={selectedCities}
              setSelectedItems={setSelectedCities}
              handleFilter={handleFilter}
              handleResetInput={handleResetInput}
              names={names}
              placeholder={"States"}
            />
          </div>
          <PaginatedTable2
            middleName={"State"}
            refresh={refresh}
            data={filteredData}
            reloadFunction={reloadCityData}
          />
        </div>
      )}
    </div>
  );
};

export default page;
