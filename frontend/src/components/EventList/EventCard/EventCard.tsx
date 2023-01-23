import React from "react";
import { Avatar, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { EventCardType } from "../../../types";
import placeholder from "../../../assets/placeholder.jpg";

import styles from "./EventCard.module.scss";

interface EventCardPropsType {
  event: EventCardType;
}

const EventCard: React.FC<EventCardPropsType> = ({ event }) => {
  const navigate = useNavigate();

  return (
    <Grid item lg={4} md={6} sm={12} xs={12}>
      <Paper
        className={styles.card}
        elevation={2}
        onClick={() => navigate(`/event/${event.uuid}`)}
      >
        <div className={styles.coverContainer}>
          <img
            className={styles.cover}
            src={event.photo_cover || placeholder}
            alt="Обложка мероприятия"
          />
        </div>
        <div className={styles.cardInfo}>
          <Typography variant="h3" component="h3" sx={{ my: 1.5 }}>
            {event.title || "Без названия"}
          </Typography>
          <div className={styles.company}>
            <Avatar
              className={styles.avatar}
              src="https://sun3-11.userapi.com/impg/ky8437PNHYlH4yTRgJh2pPNSFKGbWjA8-dqaLw/jGVuPxkf_6s.jpg?size=650x925&quality=96&sign=fecf2fabbc55d170634f67222f9acf33&type=album"
            />
            <Typography variant="body1">Серёга Чел</Typography>
          </div>
          <Typography
            variant="body1"
            sx={{
              textAlign: "right",
              mt: 1.5,
              fontWeight: 300,
            }}
            gutterBottom
          >
            {event.city
              ? `${event.city.substring(0, 1)}${event.city
                  .substring(1)
                  .toLowerCase()}`
              : "Неизвестно"}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "right" }} gutterBottom>
            {event.date_start && event.date_end
              ? `С ${new Date(
                  event.date_start,
                ).toLocaleDateString()} по ${new Date(
                  event.date_end,
                ).toLocaleDateString()}`
              : "Без даты"}
          </Typography>
        </div>
      </Paper>
    </Grid>
  );
};

export default EventCard;
