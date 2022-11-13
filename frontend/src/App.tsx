import React from 'react';
import {
  Avatar, Box, Container, CssBaseline, ThemeProvider,
} from '@mui/material';
import {
  AccountBoxOutlined, ControlPointOutlined, MailOutlined, EventNoteOutlined,
} from '@mui/icons-material';
import styles from './App.module.scss';
import { StyledIconButton, theme } from './components/StyledControls/StyledControls';
import EventList from './components/EventList/EventList';

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box className={styles.appWrapper}>
      <Box component="header" sx={{ py: 3, px: 3, display: 'flex' }}>
        <Avatar
          sx={{ width: 56, height: 56 }}
          src="https://sun9-22.userapi.com/impg/Iys7Wp4VAftKbzly1TdVWFZM57Qxt3bbUrn97A/XfXfFlj5rb4.jpg?size=1367x906&quality=96&sign=51fd6e4fcd8c6768c7bb9ccb9049dca8&type=album"
        />
        <Box sx={{
          ml: 'auto', display: 'flex', alignItems: 'center', gap: 2.5,
        }}
        >
          <StyledIconButton title="Мои мероприятия">
            <EventNoteOutlined />
          </StyledIconButton>
          <StyledIconButton title="Оповещения">
            <MailOutlined />
          </StyledIconButton>
          <StyledIconButton title="Создать мероприятие">
            <ControlPointOutlined />
          </StyledIconButton>
          <StyledIconButton title="Профиль">
            <AccountBoxOutlined />
          </StyledIconButton>
        </Box>
      </Box>
      <Container component="main" sx={{ mt: 4, mb: 2 }}>
        <EventList />
      </Container>
    </Box>
  </ThemeProvider>
);

export default App;
