import React from "react";
import { Box, Stack, TextField } from "@mui/material";

import SmallTitle from "../templates/SmallTitle";

import CommentBranch from "./CommentBranch";

const Comments = () => {
  return (
    <>
      <SmallTitle fontWeight={500} mb={5} color={"black"}>
        Комментарии:
      </SmallTitle>
      <Stack spacing={1.5} mb={5}>
        <CommentBranch />
        <CommentBranch />
        <CommentBranch />
        <CommentBranch />
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
