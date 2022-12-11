import React, { useEffect, useState } from "react";
import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { theme } from "./components/StyledControls/StyledControls";
import EventList from "./components/EventList/EventList";
import Header from "./components/Header/Header";
import EventMaker from "./components/EventMaker/EventMaker";
import EventMap from "./components/EventsMap/EventMap";
import Auth from "./components/Auth/Auth";
import EventPage from "./components/Event/EventPage";
import Profile from "./components/Profile/Profile";
import { authAPI } from "./api/Api";
import styles from "./App.module.scss";

interface AppPropsType {
  auth: boolean;
  setAuth: (auth: boolean) => void;
}

const AppWrapper: React.FC<AppPropsType> = (props) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box className={styles.appWrapper}>
      <Header auth={props.auth} setAuth={props.setAuth} />
      <Container component="main" sx={{ mt: 4, mb: 2 }}>
        <Outlet />
      </Container>
    </Box>
  </ThemeProvider>
);

const App = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [initialized, setInitialized] = useState(false);
  const [auth, setAuth] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const authMe = authAPI.getAuthMe().then((data) => {
      if (data.user_id === null) {
        setAuth(false);
        setUserId(null);
      } else {
        setAuth(true);
        setUserId(data.user_id);
      }
    });
    Promise.all([authMe]).then(() => {
      setInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (initialized && location === "/") {
      navigate("/events", { replace: true });
    }
  }, [initialized]);

  return (
    <Routes>
      <Route path="/" element={<AppWrapper auth={auth} setAuth={setAuth} />}>
        <Route path="events">
          <Route path=":profileId" element={<EventMap />} />
          <Route index element={<EventList />} />
        </Route>
        <Route path="event">
          <Route path=":eventId" element={<EventPage />} />
          <Route path=":eventId/edit" element={<EventMaker />} />
        </Route>
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route
        path="auth"
        element={<Auth auth={auth} setAuth={() => setAuth(true)} />}
      />
    </Routes>
  );
};

export default App;
