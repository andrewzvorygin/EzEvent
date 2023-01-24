import React, { useEffect, useRef, useState } from "react";
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
import { AuthContextType, DeviceContextType, DeviceType } from "./types";
import styles from "./App.module.scss";
import Invite from "./components/InvitePage/Invite";

export const DeviceContext = React.createContext<DeviceContextType>({
  device: window.innerWidth < 1000 ? DeviceType.mobile : DeviceType.computer,
  setDevice: (device) => {},
});

export const AuthContext = React.createContext<AuthContextType>({
  initialized: false,
  setInitialized: (initialized) => {},
  auth: false,
  setAuth: (auth) => {},
});

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
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [initialized, setInitialized] = useState(false);
  const [auth, setAuth] = useState<boolean>(false);
  const [device, setDevice] = useState<DeviceType>(
    window.innerWidth < 1000 ? DeviceType.mobile : DeviceType.computer,
  );
  const deviceRef = useRef<DeviceType>(
    window.innerWidth < 1000 ? DeviceType.mobile : DeviceType.computer
  );

  const resizeListener = () => {
    if (window.innerWidth < 1000 && deviceRef.current === DeviceType.computer) {
      setDevice(DeviceType.mobile);
    }
    if (window.innerWidth >= 1000 && deviceRef.current === DeviceType.mobile) {
      setDevice(DeviceType.computer);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resizeListener);
    const authMe = authAPI
      .getAuthMe((response) => {
        if (response.status === 401) {
          setAuth(false);
        }
      })
      .then((data) => {
        if (data.user_id) {
          setAuth(true);
        }
      });
    Promise.all([authMe]).then(() => {
      setInitialized(true);
    });
    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  useEffect(() => {
    if (initialized && location === "/") {
      navigate("/events", { replace: true });
    }
  }, [initialized]);

  useEffect(() => {
    deviceRef.current = device;
  }, [device]);

  if (!initialized) {
    return null;
  }

  return (
    <DeviceContext.Provider value={{ device, setDevice }}>
      <AuthContext.Provider
        value={{ auth, setAuth, initialized, setInitialized }}
      >
        <Routes>
          <Route path="/" element={<AppWrapper />}>
            <Route path="events">
              <Route path="my" element={<EventList />} />
              <Route path="map" element={<EventMap />} />
              <Route index element={<EventList />} />
            </Route>
            <Route path="event">
              <Route path=":eventId" element={<EventPage />} />
              <Route path=":eventId/edit" element={<EventMaker />} />
              <Route path=":eventId/invite/:key" element={<Invite />} />
            </Route>
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="auth" element={<Auth />} />
        </Routes>
      </AuthContext.Provider>
    </DeviceContext.Provider>
  );
};

export default App;
