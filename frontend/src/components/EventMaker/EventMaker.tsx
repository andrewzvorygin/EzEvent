import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { DeviceType, EventType } from "../../types";
import { AuthContext, DeviceContext } from "../../App";
import { eventsAPI } from "../../api/Api";

import MainForm from "./MainForm";
import Organizers from "./Organizers";
import Visibility from "./Visibility/Visibility";

interface EventMakerPropsType {
  auth: boolean;
  device: DeviceType;
  initialized: boolean;
}

const EventMaker: React.FC<EventMakerPropsType> = (props) => {
  const navigate = useNavigate();
  const [wsChannel, setWsChannel] = useState<WebSocket | null>(null);
  const [connectOpen, setConnectOpen] = useState<boolean>(false);
  const eventId = useParams().eventId;
  const [eventData, setEventData] = useState<EventType>({
    can_edit: null,
    can_reg: null,
    title: null,
    date_end: null,
    date_start: null,
    description: undefined,
    photo_cover: null,
    visibility: null,
    latitude: null,
    longitude: null,
    editors: []
  });

  useEffect(() => {
    function createChannel() {
      const accessToken = window.localStorage.getItem("access_token");
      const accessTokenQuery = accessToken
        ? `?access_token=${accessToken}`
        : "";
      setWsChannel(
        new WebSocket(
          `ws://127.0.0.1:8000/event/ws/${eventId}${accessTokenQuery}`,
        )
      );
    }
    createChannel();
  }, []);

  useEffect(() => {
    if (props.initialized && !props.auth) {
      navigate("/events", { replace: true });
    }
  }, [props.auth, props.initialized]);

  useEffect(() => {
    if (props.device === DeviceType.mobile) {
      navigate("/events", { replace: true });
    }
  }, [props.device]);

  useEffect(() => {
    wsChannel?.addEventListener("message", (e) => {
      console.log(JSON.parse(e.data));
      setEventData((prevState) => ({ ...prevState, ...JSON.parse(e.data) }));
    });
    wsChannel?.addEventListener("open", () => {
      setConnectOpen(true);
      console.log("OPEN");
    });
    wsChannel?.addEventListener("close", () => {
      setConnectOpen(false);
      navigate("/events", { replace: true });
      console.log("CLOSE");
    });
  }, [wsChannel]);

  if (!connectOpen) {
    return null;
  }

  return (
    <>
      <Typography variant="h1" component="h1" mb={5}>
        Создание мероприятия
      </Typography>
      {wsChannel !== null && (
        <Grid container spacing={2.5}>
          <Grid item xs={7}>
            <MainForm ws={wsChannel} eventData={eventData} />
          </Grid>
          <Grid item xs={5}>
            <Visibility eventData={eventData} ws={wsChannel} />
            <Organizers
              editors={eventData.editors}
              eventId={eventId as string}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

const EventMakerPage = () => {
  return (
    <AuthContext.Consumer>
      {({ auth, initialized }) => (
        <DeviceContext.Consumer>
          {({ device }) => (
            <EventMaker initialized={initialized} auth={auth} device={device} />
          )}
        </DeviceContext.Consumer>
      )}
    </AuthContext.Consumer>
  );
};

export default EventMakerPage;
