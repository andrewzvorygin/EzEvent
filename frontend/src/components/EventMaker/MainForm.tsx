import React, { ChangeEvent, useState } from "react";
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

interface MainFormPropsType {
  ws: WebSocket;
  eventData: EventType;
}

const MainForm: React.FC<MainFormPropsType> = ({ ws, eventData }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  function onPhotoChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files) {
      setPhoto(URL.createObjectURL(event?.target?.files[0]));
    }
  }

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
          <Input type="date" />
        </Grid>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Кто организовывает мероприятие?
          </Typography>
          <Typography variant="caption">
            Если это мероприятие организовывает организация, то можете добавить
            логотип организации
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Добавить комментарии к мероприятию?
          </Typography>
          <ButtonGroup variant="outlined">
            <StyledButton>Да</StyledButton>
            <StyledButton>Нет</StyledButton>
          </ButtonGroup>
        </Grid>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Будут ли этапы у мероприятия ?
          </Typography>
          <ButtonGroup
            variant="outlined"
            aria-label="outlined primary button group"
          >
            <StyledButton>Да</StyledButton>
            <StyledButton>Нет</StyledButton>
          </ButtonGroup>
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default MainForm;
