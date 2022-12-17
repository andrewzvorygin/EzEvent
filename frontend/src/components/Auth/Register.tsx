import { Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { useFormik } from "formik";

import { authAPI } from "../../api/Api";

interface RegisterPropsType {
  setLoginForm: () => void;
  setAuth: () => void;
  back: () => void;
}

const Register: React.FC<RegisterPropsType> = (props) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      surname: "",
      patronymic: "",
      password: "",
    },
    onSubmit: (values) => {
      authAPI.postAuthRegister(values).then(() => {
        authAPI.postAuthLogin(
          {
            email: values.email,
            password: values.password,
          },
          (response: Response) => {
            if (response.status === 200) {
              props.setAuth();
            }
          },
        );
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid direction="column" container spacing={2}>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Регистрация
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Имя"
            id="name"
            name="name"
            variant="standard"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Фамилия"
            variant="standard"
            id="surname"
            name="surname"
            value={formik.values.surname}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Отчество"
            variant="standard"
            id="patronymic"
            name="patronymic"
            value={formik.values.patronymic}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Электронная почта"
            variant="standard"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Пароль"
            variant="standard"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item mt={5} alignSelf="center">
          <Button
            type="submit"
            size="large"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Зарегистрироваться
          </Button>
        </Grid>
        <Grid item alignSelf="center">
          <Button
            size="large"
            variant="text"
            sx={{ textTransform: "none" }}
            onClick={props.setLoginForm}
          >
            У меня уже есть аккаунт
          </Button>
        </Grid>
        <Grid item alignSelf="center">
          <Button
            size="large"
            variant="text"
            sx={{ textTransform: "none" }}
            onClick={props.back}
          >
            Войти без регистрации
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Register;
