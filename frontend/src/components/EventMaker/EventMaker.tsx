import React from 'react';
import { Grid, Typography } from '@mui/material';
import MainForm from './MainForm';
import Organizers from './Organizers';

const EventMaker = () => (
  <div>
    <Typography variant="h3" gutterBottom mb={10}>
      Создание мероприятия
    </Typography>
    <Grid container>
      <Grid item xs={8}>
        <MainForm />
      </Grid>
      <Grid item xs={4}>
        <Organizers />
      </Grid>
    </Grid>
  </div>
);

export default EventMaker;
