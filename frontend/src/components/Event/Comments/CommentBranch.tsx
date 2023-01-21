import React, { FC, useState } from "react";
import { Box, Collapse, Stack } from "@mui/material";

import Comment from "./Comment";

interface IProps {
  mainComment: {
    value: string;
    author: string;
    avatar?: string;
  };
}

const CommentBranch: FC<IProps> = ({ mainComment }) => {
  const { value, author, avatar } = mainComment;
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded((e) => !e);

  return (
    <Box>
      <Comment
        expandComments={handleExpandClick}
        value={value}
        author={author}
        avatar={avatar}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Stack pl={5} mt={1} spacing={2}>
          <Comment value={"1"} author={"Пользователь"} />
          <Comment value={"1"} author={"Пользователь"} />
        </Stack>
      </Collapse>
    </Box>
  );
};

export default CommentBranch;
