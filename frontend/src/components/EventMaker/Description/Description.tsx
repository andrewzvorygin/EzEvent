import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MuiMarkdown from "mui-markdown";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JoditEditor from "jodit-react";
import { Typography } from "@mui/material";

import styles from "./Description.module.scss";

interface DescriptionPropsType {
  ws: WebSocket;
  description: string | undefined;
}

const Description: React.FC<DescriptionPropsType> = ({ ws, description }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("Начните писать");
  const [config] = useState({
    readonly: false,
    height: 400,
  });

  function onChange(value: string) {
    //ws.send(JSON.stringify({ description: value }));
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
        onChange={onChange}
      />
      {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
};

export default Description;
