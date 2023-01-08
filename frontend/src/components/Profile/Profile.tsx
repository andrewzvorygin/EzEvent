import React, { ChangeEvent, FC, useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../App";

import SwitchInput from "./SwitchInput";

interface ProfilePropsType {
  auth: boolean;
  initialized: boolean;
}

const Profile: FC<ProfilePropsType> = (props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), {
    defaultMatches: true,
  });
  const [phone, setPhone] = useState("8800 555 3535");
  const [email, setEmail] = useState("мерси.захил-ваших@жоп");
  function onChangePhone(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setPhone(e.target.value);
  }

  function onChangeEmail(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setEmail(e.target.value);
  }

  useEffect(() => {
    if (props.initialized && !props.auth) {
      navigate("/events", { replace: true });
    }
  }, [props.auth, props.initialized]);

  return (
    <Stack
      justifyContent={isMobile ? "flex-start" : "center"}
      direction={isMobile ? "column" : "row"}
      alignItems={"center"}
      spacing={isMobile ? 2 : 5}
      marginLeft={isMobile ? 2 : 0}
      marginRight={isMobile ? 2 : 0}
      sx={{ flexWrap: "wrap" }}
    >
      <Stack spacing={3} mb={isMobile ? 2 : 0}>
        <Avatar
          sx={{
            width: 250,
            height: 250,
            [theme.breakpoints.down("sm")]: { width: 200, height: 200 },
          }}
          src={
            "https://sun9-9.userapi.com/impg/TG2QZczG3Q4O8wZSCsOlJ9E9lzthQvwkohLQ6w/Be84mY8Wk-A.jpg?size=1044x1138&quality=96&sign=d1b687acd59d8cfe2cfd60506fb809bd&type=album"
          }
        />
        <Button variant="contained">Изменить фото</Button>
      </Stack>
      <Stack spacing={isMobile ? 2 : 4}>
        <Typography
          variant={"h2"}
          sx={{
            typography: {
              [theme.breakpoints.down("md")]: { fontSize: "1.5rem" },
            },
          }}
        >
          Валинурка ХагиВаги ДымТатар
        </Typography>
        <SwitchInput label={"Почта:"} value={email} onChange={onChangeEmail} />
        <SwitchInput
          label={"Телефон:"}
          value={phone}
          onChange={onChangePhone}
        />
        <Button
          sx={{
            alignSelf: "flex-start",
            marginTop: "auto !important",
          }}
        >
          сменить пароль
        </Button>
      </Stack>
    </Stack>
  );
};

const ProfilePage = () => {
  return (
    <AuthContext.Consumer>
      {({ auth, initialized }) => (
        <Profile auth={auth} initialized={initialized} />
      )}
    </AuthContext.Consumer>
  );
};

export default ProfilePage;
