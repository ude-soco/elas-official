import { useEffect, useState } from 'react'
import SemesterOverview from './SemesterOverview'
import Course from './CourseDetails/Course'
import Schedule from './Schedule'
import Filters from './Filters/Filters'
import { validateLanguage, validateSubjectType } from './utils/functions'
import Header from './Header'
import { prepareCourses } from '../StudyCompass'
import {
  Button,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CreateIcon from '@mui/icons-material/Create'
import FilterListIcon from '@mui/icons-material/FilterList'
import { Collapse } from '@mui/material'
import studyCompassLogo from '../../../../assets/images/studyCompass-logo.png'
import { getLectureUsingStudyProgramId } from '../utils/api'

const CourseList = ({
  courseList,
  selectStudyProgram,
  setStudyProgramsView,
}) => {
  const [state, setState] = useState({
    courses: [],
    swsCount: 0,
    selectedCourses: [],
  })
  const [open, setOpen] = useState({
    schedule: false,
    filters: false,
  })
  const [filterSelections, setFilterSelections] = useState({
    filteredSchedule: [],
    courseType: [],
    sws: [],
    language: [],
  })
  const [searchCourse, setSearchCourse] = useState('')
  const [currentSchedule, setCurrentSchedule] = useState([])
  const [resolveConflict, setResolveConflict] = useState('')

  console.log(currentSchedule)
  useEffect(() => {
    if (state.courses.length === 0) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      setState({
        ...state,
        courses: courseList,
      })
    }
  }, [])

  const handleResolvedConflict = (courseId) => {
    setResolveConflict(courseId)
  }

  const handleUpdateSelectedCourses = (courseId, updates) => {
    let tempSelectedCourses = [...state.selectedCourses]
    let courseIndex = tempSelectedCourses.findIndex(
      (item) => item.id === courseId
    )
    tempSelectedCourses[courseIndex].selectedTime = updates
    setState({ ...state, selectedCourses: tempSelectedCourses })
  }

  const handleSortCourses = (sortedCourses) => {
    setState({ ...state, courses: sortedCourses })
  }

  const handleSortSelectedCourses = (sortedCourses) => {
    setState({ ...state, selectedCourses: sortedCourses })
  }

  const handleSearchCourse = (event) => {
    setSearchCourse(event.target.value)
  }

  const handleSelectCourse = (course) => {
    let tempSelected = [...state.selectedCourses]
    tempSelected.push(course)

    let tempCourses = [...state.courses]
    let courseIndex = state.courses.findIndex((key) => key.id === course.id)
    tempCourses.splice(courseIndex, 1)

    setState({
      ...state,
      swsCount: Boolean(parseInt(course.sws))
        ? state.swsCount + parseInt(course.sws)
        : state.swsCount,
      selectedCourses: tempSelected,
      courses: tempCourses,
    })
  }

  const handleDeselectCourse = (course) => {
    let selectedIndex = state.selectedCourses.findIndex(
      (key) => key.id === course.id
    )
    let tempSelected = [...state.selectedCourses]
    let tempCourses = [...state.courses]

    tempSelected.splice(selectedIndex, 1)
    tempCourses.push(course)
    tempCourses.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

    setState({
      ...state,
      swsCount: Boolean(parseInt(course.sws))
        ? state.swsCount - parseInt(course.sws)
        : state.swsCount,
      selectedCourses: tempSelected,
      courses: tempCourses,
    })
  }

  const handleApplyFilters = async (event, filterData) => {
    setOpen({ ...open, filters: open.filters ? false : event.currentTarget })
    setFilterSelections(filterData)
    let tempCourses = await prefilterCourses(
      selectStudyProgram.id,
      state.selectedCourses,
      filterData
    )
    setState({ ...state, courses: tempCourses })
  }

  const prefilterCourses = async (studyProgramId, selectedCourses, filter) => {
    const courses = await getLectureUsingStudyProgramId(studyProgramId)

    let tempCourseLang = []

    if (filter.language.length !== 0) {
      filter.language.forEach((lang) => {
        let filterLang = courses.filter((item) => {
          let valLang = validateLanguage(item.language)
          return valLang === lang.name
        })
        tempCourseLang = [...tempCourseLang, ...filterLang]
      })
    } else {
      tempCourseLang = [...courses]
    }

    let tempCourseType = []

    if (filter.courseType.length !== 0) {
      filter.courseType.forEach((type) => {
        let filterType = tempCourseLang.filter((item) => {
          let valType = validateSubjectType(item.subject_type)
          return valType === type.name
        })
        tempCourseType = [...tempCourseType, ...filterType]
      })
    } else {
      tempCourseType = [...tempCourseLang]
    }

    const filteredSWS = tempCourseType.filter((item) => {
      return item.sws >= filter.sws[0] && item.sws <= filter.sws[1]
    })
    let tempCourseSWS = [...filteredSWS]

    let tempSchedule = []

    if (filter.filteredSchedule.length !== 0) {
      filter.filteredSchedule.forEach((schedule) => {
        let day = schedule.day
        let from = schedule.time.from
        tempCourseSWS.forEach((course) => {
          course.timetable.forEach((timetable) => {
            if (timetable.day === day && timetable.time.from === from) {
              tempSchedule.push(course)
            }
          })
        })
      })
      let uniqueSchedule = [...new Set(tempSchedule.map((item) => item))]
      tempSchedule = [...uniqueSchedule]
    } else {
      tempSchedule = [...tempCourseSWS]
    }

    let results = tempSchedule.filter(
      (item) => !selectedCourses.find(({ id }) => item.id === id)
    )

    return prepareCourses(results)
  }

  const handleOpenSchedule = () => {
    setOpen({ ...open, schedule: !open.schedule })
  }

  return (
    <>
      <Grid container style={{ padding: 40 }}>
        <Grid item xs style={{ paddingBottom: 30 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <img src={studyCompassLogo} height="50" alt="StudyCompass Logo" />
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Left side*/}
          <Grid item xs={4}>
            <Grid container>
              <Grid item xs={12} style={{ paddingBottom: 24 }}>
                <SemesterOverview
                  handleOpenSchedule={handleOpenSchedule}
                  swsCount={state.swsCount}
                  selectedCourses={state.selectedCourses}
                  setCurrentSchedule={setCurrentSchedule}
                />
              </Grid>

              <Grid item xs={12} style={{ paddingBottom: 8 }}>
                <Typography variant="h6" color="textSecondary">
                  Your selected courses
                </Typography>
              </Grid>

              <Header
                courses={state.selectedCourses}
                handleSortCourses={handleSortSelectedCourses}
              />

              <Grid item xs={12}>
                {state.selectedCourses?.map((course) => {
                  return (
                    <Course
                      key={course.id}
                      handleUpdateSelectedCourses={handleUpdateSelectedCourses}
                      selected={true}
                      course={course}
                      resolveConflict={resolveConflict}
                      handleResolvedConflict={handleResolvedConflict}
                      handleCourse={handleDeselectCourse}
                    />
                  )
                })}
              </Grid>
            </Grid>
          </Grid>

          {/* Right side*/}
          <Grid item xs={8}>
            {open.schedule ? (
              <>
                <Grid
                  container
                  justifyContent="space-between"
                  style={{ paddingBottom: 24 }}>
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="flex-end">
                      <Grid item>
                        <Typography style={{ color: '#6D6D6D' }} align="right">
                          Study program: <b>{selectStudyProgram.name}</b>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Tooltip
                          title={<Typography>Change study program</Typography>}
                          arrow>
                          <IconButton
                            onClick={() => setStudyProgramsView(false)}>
                            <CreateIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: '#FB9B0E', color: 'white' }}
                      startIcon={<CloseIcon />}
                      onClick={handleOpenSchedule}>
                      Close
                    </Button>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="flex-end">
                      <Grid item>
                        <Typography style={{ color: '#6D6D6D' }} align="right">
                          Study program: <b>{selectStudyProgram.name}</b>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Tooltip
                          title={<Typography>Change study program</Typography>}
                          arrow>
                          <IconButton
                            onClick={() => setStudyProgramsView(false)}>
                            <CreateIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item>
                    <Grid container>
                      <Button
                        style={{ marginRight: 16 }}
                        startIcon={<FilterListIcon />}
                        disabled={open.filters}
                        onClick={() =>
                          setOpen({ ...open, filters: !open.filters })
                        }>
                        Filters
                      </Button>

                      <TextField
                        label="Search for courses"
                        variant="outlined"
                        size="small"
                        value={searchCourse}
                        style={{ backgroundColor: '#FFF' }}
                        onChange={handleSearchCourse}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}

            {/* Filters */}
            <Grid item xs={12} style={{ paddingBottom: 24 }}>
              <Collapse in={open.filters}>
                <Filters
                  courses={courseList}
                  applyFilters={handleApplyFilters}
                />
              </Collapse>
            </Grid>

            {/* Schedule component */}
            {open.schedule ? (
              <Schedule
                handleResolvedConflict={handleResolvedConflict}
                currentSchedule={currentSchedule}
              />
            ) : (
              <>
                <Header
                  courses={state.courses}
                  handleSortCourses={handleSortCourses}
                />

                {state.courses?.map((course) => {
                  if (course.name.toLowerCase().includes(searchCourse)) {
                    return (
                      <Course
                        key={course.id}
                        course={course}
                        handleCourse={handleSelectCourse}
                      />
                    )
                  } else return <></>
                })}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default CourseList
