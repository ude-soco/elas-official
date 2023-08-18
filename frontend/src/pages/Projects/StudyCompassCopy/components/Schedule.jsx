import { useEffect, useState } from 'react'
import { EditingState, ViewState } from '@devexpress/dx-react-scheduler'
import {
  AppointmentForm,
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  DayView,
  MonthView,
  Scheduler,
  TodayButton,
  Toolbar,
  ViewSwitcher,
  WeekView,
} from '@devexpress/dx-react-scheduler-material-ui'
import { Grid, Paper } from '@mui/material'

const Schedule = ({ currentSchedule, showCourseDetail }) => {
  useEffect(() => {}, [currentSchedule])
  const Appointment = ({ children, style, ...restProps }) => {
    return (
      <Appointments.Appointment
        {...restProps}
        style={{
          ...style,
          backgroundColor: restProps.data.color,
          borderRadius: '6px',
        }}
        onMouseEnter={() => console.log(restProps.data)}
        onClick={() =>
          showCourseDetail(restProps.data.courseId, restProps.data.passed)
        }>
        {children}
      </Appointments.Appointment>
    )
  }
  let currentDate = Boolean(currentSchedule.length !== 0)
    ? currentSchedule[0].startDate
    : new Date()

  // console.log(`schedule ${currentDate}`)
  return (
    <Grid container spacing={1}>
      {/*<Grid item xs={8}>*/}
      <Paper>
        <Scheduler data={currentSchedule}>
          <ViewState defaultCurrentDate={currentDate} />
          <EditingState />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <WeekView startDayHour={8} endDayHour={20.5} excludedDays={[0, 6]} />
          <DayView startDayHour={8} endDayHour={20.5} />
          <MonthView />
          <ViewSwitcher />
          <Appointments appointmentComponent={Appointment} />
          <AppointmentTooltip showCloseButton showOpenButton />
          <AppointmentForm readOnly />
        </Scheduler>
      </Paper>
    </Grid>
  )
}

export default Schedule

const isOverlapping = (selectedCourses) => {
  const overlapping = (a, b) => {
    let aFrom = new Date(a.startDate)
    let aTo = new Date(a.endDate)
    let bFrom = new Date(b.startDate)
    let bTo = new Date(b.endDate)
    if ((aFrom >= bFrom && aFrom < bTo) || (aTo > bFrom && aTo < bTo)) {
      return true
    }
  }

  let tempSchedule = []
  selectedCourses.forEach((course) => {
    course.timetable[0].dates.forEach((date) => {
      tempSchedule.push({
        id: uuidv4(),
        courseId: course.id,
        timeId: course.timetable[0].id,
        startDate: date.startDate,
        endDate: date.endDate,
        title: course.name,
        color: 'green',
        passed: passed,
      })
    })
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

  const filteredCurrentSchedule = tempSchedule.filter(
    (elem) => !conflicts.find(({ id }) => elem.id === id)
  )

  let newSchedule = [...filteredCurrentSchedule, ...conflicts]

  return { conflicts, newSchedule }
}
