import React from "react";
import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet, Route, Routes } from "react-router-dom";

import { theme } from "./components/StyledControls/StyledControls";
import EventList from "./components/EventList/EventList";
import Header from "./components/Header/Header";
import EventMaker from "./components/EventMaker/EventMaker";
import EventMap from "./components/EventsMap/EventMap";
import Auth from "./components/Auth/Auth";
import styles from "./App.module.scss";
import EventPage from "./components/Event/EventPage";
import Profile from "./components/Profile/Profile";

const AppWrapper = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box className={styles.appWrapper}>
      <Header />
      <Container component="main" sx={{ mt: 4, mb: 2 }}>
        <Outlet />
      </Container>
    </Box>
  </ThemeProvider>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppWrapper />}>
        <Route path="events">
          <Route path=":profileId" element={<EventMap />} />
          <Route path=":profileId/edit" element={<EventMaker />} />
          <Route index element={<EventList />} />
        </Route>
        <Route path="event" element={<EventPage />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="auth" element={<Auth />} />
    </Routes>
  );
};

export default App;
