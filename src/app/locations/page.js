"use client";
import HeadingContainer from "@/components/HeadingContainer";
import classes from "./page.module.css";
import PaginatedTable2 from "@/components/PaginatedTable2";
import "../../app/globals.css";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import MultipleSelectDropdown from "@/components/MultipleSelectDropdown";
import LocationApiServices from "@/services/api/Location.api.services";
import Link from "next/link";
import CustomSkeleton from "@/components/CustomSkeleton";

const Page = () => {
  const [selectedCities, setSelectedCities] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [names, setNames] = useState([]);
  const [loading, setloading] = useState(true);
  const [flag, setFlag] = useState(true);
  useEffect(() => {
    const fetchLocationData = async () => {
      setloading(true);
      try {
        const data = await LocationApiServices.getAllLocations();
        setFilteredData(data?.locations || []);
        setLocationData(data?.locations || []);

        const cityNames = data.locations.map(
          (location) => location.cityId.name
        );
        const uniqueCities = [...new Set(cityNames)];

        setloading(false);
        setNames(uniqueCities);
      } catch (error) {
        setloading(false);
        console.log(error?.message);
      }
    };

    fetchLocationData();
  }, [flag]);

  const reloadLocationData = () => {
    setFlag((prev) => !prev);
  };
  const fontSize = { xs: 18, sm: 20, md: 22, lg: 20 };

  const handleFilter = (event) => {
    const button = event.target;
    button.classList.remove(classes.bouncy);
    void button.offsetWidth;
    button.classList.add(classes.bouncy);
    if (selectedCities.length === 0) {
      setFilteredData(locationData);
      return;
    }
    let newFilteredData = [];

    selectedCities.map((item) => {
      const temp = locationData.filter((it) => it.cityId.name === item);
      newFilteredData.push(...temp);
    });
    setFilteredData(newFilteredData);
    setRefresh((prev) => !prev);
  };

  const handleResetInput = () => {
    setRefresh((prev) => !prev);
    setFilteredData(locationData);
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
          <HeadingContainer heading={"Locations"} />
          <div className={classes.buttonContainer}>
            <Link href={"/location/add"} className="linkTag">
              <button className={classes.addLocationButton}>
                <AddIcon sx={{ fontSize: fontSize }} />
                <span>Add Location</span>
              </button>
            </Link>
            <MultipleSelectDropdown
              selectedItems={selectedCities}
              setSelectedItems={setSelectedCities}
              handleFilter={handleFilter}
              handleResetInput={handleResetInput}
              names={names}
            />
          </div>
          <PaginatedTable2
            middleName={"City"}
            refresh={refresh}
            data={filteredData}
            reloadFunction={reloadLocationData}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
