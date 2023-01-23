import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";

import SmallTitle from "../templates/SmallTitle";
import { eventsAPI } from "../../../api/Api";
import { CommentType } from "../../../types";

import CommentBranch from "./CommentBranch";

const { postComment, getComments } = eventsAPI;
interface IProps {
  eventId: number;
}
const Comments: FC<IProps> = ({ eventId }) => {
  const [data, setData] = useState<CommentType[] | null>(null);

  useEffect(() => {
    getSetComments();
  }, []);

  const [text, setText] = useState("");

  async function getSetComments() {
    const data: CommentType[] = await getComments(eventId);
    data.reverse();
    const array = data.filter((element) => !element.parent_id);
    data.forEach((element) => {
      if (!element.parent_id) {
        return;
      }

      const index = array.findIndex(
        (parent) => parent.comment_id === element.parent_id
      );
      const parentElem = array[index];

      if (parentElem.nestedComments) {
        parentElem.nestedComments.push(element);
      } else {
        parentElem.nestedComments = [element];
      }
    });

    setData(array);
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  async function onClick() {
    if (text.length === 0) {
      return;
    }
    setText("");
    await postComment(eventId, text);
    getSetComments();
  }

  return (
    <>
      <SmallTitle fontWeight={500} mb={5} color={"black"}>
        Комментарии:
      </SmallTitle>
      <Stack spacing={1.5} mb={5}>
        {data?.map((value) => (
          <CommentBranch
            reload={getSetComments}
            key={value.comment_id}
            mainComment={value}
            eventId={eventId}
          />
        ))}
      </Stack>
      <Box mb={5}>
        <TextField
          sx={{ borderColor: "transparent" }}
          fullWidth
          label="Введите комментарий"
          variant="filled"
          value={text}
          onChange={onChange}
        />
        <Button onClick={onClick}>Отправить</Button>
      </Box>
    </>
  );
};

export default Comments;
