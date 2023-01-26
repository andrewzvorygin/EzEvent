import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { eventsAPI } from "../../api/Api";
import { EventType } from "../../types";

import Person from "./templates/Person";
import Description from "./templates/Description";
import Comments from "./Comments/Comments";
import SmallTitle from "./templates/SmallTitle";
import ButtonModalMap from "./templates/ButtonModalMap";
import Participants from "./templates/Participants";

const EventPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), {
    defaultMatches: true,
  });

  const eventId = useParams().eventId;

  const [event, setEvent] = useState<EventType | null>(null);

  useEffect(() => {
    if (eventId) {
      eventsAPI.getEvent(eventId).then((data) => {
        console.log(data);
        setEvent({
          ...data,
          date_start: data.date_start
            ? new Date(data.date_start).toLocaleDateString()
            : "неизвестно",
          date_end: data.date_end
            ? new Date(data.date_end).toLocaleDateString()
            : "неизвестно",
        });
      });
    }
  }, []);

  if (event === null || eventId === undefined) {
    return null;
  }

  return (
    <>
      {event.photo_cover && (
        <Box
          component="img"
          sx={{
            height: "300px",
            width: "100%",
            objectFit: "cover",
          }}
          src={
            "https://sun9-22.userapi.com/impg/Sm3YtJ-VcQuAgZgeh_8x8jvUfNsdAMxRTMyN8Q/jNG_leCW7bg.jpg?size=479x274&quality=96&sign=748eda4dd8575ca4a4ded609c5e844c9&type=album"
          }
          mb={5}
        />
      )}
      <Stack direction={"row"} spacing={1} alignItems={"center"} mb={5}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            [theme.breakpoints.down("md")]: { fontSize: "2rem" },
          }}
        >
          {event.title}
        </Typography>
      </Stack>

      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 1.5 : 3}
        mb={5}
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
      >
        <Box>
          С {event.date_start} по {event.date_end}
        </Box>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          {event.latitude && event.longitude ? (
            <ButtonModalMap marker={[event.latitude, event.longitude]} />
          ) : (
            "Без места"
          )}
        </Stack>
        {event.can_edit ? (
          <Button
            variant="contained"
            onClick={() => {
              navigate(`/event/${event.uuid_edit}/edit`);
            }}
          >
            Редактировать
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => {
              eventsAPI.registerOnEvent(eventId);
            }}
            disabled={!event.can_reg}
          >
            {event.can_reg ? "Зарегистрироваться" : "Вы уже зарегистрированы"}
          </Button>
        )}
      </Stack>

      <Grid container mb={5} spacing={2.5}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Stack
            direction={isMobile ? "column" : "row"}
            justifyContent={"space-between"}
          >
            <Box>
              <SmallTitle mb={2}>Организаторы</SmallTitle>
              <Stack
                spacing={0}
                alignItems={"flex-start"}
                direction={isMobile ? "row" : "column"}
                justifyContent={"space-between"}
                flexWrap={"wrap"}
              >
                {event.editors.map((e) => {
                  return (
                    <Box mb={2} mr={2} key={e.surname}>
                      <Person item={e} />
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            {event.can_edit && event.participants && (
              <Participants participants={event.participants} />
            )}
          </Stack>
        </Grid>
        <Grid item sm={12} xs={12}>
          <Description description={event.description} />
        </Grid>
      </Grid>
      <Box mb={5}>
        <Divider />
      </Box>
      {event?.event_id && <Comments eventId={event.event_id} />}
    </>
  );
};

export default EventPage;
