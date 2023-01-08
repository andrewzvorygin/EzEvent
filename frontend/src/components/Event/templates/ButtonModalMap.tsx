import * as React from "react";
import { FC, useState } from "react";
import Box from "@mui/material/Box";
import { IconButton, Modal, useTheme } from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";

import MapWithMarker from "../../Map/MapWithMarker";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const marker: [number, number] = [56.85, 60.6122];

const ButtonModalMap: FC = () => {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded((e) => !e);
  const theme = useTheme();
  return (
    <>
      <IconButton color={"primary"} onClick={handleExpandClick}>
        <RoomIcon />
      </IconButton>
      <Modal open={expanded} onClose={handleExpandClick}>
        <Box
          sx={{
            ...style,
            [theme.breakpoints.down("md")]: { width: 500 },
            [theme.breakpoints.down("sm")]: { width: 400 },
          }}
        >
          <MapWithMarker marker={marker} />
        </Box>
      </Modal>
    </>
  );
};

export default ButtonModalMap;
