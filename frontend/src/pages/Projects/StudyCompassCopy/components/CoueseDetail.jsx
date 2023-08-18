import {
  Grid,
  Typography,
  Button,
  CardContent,
  CardActions,
  Card,
  Tabs,
  Tab,
  Container,
  Box,
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
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SchoolIcon from '@mui/icons-material/School'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import ClearIcon from '@mui/icons-material/Clear'
import { getRandomColor, validateSubjectType } from './utils/functions'
import { useState, useEffect, useMemo, useRef } from 'react'
import { getCourseInfo, enrollCourse, unenrollCourse } from '../utils/api'
import { useSearchParams, useNavigate } from 'react-router-dom'
import WordCloud from './Wordcloud'
import { getCurrentEnrolledCourses, getLocalCoursePath } from '../utils/api'
import CoursePath from './CoursePath'

const CourseDetail = () => {
  const [courseInfo, setCourseInfo] = useState(undefined)
  const [selectedCourse, setSelectedCourse] = useState([])
  const [selectedTimeID, setSelectedTimeID] = useState([])
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)

  const [lableList, setLableList] = useState([])
  const [sourceList, setSourceList] = useState([])
  const [targetList, setTargetList] = useState([])
  const [valueList, setValueList] = useState([])

  // let setting = JSON.parse(sessionStorage.getItem('elas-sc-setting'))
  let courseState = JSON.parse(sessionStorage.getItem('elas-sc-course'))
  let passed
  if (courseState) {
    passed = courseState['passed']
  }

  let token = sessionStorage.getItem('elas-token')
  let [params] = useSearchParams()
  let id = params.get('id')
  const avatarColor = useMemo(() => getRandomColor(), [])
  const navigate = useNavigate()

  useEffect(() => {
    async function loadCourseInfo() {
      let response = await getCourseInfo(id)
      setCourseInfo(response)
      return response
    }
    async function loadEnrolledCourses(tempCourseInfo) {
      let response = await getCurrentEnrolledCourses()
      setSelectedCourse(() => {
        if (response.some((item) => item.id === tempCourseInfo.id)) {
          setSelectedTimeID(
            response.filter((item) => item.id === tempCourseInfo.id)[0]
              .selectedTimeID
          )
        }
        return response
      })
    }
    async function loadLocalCoursePath(id) {
      let response = await getLocalCoursePath(id)
      setLableList(response[0].lableList)
      setSourceList(response[0].sourceList)
      setTargetList(response[0].targetList)
      setValueList(response[0].valueList)
    }

    loadCourseInfo().then((tempCourseInfo) => {
      if (token) {
        loadEnrolledCourses(tempCourseInfo)
      }
    })
    // if (token) {
    //   loadEnrolledCourses(tempCourseInfo)
    // }
    if (lableList.length === 0) {
      loadLocalCoursePath(id)
    }
  }, [id])
  console.log(selectedTimeID)

  const removeFirstWord = (str) => {
    const indexOfSpace = str.indexOf(' ')
    if (indexOfSpace === -1) {
      return ''
    }
    return str.substring(indexOfSpace + 1)
  }
  const handleEnroll = async (courseInfo) => {
    let tempSelectedCourse = [...selectedCourse]
    tempSelectedCourse.push({
      id: courseInfo.id,
      name: courseInfo.name,
      sws: courseInfo.sws,
      timetable: courseInfo.timetable,
    })
    setSelectedCourse(tempSelectedCourse)
    try {
      await enrollCourse(courseInfo.id)
    } catch (err) {
      console.log(err)
    }
  }

  const handleUnenroll = async (courseInfo) => {
    let tempSelectedCourse = selectedCourse.filter(
      (item) => item.id !== courseInfo.id
    )
    setSelectedCourse(tempSelectedCourse)
    try {
      await unenrollCourse(courseInfo.id)
    } catch (err) {}
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
    try {
      await enrollCourse(courseInfo.id, tempTime)
    } catch (err) {
      console.log(err)
    }
    setSelectedTimeID(tempTime)
  }
  return (
    <>
      {courseInfo && (
        <>
          <Container maxWidth="lg" style={{ marginTop: 20, marginBottom: 20 }}>
            <Button
              startIcon={<ArrowBackIosIcon />}
              style={{ color: '#FB9B0E', marginBottom: 8 }}
              onClick={() => {
                navigate(-1), sessionStorage.removeItem('elas-sc-course')
              }}>
              BACK
            </Button>
            <Grid
              container
              alignItems="flex-start"
              justifyContent="space-between"
              spacing={2}
              style={{ paddingBottom: '8px' }}>
              {/* course short Info */}
              <Grid item xs={12} sm={4}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      style={{ fontWeight: 'bold' }}
                      variant="h5"
                      gutterBottom>
                      {courseInfo.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container alignItems="center">
                      <Grid item style={{ paddingRight: 10 }}>
                        <Typography gutterBottom>
                          {courseInfo.subject_type
                            ? `${courseInfo.subject_type} • `
                            : ' '}
                          {courseInfo.language ? `${courseInfo.language}` : ''}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    {courseInfo.professors.map((prof, index) => {
                      return (
                        <Grid
                          key={index}
                          container
                          style={{ paddingBottom: 15 }}
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
                            <Typography gutterBottom>{prof.name}</Typography>
                          </Grid>
                        </Grid>
                      )
                    })}
                  </Grid>
                  <Grid item xs={12}>
                    {courseInfo.timetable.length && (
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography variant="h6" gutterBottom>
                            Timetable
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={1}>
                            {courseInfo.timetable.map((time, index) => {
                              return (
                                <Grid item xs={6} sx={{ pb: 1 }} key={index}>
                                  <Grid container alignItems="center">
                                    <Typography
                                      variant="body2"
                                      gutterBottom
                                      sx={{ whiteSpace: 'pre-line' }}>
                                      Time:{' '}
                                      <b>
                                        {time.day} {time.time.from} -{' '}
                                        {time.time.to}
                                      </b>
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      gutterBottom
                                      sx={{ whiteSpace: 'pre-line' }}>
                                      Rhythm: {time.rhythm}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      gutterBottom
                                      sx={{ whiteSpace: 'pre-line' }}>
                                      E-learning: {time.elearn}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      gutterBottom
                                      sx={{ whiteSpace: 'pre-line' }}>
                                      Comments: {time.comment}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              )
                            })}
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    {token && passed && (
                      <Typography variant="body2" color="green">
                        ALREADY PASSED
                      </Typography>
                    )}
                    {token && !passed && courseInfo.timetable.length > 1 && (
                      <>
                        <Button
                          size="small"
                          ref={anchorRef}
                          variant="contained"
                          onClick={handleToggle}>
                          {selectedTimeID.length !== 0 && <BookmarkAddedIcon />}
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
                                    {courseInfo.timetable.map((time, index) => (
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
                    )}
                    {token &&
                      !passed &&
                      !selectedCourse.some(
                        (course) => course.id === courseInfo.id
                      ) &&
                      courseInfo.timetable.length == 1 && (
                        <Button
                          variant="contained"
                          startIcon={<CalendarTodayIcon />}
                          style={{
                            backgroundColor: '#FB9B0E',
                            color: '#FFFFFF',
                          }}
                          onClick={() => handleEnroll(courseInfo)}>
                          ADD TO SCHEDULE
                        </Button>
                      )}
                    {token &&
                      !passed &&
                      selectedCourse.some(
                        (course) => course.id === courseInfo.id
                      ) &&
                      courseInfo.timetable.length == 1 && (
                        <Button
                          color="error"
                          variant="outlined"
                          startIcon={<ClearIcon />}
                          onClick={() => handleUnenroll(courseInfo)}>
                          REMOVE FROM SCHEDULE
                        </Button>
                      )}
                  </Grid>
                </Grid>
              </Grid>

              {/* topic Wordcloud */}
              <Grid item xs={12} sm={8}>
                {courseInfo.keywords.length !== 0 ? (
                  <>
                    <Typography
                      style={{ fontWeight: 'bold' }}
                      variant="h5"
                      gutterBottom>
                      Topics
                    </Typography>
                    {/* FIXME: wordcloud do not show keyword well */}
                    <WordCloud keywords={courseInfo.keywords} />
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>

            {/* course description */}
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  style={{ fontWeight: 'bold' }}
                  variant="h5"
                  gutterBottom>
                  Course description
                </Typography>

                <Typography paragraph>
                  {removeFirstWord(courseInfo.description)}
                </Typography>
              </Grid>

              {/* sankey diagram */}
              <Grid item xs={12}>
                <Typography
                  style={{ fontWeight: 'bold' }}
                  variant="h5"
                  gutterBottom>
                  Study path
                </Typography>
                <Typography>
                  show course path before and after "{courseInfo.name}"
                </Typography>
                {lableList.length !== 0 ? (
                  <CoursePath
                    lableList={lableList}
                    sourceList={sourceList}
                    targetList={targetList}
                    valueList={valueList}
                    width={800}
                    height={400}
                  />
                ) : (
                  <Typography gutterBottom>No study path available</Typography>
                )}
              </Grid>

              {/* study programs */}
              <Grid item xs={12} style={{ paddingBottom: 24 }}>
                <Typography
                  style={{ fontWeight: 'bold' }}
                  variant="h5"
                  gutterBottom>
                  Assigned study programs
                </Typography>

                <Box style={{ marginLeft: 16 }}>
                  <ul>
                    {courseInfo.study_prgrams.map((studyProgram, index) => {
                      return (
                        <li key={index}>
                          <Typography gutterBottom>
                            {studyProgram.name}
                          </Typography>
                        </li>
                      )
                    })}
                  </ul>
                </Box>
              </Grid>

              {/* LSF link */}
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<SchoolIcon />}
                  style={{
                    borderColor: '#FB9B0E',
                    backgroundColor: '#FFFFFF',
                    color: '#FB9B0E',
                  }}
                  onClick={() => window.open(courseInfo.url, '_blank')}>
                  LSF
                </Button>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </>
  )
}

export default CourseDetail
