import {
  Avatar,
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccountBoxOutlined,
  ControlPointOutlined,
  EventNoteOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import MapIcon from "@mui/icons-material/Map";

import logo from "../../assets/logo.png";
import { StyledIconButton } from "../StyledControls/StyledControls";
import { authAPI, eventsAPI } from "../../api/Api";
import { AuthContext, DeviceContext } from "../../App";
import { AuthType, DeviceContextType, DeviceType } from "../../types";
const activeStyle = {
  color: "#1976d2",
  ":hover": {
    color: "#1976d2",
  },
};
const Header: React.FC<AuthType & DeviceContextType> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), {
    defaultMatches: true,
  });
  return (
    <Box component="header" sx={{ py: 3, px: 3, display: "flex" }}>
      <NavLink to={"/events"}>
        <Avatar sx={{ width: 56, height: 56 }} src={logo} />
      </NavLink>
      {!isMobile && (
        <Typography variant={"h3"} alignSelf={"center"} ml={2}>
          EzEvent
        </Typography>
      )}
      <Box
        sx={{
          ml: "auto",
          display: "flex",
          alignItems: "center",
          gap: !isMobile ? 2.5 : 1.5,
        }}
      >
        {props.auth ? (
          <>
            <StyledIconButton
              sx={location.pathname === `/events/my` ? activeStyle : undefined}
              title="Мои мероприятия"
              onClick={() => {
                navigate(`/events/my`);
              }}
            >
              <EventNoteOutlined />
            </StyledIconButton>
            <StyledIconButton
              sx={location.pathname === `/events/map` ? activeStyle : undefined}
              title="Мои мероприятия картой"
              onClick={() => {
                navigate(`/events/map`);
              }}
            >
              <MapIcon />
            </StyledIconButton>
            {props.device !== DeviceType.mobile && (
              <StyledIconButton
                title="Создать мероприятие"
                onClick={() => {
                  eventsAPI.postEvent().then((data) => {
                    navigate(`/event/${data.uuid_edit}/edit`);
                  });
                }}
              >
                <ControlPointOutlined />
              </StyledIconButton>
            )}
            <StyledIconButton
              sx={location.pathname === `/events` ? activeStyle : undefined}
              title="Главная"
              onClick={() => {
                navigate(`/events`);
              }}
            >
              <HomeOutlined />
            </StyledIconButton>
            <StyledIconButton
              sx={location.pathname === `/profile` ? activeStyle : undefined}
              title="Профиль"
              onClick={() => {
                navigate(`/profile`);
              }}
            >
              <AccountBoxOutlined />
            </StyledIconButton>
            <StyledIconButton
              title="Выйти"
              onClick={() => {
                authAPI.deleteAuthLogin().then(() => {
                  props.setAuth(false);
                });
              }}
            >
              <LogoutOutlined />
            </StyledIconButton>
          </>
        ) : (
          <>
            <StyledIconButton
              sx={location.pathname === `/events` ? activeStyle : undefined}
              title="Главная"
              onClick={() => {
                navigate(`/events`);
              }}
            >
              <HomeOutlined />
            </StyledIconButton>
            <Button
              onClick={() => {
                navigate(`/auth`, { state: location });
              }}
            >
              Войти
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

const HeaderPage = () => {
  return (
    <AuthContext.Consumer>
      {({ auth, setAuth, initialized }) => (
        <DeviceContext.Consumer>
          {({ device, setDevice }) => (
            <Header
              auth={auth}
              setAuth={setAuth}
              device={device}
              setDevice={setDevice}
            />
          )}
        </DeviceContext.Consumer>
      )}
    </AuthContext.Consumer>
  );
};

export default HeaderPage;
