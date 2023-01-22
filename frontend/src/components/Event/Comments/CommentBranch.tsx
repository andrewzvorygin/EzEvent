import React, { FC, useState } from "react";
import { Box, Collapse, Stack } from "@mui/material";

import { CommentType } from "../../../types";

import Comment from "./Comment";

interface IProps {
  mainComment: CommentType;
  eventId: number;
  reload: () => void;
}

const CommentBranch: FC<IProps> = ({ mainComment, eventId, reload }) => {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded((e) => !e);
  const { nestedComments } = mainComment;
  return (
    <Box>
      <Comment
        reload={reload}
        expandComments={nestedComments && handleExpandClick}
        comment={mainComment}
        eventId={eventId}
      />
      {nestedComments && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Stack pl={5} mt={1} spacing={2}>
            {nestedComments.map((value) => (
              <Comment
                reload={reload}
                parentId={mainComment.comment_id}
                comment={value}
                eventId={eventId}
                key={value.comment_id}
              />
            ))}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
};

export default CommentBranch;
