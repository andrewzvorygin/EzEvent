import React, { useMemo, useEffect, useState } from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { FilterListOutlined, SearchOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import { StyledButton } from "../StyledControls/StyledControls";
import { eventsAPI } from "../../api/Api";
import { EventQueryType, UserType } from "../../types";

import EventCard from "./EventCard/EventCard";
import Filter from "./Filter/Filter";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState<EventQueryType>({
    limit: 30,
    offset: 0,
  });
  const location = useLocation().pathname;

  const cities = [
    {
      name: "Екб",
      id: 0,
    },
    {
      name: "Челяб",
      id: 1,
    },
    {
      name: "Москва",
      id: 2,
    },
    {
      name: "Жопосранск",
      id: 3,
    },
    {
      name: "МойДоДыр",
      id: 4,
    },
  ];

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

  const formik = useFormik({
    initialValues: {
      city: null,
      search: "",
      dateStart: null,
      dateEnd: null,
      type: "Текущие",
    },
    onSubmit: (values) => {
      console.log(values);
      //todo: something
    },
  });

  const [expandedFilter, setExpandedFilter] = useState(false);
  const handleExpandClick = () => setExpandedFilter((e) => !e);

  const selectedCity = useMemo(
    () => cities?.find((value) => value.id === formik.values.city)?.name,
    [formik.values.city]
  );
  return (
    <>
      <Typography variant="h1" component="h1" gutterBottom>
        {location === "/events/my" ? "Мои мероприятия" : "Мероприятия"}
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
          <Filter
            formik={formik}
            expanded={expandedFilter}
            handleExpandClick={handleExpandClick}
            cities={cities}
          />
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
          {selectedCity && (
            <StyledButton variant="outlined" onClick={handleExpandClick}>
              {selectedCity}
            </StyledButton>
          )}
          {formik.values.type && (
            <StyledButton variant="outlined" onClick={handleExpandClick}>
              {formik.values.type}
            </StyledButton>
          )}
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
