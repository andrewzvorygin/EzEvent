import React, { FC } from 'react';
import { Box } from '@mui/material';
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

const EventMap: FC = () => {
    window.onClickBalloonBtn = function (indexPoint: number) {
      console.log(indexPoint);
    };

    const events = [
      {
        title: 'Меро1',
        coords: [56.85, 60.6122]
      },
      {
        title: 'Меро2',
        coords: [56.85, 60.7122]
      },
      {
        title: 'Меро3',
        coords: [56.88, 60.6122]
      }
    ];

    return (
      <Box>
        <YMaps query={{
          lang: 'ru_RU',
          load: 'package.full'
        }}>
          <Map
            width="100%"
            height={435}
            defaultState={{
              center: [56.85, 60.6122],
              zoom: 12
            }}
          >
            {events.map((e, i) =>
              <Placemark
                properties={{
                  item: i,
                  balloonContentHeader: e.title,
                  balloonContentBody: 'Описание какое-то',
                  iconCaption: e.title,
                  balloonContentFooter: `<input type="button" onclick="window.onClickBalloonBtn(${i});"value="Подробнее"/>`
                }}
                key={i}
                geometry={e.coords} />
            )}
          </Map>
        </YMaps>
      </Box>
    );
  }
;

export default EventMap;
