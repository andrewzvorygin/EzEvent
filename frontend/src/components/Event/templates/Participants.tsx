import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { ProfileNameType } from "../../../types";

import SmallTitle from "./SmallTitle";

interface DescriptionPropsType {
  participants: ProfileNameType[];
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

const Participants: React.FC<DescriptionPropsType> = ({ participants }) => {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded((e) => !e);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), {
    defaultMatches: true,
  });
  return (
    <>
      <Button
        onClick={handleExpandClick}
        variant={"contained"}
        sx={!isMobile ? { alignSelf: "flex-start" } : undefined}
      >
        Участники
      </Button>
      <Modal open={expanded} onClose={handleExpandClick}>
        <Box
          sx={{
            ...style,
            [theme.breakpoints.down("md")]: { width: 400 },
            [theme.breakpoints.down("sm")]: { width: 300 },
          }}
        >
          <Typography variant={"h2"} gutterBottom={true}>
            Участники
          </Typography>
          <Stack spacing={1}>
            {participants.map(({ name, surname }, i) => (
              <Typography key={name}>{`${
                i + 1
              }. ${surname} ${name}`}</Typography>
            ))}
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default Participants;
