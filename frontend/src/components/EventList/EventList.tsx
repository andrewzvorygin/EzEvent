import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { FilterListOutlined, SearchOutlined } from "@mui/icons-material";

import {
  StyledButton,
  StyledIconButton,
} from "../StyledControls/StyledControls";

import EventCard from "./EventCard/EventCard";

const EventList = () => {
  const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  return (
    <>
      <Typography variant="h1" component="h1" gutterBottom>
        Мероприятия
      </Typography>
      <Grid
        component="article"
        container
        spacing={2.5}
        sx={{ mb: 5, alignItems: "baseline" }}
      >
        <Grid
          item
          lg={4}
          md={6}
          sm={6}
          xs={6}
          sx={{ display: "flex", alignItems: "flex-end" }}
        >
          <SearchOutlined fontSize="large" sx={{ mr: 1 }} />
          <TextField
            id="search"
            label="Название мероприятия"
            variant="standard"
            sx={{ alignSelf: "baseline", width: 220 }}
          />
          <StyledIconButton
            aria-label="filter"
            title="Фильтр"
            sx={{ ml: "auto", mb: -1 }}
          >
            <FilterListOutlined fontSize="large" />
          </StyledIconButton>
        </Grid>
        <Grid
          item
          lg={8}
          md={6}
          sm={6}
          xs={6}
          sx={{
            display: "flex",
            gap: 2.5,
            alignItems: "baseline",
          }}
        >
          <StyledButton variant="outlined">Екатеринбург</StyledButton>
          <StyledButton variant="outlined">14 - 19 октября</StyledButton>
        </Grid>
      </Grid>
      <Grid component="article" container spacing={2.5}>
        {arr.map((_, index) => (
          <EventCard key={index} />
        ))}
      </Grid>
    </>
  );
};

export default EventList;
