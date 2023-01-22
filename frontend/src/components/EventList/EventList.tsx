import React, { useEffect, useState } from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { FilterListOutlined, SearchOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";

import {
  StyledButton,
  StyledIconButton,
} from "../StyledControls/StyledControls";
import { eventsAPI } from "../../api/Api";
import { EventQueryType, UserType } from "../../types";

import EventCard from "./EventCard/EventCard";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState<EventQueryType>({
    limit: 30,
    offset: 0,
  });
  const location = useLocation().pathname;

  useEffect(() => {
    if (location === "/events/my") {
      eventsAPI
        .getMyEvents({ ...filter, typeUser: UserType.all })
        .then((data) => {
          setEvents(data.Events);
        });
    }
    if (location === "/events") {
      eventsAPI.getEvents(filter).then((data) => {
        setEvents(data.Events);
      });
    }
  }, [filter, location]);

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
          sm={12}
          xs={12}
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
          sm={12}
          xs={12}
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
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
        <Button
          onClick={() =>
            setFilter((prevFilter) => ({
              ...prevFilter,
              offset: prevFilter.offset + 1,
            }))
          }
        >
          Тык
        </Button>
      </Grid>
    </>
  );
};

export default EventList;
