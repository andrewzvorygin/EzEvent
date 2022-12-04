import React, { FC } from "react";
import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SwitchInput from "./SwitchInput";

const Profile: FC = () => {
  return (
    <Stack justifyContent={"center"} direction={"row"} spacing={5}>
      <Stack spacing={3}>
        <Avatar
          sx={{
            width: 250,
            height: 250,
          }}
          src={
            "https://sun9-9.userapi.com/impg/TG2QZczG3Q4O8wZSCsOlJ9E9lzthQvwkohLQ6w/Be84mY8Wk-A.jpg?size=1044x1138&quality=96&sign=d1b687acd59d8cfe2cfd60506fb809bd&type=album"
          }
        />
        <Button variant="contained">Изменить фото</Button>
      </Stack>
      <Stack spacing={4}>
        <Typography variant={"h2"}>Валинурка ХагиВаги ДымТатар</Typography>
        <SwitchInput label={"Почта:"} value={"мерси.захил-ваших@жоп"} />
        <SwitchInput label={"Телефон:"} value={"8800 555 3535"} />
        <Button sx={{ alignSelf: "flex-start", marginTop: "auto !important" }}>
          сменить пароль
        </Button>
      </Stack>
    </Stack>
  );
};

export default Profile;
