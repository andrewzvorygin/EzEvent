import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Grid, InputBase, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import ButtonMap from "../Map/ButtonMap";
import { EventType } from "../../types";
import { TagsContext } from "../../App";

import Description from "./Description/Description";
import Tags from "./Tags/Tags";

interface MainFormPropsType {
  ws: WebSocket;
  eventData: EventType;
}

const MainForm: React.FC<MainFormPropsType> = ({ ws, eventData }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);

  useEffect(() => {
    if (eventData.title !== title) {
      setTitle(eventData.title);
    }
    if (eventData.date_start !== dateStart) {
      setDateStart(
        eventData.date_start ? new Date(eventData.date_start) : null,
      );
    }
    if (eventData.date_end !== dateEnd) {
      setDateEnd(eventData.date_end ? new Date(eventData.date_end) : null);
    }
    if (eventData.photo_cover !== photo) {
      setPhoto(eventData.photo_cover);
    }
  }, [eventData]);

  return (
    <Grid
      direction="column"
      container
      spacing={5}
      maxWidth={"100%"}
      sx={{
        overflow: "hidden",
      }}
    >
      <Grid item>
        <Typography variant="h3" gutterBottom>
          Название мероприятия
        </Typography>
        <InputBase
          fullWidth
          placeholder="Введите текст"
          sx={{
            padding: 1,
            background: "#edfffb",
            fontSize: "1.5rem",
            borderRadius: "4px",
          }}
          onChange={(event) => {
            if (event.target.value !== title) {
              setTitle(event.target.value);
            }
          }}
          onBlur={() => {
            ws.send(JSON.stringify({ title: title }));
          }}
          value={title}
        />
      </Grid>
      <Grid item>
        <Typography variant="h3" gutterBottom>
          Обложка мероприятия
        </Typography>
        <InputBase
          fullWidth
          placeholder="Введите ссылку"
          sx={{
            padding: 1,
            background: "#edfffb",
            fontSize: "1.5rem",
            borderRadius: "4px",
          }}
          onChange={(event) => {
            if (event.target.value !== photo) {
              setPhoto(event.target.value);
            }
          }}
          onBlur={() => {
            ws.send(JSON.stringify({ photo_cover: photo }));
          }}
          value={photo}
        />
        {photo && <Box component="img" sx={{ maxWidth: "100%" }} src={photo} />}
      </Grid>
      <Grid
        item
        sx={{ maxWidth: "100% !important", overflow: "hidden", minWidth: 0 }}
      >
        <TagsContext.Consumer>
          {({ tags }) => <Tags tags={tags} ws={ws} tagsId={eventData.tags_id} />}
        </TagsContext.Consumer>
      </Grid>
      <Grid
        item
        overflow={"hidden"}
        sx={{ maxWidth: "100% !important", overflow: "hidden", minWidth: 0 }}
      >
        <Description ws={ws} description={eventData.description} />
      </Grid>
      <Grid item>
        <Typography variant="h3" gutterBottom>
          Где будет проходить мероприятие?
        </Typography>
        <ButtonMap eventData={eventData} ws={ws} />
      </Grid>
      <Grid item>
        <Typography variant="h3" gutterBottom>
          Когда будет проходить мероприятие?
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              value={dateStart}
              onChange={(value) => {
                if (value !== dateStart) {
                  setDateStart(value);
                  ws.send(
                    JSON.stringify({
                      date_start: value ? value.toJSON() : value,
                    }),
                  );
                }
              }}
            />
          </LocalizationProvider>
          <Typography>-</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              renderInput={(props) => <TextField {...props} />}
              value={dateEnd}
              onChange={(value) => {
                if (value !== dateEnd) {
                  setDateStart(value);
                  ws.send(
                    JSON.stringify({
                      date_end: value ? value.toJSON() : value,
                    }),
                  );
                }
              }}
            />
          </LocalizationProvider>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MainForm;
