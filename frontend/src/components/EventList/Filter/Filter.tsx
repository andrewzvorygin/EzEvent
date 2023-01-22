import * as React from "react";
import { FC, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import {
  Input,
  InputAdornment,
  ListSubheader,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { FilterListOutlined, SearchOutlined } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";

import { StyledIconButton } from "../../StyledControls/StyledControls";

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

interface IProps {
  formik: any;
  handleExpandClick: () => void;
  expanded: boolean;
  cities: { name: string; id: number }[];
}

const Filter: FC<IProps> = ({
  formik,
  handleExpandClick,
  expanded,
  cities,
}) => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");

  const filteredCities = useMemo(
    () => cities.filter((option) => option.name.indexOf(searchText) !== -1),
    [searchText]
  );

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ display: "contents" }}
      onChange={formik.handleSubmit}
    >
      <SearchOutlined fontSize="large" sx={{ mr: 1 }} />
      <TextField
        label="Название мероприятия"
        variant="standard"
        sx={{
          alignSelf: "baseline",
          width: 220,
        }}
        id="search"
        name="search"
        value={formik.values.search}
        onChange={formik.handleChange}
      />
      <StyledIconButton
        aria-label="filter"
        title="Фильтр"
        onClick={handleExpandClick}
        sx={{
          ml: "auto",
          mb: -1,
        }}
      >
        <FilterListOutlined fontSize="large" />
      </StyledIconButton>

      <Modal open={expanded} onClose={handleExpandClick}>
        <Box
          sx={{
            ...style,
            [theme.breakpoints.down("md")]: { width: 500 },
            [theme.breakpoints.down("sm")]: { width: 400 },
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h4">Фильтр</Typography>
            <Typography variant="body1">Город:</Typography>
            <Select
              MenuProps={{ autoFocus: false }}
              id="city"
              name="city"
              value={formik.values.city}
              onChange={(e) => {
                formik.handleChange(e);
                formik.submitForm();
              }}
              onClose={() => setSearchText("")}
              renderValue={() =>
                cities?.find((value) => value.id === formik.values.city)?.name
              }
            >
              <ListSubheader>
                <TextField
                  size="small"
                  autoFocus
                  placeholder="Введите искомый город..."
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Escape") {
                      // Prevents autoselecting item while typing (default Select behaviour)
                      e.stopPropagation();
                    }
                  }}
                />
              </ListSubheader>
              {filteredCities.map(({ name, id }) => (
                <MenuItem value={id} key={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="body1">Дата</Typography>
            <Stack spacing={2} direction={"row"} alignItems={"center"}>
              <Input
                type="date"
                id="dateStart"
                name="dateStart"
                value={formik.values.dateStart}
                onChange={formik.handleChange}
              />
              <span>-</span>
              <Input
                type="date"
                id="dateEnd"
                name="dateEnd"
                value={formik.values.dateEnd}
                onChange={formik.handleChange}
              />
            </Stack>

            <Typography variant="body1">Тип мероприятия</Typography>
            <TextField
              select
              id="type"
              name="type"
              value={formik.values.type}
              onChange={(e) => {
                formik.handleChange(e);
                formik.submitForm();
              }}
            >
              <MenuItem value={"Прошедшие"}>Прошедшие</MenuItem>
              <MenuItem value={"Текущие"}>Текущие</MenuItem>
            </TextField>
          </Stack>
        </Box>
      </Modal>
    </form>
  );
};

export default Filter;
