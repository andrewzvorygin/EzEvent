import React from "react";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";

const Stages = () => {
  const theme = useTheme();
  return (
    <Box mb={5}>
      <Stack direction="row" mb={5}>
        <Stack
          direction="row"
          sx={{
            border: "1px solid #000000",
            borderRadius: "2px",
          }}
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="space-between"
          spacing={3}
        >
          <Typography
            p={2}
            variant={"subtitle1"}
            sx={{
              fontWeight: "bold",
              [theme.breakpoints.down("md")]: { fontSize: "0.8rem" },
            }}
            align={"center"}
          >
            1 Этап
          </Typography>
          <Typography
            p={2}
            variant={"subtitle1"}
            sx={{
              [theme.breakpoints.down("md")]: { fontSize: "0.8rem" },
            }}
          >
            Бар Контур
          </Typography>
          <Typography
            p={2}
            variant={"subtitle1"}
            sx={{
              [theme.breakpoints.down("md")]: { fontSize: "0.8rem" },
            }}
          >
            19:00
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Stages;
