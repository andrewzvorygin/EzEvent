import React, { FC, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { useNavigate } from "react-router-dom";

import { eventsAPI } from "../../api/Api";

const EventMap: FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.onClickBalloonBtn = function (indexPoint: number) {
    const event = events[indexPoint];
    if (!event) {
      return;
    }
    navigate(`/event/${event.uuid}`);
  };

  useEffect(() => {
    eventsAPI
      .getMyEvents({
        typeUser: 2,
        limit: 30,
        offset: 0,
        search: "",
      })
      .then((data) => {
        const res = data.Events.map((e: any) => {
          return { ...e, coords: [e.latitude, e.longitude], title: e.title };
        });
        setEvents(res);
      });
  }, []);

  return (
    <Box>
      <Typography variant={"h1"} gutterBottom>
        Ваши мероприятия на карте
      </Typography>
      <YMaps
        query={{
          lang: "ru_RU",
          load: "package.full",
          apikey: "4717d1ce-6249-47b3-8381-461cc257f802",
          csp: true,
        }}
      >
        <Map
          width="100%"
          height={"70vh"}
          defaultState={{
            center: [56.85, 60.6122],
            zoom: 12,
          }}
        >
          {events &&
            events.map((e, i) => (
              <Placemark
                properties={{
                  item: i,
                  balloonContentHeader: e.title,
                  iconCaption: e.title,
                  balloonContentFooter: `<input type="button" onclick="window.onClickBalloonBtn(${i});"value="Подробнее"/>`,
                }}
                key={i}
                geometry={e.coords}
              />
            ))}
        </Map>
      </YMaps>
    </Box>
  );
};
export default EventMap;
