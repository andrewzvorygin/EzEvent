import React, { useEffect, useState } from "react";
import { Box, ButtonGroup, Typography } from "@mui/material";

import { StyledButton } from "../../StyledControls/StyledControls";
import { EventType } from "../../../types";

interface VisibilityPropsType {
  eventData: EventType;
  ws: WebSocket;
}

const selectedStyle = {
  background: "#1976d2",
  color: "white",
  ":hover": {
    color: "white",
    background: "rgba(25,118,210,0.43)",
  },
};
const Visibility: React.FC<VisibilityPropsType> = ({ ws, eventData }) => {
  const [disableVisibility, setDisableVisibility] = useState<boolean>(true);
  const [visibility, setVisibility] = useState<boolean>(
    eventData.visibility ?? false,
  );

  const skipKeys = [
    "key_invite",
    "visibility",
    "can_edit",
    "can_reg",
    "participants",
  ];

  useEffect(() => {
    if (eventData.visibility !== visibility) {
      setVisibility(eventData.visibility ?? false);
    }
    let disable = false;
    Object.entries(eventData).forEach((item) => {
      if (!skipKeys.includes(item[0]) && !item[1]) {
        disable = true;
      }
    });
    if (disable && visibility) {
      setVisibility(false);
      ws.send(JSON.stringify({ visibility: false }));
    }
    setDisableVisibility(disable);
  }, [eventData]);

  return (
    <Box mb={2}>
      <Typography variant="h3" gutterBottom>
        Видимость мероприятия
      </Typography>
      <ButtonGroup
        variant="outlined"
        aria-label="outlined primary button group"
        disabled={disableVisibility}
      >
        <StyledButton
          onClick={() => {
            setVisibility(true);
            ws.send(JSON.stringify({ visibility: true }));
          }}
          sx={visibility ? selectedStyle : undefined}
        >
          Видимо
        </StyledButton>
        <StyledButton
          onClick={() => {
            setVisibility(false);
          }}
          sx={!visibility ? selectedStyle : undefined}
        >
          Скрыто
        </StyledButton>
      </ButtonGroup>
    </Box>
  );
};

export default Visibility;
