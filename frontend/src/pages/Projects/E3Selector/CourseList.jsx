import React, { useEffect, useState } from "react";
import { CircularProgress, Grid, Pagination, Typography } from "@mui/material";
import CourseCard from "./CourseCard";

const cardsPerPage = 8;

export default function CourseList({
  currentPage,
  setCurrentPage,
  e3Courses,
  filters,
  order,
  rows,
  searchCourse,
  handleAddCourseToList,
}) {
  // const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedCourses, setDisplayedCourses] = useState([]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (searchCourse !== "") {
      const foundList = e3Courses.filter((course) =>
        course.course_name.toLowerCase().includes(searchCourse.toLowerCase())
      );
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      let filteredCourses = filterCourses(foundList, filters);
      setDisplayedCourses(filteredCourses.slice(0, cardsPerPage));
      setTotalPages(Math.ceil(filteredCourses.length / cardsPerPage));
    } else {
      let filteredCourses = filterCourses(e3Courses, filters);
      setDisplayedCourses(
        filteredCourses.slice(
          (currentPage - 1) * cardsPerPage,
          currentPage * cardsPerPage
        )
      );
      setTotalPages(Math.ceil(filteredCourses.length / cardsPerPage));
    }
  }, [e3Courses[0].course_name, filters, order, searchCourse, currentPage]);

  function filterCourses(courses, filters) {
    return courses.filter((course) => {
      // Filter by weekdays
      let weekdayFilter = true;
      if (filters.weekdays.length !== 0) {
        weekdayFilter = filters.weekdays.some((weekday) => {
          return course.timetable.some((timetableEntry) => {
            return timetableEntry.day === weekday.day;
          });
        });
      }
      // Filter by starting time range
      let startingTimeRange = true;
      if (filters.startingTimes.length !== 0) {
        function courseFallsInTimeRange(course, filters) {
          function timeInRange(
            courseStart,
            courseEnd,
            filterStartTime,
            filterEndTime
          ) {
            const courseStartTime = new Date(`1970-01-01T${courseStart}:00`);
            const courseEndTime = new Date(`1970-01-01T${courseEnd}:00`);
            const startTime = new Date(`1970-01-01T${filterStartTime}:00`);
            const endTime = new Date(`1970-01-01T${filterEndTime}:00`);

            return courseStartTime >= startTime && courseEndTime <= endTime;
          }

          const filterStartTime = filters.startingTimes[0];
          const filterEndTime = filters.startingTimes[1];

          for (const timetableEntry of course.timetable) {
            if (
              timeInRange(
                timetableEntry.start_time,
                timetableEntry.end_time,
                filterStartTime,
                filterEndTime
              )
            ) {
              return true;
            }
          }
          return false;
        }

        startingTimeRange = courseFallsInTimeRange(course, filters);
      }

      // Filter by SWS
      let swsFilter = true;
      if (course.sws !== "") {
        swsFilter = Boolean(filters.sws >= parseInt(course.sws));
      }

      // Filter by Credits
      let creditFilter = true;
      if (course.credits !== "") {
        creditFilter = Boolean(
          filters.credits >= parseInt(parseInt(course.credits))
        );
      }

      // Filter by event types
      let eventTypeFilter = true;
      if (filters.events.length !== 0) {
        eventTypeFilter = filters.events.some(
          (event) => course.type === event.type
        );
      }

      // Filter by catalogs
      let catalogFilter = true;
      if (filters.catalogs.length !== 0) {
        catalogFilter = filters.catalogs.some(
          (catalog) => course.catalog === catalog.catalog
        );
      }

      // Filter by languages
      let languageFilter = true;
      if (filters.languages.length !== 0) {
        languageFilter = filters.languages.some(
          (lang) => course.language === lang.language
        );
      }

      // Filter by locations
      let locationFilter = true;
      if (filters.locations.length !== 0) {
        locationFilter = filters.locations.some(
          (loc) => course.location === loc.location
        );
      }

      // Return true if all filter conditions are met
      return (
        weekdayFilter &&
        eventTypeFilter &&
        catalogFilter &&
        languageFilter &&
        locationFilter &&
        swsFilter &&
        creditFilter &&
        startingTimeRange
      );
    });
  }

  return (
    <>
      {e3Courses.length !== 1 ? (
        displayedCourses.length !== 0 ? (
          <>
            <Grid container spacing={3} sx={{ pt: 4 }}>
              {displayedCourses?.map((course) => (
                <Grid item xs={12} sm={6} lg={3} key={course.id}>
                  <CourseCard
                    rows={rows}
                    course={course}
                    handleAddCourseToList={handleAddCourseToList}
                  />
                </Grid>
              ))}
            </Grid>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              sx={{ mt: 4, display: "flex", justifyContent: "center" }}
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
  );
}
