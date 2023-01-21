import React, { FC, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface IProps {
  expandComments?: () => void;
  value: string;
  author: string;
  avatar?: string;
}

const Comment: FC<IProps> = ({ expandComments, value, author, avatar }) => {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded((e) => !e);

  return (
    <Stack direction="row" spacing={2}>
      <Box paddingTop={0.5}>
        <Avatar alt="Remy Sharp" src={avatar} />
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
            {author}
          </Typography>
          <Typography variant={"body1"} fontSize={16}>
            {value}
          </Typography>
          <Button onClick={handleExpandClick}>Ответить</Button>
          {expandComments && (
            <Box
              onClick={() => {
                expandComments();
              }}
              component={"button"}
              sx={{
                display: "block",
                background: "none",
                fontSize: 14,
                color: "black",
                ":hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
                margin: 0,
                padding: 0,
                pt: 1,
                border: "none",
              }}
            >
              Посмотреть ответы
            </Box>
          )}
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
