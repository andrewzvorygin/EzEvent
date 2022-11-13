import React from 'react';
import {
  Avatar, Grid, Paper, Typography,
} from '@mui/material';
import styles from './EventCard.module.scss';

const EventCard = () => (
  <Grid item lg={4} md={6} sm={12} xs={12}>
    <Paper elevation={2}>
      <div className={styles.coverContainer}>
        <img
          className={styles.cover}
          src="https://sun9-22.userapi.com/impg/Iys7Wp4VAftKbzly1TdVWFZM57Qxt3bbUrn97A/XfXfFlj5rb4.jpg?size=1367x906&quality=96&sign=51fd6e4fcd8c6768c7bb9ccb9049dca8&type=album"
          alt="Обложка мероприятия"
        />
      </div>
      <div className={styles.cardInfo}>
        <Typography variant="h3" component="h3" sx={{ my: 1.5 }}>
          Туса в Контуре
        </Typography>
        <div className={styles.company}>
          <Avatar
            className={styles.avatar}
            src="https://sun3-11.userapi.com/impg/ky8437PNHYlH4yTRgJh2pPNSFKGbWjA8-dqaLw/jGVuPxkf_6s.jpg?size=650x925&quality=96&sign=fecf2fabbc55d170634f67222f9acf33&type=album"
          />
          <Typography variant="body1">Контур</Typography>
          <Typography variant="body1">Серёга Чел</Typography>
        </div>
        <Typography variant="body1" sx={{ textAlign: 'right', mt: 1.5, fontWeight: 300 }} gutterBottom>
          Екатеринбург
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'right' }} gutterBottom>
          31 февраля
        </Typography>
      </div>
    </Paper>
  </Grid>
);

export default EventCard;
