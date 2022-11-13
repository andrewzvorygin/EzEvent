import React from 'react';
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  Container,
  Input,
  Button,
  ButtonGroup,
} from '@mui/material';

const MainForm = () => (
  <Container>
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
          <Button component="label">
            <input hidden accept="image/*" type="file" />
            Загрузите фотографию
          </Button>
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
          <TextField
            fullWidth
            label="Укажите город, улицу"
            variant="filled"
          />
          Кнопка карты
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
            <Button>Да</Button>
            <Button>Нет</Button>
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
            <Button>Да</Button>
            <Button>Нет</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </FormControl>
  </Container>
);

export default MainForm;
