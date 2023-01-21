import React from "react";
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

import Person from "./templates/Person";
import Stages from "./templates/Stages";
import Description from "./templates/Description";
import Comments from "./Comments/Comments";
import SmallTitle from "./templates/SmallTitle";
import ButtonModalMap from "./templates/ButtonModalMap";

const EventPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), {
    defaultMatches: true,
  });
  const photo =
    "https://cs4.pikabu.ru/post_img/big/2015/08/06/8/1438865092_1172094034.png";
  return (
    <>
      {photo && (
        <Box
          component="img"
          sx={{
            maxWidth: "100%",
            width: "100%",
            objectFit: "contain",
          }}
          src={photo}
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
        Ботинкин Анджей Буховский. <br /> Мифы и предания 2ух тапков Ведьмака
      </Typography>
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 1.5 : 3}
        mb={5}
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-between"
      >
        <Box>28 сентября</Box>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
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
