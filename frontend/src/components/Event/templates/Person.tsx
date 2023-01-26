import React, { FC } from "react";
import { Avatar, Stack, Typography } from "@mui/material";

import { ProfileNameType } from "../../../types";

interface IProps {
  item: ProfileNameType;
}

const Person: FC<IProps> = ({ item }) => {
  const { surname, name } = item;
  return (
    <Stack direction="row" spacing={1} alignItems={"center"}>
      <Avatar alt={`${surname} ${name}`} src={"photo"} />
      <Typography fontSize={18}>{`${surname} ${name}`}</Typography>
    </Stack>
  );
};

export default Person;
