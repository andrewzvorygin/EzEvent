import * as React from "react";
import { FC, useState } from "react";
import Box from "@mui/material/Box";

import MapInput from "./MapInput";

const ButtonMap: FC = () => {
  const [coordsMarker, setCoordsMarker] = useState<null | [number, number]>(
    null,
  );

  function onChange(coords: [number, number]) {
    setCoordsMarker(coords);
  }

  return (
    <Box>
      <MapInput onChange={onChange} value={coordsMarker} />
    </Box>
  );
};

export default ButtonMap;
