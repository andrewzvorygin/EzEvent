import React, { FC, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Input,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import placeholder from "../../assets/placeholder.jpg";
import { AuthContext } from "../../App";
import { profileAPI } from "../../api/Api";
import { ProfileType } from "../../types";

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
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [photo, setPhoto] = useState<any>(null);
  const [name, setName] = useState<string>();
  const [surname, setSurname] = useState<string>();
  const [patronymic, setPatronymic] = useState<string>();
  const [phone, setPhone] = useState<string>();

  const loadPhoto = async (path: string) => {
    await profileAPI.getProfilePhoto(path).then(async (response) => {
      if (response.status === 404) {
        setPhoto(null);
      } else {
        const data = await response.blob();
        setPhoto(data);
      }
    });
  };

  useEffect(() => {
    if (props.initialized && !props.auth) {
      navigate("/events", { replace: true });
    }
  }, [props.auth, props.initialized]);

  useEffect(() => {
    profileAPI.getProfile().then(async (data) => {
      await loadPhoto(data.photo);
      setProfile(data);
      setName(data.name);
      setSurname(data.surname);
      setPatronymic(data.patronymic);
      setPhone(data.phone);
    });
  }, []);

  if (profile === null) {
    return null;
  }

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
          src={photo === null ? placeholder : window.URL.createObjectURL(photo)}
        />
        <Button component="label">
          Изменить фото
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                profileAPI
                  .putProfilePhoto(file)
                  .then(() => loadPhoto(profile.photo));
              }
            }}
          />
        </Button>
      </Stack>
      <Stack spacing={isMobile ? 2 : 4}>
        {editMode ? (
          <>
            <Typography
              variant={"h2"}
              sx={{
                typography: {
                  [theme.breakpoints.down("md")]: { fontSize: "1.5rem" },
                },
              }}
            >
              Редактирование профиля
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography>Фамилия:</Typography>
              <Input
                sx={{ flexGrow: 1, ml: 1 }}
                onChange={(e) => setSurname(e.target.value)}
                value={surname}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography>Имя:</Typography>
              <Input
                sx={{ flexGrow: 1, ml: 1 }}
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography>Отчество:</Typography>
              <Input
                sx={{ flexGrow: 1, ml: 1 }}
                onChange={(e) => setPatronymic(e.target.value)}
                value={patronymic}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography>Номер:</Typography>
              <Input
                sx={{ flexGrow: 1, ml: 1 }}
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </Box>
          </>
        ) : (
          <>
            <Typography
              variant={"h2"}
              sx={{
                typography: {
                  [theme.breakpoints.down("md")]: { fontSize: "1.5rem" },
                },
              }}
            >
              {profile.surname} {profile.name} {profile.patronymic}
            </Typography>
            <Typography>Почта: {profile.email}</Typography>
            <Typography>Телефон: {profile.phone || "Не указан"}</Typography>
          </>
        )}
        <Button
          variant="contained"
          sx={{
            alignSelf: "flex-start",
          }}
          onClick={async () => {
            editMode &&
              (await profileAPI
                .putProfile({
                  name,
                  surname,
                  patronymic,
                  phone,
                })
                .then(() => {
                  profileAPI.getProfile().then(async (data) => {
                    setProfile(data);
                    setName(data.name);
                    setSurname(data.surname);
                    setPatronymic(data.patronymic);
                    setPhone(data.phone);
                  });
                }));
            setEditMode(!editMode);
          }}
        >
          {editMode ? "Сохранить" : "Редактировать профиль"}
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
