import React from 'react';
import {
  Box, Button, IconButton, Stack, Typography,
} from '@mui/material';

const Organizers = () => (
  <Box>
    <Box sx={{ display: 'flex', gap: '1em' }} mb={3}>
      <Typography variant="h4" gutterBottom={false}>
        Добавить организатора
      </Typography>
      <IconButton color="secondary">
        +
      </IconButton>
    </Box>
    <Stack mb={3} gap={1.5} alignItems="start">
      <Typography paragraph={false}>Главный организатор</Typography>
      <Button variant="outlined">Сергей Камбала</Button>
    </Stack>
    <Stack alignItems="start" gap={1.5}>
      <Typography paragraph={false}>Список организаторов:</Typography>
      <Button variant="outlined">Сергей Камбала</Button>
      <Button variant="outlined">Сергей Камбала</Button>
      <Button variant="outlined">Сергей Камбала</Button>
      <Button variant="outlined">Сергей Камбала</Button>
    </Stack>
  </Box>
);

export default Organizers;
