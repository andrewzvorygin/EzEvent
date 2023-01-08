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
const Comments = () => {
  const [visibility, setVisibility] = useState(false);
  return (
    <Box mb={2}>
      <Typography variant="h3" gutterBottom>
        Добавить комментарии к мероприятию?
      </Typography>
      <ButtonGroup
        variant="outlined"
        aria-label="outlined primary button group"
      >
        <StyledButton
          onClick={() => setVisibility(true)}
          sx={visibility ? selectedStyle : undefined}
        >
          Да
        </StyledButton>
        <StyledButton
          onClick={() => setVisibility(false)}
          sx={!visibility ? selectedStyle : undefined}
        >
          Нет
        </StyledButton>
      </ButtonGroup>
    </Box>
  );
};

export default Comments;
