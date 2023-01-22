import React, { useEffect, useState } from "react";
import { Card, CardContent, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../../App";
import { AuthType } from "../../types";

import Register from "./Register";
import Login from "./Login";
import styles from "./Auth.module.scss";

const Auth: React.FC<AuthType> = (props) => {
  const navigate = useNavigate();
  const location = useLocation().state as string;
  const prevLocation =
    location === "/" || location === null ? "/events" : location;
  const [loginForm, setLoginForm] = useState(true);

  useEffect(() => {
    if (props.auth) {
      navigate(prevLocation, { replace: true });
    }
  }, [props.auth]);

  return (
    <div className={styles.container}>
      <Container maxWidth="sm">
        <Card sx={{ p: 10, paddingBottom: 6, paddingTop: 5 }}>
          <CardContent>
            {loginForm ? (
              <Login
                setLoginForm={() => setLoginForm(false)}
                setAuth={() => props.setAuth(true)}
              />
            ) : (
              <Register
                setLoginForm={() => setLoginForm(true)}
                setAuth={() => props.setAuth(true)}
                back={() => navigate("/events")}
              />
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

const AuthPage = () => {
  return (
    <AuthContext.Consumer>
      {({ auth, setAuth }) => <Auth auth={auth} setAuth={setAuth} />}
    </AuthContext.Consumer>
  );
};

export default AuthPage;
