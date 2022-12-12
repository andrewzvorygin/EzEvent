import React, { useEffect } from "react";
import { Grid, Typography } from "@mui/material";

import MainForm from "./MainForm";
import Organizers from "./Organizers";

const EventMaker = () => {
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    ws.addEventListener("message", (e) => {
      console.log(e.data);
    });
  }, []);

  return (
    <>
      <Typography variant="h1" component="h1" mb={5}>
        Создание мероприятия
      </Typography>
      <Grid container spacing={2.5}>
        <Grid item xs={7}>
          <MainForm />
        </Grid>
        <Grid item xs={5}>
          <Organizers />
        </Grid>
      </Grid>
    </>
  );
};

export default EventMaker;
