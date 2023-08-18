import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Grid,
  Typography,
  Button,
  CardContent,
  CardActions,
  Card,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Stack,
  MenuItem,
  Checkbox,
  ListItemText,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  FormGroup,
  FormControlLabel,
  Chip,
} from '@mui/material'
import { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import {
  Delete as DeleteIcon,
  Info as InfoIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Stars as StarsIcon,
  Recommend as RecommendIcon,
  BookmarkAdded as BookmarkAddedIcon,
} from '@mui/icons-material'
import PropTypes from 'prop-types'
import { getRandomColor } from './utils/functions'
import { enrollCourse, unenrollCourse } from '../utils/api'
import { useSnackbar } from 'notistack'
import { prepareCourses, isOverlapping } from '../StudyCompassNew'

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
})

const CourseCard = ({
  course,
  workload,
  setWorkload,
  selectedCourses,
  setSelectedCourses,
  currentSchedule,
  setCurrentSchedule,
  filters,
  order,
  selectedProgram,
  tabValue,
  currentPage,
  hideFilter,
  duration,
  swsValue,
  clearSelectedTimeslot,
}) => {
  const [professor, setProfessor] = useState([])
  const [selectedTimeID, setSelectedTimeID] = useState([])
  const navigate = useNavigate()
  const avatarColor = useMemo(() => getRandomColor(), [])
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)

  const { enqueueSnackbar } = useSnackbar()
  const showSnackbar = (message) => {
    enqueueSnackbar(message, {
      variant: message.includes('successfully') ? 'success' : 'error',
      autoHideDuration: 6000,
    })
  }

  useEffect(() => {
    let prof = course.professors.filter((item) => item.name.includes('Prof'))
    if (prof.length !== 0) {
      setProfessor(prof[0])
    } else {
      setProfessor(course.professors[0])
    }
    if (selectedCourses.some((item) => item.id === course.id)) {
      setSelectedTimeID(
        selectedCourses.filter((item) => item.id === course.id)[0]
          .selectedTimeID
      )
    } else {
      setSelectedTimeID([])
    }
  }, [selectedCourses.length])
  const showCourseDetail = (id) => {
    const setting = {
      filters: filters,
      order: order,
      selectedProgram: selectedProgram,
      hideFilter: hideFilter,
      duration: duration,
      swsValue: swsValue,
      tabValue: tabValue,
      currentPage: currentPage,
    }
    const courseState = {
      passed: course.passed,
    }
    sessionStorage.setItem('elas-sc-course', JSON.stringify(courseState))
    sessionStorage.setItem('elas-sc-setting', JSON.stringify(setting))
    navigate(`detail?id=${id}`)
  }

  const handleEnroll = async (course) => {
    let temWorkload = workload + parseInt(course.sws)
    setWorkload(temWorkload)
    try {
      await enrollCourse(course.id, course.timetable[0].id)
      showSnackbar('Add course successfully!')
    } catch (err) {
      console.log(err)
    }
  }

  const handleUnenroll = async (course) => {
    setSelectedTimeID([])
    console.log(selectedTimeID)
    try {
      await unenrollCourse(course.id)
      showSnackbar('Remove course successfully!')
    } catch (err) {
      console.log(err)
      showSnackbar(err)
    }
    let temWorkload = workload - parseInt(course.sws)
    setWorkload(temWorkload)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setOpen(false)
  }

  const handleSelectTimeslot = async (checked, value) => {
    let tempTime = selectedTimeID
    if (checked) {
      tempTime = [...tempTime, value]
    } else {
      tempTime = tempTime.filter((item) => item != value)
    }
    let temWorkload = workload + parseInt(course.sws)
    setWorkload(temWorkload)
    try {
      await enrollCourse(course.id, tempTime)
      // if (tempTime.length !== 0) {
      //   showSnackbar('Add course successfully!')
      // } else {
      //   showSnackbar('Remove course successfully!')
      // }
    } catch (err) {
      console.log(err)
    }
    setSelectedTimeID(tempTime)
  }

  return (
    <>
      <Card
        sx={{
          idth: '100%',
          // minHeight: "370px",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '&:hover': {
            boxShadow: 5,
          },
          borderRadius: 2,
          border: '2px solid',
          borderColor: '#A5A5A5',
        }}
        elevation={0}>
        <CardContent sx={{ minHeight: 270 }}>
          {sessionStorage.getItem('elas-token') && (
            <>
              <Stack direction="row" spacing={2}>
                {course.recommendation.status && (
                  <CustomWidthTooltip
                    title={
                      <Typography>
                        The recommendation of courses is based on the following:
                        <br />
                        <br /> • Your passed courses
                        <br /> • Similar students who have taken similar courses
                        as you
                        <br /> • Ratings of the course
                        <br /> • Popularity of the course
                        <br /> • Passed rate/difficulty of the course
                      </Typography>
                    }>
                    <Stack direction="row" spacing={0.5}>
                      <RecommendIcon color="success" />
                      <Typography>Recommended</Typography>
                    </Stack>
                  </CustomWidthTooltip>
                )}
                {course.popularity.status && (
                  <Tooltip
                    title={`${course.popularity.passed_students} students have taken the course`}>
                    <Stack direction="row" spacing={0.5}>
                      <StarsIcon sx={{ color: '#FB9B0E' }} />
                      <Typography>Popular</Typography>
                    </Stack>
                  </Tooltip>
                )}
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: '5px' }}>
                {course.ratings.map((item, index) => (
                  <Chip
                    key={index}
                    label={item.rating}
                    variant="outlined"
                    color="success"
                    size="small"
                  />
                ))}
              </Stack>
            </>
          )}
          <Typography variant="h6" gutterBottom>
            {course.name}
          </Typography>

          <Typography gutterBottom color="text.secondary">
            {course.subject_type ? `${course.subject_type} • ` : ' '}
            {course.language ? `${course.language}` : ''}
          </Typography>

          {course.sws && (
            <Typography variant="body2" gutterBottom>
              SWS: {course.sws}
            </Typography>
          )}

          {Boolean(course.timetable?.length) && (
            <>
              <Grid container alignItems="center">
                {course.timetable.map((time, index) => {
                  return (
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{ pr: 1 }}
                      gutterBottom>
                      Time:{' '}
                      <b>
                        {time.day} {time.time.from} - {time.time.to}
                      </b>
                    </Typography>
                  )
                })}
              </Grid>
            </>
          )}
          {professor?.name && (
            <Grid container style={{ paddingTop: 15 }} alignItems="center">
              <Grid item style={{ marginRight: 16 }}>
                <Avatar
                  style={{
                    backgroundColor: avatarColor,
                  }}>
                  {professor.name.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item xs={8}>
                <Typography gutterBottom>{professor.name}</Typography>
              </Grid>
            </Grid>
          )}
        </CardContent>
        <CardActions>
          <Grid container justifyContent={'space-between'} sx={{ px: 1 }}>
            <Button onClick={() => showCourseDetail(course.id)} size="small">
              VIEW COURSE
            </Button>
            {sessionStorage.getItem('elas-token') ? (
              course.passed ? (
                <Typography variant="body2" color="green">
                  ALREADY PASSED
                </Typography>
              ) : course.timetable.length !== 1 ? (
                <>
                  <Button
                    size="small"
                    ref={anchorRef}
                    variant="contained"
                    onClick={handleToggle}>
                    {selectedTimeID.length != 0 && <BookmarkAddedIcon />}
                    ADD TO SCHEDULE
                    <ArrowDropDownIcon />
                  </Button>
                  <Popper
                    sx={{
                      zIndex: 1,
                    }}
                    open={open}
                    anchorEl={anchorRef.current}
                    transition
                    disablePortal
                    placement="right">
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps}>
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList>
                              {course.timetable.map((time, index) => (
                                <MenuItem key={time.id}>
                                  <FormGroup row>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={selectedTimeID.some(
                                            (item) => item === time.id
                                          )}
                                        />
                                      }
                                      label={`${time.day} ${time.time.from} - ${time.time.to}`}
                                      value={time.id}
                                      onChange={(event) =>
                                        handleSelectTimeslot(
                                          event.target.checked,
                                          event.target.value
                                        )
                                      }
                                    />
                                  </FormGroup>
                                </MenuItem>
                              ))}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </>
              ) : !selectedCourses.some((item) => item.id === course.id) ? (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleEnroll(course)}>
                  ADD TO SCHEDULE
                </Button>
              ) : (
                <Button
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleUnenroll(course)}>
                  Remove
                </Button>
              )
            ) : (
              <Tooltip title="Login to arrange schedule">
                <span>
                  <Button
                    variant="contained"
                    size="small"
                    disabled
                    // onClick={goToLoginPage}
                  >
                    ADD TO SCHEDULE
                  </Button>
                </span>
              </Tooltip>
            )}
          </Grid>
        </CardActions>
      </Card>
    </>
  )
}

export default CourseCard
