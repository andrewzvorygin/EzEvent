import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { useFormik } from "formik";

import { StyledButton } from "../StyledControls/StyledControls";
import { eventsAPI } from "../../api/Api";
import {
  CityType,
  EventCardType,
  EventQueryType,
  MyEventQueryType,
  UserType,
} from "../../types";

import Filter from "./Filter/Filter";
import EventCard from "./EventCard/EventCard";

const EventList = () => {
  const [userType, setUserType] = useState(UserType.all);
  const [cities, setCities] = useState<CityType[]>([]);
  const [events, setEvents] = useState<EventCardType[]>([]);
  const [filter, setFilter] = useState<EventQueryType>({
    limit: 30,
    offset: 0,
  });
  const location = useLocation().pathname;

  const formik = useFormik({
    initialValues: {
      location: undefined,
      search: "",
      dateStart: undefined,
      dateEnd: undefined,
    },
    onSubmit: (values) => {
      if (location === "/events/my") {
        eventsAPI
          .getMyEvents({ ...values, typeUser: userType, ...filter })
          .then((data) => {
            setEvents((prevState) => [...prevState, ...data.Events]);
          });
      }
      if (location === "/events") {
        eventsAPI.getEvents({ ...values, ...filter }).then((data) => {
          setEvents((prevState) => [...prevState, ...data.Events]);
        });
      }
    },
  });

  useEffect(() => {
    if (location === "/events/my") {
      eventsAPI
        .getMyEvents({ ...formik.values, typeUser: userType, ...filter })
        .then((data) => {
          setEvents((prevState) =>
            filter.offset ? [...prevState, ...data.Events] : data.Events,
          );
        });
    }
    if (location === "/events") {
      eventsAPI
        .getEvents({
          ...formik.values,
          ...filter,
        })
        .then((data) => {
          setEvents((prevState) =>
            filter.offset ? [...prevState, ...data.Events] : data.Events,
          );
        });
    }
  }, [filter]);

  useEffect(() => {
    setFilter({ limit: 30, offset: 0 });
  }, [location]);

  const [expandedFilter, setExpandedFilter] = useState(false);
  const handleExpandClick = () => setExpandedFilter((e) => !e);

  const selectedCity = useMemo(
    () => cities?.find((value) => value.id === formik.values.location)?.name,
    [formik.values.location]
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
            setCities={setCities}
            userType={location === "/events/my" ? userType : null}
            setUserType={location === "/events/my" ? setUserType : null}
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
          {formik.values.dateStart && (
            <StyledButton variant="outlined" onClick={handleExpandClick}>
              <>С {formik.values.dateStart}</>
            </StyledButton>
          )}
          {formik.values.dateEnd && (
            <StyledButton variant="outlined" onClick={handleExpandClick}>
              <>По {formik.values.dateEnd}</>
            </StyledButton>
          )}
        </Grid>
      </Grid>
      <Grid component="article" container spacing={2.5}>
        {events.length > 0 ? (
          events.map((event, index) => <EventCard key={index} event={event} />)
        ) : (
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography variant={"h6"}>Пока здесь пусто...</Typography>
          </Grid>
        )}
      </Grid>
      {events.length === filter.limit * (filter.offset + 1) && (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() =>
              setFilter((prevFilter) => ({
                ...prevFilter,
                offset: prevFilter.offset + 1,
              }))
            }
          >
            Показать ещё
          </Button>
        </Box>
      )}
    </>
  );
};

export default EventList;
