import React, { useEffect, useState } from "react";
import { Card, CardContent, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import Register from "./Register";
import Login from "./Login";
import styles from "./Auth.module.scss";

interface AuthPropsType {
  auth: boolean;
  setAuth: () => void;
}

const Auth: React.FC<AuthPropsType> = (props) => {
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
                setAuth={props.setAuth}
              />
            ) : (
              <Register
                setLoginForm={() => setLoginForm(true)}
                setAuth={props.setAuth}
                back={() => navigate("/events")}
              />
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Auth;
