import React, { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";

import { eventsAPI } from "../../api/Api";
import { UserType } from "../../types";

const EventMap: FC = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.onClickBalloonBtn = function (indexPoint: number) {
    console.log(indexPoint);
  };

  const [events, setEvents] = useState<any[]>([]);

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
          return { coords: [e.latitude, e.longitude], title: e.title };
        });
        setEvents(res);
      });
  }, []);

  return (
    <Box>
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
