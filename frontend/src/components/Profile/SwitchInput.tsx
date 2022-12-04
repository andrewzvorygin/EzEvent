import React, { FC, useState } from "react";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

interface IProps {
  label: string;
  value: string;
}

const SwitchInput: FC<IProps> = ({ label, value }) => {
  const [mode, setMode] = useState<"read" | "edit">("read");

  return (
    <Box>
      <Typography fontSize={18}>{label}</Typography>

      {mode === "read" ? (
        <>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <Typography fontSize={20}>{value}</Typography>
            <IconButton onClick={() => setMode("edit")}>
              <EditIcon />
            </IconButton>
          </Stack>
        </>
      ) : (
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <TextField
            fullWidth
            value={value}
            id="asd"
            name="asd"
            sx={{ fontSize: "20px" }}
            variant="standard"
          />
          <IconButton onClick={() => setMode("read")}>
            <SaveIcon />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};

export default SwitchInput;
