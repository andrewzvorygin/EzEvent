import React, { FC } from "react";
import { Box } from "@mui/material";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";

interface IProps {
  marker: [number, number];
}

const MapWithMarker: FC<IProps> = ({ marker }) => {
  return (
    <Box>
      <YMaps
        query={{
          apikey: "4717d1ce-6249-47b3-8381-461cc257f802",
          lang: "ru_RU",
          load: "package.full",
        }}
      >
        <Map
          width="100%"
          height={435}
          defaultState={{
            center: marker,
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
