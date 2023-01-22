import React from "react";
import { Box, Stack, TextField } from "@mui/material";

import SmallTitle from "../templates/SmallTitle";

import CommentBranch from "./CommentBranch";

const Comments = () => {
  const data = {
    value:
      "Коментарий Коментарий " +
      "\n КоментарийКоментарийКоментарийКоментарийКоментарийКоментарийКоментарийКоментарийКоментарийКоментарий",
    author: "Сергей Бакалейщик Шот Вискович",
    avatar:
      "https://sun9-37.userapi.com/impg/-oPmYabhuLe-TgxYpw-lDp-xfr9jCcKyDHnQjA/ggBHHu4JFjE.jpg?size=810x1080&quality=96&sign=81b998d748ce50119a5ee97ee78b67d3&type=album",
  };
  return (
    <>
      <SmallTitle fontWeight={500} mb={5} color={"black"}>
        Комментарии:
      </SmallTitle>
      <Stack spacing={1.5} mb={5}>
        <CommentBranch mainComment={data} />
        <CommentBranch mainComment={data} />
        <CommentBranch mainComment={data} />
        <CommentBranch mainComment={data} />
      </Stack>
      <Box mb={5}>
        <TextField
          sx={{ borderColor: "transparent" }}
          fullWidth
          label="Введите комментарий"
          variant="filled"
        />
      </Box>
    </>
  );
};

export default Comments;
