import React, { useState } from "react";
import {
  Grid,
  IconButton,
  Button,
  ButtonGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Slider,
  FormGroup,
  TextField,
  Collapse,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import {
  History as HistoryIcon,
  Sort as SortIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const days = [
  { id: 0, day: "Mo" },
  { id: 1, day: "Di" },
  { id: 3, day: "Mi" },
  { id: 4, day: "Do" },
  { id: 5, day: "Fr" },
  { id: 6, day: "Sa" },
];

export default function Filters({
  catalogs,
  currentPage,
  setCurrentPage,
  events,
  filters,
  setFilters,
  languages,
  locations,
  order,
  searchCourse,
  clearSearchCourse,
  handleSearchCourse,
  handleSortCourses,
}) {
  const [hideFilter, setHideFilter] = useState(false);
  const [duration, setDuration] = useState([0 * 60, 100 * 60]);
  const [swsValue, setSwsValue] = useState(10);
  const [creditValue, setCreditValue] = useState(10);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (order = "") => {
    setAnchorEl(null);
    handleSortCourses(order);
  };

  const handleHideFilter = () => {
    setHideFilter((prev) => !prev);
  };

  const formatTime = (value) => {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleFilterDuration = (event, newValue) => {
    setFilters((prevState) => ({
      ...prevState,
      startingTimes: [formatTime(newValue[0]), formatTime(newValue[1])],
    }));
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handleFilterSWS = (event, newValue) => {
    setFilters((prevState) => ({
      ...prevState,
      sws: newValue,
    }));
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handleFilterCredits = (event, newValue) => {
    setFilters((prevState) => ({
      ...prevState,
      credits: newValue,
    }));
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handleCheckCheckbox = (filterAttr, catalog) => {
    let tempFilterAttr = updateFilters(filters[filterAttr], catalog);
    setFilters((prevState) => ({
      ...prevState,
      [filterAttr]: tempFilterAttr,
    }));
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      weekdays: [],
      events: [],
      catalogs: [],
      languages: [],
      locations: [],
      sws: 10,
      credits: 10,
      startingTimes: [],
    });
    setDuration([0 * 60, 100 * 60]);
    setSwsValue(10);
    setCreditValue(10);
    if (currentPage !== 1) setCurrentPage(1);
  };

  function updateFilters(filterAtt, newEntry) {
    const index = filterAtt.findIndex((attr) => attr.id === newEntry.id);
    if (index !== -1) {
      return filterAtt.filter((attr) => attr.id !== newEntry.id);
    }
    return filterAtt.concat(newEntry);
  }

  return (
    <>
      <Grid
        container
        sx={{ py: 3 }}
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} md={6}>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            placeholder="Search for courses..."
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "#A5A5A5",
            }}
            value={searchCourse}
            onChange={handleSearchCourse}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchCourse && (
                    <IconButton edge="end" onClick={clearSearchCourse}>
                      <CloseIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item>
              <Button
                startIcon={<FilterListIcon />}
                size="large"
                onClick={handleHideFilter}
                endIcon={
                  hideFilter ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )
                }
              >
                {hideFilter ? "Hide filter" : "Filter by"}
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="large"
                startIcon={<SortIcon />}
                color="primary"
                onClick={handleClick}
              >
                Sort
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={() => handleClose("asc")}>
                  <ListItemIcon>
                    <ArrowDownwardIcon
                      fontSize="small"
                      color={order === "asc" ? "primary" : ""}
                    />
                  </ListItemIcon>
                  <ListItemText>Sort courses by A-Z</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleClose("desc")}>
                  <ListItemIcon>
                    <ArrowUpwardIcon
                      fontSize="small"
                      color={order === "desc" ? "primary" : ""}
                    />
                  </ListItemIcon>
                  <ListItemText>Sort courses by Z-A</ListItemText>
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* Filter button */}
      <Collapse in={hideFilter}>
        <Grid
          container
          sx={{
            borderRadius: 2,
            border: "2px solid",
            borderColor: "#A5A5A5",
            py: 2,
            px: { xs: 1, sm: 3 },
          }}
        >
          <Grid container>
            <Grid container spacing={3} sx={{ pt: 2 }}>
              <Grid item xs={12}>
                <Grid item sx={{ maxWidth: 330, width: "100%" }}>
                  <FormLabel component="legend" sx={{ pb: 1 }}>
                    Weekdays
                  </FormLabel>
                  <ButtonGroup>
                    {days.map((day) => (
                      <Button
                        variant={
                          filters.weekdays.includes(day)
                            ? "contained"
                            : "outlined"
                        }
                        key={day.id}
                        onClick={() => handleCheckCheckbox("weekdays", day)}
                      >
                        {day.day}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={6} sx={{ px: 2 }}>
                  <Grid item xs={12} lg={4}>
                    <FormLabel component="legend" sx={{ pb: 1, ml: -2 }}>
                      Start time
                    </FormLabel>
                    <Slider
                      value={duration}
                      onChange={(event, newValue) => setDuration(newValue)}
                      onChangeCommitted={handleFilterDuration}
                      valueLabelDisplay="auto"
                      min={7 * 60} // Minimum time (e.g., 07:00) in minutes
                      max={20 * 60} // Maximum time (e.g., 24:00) in minutes
                      step={30} // Step size (e.g., 00:30) in minutes
                      valueLabelFormat={formatTime}
                      marks={[
                        {
                          value: 7 * 60, // 07:00 in minutes
                          label: "07:00",
                        },
                        {
                          value: 20 * 60, // 20:00 in minutes
                          label: "20:00",
                        },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <FormLabel component="legend" sx={{ pb: 1, ml: -2 }}>
                      SWS
                    </FormLabel>
                    <Slider
                      value={swsValue}
                      max={10}
                      min={0}
                      onChange={(event, newValue) => setSwsValue(newValue)}
                      onChangeCommitted={handleFilterSWS}
                      valueLabelDisplay="auto"
                      marks={[
                        {
                          value: 0,
                          label: "0",
                        },
                        {
                          value: 10,
                          label: "10",
                        },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <FormLabel component="legend" sx={{ pb: 1, ml: -2 }}>
                      Credit
                    </FormLabel>
                    <Slider
                      value={creditValue}
                      max={10}
                      min={0}
                      onChange={(event, newValue) => setCreditValue(newValue)}
                      onChangeCommitted={handleFilterCredits}
                      valueLabelDisplay="auto"
                      marks={[
                        {
                          value: 0,
                          label: "0",
                        },
                        {
                          value: 10,
                          label: "10",
                        },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {/* Events */}
                  <Grid item xs={12}>
                    <FormLabel component="legend">Events</FormLabel>
                    <FormGroup row>
                      {events.map((eventType) => (
                        <FormControlLabel
                          key={eventType.id}
                          control={
                            <Checkbox
                              checked={filters.events.some(
                                (event) => event.id === eventType.id
                              )}
                              onChange={() =>
                                handleCheckCheckbox("events", eventType)
                              }
                            />
                          }
                          label={eventType.type}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  {/* Catalogs */}
                  <Grid item xs={12}>
                    <FormLabel component="legend">Catalogs</FormLabel>
                    <FormGroup row>
                      {catalogs.map(
                        (cat) =>
                          cat.catalog && (
                            <FormControlLabel
                              key={cat.id}
                              control={
                                <Checkbox
                                  checked={filters.catalogs.some(
                                    (catalog) => catalog.id === cat.id
                                  )}
                                  onChange={() =>
                                    handleCheckCheckbox("catalogs", cat)
                                  }
                                />
                              }
                              label={cat.catalog}
                            />
                          )
                      )}
                    </FormGroup>
                  </Grid>
                  {/* Languages */}
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormLabel component="legend">Languages</FormLabel>
                        <FormGroup row>
                          {languages.map((language) => (
                            <FormControlLabel
                              key={language.id}
                              control={
                                <Checkbox
                                  checked={filters.languages.some(
                                    (lang) => lang.id === language.id
                                  )}
                                  onChange={() =>
                                    handleCheckCheckbox("languages", language)
                                  }
                                />
                              }
                              label={language.language}
                            />
                          ))}
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* Locations */}
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormLabel component="legend">Location</FormLabel>
                        <FormGroup row>
                          {locations.map(
                            (location) =>
                              location.location !== "unknown" && (
                                <FormControlLabel
                                  key={location.id}
                                  control={
                                    <Checkbox
                                      checked={filters.locations.some(
                                        (loc) => loc.id === location.id
                                      )}
                                      onChange={() =>
                                        handleCheckCheckbox(
                                          "locations",
                                          location
                                        )
                                      }
                                    />
                                  }
                                  label={location.location}
                                />
                              )
                          )}
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end" sx={{ pt: 1 }}>
                <Grid item>
                  <Button
                    startIcon={<HistoryIcon />}
                    color="primary"
                    onClick={handleResetFilters}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Collapse>
    </>
  );
}
