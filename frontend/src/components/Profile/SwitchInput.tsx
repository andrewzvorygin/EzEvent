import React, { ChangeEvent, FC, useState } from "react";
import {
  Box,
  IconButton,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

interface IProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SwitchInput: FC<IProps> = ({ label, value, onChange }) => {
  const [mode, setMode] = useState<"read" | "edit">("read");
  return (
    <Box>
      <Typography fontSize={18}>{label}</Typography>
      {mode === "read" ? (
        <>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <Typography fontSize={20} pt={0.1}>
              {value}
            </Typography>
            <IconButton onClick={() => setMode("edit")}>
              <EditIcon />
            </IconButton>
          </Stack>
        </>
      ) : (
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <Input
            type={"textarea"}
            value={value}
            id="asd"
            onChange={onChange}
            name="asd"
            sx={{ fontSize: "20px", maxWidth: "300px" }}
            fullWidth={true}
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
