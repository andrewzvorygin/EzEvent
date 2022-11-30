import { Avatar, Box } from "@mui/material";
import {
  AccountBoxOutlined,
  ControlPointOutlined,
  EventNoteOutlined,
  MailOutlined,
} from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";

import { StyledIconButton } from "../StyledControls/StyledControls";

const Header = () => {
  const navigate = useNavigate();
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
        <StyledIconButton
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
        <StyledIconButton
          title="Создать мероприятие"
          onClick={() => {
            navigate(`/events/1/edit`);
          }}
        >
          <ControlPointOutlined />
        </StyledIconButton>
        <StyledIconButton
          title="Профиль"
          onClick={() => {
            navigate(`/profile`);
          }}
        >
          <AccountBoxOutlined />
        </StyledIconButton>
      </Box>
    </Box>
  );
};

export default Header;
