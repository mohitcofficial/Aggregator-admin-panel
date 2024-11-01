"use client";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import classes from "./MultipleSelectDropdown.module.css";
import { useMediaQuery } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedCities, theme) {
  return {
    fontWeight:
      selectedCities.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectDropdown({
  selectedItems,
  setSelectedItems,
  handleFilter,
  handleResetInput,
  names = [],
  placeholder = "Cities",
}) {
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  let width;
  if (isExtraSmallScreen) {
    width = "100%";
  } else if (isSmallScreen) {
    width = "100%";
  } else if (isMediumScreen) {
    width = 400;
  } else if (isLargeScreen) {
    width = 500;
  } else {
    width = 500;
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedItems(typeof value === "string" ? value.split(",") : value);
  };

  const handleReset = (event) => {
    const button = event.target;
    button.classList.remove(classes.bouncy);
    void button.offsetWidth;
    button.classList.add(classes.bouncy);
    setSelectedItems([]);
    handleResetInput();
  };

  return (
    <div className={classes.container}>
      <div className={classes.marginContainer}>
        <FormControl
          sx={{
            width: width,
          }}
        >
          <InputLabel id="demo-multiple-chip-label">
            Filter With {placeholder}
          </InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={selectedItems}
            onChange={handleChange}
            input={
              <OutlinedInput
                id="select-multiple-chip"
                label={`Filter With ${placeholder}`}
              />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {names?.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, selectedItems, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className={classes.buttonContainer}>
          <button
            onClick={handleReset}
            className={`${classes.resetButton} ${classes.bouncyButton}`}
          >
            Reset
          </button>
          <button onClick={handleFilter} className={classes.filterButton}>
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}
