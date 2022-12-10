import React from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import IosShareIcon from "@mui/icons-material/IosShare";

import Person from "./templates/Person";
import Stages from "./templates/Stages";
import Description from "./templates/Description";
import Comments from "./Comments/Comments";
import SmallTitle from "./templates/SmallTitle";
import ButtonModalMap from "./templates/ButtonModalMap";

const EventPage = () => {
  const photo =
    "https://cs4.pikabu.ru/post_img/big/2015/08/06/8/1438865092_1172094034.png";
  return (
    <>
      {photo && (
        <Box
          component="img"
          sx={{
            maxWidth: "100%",
            height: "450px",
            width: "100%",
          }}
          src={photo}
          mb={5}
        />
      )}
      <Typography variant="h1" component="h1" mb={5}>
        Ботинкин Анджей Буховский. <br /> Мифы и предания 2ух тапков Ведьмака
      </Typography>
      <Stack
        direction="row"
        spacing={3}
        mb={5}
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
      >
        <Box>28 сентября</Box>
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
        <Typography
          variant={"caption"}
          fontSize={16}
          fontWeight={300}
          sx={{ fontStyle: "italic" }}
          maxWidth={280}
        >
          *Мероприятие предназначено только для участников команды по проекту
        </Typography>
      </Stack>

      <Grid container mb={5} spacing={2.5}>
        <Grid item xs={3}>
          <SmallTitle mb={1}>Организаторы</SmallTitle>
          <Stack spacing={2}>
            <Person />
            <Person />
            <Person />
            <Person />
            <Person />
          </Stack>
        </Grid>
        <Grid item xs={9}>
          <Description />
        </Grid>
      </Grid>
      <Box mb={5}>
        <Divider />
      </Box>
      <Stages />
      <Comments />
    </>
  );
};

export default EventPage;
