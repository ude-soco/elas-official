import React, { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Collapse,
  Divider,
  Dialog,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
  DialogContent,
  Toolbar,
} from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox'
import CourseDescription from './CourseDescription'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import InfoIcon from '@mui/icons-material/Info'
import { loading } from '../../StudyCompass'
import { getRandomColor, validateSubjectType } from '../utils/functions'
import { getCourseInfo, enrollCourse, unenrollCourse } from '../../utils/api'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CourseTimetable from './CourseTimetable'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreIcon from '@mui/icons-material/More'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

const Course = (props) => {
  const {
    course,
    handleCourse,
    selected,
    resolveConflict,
    handleResolvedConflict,
    handleUpdateSelectedCourses,
  } = props

  const [courseDetails, setCourseDetails] = useState({
    description: '',
    id: '',
    language: '',
    longtext: '',
    name: '',
    shorttext: '',
    subject_type: '',
    sws: '',
    timetable: [],
    url: '',
  })
  const [additionalInfo, setAddintionalInfo] = useState({
    keywords: [],
    professors: [],
    study_prgrams: [],
  })
  const [selectedTime, setSelectedTime] = useState({
    time: '',
    value: {},
  })
  const [expand, setExpand] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const avatarColor = useMemo(() => getRandomColor(), [])
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const showSnackbar = (message) => {
    enqueueSnackbar(message, {
      variant: message.includes('successfully') ? 'success' : 'error',
      autoHideDuration: 6000,
    })
  }

  useEffect(() => {
    setCourseDetails(course)
    if (course.timetable.length !== 0) {
      if (course.selectedTime) {
        setSelectedTime(course.selectedTime)
      } else {
        setSelectedTime({
          ...selectedTime,
          time: `${course.timetable[0].day} ${course.timetable[0].time.from}-${course.timetable[0].time.to}`,
          elearn: course.timetable[0].elearn,
          room: course.timetable[0].room,
          value: course.timetable[0],
        })
      }
    }
    if (resolveConflict === course.id) {
      setExpand((prevState) => !prevState)
    }
  }, [course, resolveConflict])

  // useEffect(() => {
  //   async function loadAdditinalInfo() {
  //     let id = course.id
  //     let response = await getCourseInfo(id)
  //     setAddintionalInfo(response)
  //   }
  //   loadAdditinalInfo()
  // }, [])

  const handleToggleMenu = (event) => {
    setOpenMenu((prevState) => {
      if (prevState !== null) {
        return null
      }
      return event.currentTarget
    })
  }

  const handleSelectedTime = (time) => {
    let timeItem = {
      time: `${time[0].day} ${time[0].time.from}-${time[0].time.to}`,
      elearn: time[0].elearn,
      room: time[0].room,
      value: time[0],
    }
    setSelectedTime(timeItem)

    if (selected) {
      handleUpdateSelectedCourses(course.id, timeItem)
    }
  }

  const goDetailPage = () => {
    navigate(`detail?id=${course.id}`)
  }

  const handleEnroll = async (id) => {
    try {
      await enrollCourse(id)
      showSnackbar('Course enrolled successfully!')
    } catch (err) {
      const {
        data: { error },
      } = err.response
      showSnackbar(error)
    }
  }

  const handleUnenroll = async (id) => {
    try {
      await unenrollCourse(id)
      showSnackbar('Course unenrolled successfully!')
    } catch (err) {
      showSnackbar(err)
    }
  }

  return (
    <>
      <Grid item xs={12} style={{ paddingBottom: 8 }}>
        <Paper style={{ padding: '16px 8px 16px 4px' }}>
          <Grid container alignItems="center">
            <Grid item xs={1}>
              <Grid container justifyContent="center">
                <IconButton
                  onClick={() => {
                    handleCourse({ ...course, selectedTime: selectedTime })
                    selected
                      ? handleUnenroll(course.id)
                      : handleEnroll(course.id)
                  }}>
                  {selected ? (
                    <RemoveCircleIcon style={{ color: 'red' }} />
                  ) : (
                    <AddBoxIcon style={{ color: 'orange' }} />
                  )}
                </IconButton>
              </Grid>
            </Grid>

            <Grid item xs={2}>
              <Grid container>
                <Grid item style={{ paddingRight: 8 }}>
                  <Typography color="textSecondary" variant="button">
                    {selectedTime.time}
                  </Typography>
                </Grid>
                {course.timetable.length > 1 ? (
                  <>
                    <Grid item>
                      <Tooltip
                        title={
                          <Typography>More time slots available!</Typography>
                        }>
                        <InfoOutlinedIcon color="disabled" />
                      </Tooltip>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>

            <Grid item xs={1}>
              <Grid container style={{ paddingLeft: 12 }}>
                <Typography color="textSecondary" variant="button">
                  {course.sws}
                </Typography>
              </Grid>
            </Grid>

            <Grid
              item
              xs={5}
              // onClick={() => setExpand((prevState) => !prevState)}
              onClick={() => goDetailPage()}
              style={{ cursor: 'pointer' }}>
              <Grid container>
                <Typography
                  color="textSecondary"
                  style={{ fontWeight: 'bold' }}>
                  {course.name}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={2}>
              <Grid container>
                <Typography color="textSecondary" variant="button">
                  {validateSubjectType(course.subject_type)}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={1}>
              <Grid container justifyContent="center">
                <Toolbar title="More course details">
                  <IconButton
                    onClick={() => {
                      if (handleResolvedConflict) {
                        handleResolvedConflict('')
                      }
                      // goDetailPage()
                      setExpand((prevState) => !prevState)
                    }}>
                    <InfoIcon />
                  </IconButton>
                </Toolbar>
              </Grid>
            </Grid>
          </Grid>

          <Dialog fullScreen open={expand} onClose={() => setExpand(false)}>
            <Grid container>
              {!courseDetails && !expand ? (
                <> {loading} </>
              ) : (
                <>
                  <DialogContent>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between">
                      <Typography variant="h5" gutterBottom>
                        {courseDetails.name}
                      </Typography>

                      <Button
                        startIcon={<CloseIcon />}
                        onClick={() => setExpand(false)}>
                        close
                      </Button>
                    </Grid>
                    <Grid container spacing={3} sx={{ py: 4 }}>
                      {/* Left side*/}
                      <Grid item xs={4}>
                        <Grid container>
                          <Grid container style={{ paddingBottom: 24 }}>
                            <Grid item xs={12} style={{ paddingBottom: 8 }}>
                              <Typography style={{ fontWeight: 'bold' }}>
                                Professor(s) / Assistant(s)
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              {additionalInfo.professors.map((prof, index) => {
                                return (
                                  <Grid
                                    key={index}
                                    container
                                    style={{ paddingBottom: 8 }}
                                    alignItems="center">
                                    <Grid item style={{ marginRight: 16 }}>
                                      <Avatar
                                        style={{
                                          backgroundColor: avatarColor,
                                        }}>
                                        {prof.name.split(' ')[0].charAt(0)}
                                      </Avatar>
                                    </Grid>
                                    <Grid item xs={8}>
                                      <Typography>{prof.name}</Typography>
                                    </Grid>
                                  </Grid>
                                )
                              })}
                            </Grid>
                          </Grid>

                          {/* Timetable */}
                          <CourseTimetable
                            addRemoveSchedule={
                              <>
                                {!selected ? (
                                  <Button
                                    onClick={() =>
                                      handleCourse({
                                        ...course,
                                        selectedTime: selectedTime,
                                      })
                                    }
                                    size="small"
                                    startIcon={<PlaylistAddIcon />}
                                    variant="contained"
                                    style={{
                                      backgroundColor: '#FB9B0E',
                                      color: 'white',
                                    }}>
                                    Add course
                                  </Button>
                                ) : (
                                  <Button
                                    startIcon={<RemoveCircleIcon />}
                                    color="error"
                                    onClick={() =>
                                      handleCourse({
                                        ...course,
                                        selectedTime: selectedTime,
                                      })
                                    }>
                                    Remove from schedule
                                  </Button>
                                )}
                              </>
                            }
                            selectedTime={selectedTime}
                            timetable={courseDetails.timetable}
                            handleSelectedTime={handleSelectedTime}
                          />
                        </Grid>
                      </Grid>

                      {/* Right side */}

                      <Grid item xs={8}>
                        <CourseDescription
                          description={courseDetails.description}
                          url={courseDetails.url}
                          keywords={additionalInfo.keywords}
                          studyPrograms={additionalInfo.study_prgrams}
                          expand={expand}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                </>
              )}
            </Grid>
          </Dialog>
        </Paper>
      </Grid>
    </>
  )
}

export default Course
