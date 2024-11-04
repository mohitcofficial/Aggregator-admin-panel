import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import Card from "./Card";
import classes from "./CardsContainer.module.css";

function CardsContainer() {
  const fontSize = { xs: 18, sm: 20, md: 22, lg: 24 };
  const cardData = [
    {
      heading: "State Count",
      value: 12,
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
      value: 100,
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
      value: 50,
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

  return (
    <div className={classes.container}>
      {cardData.map((card, index) => (
        <Card
          key={index}
          value={card.value}
          heading={card.heading}
          color={card.color}
          icon={card.icon}
          redirection={card.redirection}
        />
      ))}
    </div>
  );
}

export default CardsContainer;
