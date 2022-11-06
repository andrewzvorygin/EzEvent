import React from 'react';
import {
  Grid, Button, TextField, Typography, FormControl, Container, Card, CardContent,
} from '@mui/material';
import styles from './Auth.module.scss';

const Auth = () => (
  <div className={styles.container}>
    <Container maxWidth="sm">
      <Card sx={{ p: 10, paddingBottom: 6, paddingTop: 5 }}>
        <CardContent>
          <FormControl fullWidth>
            <Grid direction="column" container spacing={2}>
              <Grid item>
                <Typography variant="h3" gutterBottom>
                  Регистрация
                </Typography>
              </Grid>
              <Grid item>
                <TextField fullWidth label="Имя" variant="standard" />
              </Grid>
              <Grid item>
                <TextField fullWidth label="Фамилия" variant="standard" />
              </Grid>
              <Grid item>
                <TextField fullWidth label="Отчество" variant="standard" />
              </Grid>
              <Grid item>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Электронная почта"
                  variant="standard"
                />
              </Grid>
              <Grid item><TextField fullWidth label="Пароль" variant="standard" /></Grid>
              <Grid item mt={5} alignSelf="center">
                <Button size="large" variant="contained" sx={{ textTransform: 'none' }}>Зарегистрироваться</Button>
              </Grid>
            </Grid>
          </FormControl>
        </CardContent>
      </Card>
    </Container>
  </div>
);

export default Auth;
