import React, { useState, useEffect, useMemo } from 'react'
import {
  Grid,
  Typography,
  Button,
  IconButton,
  ButtonGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Slider,
  Radio,
  FormGroup,
  TextField,
  RadioGroup,
  FormControl,
  Collapse,
  InputAdornment,
  duration,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Autocomplete,
} from '@mui/material'
import {
  History as HistoryIcon,
  Sort as SortIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Recommend as RecommendIcon,
} from '@mui/icons-material'

const days = [
  { id: 0, day: 'Mo' },
  { id: 1, day: 'Di' },
  { id: 3, day: 'Mi' },
  { id: 4, day: 'Do' },
  { id: 5, day: 'Fr' },
  { id: 6, day: 'Sa' },
]

const Filters = ({
  events,
  languages,
  filters,
  currentPage,
  setCurrentPage,
  setFilters,
  searchCourse,
  order,
  showedType,
  setShowedType,
  clearSearchCourse,
  handleSearchCourse,
  handleSortCourses,
  studyPrograms,
  selectedProgram,
  setSelectedProgram,
  hideFilter,
  setHideFilter,
  duration,
  setDuration,
  swsValue,
  setSwsValue,
}) => {
  // const [hideFilter, setHideFilter] = useState(false)
  // const [duration, setDuration] = useState([0 * 60, 100 * 60])
  // const [swsValue, setSwsValue] = useState(10)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  // const [showedType, setShowedType] = useState('list')

  const handleHideFilter = () => {
    setHideFilter((prev) => !prev)
  }

  const handleSetCheckbox = (filterAttr, catalog) => {
    let tempFilterAttr = updateFilters(filters[filterAttr], catalog)
    setFilters((prevState) => ({
      ...prevState,
      [filterAttr]: tempFilterAttr,
    }))
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }

  const handleSetSort = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseSort = (order = '') => {
    setAnchorEl(null)
    handleSortCourses(order)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const formatTime = (value) => {
    const hours = Math.floor(value / 60)
    const minutes = value % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`
  }

  const handleFilterDuration = (event, newValue) => {
    setFilters((prevState) => ({
      ...prevState,
      startingTimes: [formatTime(newValue[0]), formatTime(newValue[1])],
      duration: [newValue[0], newValue[1]],
    }))
    if (currentPage !== 1) setCurrentPage(1)
  }

  const handleFilterSWS = (event, newValue) => {
    setFilters((prevState) => ({
      ...prevState,
      sws: newValue,
    }))
    if (currentPage !== 1) setCurrentPage(1)
  }
  const handleHidePassed = () => {
    let prev = filters.hidePassed
    setFilters((prevState) => ({
      ...prevState,
      hidePassed: !prev,
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      weekdays: [],
      events: [],
      languages: [],
      sws: 10,
      startingTimes: [],
      hidePassed: false,
    })
    setDuration([0 * 60, 100 * 60])
    setSwsValue(10)
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }

  function updateFilters(filterAtt, newEntry) {
    const index = filterAtt.findIndex((attr) => attr.id === newEntry.id)
    if (index !== -1) {
      return filterAtt.filter((attr) => attr.id !== newEntry.id)
    }
    return filterAtt.concat(newEntry)
  }

  const handleShowedType = (e) => {
    setShowedType(e.target.value)
  }
  const handleSelectStudyProgram = (value) => {
    console.log(value)
    setSelectedProgram(value)
  }
  // console.log(filters)
  return (
    <>
      <Grid container sx={{ py: 3 }} spacing={3} alignItems="center">
        {studyPrograms.length !== 0 && (
          <Grid item tem xs={12} sm={6}>
            <Autocomplete
              style={{ backgroundColor: '#FFF' }}
              options={studyPrograms}
              value={selectedProgram}
              fullWidth
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Study program"
                  placeholder="Choose study program"
                />
              )}
              getOptionLabel={(option) => option.name}
              onChange={(event, value) => handleSelectStudyProgram(value)}
            />
          </Grid>
        )}
        {/* search box */}
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            placeholder="Search for courses..."
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: '#A5A5A5',
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
        <Grid item xs={12} sm={6}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <FormControl>
                <RadioGroup
                  row
                  // defaultValue="list"
                  value={showedType}
                  onChange={(event) => handleShowedType(event)}>
                  <FormControlLabel
                    value="list"
                    control={<Radio />}
                    label="Show course list"
                  />
                  <FormControlLabel
                    value="path"
                    control={<Radio />}
                    label="Show course path"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
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
                }>
                {hideFilter ? 'Hide filter' : 'Filter by'}
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="large"
                startIcon={<SortIcon />}
                color="primary"
                onClick={handleSetSort}>
                Sort
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}>
                {sessionStorage.getItem('elas-token') && (
                  <MenuItem onClick={() => handleCloseSort('default')}>
                    <ListItemIcon>
                      <RecommendIcon
                        fontSize="small"
                        color={order === 'default' ? 'primary' : ''}
                      />
                    </ListItemIcon>
                    <ListItemText>Default</ListItemText>
                  </MenuItem>
                )}
                <MenuItem onClick={() => handleCloseSort('asc')}>
                  <ListItemIcon>
                    <ArrowDownwardIcon
                      fontSize="small"
                      color={order === 'asc' ? 'primary' : ''}
                    />
                  </ListItemIcon>
                  <ListItemText>Sort courses by A-Z</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleCloseSort('desc')}>
                  <ListItemIcon>
                    <ArrowUpwardIcon
                      fontSize="small"
                      color={order === 'desc' ? 'primary' : ''}
                    />
                  </ListItemIcon>
                  <ListItemText>Sort courses by Z-A</ListItemText>
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* filters box */}
      <Collapse in={hideFilter}>
        <Grid
          container
          sx={{
            borderRadius: 2,
            border: '2px solid',
            borderColor: '#A5A5A5',
            py: 2,
            px: { xs: 1, sm: 3 },
          }}>
          <Grid container>
            <Grid container spacing={3} sx={{ pt: 2 }}>
              {/* weekdays */}
              <Grid item xs={12}>
                <Grid item xs={12} sx={{ maxWidth: 330, width: '100%' }}>
                  <FormLabel component="legend" sx={{ pb: 1 }}>
                    Weekdays
                  </FormLabel>
                  {/* FIXME: when back from detial page, selected day button is not contained*/}
                  <ButtonGroup>
                    {days.map((day) => (
                      <Button
                        variant={
                          filters.weekdays.includes(day)
                            ? 'contained'
                            : 'outlined'
                        }
                        key={day.id}
                        onClick={() => handleSetCheckbox('weekdays', day)}>
                        {day.day}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Grid>
              </Grid>
              {/* tiem & sws */}
              <Grid item xs={12}>
                <Grid container spacing={6} sx={{ px: 2 }}>
                  <Grid item xs={12} lg={6}>
                    <FormLabel component="legend" sx={{ pb: 1, ml: -2 }}>
                      Start Time
                    </FormLabel>
                    <Slider
                      value={duration}
                      onChange={(event, newValue) => setDuration(newValue)}
                      onChangeCommitted={handleFilterDuration}
                      valueLabelDisplay="auto"
                      min={7 * 60} // Minimum time (e.g., 07:00) in minutes
                      max={20 * 60} // Maximum time (e.g., 20:00) in minutes
                      step={30} // Step size (e.g., 00:30) in minutes
                      valueLabelFormat={formatTime}
                      marks={[
                        {
                          value: 7 * 60, // 07:00 in minutes
                          label: '07:00',
                        },
                        {
                          value: 20 * 60, // 20:00 in minutes
                          label: '20:00',
                        },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
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
                          label: '0',
                        },
                        {
                          value: 10,
                          label: '10',
                        },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {/* event */}
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
                                handleSetCheckbox('events', eventType)
                              }
                            />
                          }
                          label={eventType.event}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  {/* languages */}
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
                                handleSetCheckbox('languages', language)
                              }
                            />
                          }
                          label={language.language}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                  {/* course list */}
                  <Grid item xs={12}>
                    <FormLabel component="legend">Course list</FormLabel>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filters.hidePassed}
                            onChange={handleHidePassed}
                          />
                        }
                        label="Hide passed courses"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Grid>
              {/* reset button */}
              <Grid container justifyContent="flex-end" sx={{ pt: 1 }}>
                <Grid item>
                  <Button
                    startIcon={<HistoryIcon />}
                    color="primary"
                    onClick={handleResetFilters}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Collapse>
    </>
  )
}

export default Filters
