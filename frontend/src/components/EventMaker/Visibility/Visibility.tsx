import React, { useState } from "react";
import { Box, ButtonGroup, Typography } from "@mui/material";

import { StyledButton } from "../../StyledControls/StyledControls";

const selectedStyle = {
  background: "#1976d2",
  color: "white",
  ":hover": {
    color: "white",
    background: "rgba(25,118,210,0.43)",
  },
};
const Visibility = () => {
  const [visibility, setVisibility] = useState(false);
  return (
    <Box mb={2}>
      <Typography variant="h3" gutterBottom>
        Видимость мероприятия
      </Typography>
      <ButtonGroup
        variant="outlined"
        aria-label="outlined primary button group"
      >
        <StyledButton
          onClick={() => setVisibility(true)}
          sx={visibility ? selectedStyle : undefined}
        >
          Видимо
        </StyledButton>
        <StyledButton
          onClick={() => setVisibility(false)}
          sx={!visibility ? selectedStyle : undefined}
        >
          Скрыто
        </StyledButton>
      </ButtonGroup>
    </Box>
  );
};

export default Visibility;
