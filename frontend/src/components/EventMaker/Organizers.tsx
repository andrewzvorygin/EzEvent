import React from 'react';
import {
  Box, Stack, Typography,
} from '@mui/material';
import { ControlPointOutlined } from '@mui/icons-material';
import { StyledButton, StyledIconButton } from '../StyledControls/StyledControls';

const Organizers = () => (
  <Box>
    <Box sx={{ display: 'flex', gap: '1em', alignItems: 'center' }} mb={3}>
      <Typography variant="h3">
        Добавить организатора
      </Typography>
      <StyledIconButton>
        <ControlPointOutlined fontSize="large" />
      </StyledIconButton>
    </Box>
    <Stack mb={3} gap={1.5} alignItems="start">
      <Typography>Главный организатор</Typography>
      <StyledButton variant="outlined">Сергей Камбала</StyledButton>
    </Stack>
    <Stack alignItems="start" gap={1.5}>
      <Typography>Список организаторов:</Typography>
      <StyledButton variant="outlined">Сергей Камбала</StyledButton>
      <StyledButton variant="outlined">Сергей Камбала</StyledButton>
      <StyledButton variant="outlined">Сергей Камбала</StyledButton>
      <StyledButton variant="outlined">Сергей Камбала</StyledButton>
    </Stack>
  </Box>
);

export default Organizers;
