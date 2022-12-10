import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const Comment = () => {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded((e) => !e);

  return (
    <Stack direction="row" spacing={2}>
      <Box paddingTop={0.5}>
        <Avatar
          alt="Remy Sharp"
          src={
            "https://sun9-66.userapi.com/impg/gpPdVT_I38wgnrXkvZXoaZRvnAShF_W7ZN2wOA/O7zIGq8XOdM.jpg?size=1620x2160&quality=96&sign=a4ff920a97a4bcd4ee513e3bc7c1a592&type=album"
          }
        />
      </Box>
      <Stack spacing={0} width={"100%"}>
        <Box
          sx={{
            background: "#F5F6F8",
            borderRadius: "3px",
            width: "100%",
          }}
          paddingLeft={2}
          paddingRight={2}
          paddingTop={1}
          paddingBottom={1}
        >
          <Typography variant={"h4"} fontSize={14}>
            Пользователь 1
          </Typography>
          <Typography variant={"body1"} fontSize={16}>
            Какое классное мероприятие!
          </Typography>
          <Button onClick={handleExpandClick}>Ответить</Button>
        </Box>
        <Collapse sx={{ mt: 1.5 }} in={expanded} timeout="auto" unmountOnExit>
          <TextField
            sx={{ borderColor: "transparent" }}
            fullWidth
            label="Введите комментарий"
            variant="filled"
          />
        </Collapse>
      </Stack>
    </Stack>
  );
};

export default Comment;
