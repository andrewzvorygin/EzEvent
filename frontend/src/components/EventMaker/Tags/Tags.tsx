import React, { FC, useState } from "react";
import { MenuItem, Select, Typography } from "@mui/material";

import { TagsDictionaryType } from "../../../types";

interface IProps {
  tags: TagsDictionaryType;
  ws: WebSocket;
}

const Tags: FC<IProps> = ({ tags }) => {
  const [value, setValue] = useState<number[] | null>([]);
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
          setValue(e.target.value as number[]);
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
