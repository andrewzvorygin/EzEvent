import React from 'react';
import {
  Button, Card, CardContent, Container, Grid, TextField, Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import styles from './Auth.module.scss';

const Auth = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      surname: '',
      patronymic: '',
      password: '',
    },
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div className={styles.container}>
      <Container maxWidth="sm">
        <Card sx={{ p: 10, paddingBottom: 6, paddingTop: 5 }}>
          <CardContent>
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
                  <Button type="submit" size="large" variant="contained" sx={{ textTransform: 'none' }}>Зарегистрироваться</Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Auth;
