import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MuiMarkdown from "mui-markdown";

import Editor from "./Editor";

const Description = () => {
  const [text, setText] = useState<string | undefined>("");

  function onChange(value: string) {
    setText(value);
  }

  return (
    <>
      <Box maxHeight={500} overflow={"auto"}>
        <MuiMarkdown
          overrides={{
            img: {
              component: "img",
              props: {
                style: { width: "100%" },
              },
            },
          }}
        >
          {text}
        </MuiMarkdown>
      </Box>
      <Typography variant="h3" gutterBottom>
        Описание мероприятия
      </Typography>
      <Editor value={text} onChange={onChange} />
    </>
  );
};

export default Description;
