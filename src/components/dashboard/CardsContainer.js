import Card from "./Card";
import classes from "./CardsContainer.module.css";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HelpIcon from "@mui/icons-material/Help";

function CardsContainer() {
  const fontSize = { xs: 18, sm: 20, md: 22, lg: 24 };
  const cardData = [
    {
      heading: "City Count",
      value: 12,
      color: "#6400EA",
      icon: (
        <LocationCityIcon
          sx={{
            color: "#fff",
            fontSize: fontSize,
            backgroundColor: "#6400EA",
            padding: "8px",
            borderRadius: "50%",
          }}
        />
      ),
    },
    {
      heading: "Location Count",
      value: 100,
      color: "#F6B817",
      icon: (
        <LocationOnIcon
          sx={{
            color: "#fff",
            fontSize: fontSize,
            backgroundColor: "#F6B817",
            padding: "8px",
            borderRadius: "50%",
          }}
        />
      ),
    },
    {
      heading: "Query Count",
      value: 50,
      color: "#9A29AD",
      icon: (
        <HelpIcon
          sx={{
            color: "#fff",
            fontSize: fontSize,
            backgroundColor: "#9A29AD",
            padding: "8px",
            borderRadius: "50%",
          }}
        />
      ),
    },
    {
      heading: "Conversion",
      value: "10%",
      color: "#21A89B",
      icon: (
        <ChangeCircleIcon
          sx={{
            color: "#fff",
            fontSize: fontSize,
            backgroundColor: "#21A89B",
            padding: "8px",
            borderRadius: "50%",
          }}
        />
      ),
    },
  ];

  return (
    <div className={classes.container}>
      {cardData.map((card, index) => (
        <Card
          key={index}
          value={card.value}
          heading={card.heading}
          color={card.color}
          icon={card.icon}
        />
      ))}
    </div>
  );
}

export default CardsContainer;
