import React, { useState, useEffect, useMemo } from 'react'
import CourseCard from './CourseCard'
import { Grid, Pagination, Typography, CircularProgress } from '@mui/material'

const cardsPerPage = 8

const CourseListNew = ({
  courses,
  workload,
  setWorkload,
  currentPage,
  setCurrentPage,
  searchCourse,
  filters,
  order,
  selectedCourses,
  setSelectedCourses,
  currentSchedule,
  setCurrentSchedule,
  selectedProgram,
  tabValue,
  hideFilter,
  duration,
  swsValue,
}) => {
  const [totalPages, setTotalPages] = useState(1)
  const [displayedCourses, setDisplayedCourses] = useState([])
  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }
  const sortByRecommended = (courses) => {
    let recommendedCourses = courses.filter(
      (course) => course.recommendation.status === true
    )
    let sortedrecommendations = recommendedCourses.sort(
      (a, b) => b.recommendation.weight - a.recommendation.weight
    )
    let popularCourse = courses
      .filter(
        (course) =>
          !recommendedCourses.includes(course) &&
          course.popularity.status === true
      )
      .sort(
        (a, b) => b.popularity.passed_students - a.popularity.passed_students
      )
    let remainingCourse = courses
      .filter(
        (course) =>
          !recommendedCourses.includes(course) &&
          !popularCourse.includes(course)
      )
      .sort((a, b) => a.name.localeCompare(b.name))
    let newCourses = [
      ...sortedrecommendations,
      ...popularCourse,
      ...remainingCourse,
    ]
    return newCourses
  }

  useEffect(() => {
    if (order == 'asc') {
      courses.sort((a, b) => a.name.localeCompare(b.name))
    }
    if (order == 'desc') {
      courses.sort((a, b) => b.name.localeCompare(a.name))
    }
    if (order == 'default') {
      courses = sortByRecommended(courses)
    }

    if (selectedProgram) {
      courses = courses.filter((course) =>
        course.belonged_studyprograms.includes(selectedProgram.name)
      )
    }
    if (searchCourse !== '') {
      const foundList = courses.filter((course) =>
        course.name.toLowerCase().includes(searchCourse.toLowerCase())
      )
      let filteredCourses = filterCourses(foundList, filters)
      setDisplayedCourses(filteredCourses.slice(currentPage - 1, cardsPerPage))
      setTotalPages(Math.ceil(filteredCourses.length / cardsPerPage))
    } else {
      let filteredCourses = filterCourses(courses, filters)
      setDisplayedCourses(
        filteredCourses.slice(
          (currentPage - 1) * cardsPerPage,
          currentPage * cardsPerPage
        )
      )
      setTotalPages(Math.ceil(filteredCourses.length / cardsPerPage))
    }
  }, [
    searchCourse,
    currentPage,
    courses[0].name,
    filters,
    order,
    selectedProgram,
  ])
  function filterCourses(courses, filters) {
    return courses.filter((course) => {
      // Filter by weekdays
      let weekdayFilter = true
      if (filters.weekdays.length !== 0) {
        weekdayFilter = filters.weekdays.some((weekday) => {
          return course.timetable.some((timetableEntry) => {
            return timetableEntry.day === `${weekday.day}.`
          })
        })
      }
      // Filter by starting time range
      let startingTimeRange = true
      if (filters.startingTimes.length !== 0) {
        function courseFallsInTimeRange(course, filters) {
          function timeInRange(
            courseStart,
            courseEnd,
            filterStartTime,
            filterEndTime
          ) {
            const courseStartTime = new Date(`1970-01-01T${courseStart}:00`)
            const courseEndTime = new Date(`1970-01-01T${courseEnd}:00`)
            const startTime = new Date(`1970-01-01T${filterStartTime}:00`)
            const endTime = new Date(`1970-01-01T${filterEndTime}:00`)

            return courseStartTime >= startTime && courseEndTime <= endTime
          }

          const filterStartTime = filters.startingTimes[0]
          const filterEndTime = filters.startingTimes[1]

          for (const timetableEntry of course.timetable) {
            if (
              timeInRange(
                timetableEntry.time.from,
                timetableEntry.time.to,
                filterStartTime,
                filterEndTime
              )
            ) {
              return true
            }
          }
          return false
        }

        startingTimeRange = courseFallsInTimeRange(course, filters)
      }
      // Filter by SWS
      let swsFilter = true
      if (course.sws !== '') {
        swsFilter = Boolean(filters.sws >= parseInt(course.sws))
      }
      // Filter by event types
      let eventTypeFilter = true
      if (filters.events.length !== 0) {
        eventTypeFilter = filters.events.some((event) =>
          course.subject_type?.includes(event.event)
        )
      }
      // Filter by languages
      let languageFilter = true
      if (filters.languages.length !== 0) {
        languageFilter = filters.languages.some((lang) => {
          switch (course.language) {
            case 'Englisch':
              if (lang.language === 'English') {
                return true
              }
              break
            case 'Deutsch':
              if (lang.language === 'German') {
                return true
              }
              break
            case 'mehrsprachig':
              if (lang.language === 'Multilingual') {
                return true
              }
              break
            default:
              if (lang.language === 'Other') {
                return true
              }
          }
        })
      }
      // Filter by passed state
      let hidePassedFilter = true
      if ('passed' in course) {
        if (filters.hidePassed) {
          hidePassedFilter = !course.passed ? true : false
        }
      }

      // Return true if all filter conditions are met
      return (
        weekdayFilter &&
        eventTypeFilter &&
        languageFilter &&
        swsFilter &&
        startingTimeRange &&
        hidePassedFilter
      )
    })
  }
  return (
    <>
      {courses.length !== 1 ? (
        displayedCourses.length !== 0 ? (
          <>
            <Grid container spacing={3} sx={{ pt: 4 }}>
              {displayedCourses.map((course) => (
                <Grid item xs={12} sm={6} lg={3} key={course.id}>
                  <CourseCard
                    course={course}
                    workload={workload}
                    setWorkload={setWorkload}
                    selectedCourses={selectedCourses}
                    filters={filters}
                    order={order}
                    selectedProgram={selectedProgram}
                    tabValue={tabValue}
                    currentPage={currentPage}
                    hideFilter={hideFilter}
                    duration={duration}
                    swsValue={swsValue}
                  />
                </Grid>
              ))}
            </Grid>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
            />
          </>
        ) : (
          <Grid container direction="column" alignItems="center" sx={{ my: 5 }}>
            <Grid item>
              <Typography variant="h5" sx={{ mt: 2 }}>
                No courses found! Try changing your filters.
              </Typography>
            </Grid>
          </Grid>
        )
      ) : (
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <CircularProgress sx={{ mt: 4 }} size={60} />
          </Grid>
          <Grid item>
            <Typography variant="overline" sx={{ mt: 2 }}>
              Loading courses
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default CourseListNew
