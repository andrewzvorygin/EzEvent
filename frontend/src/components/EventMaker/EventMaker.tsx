import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { DeviceType, EventType } from "../../types";
import { DeviceContext } from "../../App";

import MainForm from "./MainForm";
import Organizers from "./Organizers";

interface EventMakerPropsType {
  device: DeviceType;
}

const EventMaker: React.FC<EventMakerPropsType> = (props) => {
  const navigate = useNavigate();
  const [wsChannel, setWsChannel] = useState<WebSocket | null>(null);
  const eventId = useParams().eventId;
  const [eventData, setEventData] = useState<EventType>({
    title: null,
    dateEnd: null,
    dateStart: null,
    description: undefined,
    photoCover: null,
    visibility: null,
  });

  useEffect(() => {
    if (props.device === DeviceType.mobile) {
      navigate("/events", { replace: true });
      return;
    }
    function createChannel() {
      setWsChannel(new WebSocket(`wss://127.0.0.1:8000/event/ws/${eventId}`));
    }
    createChannel();
  }, []);

  useEffect(() => {
    wsChannel?.addEventListener("message", (e) => {
      console.log(JSON.parse(e.data));
      setEventData((prevState) => ({ ...prevState, ...JSON.parse(e.data) }));
    });
    wsChannel?.addEventListener("close", () => {
      console.log("CLOSE");
    });
  }, [wsChannel]);

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
            <Organizers />
          </Grid>
        </Grid>
      )}
    </>
  );
};

const EventMakerPage = () => {
  return (
    <DeviceContext.Consumer>
      {({ device }) => <EventMaker device={device} />}
    </DeviceContext.Consumer>
  );
};

export default EventMakerPage;
