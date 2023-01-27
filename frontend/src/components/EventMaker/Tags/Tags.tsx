import React, { FC, useEffect, useState } from "react";
import { MenuItem, Select, Typography } from "@mui/material";

import { TagsDictionaryType } from "../../../types";

interface IProps {
  tags: TagsDictionaryType;
  ws: WebSocket;
  tagsId: number[];
}

const Tags: FC<IProps> = ({ tags, ws, tagsId }) => {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    const convertedTagsId = tagsId.map((tag) => String(tag));
    if (
      !(
        convertedTagsId.every((tag) => value.includes(tag)) &&
        value.every((tag) => convertedTagsId.includes(tag))
      )
    ) {
      setValue(convertedTagsId);
    }
  }, [tagsId]);

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Теги
      </Typography>
      <Select
        sx={{
          minWidth: "250px",
          maxWidth: "100%",
        }}
        multiple={true}
        value={value}
        onChange={(e) => {
          setValue(e.target.value as string[]);
          ws.send(
            JSON.stringify({
              tags_id: (e.target.value as string[]).map((tag) => Number(tag)),
            }),
          );
        }}
      >
        {Object.entries(tags).map(([key, value]) => (
          <MenuItem value={key} key={key}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default Tags;
