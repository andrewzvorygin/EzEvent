import React, { FC } from "react";
import { Box } from "@mui/material";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";

interface IProps {
  marker: [number, number];
}

const MapWithMarker: FC<IProps> = ({ marker }) => {
  return (
    <Box>
      <YMaps>
        <Map
          width="100%"
          height={435}
          defaultState={{
            center: [56.85, 60.6122],
            zoom: 12,
          }}
        >
          <Placemark geometry={marker} />
        </Map>
      </YMaps>
    </Box>
  );
};

export default MapWithMarker;
