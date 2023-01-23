import * as React from "react";
import { FC, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import {
  ButtonGroup,
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
import Button from "@mui/material/Button";

import {
  StyledButton,
  StyledIconButton,
} from "../../StyledControls/StyledControls";
import { CityType, UserType } from "../../../types";
import { cityAPI } from "../../../api/Api";

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

const selectedStyle = {
  background: "#1976d2",
  color: "white",
  ":hover": {
    color: "white",
    background: "rgba(25,118,210,0.43)",
  },
};

interface IProps {
  formik: any;
  handleExpandClick: () => void;
  expanded: boolean;
  cities: CityType[];
  setCities: (cities: CityType[]) => void;
  userType: UserType | null;
  setUserType: ((userType: UserType) => void) | null;
}

const Filter: FC<IProps> = ({
  formik,
  handleExpandClick,
  expanded,
  cities,
  setCities,
  userType,
  setUserType,
}) => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    searchText &&
      cityAPI.getCityByPrefix(searchText).then((data) => {
        setCities(data.slice(0, 5));
      });
  }, [searchText]);

  return (
    <form onSubmit={formik.handleSubmit} style={{ display: "contents" }}>
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
        onSubmit={formik.handleSubmit}
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
              id="location"
              name="location"
              value={formik.values.location}
              onChange={(e) => {
                formik.handleChange(e);
              }}
              onClose={() => setSearchText("")}
              renderValue={() =>
                cities?.find((value) => value.id === formik.values.location)
                  ?.name
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
              {cities.map(({ name, id }) => (
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
            {userType !== null && setUserType && (
              <ButtonGroup
                variant="outlined"
                aria-label="outlined primary button group"
              >
                <StyledButton
                  onClick={() => {
                    setUserType(UserType.all);
                  }}
                  sx={userType === UserType.all ? selectedStyle : undefined}
                >
                  Все
                </StyledButton>
                <StyledButton
                  onClick={() => {
                    setUserType(UserType.particiapant);
                  }}
                  sx={
                    userType === UserType.particiapant
                      ? selectedStyle
                      : undefined
                  }
                >
                  Посещенные
                </StyledButton>
                <StyledButton
                  onClick={() => {
                    setUserType(UserType.organizer);
                  }}
                  sx={
                    userType === UserType.organizer ? selectedStyle : undefined
                  }
                >
                  Организованные
                </StyledButton>
              </ButtonGroup>
            )}
            <Button
              onClick={() => {
                formik.handleSubmit();
                handleExpandClick();
              }}
              sx={{ alignSelf: "flex-start" }}
              variant="contained"
            >
              Применить
            </Button>
          </Stack>
        </Box>
      </Modal>
    </form>
  );
};

export default Filter;
