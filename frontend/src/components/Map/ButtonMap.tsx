import * as React from "react";
import { FC, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Collapse } from "@mui/material";

import MapInput from "./MapInput";

const ButtonMap: FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [coordsMarker, setCoordsMarker] = useState<null | [number, number]>(
    null,
  );
  const handleExpandClick = () => setExpanded((e) => !e);

  // eslint-disable-next-line no-unused-vars
  function onChange(coords: [number, number]) {
    setCoordsMarker(coords);
    // todo: something
  }

  return (
    <>
      <Button onClick={handleExpandClick} sx={{ marginBottom: "1em" }}>
        Открыть карту
      </Button>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box>
          <MapInput onChange={onChange} value={coordsMarker} />
        </Box>
      </Collapse>
    </>
  );
};

export default ButtonMap;
