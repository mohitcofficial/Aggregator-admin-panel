"use client";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import Card from "./Card";
import classes from "./CardsContainer.module.css";
import CityApiServices from "@/services/api/City.api.services";
import LocationApiServices from "@/services/api/Location.api.services";
import StateApiServices from "@/services/api/State.api.services";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import CustomSkeleton from "../CustomSkeleton";

function CardsContainer() {
  const fontSize = { xs: 18, sm: 20, md: 22, lg: 24 };
  const [loading, setLoading] = useState(true);
  const [statesCount, setStatesCount] = useState(0);
  const [citiesCount, setCitiesCount] = useState(0);
  const [locationsCount, setlocationsCount] = useState(0);
  const cardData = [
    {
      heading: "State Count",
      value: statesCount,
      color: "#6400EA",
      icon: (
        <PublicIcon
          sx={{
            color: "#fff",
            fontSize: fontSize,
            backgroundColor: "#6400EA",
            padding: "8px",
            borderRadius: "50%",
          }}
        />
      ),
      redirection: "/states",
    },
    {
      heading: "City Count",
      value: citiesCount,
      color: "#F6B817",
      icon: (
        <LocationCityIcon
          sx={{
            color: "#fff",
            fontSize: fontSize,
            backgroundColor: "#F6B817",
            padding: "8px",
            borderRadius: "50%",
          }}
        />
      ),
      redirection: "/cities",
    },
    {
      heading: "Location Count",
      value: locationsCount,
      color: "#9A29AD",
      icon: (
        <LocationOnIcon
          sx={{
            color: "#fff",
            fontSize: fontSize,
            backgroundColor: "#9A29AD",
            padding: "8px",
            borderRadius: "50%",
          }}
        />
      ),
      redirection: "/locations",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statesData, cityData, locationData] = await Promise.all([
        StateApiServices.getAllStates(),
        CityApiServices.getAllCities(),
        LocationApiServices.getAllLocations(),
      ]);

      setStatesCount(statesData?.states?.length);
      setCitiesCount((cardData[1].value = cityData?.cities?.length));
      setlocationsCount((cardData[2].value = locationData?.locations?.length));
    } catch (error) {
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      {cardData.map((card, index) =>
        loading ? (
          <CustomSkeleton key={index} width="250px" height={60} />
        ) : (
          <Card
            key={index}
            value={card.value}
            heading={card.heading}
            color={card.color}
            icon={card.icon}
            redirection={card.redirection}
          />
        )
      )}
    </div>
  );
}

export default CardsContainer;
