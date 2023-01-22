import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  Input,
  InputBase,
  Typography,
} from "@mui/material";
import { AddAPhotoOutlined } from "@mui/icons-material";

import { StyledButton } from "../StyledControls/StyledControls";
import ButtonMap from "../Map/ButtonMap";
import { EventType } from "../../types";

import Description from "./Description/Description";
import Comments from "./Comments/Comments";

interface MainFormPropsType {
  ws: WebSocket;
  eventData: EventType;
}

const MainForm: React.FC<MainFormPropsType> = ({ ws, eventData }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  function onPhotoChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files) {
      setPhoto(URL.createObjectURL(event?.target?.files[0]));
    }
  }

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
  }, [eventData]);

  return (
    <FormControl fullWidth>
      <Grid direction="column" container spacing={5}>
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
          <Button component="label" startIcon={<AddAPhotoOutlined />}>
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={onPhotoChange}
            />
            Загрузите фотографию
          </Button>
          {photo && (
            <Box component="img" sx={{ maxWidth: "100%" }} src={photo} />
          )}
        </Grid>
        <Grid item maxWidth={"100%"} overflow={"hidden"}>
          <Description ws={ws} description={eventData.description} />
        </Grid>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Где будет проходить мероприятие?
          </Typography>
          <ButtonMap />
        </Grid>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Когда будет проходить мероприятие?
          </Typography>
          С{" "}
          <Input
            type="date"
            onChange={(event) => {
              const newDateStart = new Date(event.target.value);
              if (newDateStart !== dateStart) {
                setDateStart(newDateStart);
                ws.send(
                  JSON.stringify({ date_start: newDateStart.toISOString() }),
                );
              }
            }}
          />{" "}
          по{" "}
          <Input
            type="date"
            onChange={(event) => {
              const newDateEnd = new Date(event.target.value);
              if (newDateEnd !== dateEnd) {
                setDateStart(newDateEnd);
                ws.send(JSON.stringify({ date_end: newDateEnd.toISOString() }));
              }
            }}
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default MainForm;
