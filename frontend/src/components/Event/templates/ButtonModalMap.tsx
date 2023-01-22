import * as React from "react";
import { FC, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { IconButton, Modal, Stack, Typography, useTheme } from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";

import MapWithMarker from "../../Map/MapWithMarker";

interface ButtonModalMapPropsType {
  marker: [number, number];
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ButtonModalMap: FC<ButtonModalMapPropsType> = ({ marker }) => {
  const mapRef = useRef<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [address, setAddress] = useState("");
  const handleExpandClick = () => setExpanded((e) => !e);
  const theme = useTheme();

  useEffect(() => {
    if (mapRef.current) {
      getSetAddress(marker);
    }
  }, [marker]);

  // Определяем адрес по координатам (обратное геокодирование).
  function getSetAddress(coords: [number, number]) {
    // eslint-disable-next-line promise/catch-or-return
    mapRef?.current?.geocode(coords)?.then(function (res: any) {
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
    <>
      <Stack direction={"column"} spacing={1} alignItems={"center"}>
        <Typography>Посмотреть на карте</Typography>
        <Typography
          gutterBottom
          maxWidth={"400px"}
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {address}
        </Typography>
      </Stack>
      <IconButton color={"primary"} onClick={handleExpandClick}>
        <RoomIcon />
      </IconButton>
      <Modal open={expanded} onClose={handleExpandClick}>
        <Box
          sx={{
            ...style,
            [theme.breakpoints.down("md")]: { width: 500 },
            [theme.breakpoints.down("sm")]: { width: 400 },
          }}
        >
          <MapWithMarker marker={marker} />
        </Box>
      </Modal>
      <YMaps
        query={{
          apikey: "4717d1ce-6249-47b3-8381-461cc257f802",
          lang: "ru_RU",
          load: "package.full",
        }}
      >
        <Map
          width="0%"
          height={0}
          onLoad={(ymapsInstance: any) => {
            mapRef.current = ymapsInstance;
            getSetAddress(marker);
          }}
        />
      </YMaps>
    </>
  );
};

export default ButtonModalMap;
