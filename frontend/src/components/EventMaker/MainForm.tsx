import React, { ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  Input,
  TextField,
  Typography
} from '@mui/material';
import { AddAPhotoOutlined } from '@mui/icons-material';
import { StyledButton } from '../StyledControls/StyledControls';
import ButtonMap from '../Map/ButtonMap';

const MainForm = () => {
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
          <TextField fullWidth label="Введите текст" variant="filled" />
        </Grid>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Обложка мероприятия
          </Typography>
          <Button component="label" startIcon={<AddAPhotoOutlined />}>
            <input hidden accept="image/*" type="file" onChange={onPhotoChange} />
            Загрузите фотографию
          </Button>
          {photo && (
            <Box
              component="img"
              sx={{ maxWidth: '100%' }}
              src={photo}
            />
          )}
        </Grid>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Описание мероприятия
          </Typography>
          <TextField
            multiline
            fullWidth
            label="Введите текст"
            variant="filled"
            rows={4}
          />
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
            Если это мероприятие организовывает организация, то можете
            добавить логотип организации
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
