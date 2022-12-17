import { Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { useFormik } from "formik";

import { authAPI } from "../../api/Api";

interface LoginPropsType {
  setLoginForm: () => void;
  setAuth: () => void;
}

const Login: React.FC<LoginPropsType> = (props) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      authAPI.postAuthLogin(values, (response: Response) => {
        if (response.status === 200) {
          props.setAuth();
        }
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid direction="column" container spacing={2}>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Вход
          </Typography>
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
            Войти
          </Button>
        </Grid>
        <Grid item alignSelf="center">
          <Button
            size="large"
            variant="text"
            sx={{ textTransform: "none" }}
            onClick={props.setLoginForm}
          >
            Зарегистрироваться
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Login;
