import React, { FC, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";

interface IProps {
  onChange: (coords: [number, number]) => void;
  value: [number | null, number | null];
}

const MapInput: FC<IProps> = ({ onChange, value }) => {
  const map = useRef<any>(null);
  const [address, setAddress] = useState("");
  useEffect(() => {
    if (value[0] && value[1] && map.current) {
      getSetAddress(value as [number, number]);
    }
  }, [value]);

  function onClick(e: { get: (value: string) => [number, number] }) {
    onChange(e.get("coords"));
  }

  // Определяем адрес по координатам (обратное геокодирование).
  function getSetAddress(coords: [number, number]) {
    // eslint-disable-next-line promise/catch-or-return
    map?.current?.geocode(coords)?.then(function (res: any) {
      const firstGeoObject = res.geoObjects.get(0);
      setAddress(
        [
          firstGeoObject.getLocalities().length
            ? firstGeoObject.getLocalities()
            : firstGeoObject.getAdministrativeAreas(),
          // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
          firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
          firstGeoObject.getPremiseNumber(),
        ]
          .filter(Boolean)
          .join(", ")
      );
    });
  }

  return (
    <Box>
      <Typography variant={"h5"} gutterBottom>
        {address || "Поставьте маркер, чтобы увидеть адрес"}
      </Typography>
      <YMaps
        query={{
          apikey: "4717d1ce-6249-47b3-8381-461cc257f802",
          lang: "ru_RU",
          load: "package.full",
        }}
      >
        <Map
          onLoad={(ymapsInstance: any) => {
            map.current = ymapsInstance;
            if (!address && value[0] && value[1]) {
              getSetAddress(value as [number, number]);
            }
          }}
          width="100%"
          height={435}
          onClick={onClick}
          defaultState={{
            center:
              value[0] && value[1]
                ? (value as [number, number])
                : [56.85, 60.6122],
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
