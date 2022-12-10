import React, { useState } from "react";
import { Button, Stack, Collapse, Box } from "@mui/material";

import Comment from "./Comment";

const CommentBranch = () => {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded((e) => !e);

  return (
    <Box>
      <Comment />
      <Box mt={1.5}>
        <Button onClick={handleExpandClick}>toggle</Button>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Stack pl={5} mt={1} spacing={2}>
          <Comment />
          <Comment />
        </Stack>
      </Collapse>
    </Box>
  );
};

export default CommentBranch;
