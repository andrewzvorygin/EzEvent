import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import IosShareIcon from "@mui/icons-material/IosShare";
import { useParams } from "react-router-dom";

import { eventsAPI } from "../../api/Api";
import { EventType } from "../../types";

import Person from "./templates/Person";
import Description from "./templates/Description";
import Comments from "./Comments/Comments";
import SmallTitle from "./templates/SmallTitle";
import ButtonModalMap from "./templates/ButtonModalMap";

const EventPage = () => {
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

  if (event === null) {
    return null;
  }

  return (
    <>
      {event.photo_cover && (
        <Box
          component="img"
          sx={{
            maxWidth: "100%",
            width: "100%",
            objectFit: "contain",
          }}
          src={event.photo_cover}
          mb={5}
        />
      )}
      <Typography
        variant="h1"
        component="h1"
        mb={5}
        sx={{
          [theme.breakpoints.down("md")]: { fontSize: "2rem" },
        }}
      >
        {event.title}
      </Typography>
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
          <Typography>Посмотреть на карте</Typography>
          <ButtonModalMap />
        </Stack>
        <Button variant="contained">Зарегистрироваться</Button>
      </Stack>

      <Stack direction="row" spacing={3} mb={5} justifyContent="space-between">
        <Box>
          <IconButton>
            <LinkIcon />
          </IconButton>
          <IconButton>
            <IosShareIcon />
          </IconButton>
        </Box>
      </Stack>

      <Grid container mb={5} spacing={2.5}>
        <Grid item lg={4} md={6} sm={12} xs={12}>
          <SmallTitle mb={1}>Организаторы</SmallTitle>
          <Stack
            spacing={0}
            alignItems={"flex-start"}
            direction={isMobile ? "row" : "column"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            <Box mb={2} mr={2}>
              <Person />
            </Box>
            <Box mb={2} mr={2}>
              <Person />
            </Box>
            <Box mb={2} mr={2}>
              <Person />
            </Box>
            <Box mb={2} mr={2}>
              <Person />
            </Box>
          </Stack>
        </Grid>
        <Grid item sm={12} xs={12}>
          <Description description={event.description} />
        </Grid>
      </Grid>
      <Box mb={5}>
        <Divider />
      </Box>
      <Comments />
    </>
  );
};

export default EventPage;
