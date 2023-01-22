import React, { useMemo, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import { StyledButton } from "../StyledControls/StyledControls";

import EventCard from "./EventCard/EventCard";
import Filter from "./Filter/Filter";

const EventList = () => {
  const arr = [
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
    "be86c52b-5520-4629-b148-ad41e391a144",
  ];

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

  const navigate = useNavigate();

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
        {arr.map((item, index) => (
          <EventCard key={index} onClick={() => navigate(`/event/${item}`)} />
        ))}
      </Grid>
    </>
  );
};

export default EventList;
