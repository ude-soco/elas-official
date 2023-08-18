import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Typography,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Alert,
  Link,
  Stepper,
  StepLabel,
  Step,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Autocomplete,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Tune,
} from '@mui/icons-material'
import PropTypes from 'prop-types'
import { DataGrid } from '@mui/x-data-grid'
import studyCompassLogo from '../../../assets/images/studyCompass-logo.png'
import {
  getCurrentEnrolledCourses,
  getCourses,
  unenrollCourse,
  getStudyPrograms,
  getWholeCoursePath,
  getStudentSemester,
  getAvailableCourse,
  enrollCourse,
  changeUserSetting,
} from './utils/api'
import { parseDate } from './utils/functions'
import CourseListNew from './components/CourseListNew'
import Filters from './components/Filters'
import Schedule from './components/Schedule'
import CoursePath from './components/CoursePath'
import { useSnackbar } from 'notistack'
import { v4 as uuidv4 } from 'uuid'

function TabPanel({ children, value, index }) {
  return (
    <section hidden={value !== index}>{value === index && children}</section>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

export default function StudyCompassNew() {
  const token = sessionStorage.getItem('elas-token')
  const [selectedCourses, setSelectedCourses] = useState([])
  const [currentSchedule, setCurrentSchedule] = useState([])
  const [courses, setCourses] = useState([
    {
      id: 0,
      name: '',
      timetable: [],
      professors: [],
      belonged_studyprograms: [],
      popularity: {
        status: false,
        passed_students: 0,
        passed_percentage: '0%',
      },
      recommendation: { status: false, weight: 0 },
    },
  ])
  const [studyPrograms, setStudyPrograms] = useState([])
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [workload, setWorkload] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [tabValue, setTabValue] = useState(0)
  // filter rule
  const [showedType, setShowedType] = useState('list')
  const [searchCourse, setSearchCourse] = useState('')
  const [events, setEvents] = useState([
    { id: 0, event: 'Vorlesung' },
    { id: 1, event: 'Übung' },
    ,
    { id: 2, event: 'Seminar' },
    { id: 3, event: 'Kolloquium' },
    { id: 4, event: 'Projekt' },
    { id: 5, event: 'Praxisprojekt' },
    { id: 6, event: 'Praktikum' },
    { id: 7, event: 'Einführung' },
  ])
  const [languages, setLanguages] = useState([
    { id: 0, language: 'English' },
    { id: 1, language: 'German' },
    { id: 3, language: 'Multilingual' },
    { id: 4, language: 'Other' },
  ])
  const [hideFilter, setHideFilter] = useState(false)
  const [duration, setDuration] = useState([0 * 60, 100 * 60])
  const [swsValue, setSwsValue] = useState(10)
  const [filters, setFilters] = useState({
    weekdays: [],
    events: [],
    languages: [],
    sws: 10,
    startingTimes: [],
    hidePassed: false,
    duration: [[0 * 60, 100 * 60]],
  })
  const [order, setOrder] = useState(token ? 'default' : 'asc')
  // course path data
  const [lableList, setLableList] = useState([])
  const [sourceList, setSourceList] = useState([])
  const [targetList, setTargetList] = useState([])
  const [valueList, setValueList] = useState([])

  const elasUser = token ? JSON.parse(sessionStorage.getItem('elas-user')) : {}
  const userSetting = elasUser.elas_setting
  const [newUser, setNewUser] = useState(
    userSetting ? userSetting['newUser'] : false
  )
  const [newSemester, setNewSemester] = useState(
    userSetting ? userSetting['newSemester'] : false
  )
  const [studentSemester, setStudentSemester] = useState([])
  const [chosenSemester, setChosensemester] = useState('')
  const [activeStep, setActiveStep] = React.useState(0)
  const [availableCourses, setAvailaleCourse] = useState([])
  const [selectedAddCourses, SetSelectedAddCourses] = useState([])
  const [addedCourseList, setAddedCourseList] = useState([])
  const [saveOpen, setSaveOpen] = useState(false)
  const [saveNotifyOpen, setSaveNotifyOpen] = useState(false)
  const [noCourseNotifyOpen, setNoCourseNotyfiOpen] = useState(false)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const showSnackbar = (message) => {
    enqueueSnackbar(message, {
      variant: message.includes('successfully') ? 'success' : 'error',
      autoHideDuration: 500,
    })
  }

  // datagrid colums
  const columns = [
    { field: 'selectedTime', headerName: 'Time', width: 200 },
    {
      field: 'conflict',
      headerName: '',
      sortable: false,
      width: 40,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.conflicted && (
          <Tooltip title="Schedule overlapped!" arrow>
            <IconButton
              color="error"
              onClick={() => {
                showSchedule(params.row)
              }}>
              <WarningIcon />
            </IconButton>
          </Tooltip>
        ),
    },
    { field: 'name', headerName: 'Selected courses', flex: 1 },
    {
      field: 'Delete',
      headerName: '',
      sortable: false,
      width: 40,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title="Remove course from list" arrow>
          <IconButton
            color="error"
            onClick={() => {
              handleUnenroll(params.row)
            }}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: 'Preview',
      headerName: '',
      sortable: false,
      width: 40,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title="View course details" arrow>
          <IconButton
            color="primary"
            onClick={() => showCourseDetail(params.row.id)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ]
  // add course dialog colums
  const addCourseColumns = [
    { field: 'name', headerName: 'Selected courses', flex: 1 },
    {
      field: 'passed state',
      headerName: '',
      sortable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <FormControl component="fieldset">
          <RadioGroup
            defaultValue={params.row.passed}
            // value={params.row.passed}
            onChange={(event) => ChoosePassedState(event, params.row.id)}
            row>
            <FormControlLabel value="true" control={<Radio />} label="passed" />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="not passed"
            />
          </RadioGroup>
        </FormControl>
      ),
    },
    {
      field: 'delete',
      headerName: '',
      sortable: false,
      width: 40,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title="Remove course" arrow>
          <IconButton
            color="error"
            onClick={() => handleRemoveAddCourse(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  // get filter setting
  let setting = JSON.parse(sessionStorage.getItem('elas-sc-setting'))
  if (setting) {
    setFilters(setting['filters'])
    setOrder(setting['order'])
    setSelectedProgram(setting['selectedProgram'])
    setHideFilter(setting['hideFilter'])
    setDuration(setting['duration'])
    setSwsValue(setting['swsValue'])
    setTabValue(setting['tabValue'])
    setCurrentPage(setting['currentPage'])
    setCurrentSchedule(setting['currentSchedule'])
    sessionStorage.removeItem('elas-sc-setting')
  }
  useEffect(() => {
    if (token) {
      getCurrentEnrolledCourses().then((data) => {
        let tempSelectedCourses = prepareCourses(data)
        setSelectedCourses(tempSelectedCourses)
        let tempWorklaod = 0
        for (let i = 0; i < data.length; i++) {
          tempWorklaod += parseInt(data[i].sws)
        }
        setWorkload(tempWorklaod)

        if (tempSelectedCourses.length !== 0) {
          let schedule = isOverlapping(tempSelectedCourses)
          setCurrentSchedule(schedule.newSchedule)
        }
      })
    } else {
      loadStudyprogram()
    }
    async function loadStudyprogram() {
      let response = await getStudyPrograms()
      setStudyPrograms(response)
    }
    async function loadCourses() {
      let response = await getCourses()
      let newCourseList = prepareCourses(response)
      setCourses(newCourseList)
    }
    async function loadWholeCoursePath() {
      let response = await getWholeCoursePath()
      setLableList(response[0].lableList)
      setSourceList(response[0].sourceList)
      setTargetList(response[0].targetList)
      setValueList(response[0].valueList)
    }
    async function loadStudentSemester() {
      let response = await getStudentSemester()
      let semesters = response.slice(1).reverse()
      setStudentSemester(semesters)
      setChosensemester(semesters[0])
    }
    if (courses.length === 1) {
      loadCourses()
    }
    if (lableList.length === 0) {
      loadWholeCoursePath()
    }
    if (token && newUser) {
      loadStudentSemester()
    }
  }, [workload])

  useEffect(() => {
    async function loadAvailableCourses() {
      let response = await getAvailableCourse(chosenSemester)
      let filteredCourses = response
        .filter(
          (item) => !selectedCourses.some((course) => course.id === item.id)
        )
        .sort((a, b) => a.name.localeCompare(b.name))
      setAvailaleCourse(filteredCourses)
    }
    if (chosenSemester) {
      loadAvailableCourses()
    }
    let addedCourseStorage = JSON.parse(
      sessionStorage.getItem('elas-sc-added-course-list')
    )
    if (addedCourseStorage) {
      SetSelectedAddCourses((pre) =>
        addedCourseStorage.filter((item) => item.semester === chosenSemester)
      )
      setAddedCourseList(addedCourseStorage)
    }
  }, [chosenSemester])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleSearchCourse = (event) => {
    const newSearch = event.target.value
    setSearchCourse(newSearch)
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }

  const clearSearchCourse = () => {
    setSearchCourse('')
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }

  const handleSortCourses = (order) => {
    setOrder(order)
  }

  const handleUnenroll = async (row) => {
    try {
      await unenrollCourse(row.id)
      showSnackbar('Remove course successfully!')
    } catch (err) {
      console.log(err)
      showSnackbar(err)
    }
    let temWorkload = workload - parseInt(row.sws)
    setWorkload(temWorkload)
  }

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
      currentSchedule: currentSchedule,
    }
    sessionStorage.setItem('elas-sc-setting', JSON.stringify(setting))
    navigate(`detail?id=${id}`)
  }
  const showSchedule = () => {
    setTabValue(1)
  }
  const goToLoginPage = () => {
    navigate(`../../sign-in`)
  }

  const handleStepBack = () => {
    // load storage
    // let addedCourseStorage = JSON.parse(
    //   sessionStorage.getItem('elas-sc-added-course-list')
    // )
    let tempChosenSmester =
      studentSemester[studentSemester.indexOf(chosenSemester) - 1]
    setChosensemester((chosenSemester) => tempChosenSmester)
    // if (addedCourseStorage) {
    //   SetSelectedAddCourses((pre) =>
    //     addedCourseStorage.filter((item) => item.semester === tempChosenSmester)
    //   )
    // } else {
    //   setSelectedCourses([])
    // }
    sessionStorage.setItem(
      'elas-sc-added-course-list',
      JSON.stringify(addedCourseList)
    )
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStepNext = () => {
    // load storage
    // let addedCourseStorage = JSON.parse(
    //   sessionStorage.getItem('elas-sc-added-course-list')
    // )
    // console.log('addedCourseStorage', addedCourseStorage)
    // update AddedCourseList
    // setAddedCourseList((preCourses) => {
    //   let filteredPreCourses = preCourses.filter(
    //     (item) => item.semester !== chosenSemester
    //   )
    //   console.log('filteredPreCourses', filteredPreCourses)
    //   let courses = [...new Set([...filteredPreCourses, ...selectedAddCourses])]
    //   console.log('courses', courses)
    //   // let courses = preCourses.concat(selectedAddCourses)
    //   sessionStorage.setItem(
    //     'elas-sc-added-course-list',
    //     JSON.stringify(courses)
    //   )
    //   return courses
    // })
    let tempChosenSemester =
      studentSemester[studentSemester.indexOf(chosenSemester) + 1]
    setChosensemester(tempChosenSemester)
    // load selectedAddedcourses from storage
    // if (addedCourseStorage) {
    //   SetSelectedAddCourses(
    //     addedCourseStorage.filter(
    //       (item) => item.semester === tempChosenSemester
    //     )
    //   )
    // } else {
    //   SetSelectedAddCourses([])
    // }
    sessionStorage.setItem(
      'elas-sc-added-course-list',
      JSON.stringify(addedCourseList)
    )
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    // SetSelectedAddCourses([])
  }
  const handleDoItLater = () => {
    if (addedCourseList.length > 0) {
      setSaveOpen(true)
    } else {
      setNoCourseNotyfiOpen(true)
    }
  }
  const handleSelectAddCourse = (value) => {
    let selectedTimeID = value.timetable[0].id
    if (!selectedAddCourses.some((item) => item.id === value.id)) {
      SetSelectedAddCourses([
        ...selectedAddCourses,
        {
          id: value.id,
          name: value.name,
          passed: 'true',
          selectedTimeID: selectedTimeID,
          semester: chosenSemester,
        },
      ])
      if (!addedCourseList.some((item) => item.id === value.id))
        setAddedCourseList([
          ...addedCourseList,
          {
            id: value.id,
            name: value.name,
            passed: 'true',
            selectedTimeID: selectedTimeID,
            semester: chosenSemester,
          },
        ])
    }
  }
  const handleRemoveAddCourse = (row) => {
    console.log(row)
    SetSelectedAddCourses(
      selectedAddCourses.filter((course) => course.id != row.id)
    )
    setAddedCourseList(addedCourseList.filter((course) => course.id != row.id))
  }
  const ChoosePassedState = (event, id) => {
    let tempSelectedCourse = selectedAddCourses.filter(
      (course) => course.id === id
    )
    tempSelectedCourse[0].passed = event.target.value
    let tempAddedCourse = addedCourseList.filter((course) => course.id === id)
    tempAddedCourse[0].passed = event.target.value
  }
  const handleSubmitAddedCourses = () => {
    console.log(addedCourseList)
    addedCourseList.forEach(async (item) => {
      await enrollCourse(item.id, item.selectedTimeID, item.passed)
    })
    closeAddCoursesDialog()
  }
  const handleSave = () => {
    handleSubmitAddedCourses()
    setSaveNotifyOpen(true)
    closeAddCoursesDialog()
  }

  const closeAddCoursesDialog = async () => {
    setNewUser(false)
    let newUserSetting = { ...userSetting, newUser: false }
    sessionStorage.setItem(
      'elas-user',
      JSON.stringify({
        ...elasUser,
        elas_setting: newUserSetting,
      }),
      await changeUserSetting(newUserSetting)
    )
    sessionStorage.removeItem('elas-sc-added-course-list')
  }
  return (
    <>
      <Grid container justifyContent="center" sx={{ py: 4, px: 2 }}>
        <Grid container sx={{ maxWidth: 1500, width: '100%' }} spacing={2}>
          {/* new user add course */}
          {token && elasUser.start_semester !== elasUser.current_semester && (
            <>
              {/* add courses dialog */}
              <Dialog open={newUser}>
                <DialogTitle>
                  Add course you attended in {chosenSemester}
                </DialogTitle>
                <DialogContent sx={{ width: '600px' }}>
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {studentSemester.map((label, index) => {
                      const stepProps = {}
                      const labelProps = {}
                      return (
                        <Step key={label} {...stepProps}>
                          <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                      )
                    })}
                  </Stepper>
                  <React.Fragment>
                    <Autocomplete
                      style={{ backgroundColor: '#FFF' }}
                      options={availableCourses}
                      fullWidth
                      disableClearable
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Add course"
                          variant="outlined"
                        />
                      )}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, value) => handleSelectAddCourse(value)}
                      sx={{ mt: 1, mb: 1 }}
                    />
                    {/* {selectedAddCourses.length !== 0 && ( */}
                    <DataGrid
                      rows={selectedAddCourses}
                      columns={addCourseColumns}
                      sx={{
                        height: 340,
                        width: '100%',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: '#A5A5A5',
                        mb: 3,
                      }}
                      slots={{
                        noRowsOverlay: () => (
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                            sx={{ pt: 10 }}>
                            <Grid item>
                              <Typography>No course selected</Typography>
                            </Grid>
                          </Grid>
                        ),
                      }}
                    />
                    {/* )} */}
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Button
                        color="inherit"
                        onClick={handleDoItLater}
                        sx={{ mr: 1 }}>
                        Do it later
                      </Button>
                      <Box sx={{ flex: '1 1 auto' }} />

                      <Button
                        onClick={handleStepBack}
                        color="inherit"
                        sx={{ mr: 1 }}
                        disabled={activeStep === 0}>
                        previous
                      </Button>

                      {/* <Button onClick={handleStepNext} variant="contained"> */}
                      {activeStep === studentSemester.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleSubmitAddedCourses}>
                          Finish{' '}
                        </Button>
                      ) : (
                        <Button onClick={handleStepNext} variant="contained">
                          Next{' '}
                        </Button>
                      )}
                      {/* // </Button> */}
                    </Box>
                  </React.Fragment>
                </DialogContent>
                {/* <DialogActions>
              <Button onClick={handleRateClose}>Cancel</Button>
              <Button disabled={ratings.length == 0} onClick={handleRateCourse}>
                Submit
              </Button>
            </DialogActions> */}
              </Dialog>
              {/* confirm save dialog */}
              <Dialog open={saveOpen}>
                <DialogTitle>Confirm save</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Do you want to save courses you already selected?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setSaveOpen(false)}>Back</Button>
                  <Button
                    onClick={() => {
                      setSaveOpen(false), setNoCourseNotyfiOpen(true)
                    }}>
                    No,thanks
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                </DialogActions>
              </Dialog>
              {/* save notifycation dialog */}
              <Dialog open={saveNotifyOpen}>
                <DialogTitle>Notification</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    You can continue to add courses in the user schedule page,
                    this will help us to improve recommendations tailored for
                    your preferences!
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setSaveNotifyOpen(false), setSaveOpen(false)
                    }}>
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
              {/* no selected course notification dialog */}
              <Dialog open={noCourseNotifyOpen}>
                <DialogTitle>Attention</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    StudyCompass will not be able to provide recommendations due
                    to the absence of data regarding your past attended courses.
                    You can continue to add courses in the your <b>Schedule</b>{' '}
                    page, this will help us to provide recommendations tailored
                    for your preferences!
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setNoCourseNotyfiOpen(false)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      setNoCourseNotyfiOpen(false), closeAddCoursesDialog()
                    }}>
                    I confirm
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
          <Grid item xs={12}>
            {/* LOGO */}
            <Grid container justifyContent={'center'}>
              <Grid
                item
                component="img"
                src={studyCompassLogo}
                alt="studyCompass Logo"
                xs={12}
                sm={7}
                md={5}
                sx={{ width: '100%', pb: 3 }}
              />
            </Grid>
            {/* course plan */}
            <Grid container justifyContent="center" spacing={2}>
              {/* Work load */}
              <Grid item xs={12} sm={3}>
                <Box
                  sx={{
                    height: 340,
                    // maxWidth: 400,
                    width: '100%',
                    border: '2px solid',
                    borderColor: '#A5A5A5',

                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Grid container justifyContent="center" spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h5" align="center">
                        Weekly Workload
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h1" align="center" color="primary">
                        {workload}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {/* Selected courses */}
              <Grid item xs={12} sm={9}>
                <DataGrid
                  rows={selectedCourses}
                  columns={columns}
                  sx={{
                    height: 340,
                    width: '100%',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: '#A5A5A5',
                  }}
                  slots={{
                    noRowsOverlay: () => (
                      <Grid
                        container
                        direction="column"
                        alignItems="center"
                        sx={{ pt: 10 }}>
                        <Grid item>
                          {!token && (
                            <Typography>
                              You need to sign in to add courses. Click{' '}
                              <Link
                                onClick={goToLoginPage}
                                sx={{ cursor: 'pointer' }}>
                                here
                              </Link>{' '}
                              to sign in.
                            </Typography>
                          )}
                          {token && <Typography>No course selected</Typography>}
                        </Grid>
                      </Grid>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tab label="Course list" />
              <Tab label="Schedule" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <Grid item xs={12}>
                <Filters
                  searchCourse={searchCourse}
                  clearSearchCourse={clearSearchCourse}
                  handleSearchCourse={handleSearchCourse}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  filters={filters}
                  setFilters={setFilters}
                  events={events}
                  languages={languages}
                  order={order}
                  handleSortCourses={handleSortCourses}
                  showedType={showedType}
                  setShowedType={setShowedType}
                  studyPrograms={studyPrograms}
                  selectedProgram={selectedProgram}
                  setSelectedProgram={setSelectedProgram}
                  hideFilter={hideFilter}
                  setHideFilter={setHideFilter}
                  duration={duration}
                  setDuration={setDuration}
                  swsValue={swsValue}
                  setSwsValue={setSwsValue}
                />
              </Grid>
              {showedType === 'list' && (
                <Grid item xs={12}>
                  <CourseListNew
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    searchCourse={searchCourse}
                    courses={courses}
                    workload={workload}
                    setWorkload={setWorkload}
                    filters={filters}
                    order={order}
                    selectedCourses={selectedCourses}
                    setSelectedCourses={setSelectedCourses}
                    currentSchedule={currentSchedule}
                    setCurrentSchedule={setCurrentSchedule}
                    selectedProgram={selectedProgram}
                    tabValue={tabValue}
                    hideFilter={hideFilter}
                    duration={duration}
                    swsValue={swsValue}
                  />
                </Grid>
              )}
              {showedType === 'path' && (
                <Grid item xs={12}>
                  <Typography
                    variant="h5"
                    display="flex"
                    justifyContent="center">
                    course path show how students taken courses
                  </Typography>

                  <CoursePath
                    lableList={lableList}
                    sourceList={sourceList}
                    targetList={targetList}
                    valueList={valueList}
                    width={1200}
                    height={800}
                  />
                </Grid>
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Typography component="div" align="center" gutterBottom>
                <Schedule
                  currentSchedule={currentSchedule}
                  showCourseDetail={showCourseDetail}
                />
              </Typography>
            </TabPanel>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export const prepareCourses = (courses) => {
  let newCourseList = []
  courses.forEach((course) => {
    let time = []
    course.timetable.forEach((timetable) => {
      course.selectedTimeID?.forEach((id) => {
        if (timetable.id == id) {
          time.push(
            `${timetable.day} ${timetable.time.from}-${timetable.time.to}`
          )
        }
      })
    })
    let newTimetable = []
    course.timetable.forEach((time) => {
      let timeFrom = time.time.from
      let timeTo = time.time.to
      let newDateArray = []
      time.dates.forEach((date) => {
        let startDate = parseDate(date, timeFrom)
        let endDate = parseDate(date, timeTo)
        newDateArray.push({ startDate, endDate })
      })
      newTimetable.push({
        ...time,
        duration: {
          from: parseDate(time.duration.from, timeFrom),
          to: parseDate(time.duration.to, timeTo),
        },
        time: {
          from: time.time.from.split(' ')[0],
          to: time.time.to.split(' ')[0],
        },
        dates: newDateArray,
      })
    })

    newCourseList.push({
      ...course,
      selectedTime: time,
      timetable: newTimetable,
    })
  })
  return newCourseList
}
export const isOverlapping = (selectedCourses) => {
  const overlapping = (a, b) => {
    let aFrom = new Date(a.startDate)
    let aTo = new Date(a.endDate)
    let bFrom = new Date(b.startDate)
    let bTo = new Date(b.endDate)
    if ((aFrom >= bFrom && aFrom < bTo) || (aTo > bFrom && aTo <= bTo)) {
      return true
    }
  }
  let tempSchedule = []
  selectedCourses.forEach((course) => {
    let selectedTimeslot = course.timetable.filter((timetable) =>
      course.selectedTimeID.includes(timetable.id)
    )
    selectedTimeslot.forEach((timeslot) =>
      timeslot.dates.forEach((date) => {
        tempSchedule.push({
          id: uuidv4(),
          courseId: course.id,
          timeId: course.timetable[0].id,
          startDate: date.startDate,
          endDate: date.endDate,
          title: course.name,
          passed: course.passed,
          color: 'green',
        })
      })
    )
    // course.timetable[0].dates.forEach((date) => {
    //   tempSchedule.push({
    //     id: uuidv4(),
    //     courseId: course.id,
    //     timeId: course.timetable[0].id,
    //     startDate: date.startDate,
    //     endDate: date.endDate,
    //     title: course.name,
    //     passed: course.passed,
    //     color: 'green',
    //   })
    // })
  })

  let conflicts = []
  tempSchedule.forEach((current) => {
    tempSchedule.forEach((validateDate) => {
      if (current.timeId !== validateDate.timeId) {
        if (overlapping(current, validateDate)) {
          if (!conflicts.some((item) => item.id === validateDate.id)) {
            let tempValidateDate = {
              ...validateDate,
              color: 'red',
            }
            conflicts.push(tempValidateDate)
          }
        }
      }
    })
  })

  conflicts.forEach((conflict) => {
    selectedCourses.forEach((course) => {
      if (course.id === conflict.courseId) {
        course['conflicted'] = true
      }
    })
  })

  const filteredCurrentSchedule = tempSchedule.filter(
    (elem) => !conflicts.find(({ id }) => elem.id === id)
  )

  let newSchedule = [...filteredCurrentSchedule, ...conflicts]

  return { conflicts, newSchedule }
}
