import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MuiMarkdown from "mui-markdown";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JoditEditor from "jodit-react";
import { Typography } from "@mui/material";

import styles from "./Description.module.scss";
import "./Descriptions.css";

interface DescriptionPropsType {
  ws: WebSocket;
  description: string | undefined;
}

const Description: React.FC<DescriptionPropsType> = ({
  ws,
  description = "",
}) => {
  const editor = useRef(null);
  const [content, setContent] = useState(description || "");
  const [config] = useState({
    readonly: false,
    height: 400,
  });

  useEffect(() => {
    if (description !== content) {
      setContent(description);
    }
  }, [description]);

  function onChange(value: string) {
    if (value !== description) {
      setContent(value);
      ws.send(JSON.stringify({ description: value }));
    }
  }

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Описание мероприятия
      </Typography>
      <JoditEditor
        className={styles.editor}
        ref={editor}
        value={content}
        config={config}
        onBlur={onChange}
      />
    </>
  );
};

export default Description;
