import * as React from "react";
import { FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";

import { EventType } from "../../types";

import MapInput from "./MapInput";

interface ButtonMapPropsType {
  eventData: EventType;
  ws: WebSocket;
}

const ButtonMap: FC<ButtonMapPropsType> = ({ ws, eventData }) => {
  const [coordsMarker, setCoordsMarker] = useState<
    [number | null, number | null]
  >([eventData.latitude, eventData.longitude]);

  useEffect(() => {
    if (
      eventData.latitude !== coordsMarker[0] ||
      eventData.longitude !== coordsMarker[1]
    ) {
      setCoordsMarker([eventData.latitude, eventData.longitude]);
    }
  }, [eventData]);

  function onChange(coords: [number, number]) {
    setCoordsMarker(coords);
    ws.send(
      JSON.stringify({ latitude: coords[0], longitude: coords[1] }),
    );
  }

  return (
    <Box>
      <MapInput onChange={onChange} value={coordsMarker} />
    </Box>
  );
};

export default ButtonMap;
