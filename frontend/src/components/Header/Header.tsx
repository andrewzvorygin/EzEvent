import { Avatar, Box } from "@mui/material";
import {
  AccountBoxOutlined,
  ControlPointOutlined,
  EventNoteOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MailOutlined,
} from "@mui/icons-material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { StyledIconButton } from "../StyledControls/StyledControls";
import { authAPI, eventsAPI } from "../../api/Api";
import { AuthContext, DeviceContext } from "../../App";
import { AuthContextType, DeviceContextType, DeviceType } from "../../types";

const Header: React.FC<AuthContextType & DeviceContextType> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(props.device)
  return (
    <Box component="header" sx={{ py: 3, px: 3, display: "flex" }}>
      <Avatar
        sx={{ width: 56, height: 56 }}
        src="https://sun9-22.userapi.com/impg/Iys7Wp4VAftKbzly1TdVWFZM57Qxt3bbUrn97A/XfXfFlj5rb4.jpg?size=1367x906&quality=96&sign=51fd6e4fcd8c6768c7bb9ccb9049dca8&type=album"
      />
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
              title="Мобильная версия"
              onClick={() => {
                navigate(`/events`);
              }}
            >
              <EventNoteOutlined />
            </StyledIconButton><StyledIconButton
              title="Мои мероприятия"
              onClick={() => {
                navigate(`/events`);
              }}
            >
              <EventNoteOutlined />
            </StyledIconButton>
            <StyledIconButton title="Оповещения">
              <MailOutlined />
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
      {({ auth, setAuth }) => (
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
