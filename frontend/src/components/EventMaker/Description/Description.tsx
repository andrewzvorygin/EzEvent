import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MuiMarkdown from "mui-markdown";
import JoditEditor from "jodit-react";

import styles from "./Description.module.scss";

interface DescriptionPropsType {
  ws: WebSocket;
  description: string | undefined;
}

const Description: React.FC<DescriptionPropsType> = ({ ws, description }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("Начните писать");
  const config = {
    readonly: false,
    height: 400,
  };
  useEffect(() => {
    if (description) {
      setContent(description);
    }
  }, [description]);

  const handleUpdate = (content: string) => {
    setContent(content);
  };

  function onChange(value: string) {
    ws.send(JSON.stringify({ description: value }));
  }

  return (
    <>
      <JoditEditor
        className={styles.editor}
        ref={editor}
        value={content}
        config={config}
        onBlur={handleUpdate}
        onChange={onChange}
      />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
};

export default Description;
