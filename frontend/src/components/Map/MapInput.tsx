import React, { FC } from 'react';
import { Box } from '@mui/material';
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

interface IProps {
  onChange: (coords:[number, number]) => void;
  value: [number, number] | null
}

const MapInput: FC<IProps> = ({ onChange, value }) => {
  function onClick(e: { get: (value: string) => [number, number] }) {
    onChange(e.get('coords'));
  }

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
          onClick={onClick}
          defaultState={{
            center: [56.85, 60.6122],
            zoom: 12,
          }}
        >
          {value && <Placemark geometry={value} />}
        </Map>
      </YMaps>
    </Box>
  );
};

export default MapInput;
