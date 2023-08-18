import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Grid,
  Typography,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
  FormControl,
  Select,
  Autocomplete,
  RadioGroup,
  Radio,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  RateReview as RateReviewIcon,
  ChangeHistory as ChangeHistoryIcon,
  BorderColor as BorderColorIcon,
} from '@mui/icons-material'
import PropTypes from 'prop-types'
import Schedule from './Projects/StudyCompassCopy/components/Schedule'
import {
  getStudentSemester,
  getStudentSchedule,
  rateCourse,
  changePassState,
  getAvailableCourse,
  enrollCourse,
  unenrollCourse,
} from './Projects/StudyCompassCopy/utils/api'
import {
  prepareCourses,
  isOverlapping,
} from './Projects/StudyCompassCopy/StudyCompassNew'

function TabPanel({ children, value, index }) {
  return (
    <section hidden={value !== index} style={{ maxWidth: '850px' }}>
      {value === index && children}
    </section>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}
const UserSchedule = () => {
  const [currentSchedule, setCurrentSchedule] = useState([])
  const [selectedCourses, setSelectedCourses] = useState([])
  const [studentSemester, setStudentSemester] = useState([])
  const [semester, setSemester] = useState('')
  const [currentSemester, setCurrentsemester] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [rateOpen, setRateOpen] = useState(false)
  const [warningOpen, setWarningOpen] = useState(false)
  const [changPassedOpen, setChangePassedOpen] = useState(false)
  const [addCoursesOpen, setAddCoursesOpen] = useState(false)
  const [passedState, setPassedState] = useState('')
  const [ratings, setRatings] = useState([])
  const [cid, setCid] = useState('')
  const [availableCourses, setAvailaleCourse] = useState([])
  const [selectedAddCourses, SetSelectedAddCourses] = useState([])

  const navigate = useNavigate()

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
            <IconButton color="error">
              <WarningIcon />
            </IconButton>
          </Tooltip>
        ),
    },
    { field: 'name', headerName: 'Selected courses', flex: 1 },
    {
      field: 'passedStatus',
      headerName: '',
      sortable: false,
      width: 100,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.enrollSemester === currentSemester ? (
          <></>
        ) : params.row.passed ? (
          <Typography variant="body2" color="green">
            PASSED
          </Typography>
        ) : (
          <Typography variant="body2" color="error">
            NOT PASSED
          </Typography>
        ),
    },
    {
      field: 'ratedStatus',
      headerName: '',
      sortable: false,
      width: 90,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.rated ? (
          <Typography variant="body2" color="green">
            RATED
          </Typography>
        ) : params.row.passed ? (
          <Typography variant="body2" color="error">
            NOT RATED
          </Typography>
        ) : (
          <></>
        ),
    },
    {
      field: 'Operation',
      headerName: '',
      sortable: false,
      width: 40,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.passed ? (
          <Tooltip title="rate course" arrow>
            <IconButton
              color="primary"
              onClick={() => {
                handleRateOpen(params.row.id)
              }}>
              <RateReviewIcon />
            </IconButton>
          </Tooltip>
        ) : (
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
            onClick={() => showCourseDetail(params.row.id, params.row.passed)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: 'Change passed',
      headerName: '',
      sortable: false,
      width: 40,
      disableColumnMenu: true,
      renderCell: (params) =>
        semester !== currentSemester && (
          <Tooltip title="Change passed state" arrow>
            <IconButton
              color="primary"
              onClick={() => handleWarningOpen(params.row.id)}>
              <BorderColorIcon />
            </IconButton>
          </Tooltip>
        ),
    },
  ]

  const addCourseColumns = [
    { field: 'name', headerName: 'Selected courses', flex: 1 },
    {
      field: 'passed state',
      headerName: '',
      sortable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RadioGroup
          defaultValue="true"
          onChange={(event) => ChoosePassedState(event, params.row.id)}
          row>
          <FormControlLabel value="true" control={<Radio />} label="passed" />
          <FormControlLabel
            value="false"
            control={<Radio />}
            label="not passed"
          />
        </RadioGroup>
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

  const ratingLabels = [
    'Informative',
    'Well-structured',
    'Motivating',
    'Valuable',
    'Practical',
    'Enjoyable',
    'Inspiring',
    'Challenging',
    'Comprehensive',
    'Interesting',
  ]

  async function loadStudentSchedule(semester) {
    let response = await getStudentSchedule(semester)
    let tempSelectedCourses = prepareCourses(response)
    setSelectedCourses(tempSelectedCourses)
    if (tempSelectedCourses.length !== 0) {
      let schedule = isOverlapping(tempSelectedCourses)
      setCurrentSchedule(schedule.newSchedule)
    }
  }

  useEffect(() => {
    async function loadStudentSemester() {
      let response = await getStudentSemester()
      setStudentSemester(response)
      setSemester(response[0])
      setCurrentsemester(response[0])
    }

    if (studentSemester.length == 0) {
      loadStudentSemester()
    }
    loadStudentSchedule(semester)
  }, [semester])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setSemester(event.target.textContent)
    setCurrentSchedule([])
  }
  const showCourseDetail = (id, passed) => {
    const courseState = {
      passed: passed,
    }
    sessionStorage.setItem('elas-sc-course', JSON.stringify(courseState))
    navigate(`../projects/study-compass-copy/detail?id=${id}`)
  }
  const handleRateOpen = (id) => {
    setRateOpen(true)
    setCid(id)
  }
  const handleRateClose = () => {
    setRateOpen(false)
    setRatings([])
    setCid('')
  }

  const handleWarningClose = () => {
    setWarningOpen(false)
  }
  const handleWarningOpen = (id) => {
    setWarningOpen(true)
    setCid(id)
  }
  const handleAddCoursesClose = () => {
    setAddCoursesOpen(false)
    SetSelectedAddCourses([])
  }

  const handleAddCoursesOpen = () => {
    setAddCoursesOpen(true)
    async function loadAvailableCourses() {
      let response = await getAvailableCourse(semester)
      let filteredCourses = response
        .filter(
          (item) => !selectedCourses.some((course) => course.id === item.id)
        )
        .sort((a, b) => a.name.localeCompare(b.name))
      setAvailaleCourse(filteredCourses)
    }
    loadAvailableCourses()
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
        },
      ])
    }
  }
  const handleRemoveAddCourse = (row) => {
    console.log(row)
    SetSelectedAddCourses(
      selectedAddCourses.filter((course) => course.id != row.id)
    )
  }
  const ChoosePassedState = (event, id) => {
    let tempCourse = selectedAddCourses.filter((course) => course.id === id)
    tempCourse[0].passed = event.target.value
  }
  const handleChangePassedOpen = () => {
    setChangePassedOpen(true), setWarningOpen(false)
  }
  const handleChangePassedClose = () => {
    setChangePassedOpen(false)
    setPassedState('')
    setCid('')
  }
  const hanleCheckChange = (checked, value) => {
    if (checked) {
      setRatings((ratings) => [...ratings, value])
    } else {
      setRatings((ratings) => ratings.filter((item) => item != value))
    }
  }
  const handleUnenroll = async (row) => {
    try {
      await unenrollCourse(row.id)
    } catch (err) {
      console.log(err)
    }
    loadStudentSchedule(semester)
  }

  const handleRateCourse = async () => {
    console.log(cid)
    console.log(ratings)
    try {
      await rateCourse(cid, ratings)
    } catch (err) {
      console.log(err)
    }
    handleRateClose()
    loadStudentSchedule(semester)
  }
  const handleSelectChange = (event) => {
    setPassedState(JSON.parse(event.target.value))
  }
  const handlePassedChange = async () => {
    console.log(cid)
    console.log(passedState)
    try {
      await changePassState(cid, passedState)
    } catch (err) {
      console.log(err)
    }
    handleChangePassedClose()
    loadStudentSchedule(semester)
  }
  const handleAddSelectedCourse = () => {
    selectedAddCourses.forEach(async (item) => {
      await enrollCourse(item.id, item.selectedTimeID, item.passed)
      loadStudentSchedule(semester)
    })
    SetSelectedAddCourses([])
    setAddCoursesOpen(false)
  }
  return (
    <>
      <Grid container justifyContent="center" sx={{ p: 4 }}>
        <Grid sx={{ maxWidth: '1000px', width: '100%', display: 'flex' }}>
          {/* rate dialog */}
          <Dialog open={rateOpen} onClose={handleRateClose}>
            <DialogTitle>Rate Course</DialogTitle>
            <DialogContent>
              <DialogContentText>
                What do you think about this course? give us your ratings:
              </DialogContentText>
              <FormGroup row>
                {ratingLabels.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    control={<Checkbox />}
                    label={item}
                    value={item}
                    onChange={(event) =>
                      hanleCheckChange(event.target.checked, event.target.value)
                    }
                  />
                ))}
              </FormGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleRateClose}>Cancel</Button>
              <Button disabled={ratings.length == 0} onClick={handleRateCourse}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          {/* warning dialog */}
          <Dialog open={warningOpen} onClose={() => setWarningOpen(false)}>
            <DialogTitle>Warning!</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Changing the pass state of a course will affect the courses
                recommended to you. Are you sure you want to change it?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setWarningOpen(false)}>Cancel</Button>
              <Button onClick={handleChangePassedOpen}>Confirm</Button>
            </DialogActions>
          </Dialog>
          {/* Change passed dialog */}
          <Dialog open={changPassedOpen} onClose={handleChangePassedClose}>
            <DialogTitle>Choose your passed state</DialogTitle>
            <DialogContent>
              {/* <FormControl fullWidth>
                <Select value={passedState} onChange={handleSelectChange}>
                  <MenuItem value={true}>Passed</MenuItem>
                  <MenuItem value={false}>Not passed</MenuItem>
                </Select>
              </FormControl> */}
              <RadioGroup onChange={handleSelectChange} row>
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="passed"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="not passed"
                />
              </RadioGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleChangePassedClose}>Cancel</Button>
              <Button
                disabled={passedState === ''}
                onClick={handlePassedChange}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          {/* add courses dialog */}
          <Dialog open={addCoursesOpen} onClose={handleAddCoursesClose}>
            <DialogTitle>Add courses to {semester} </DialogTitle>
            <DialogContent sx={{ width: '600px' }}>
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
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAddCoursesClose}>Cancel</Button>
              <Button onClick={handleAddSelectedCourse}>Add courses</Button>
            </DialogActions>
          </Dialog>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            // variant="fullWidth"
            orientation="vertical"
            sx={{ borderRight: 1, borderColor: 'divider', mr: 2 }}>
            {studentSemester.map((item, index) => (
              <Tab key={index} label={item} />
            ))}
          </Tabs>
          {studentSemester.map(
            (item, index) =>
              semester !== '' && (
                <TabPanel value={tabValue} key={index} index={index}>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      {currentSemester != semester && (
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: '#FB9B0E',
                            color: '#FFFFFF',
                            marginBottom: '10px',
                          }}
                          onClick={handleAddCoursesOpen}>
                          ADD COURSES
                        </Button>
                      )}
                    </Grid>
                    <Grid item>
                      <DataGrid
                        style={{ width: '850px' }}
                        rows={selectedCourses}
                        columns={columns}
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
                      {currentSchedule.length !== 0 && (
                        <Schedule
                          currentSchedule={currentSchedule}
                          showCourseDetail={showCourseDetail}
                          // currentDate={currentDate}
                        />
                      )}
                    </Grid>
                  </Grid>
                </TabPanel>
              )
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default UserSchedule
