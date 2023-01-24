import React, { ChangeEvent, FC, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { eventsAPI } from "../../../api/Api";
import { CommentType } from "../../../types";

interface IProps {
  expandComments?: () => void;
  comment: CommentType;
  eventId: number;
  parentId?: number | null;
  reload: () => void;
}

const { postComment } = eventsAPI;

const Comment: FC<IProps> = ({
  expandComments,
  comment,
  eventId,
  parentId,
  reload,
}) => {
  const {
    date_comment,
    name,
    text: value,
    surname,
    photo,
    comment_id,
  } = comment;
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded((e) => !e);
  const [text, setText] = useState("");

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  async function onClick() {
    if (text.length === 0) {
      return;
    }
    setText("");
    await postComment(eventId, text, parentId ?? comment_id);
    reload();
  }

  return (
    <Stack direction="row" spacing={2}>
      <Box paddingTop={0.5}>
        <Avatar alt={`${surname} ${name}`} src={photo} />
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
          <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
            <Typography variant={"h4"} fontSize={14}>
              {`${surname} ${name}`}
            </Typography>
            <Typography variant={"body2"}>{date_comment}</Typography>
          </Stack>
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
                ":focus": {
                  outline: "none",
                  textDecoration: "underline",
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
            value={text}
            onChange={onChange}
          />
          <Button onClick={onClick}>Отправить</Button>
        </Collapse>
      </Stack>
    </Stack>
  );
};

export default Comment;
