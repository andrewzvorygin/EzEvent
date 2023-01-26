import { Avatar, Box } from "@mui/material";
import {
  AccountBoxOutlined,
  ControlPointOutlined,
  EventNoteOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapIcon from "@mui/icons-material/Map";

import logo from "../../assets/logo.png";
import { StyledIconButton } from "../StyledControls/StyledControls";
import { authAPI, eventsAPI } from "../../api/Api";
import { AuthContext, DeviceContext } from "../../App";
import { AuthType, DeviceContextType, DeviceType } from "../../types";
const Header: React.FC<AuthType & DeviceContextType> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Box component="header" sx={{ py: 3, px: 3, display: "flex" }}>
      <Avatar sx={{ width: 56, height: 56 }} src={logo} />
      <Box
        sx={{
          ml: "auto",
          display: "flex",
          alignItems: "center",
          gap: 2.5,
        }}
      >
        {props.auth ? (
          <>
            <StyledIconButton
              title="Мои мероприятия"
              onClick={() => {
                navigate(`/events/my`);
              }}
            >
              <EventNoteOutlined />
            </StyledIconButton>
            <StyledIconButton
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
              title="Главная"
              onClick={() => {
                navigate(`/events`);
              }}
            >
              <HomeOutlined />
            </StyledIconButton>
            <StyledIconButton
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
              title="Главная"
              onClick={() => {
                navigate(`/events`);
              }}
            >
              <HomeOutlined />
            </StyledIconButton>
            <StyledIconButton
              title="Войти"
              onClick={() => {
                navigate(`/auth`, { state: location });
              }}
            >
              <LoginOutlined />
            </StyledIconButton>
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
