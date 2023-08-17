import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  DialogActions,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { v4 as uuid4 } from "uuid";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";

import CourseList from "./CourseList";
import Filters from "./Filters";
import CourseDetails from "./CourseDetails";
import { getE3Courses } from "./utils/api";
import e3SelectorLogo from "../../../assets/images/e3Selector-logo.png";

export default function E3SelectorNew() {
  const { enqueueSnackbar } = useSnackbar();
  const columns = [
    {
      field: "error",
      headerName: "",
      width: 20,
      renderCell: (params) => {
        if (
          overlappingCourses.some(
            (course) => course.name === params.row.selectedCourses
          )
        ) {
          return (
            <>
              <Tooltip title="Open conflict panel" arrow>
                <IconButton color="error" onClick={toggleShowConflicts}>
                  <WarningIcon />
                </IconButton>
              </Tooltip>
            </>
          );
        }
      },
    },
    {
      field: "Preview",
      headerName: "",
      sortable: false,
      width: 20,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title="View course details" arrow>
          <IconButton
            color="primary"
            onClick={() => toggleShowCourseDetails(params.row.course)}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "selectedCourses",
      headerName: "Selected courses",
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            <Tooltip
              title={params.row.selectedCourses}
              arrow
              placement="bottom-start"
            >
              <Box>{params.row.selectedCourses}</Box>
            </Tooltip>
          </>
        );
      },
    },
    {
      field: "Delete",
      headerName: "",
      sortable: false,
      width: 70,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Tooltip title="Remove course from list" arrow>
          <IconButton
            color="error"
            onClick={() => {
              handleAddCourseToList(params.row.course, "remove");
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const [workloadCredits, setWorkloadCredits] = useState([0, 0]);
  const [catalogs, setCatalogs] = useState([]);
  const [e3Courses, setE3Courses] = useState([{ course_name: "" }]);
  const [events, setEvent] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [searchCourse, setSearchCourse] = useState("");
  const [showCourseDetails, setShowCourseDetails] = useState({
    selected: false,
    course: { course_name: "" },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    weekdays: [],
    events: [],
    catalogs: [],
    languages: [],
    locations: [],
    sws: 10,
    credits: 10,
    startingTimes: [],
  });
  const [overlappingCourses, setOverlappingCourses] = useState([]);
  const [showConflicts, setShowConflicts] = useState(false);

  const handleSearchCourse = (event) => {
    const newSearch = event.target.value;
    setSearchCourse(newSearch);
  };

  const clearSearchCourse = () => {
    setSearchCourse("");
  };

  const handleSortCourses = (order) => {
    setOrder(order);
  };

  const toggleShowCourseDetails = (course = {}) => {
    setShowCourseDetails((prevState) => {
      return {
        selected: !prevState.selected,
        course: course,
      };
    });
  };

  const toggleShowConflicts = () => {
    setShowConflicts((prevState) => !prevState);
  };

  useEffect(() => {
    let elasE3 = JSON.parse(localStorage.getItem("elas-e3"));
    if (elasE3) {
      let tempRows = [];
      let tempWorkloadCredits = [0, 0];
      elasE3.forEach((e3) => {
        tempRows.push(e3);
        if (e3.course.sws) {
          tempWorkloadCredits[0] += parseInt(e3.course.sws);
        }
        if (e3.course.credits) {
          tempWorkloadCredits[1] += parseInt(e3.course.credits);
        }
      });
      setRows(tempRows);
      setWorkloadCredits(tempWorkloadCredits);
      let overlaps = findOverlappingCourses(tempRows);
      setOverlappingCourses(overlaps);
    }
    if (e3Courses.length === 1) {
      function getUnique(data, type) {
        const uniqueSet = new Set(data.map((item) => item[type]));
        const uniqueSetArray = Array.from(uniqueSet);
        uniqueSetArray.sort((a, b) => a.localeCompare(b));
        return uniqueSetArray.map((unique) => {
          return { id: uuid4(), [type]: unique };
        });
      }

      getE3Courses().then((data) => {
        let sortedData = data.sort((a, b) =>
          a.course_name.localeCompare(b.course_name)
        );
        setE3Courses(sortedData);
        setLanguages(getUnique(sortedData, "language"));
        setEvent(getUnique(sortedData, "type"));
        setCatalogs(getUnique(sortedData, "catalog"));
        setLocations(getUnique(sortedData, "location"));
      });
    } else {
      if (order === "asc") {
        const sortedCourses = e3Courses.sort((a, b) =>
          a.course_name.localeCompare(b.course_name)
        );
        setE3Courses(sortedCourses);
      }
      if (order === "desc") {
        const sortedCourses = e3Courses.sort((a, b) =>
          b.course_name.localeCompare(a.course_name)
        );
        setE3Courses(sortedCourses);
      }
    }
  }, [order]);

  const handleAddCourseToList = (course, operator) => {
    if (operator === "add") {
      let tempRows = [...rows];
      tempRows.push({
        id: course.id,
        selectedCourses: course.course_name,
        course: course,
        timetable: course.timetable,
      });
      let tempWorkloadCredits = [...workloadCredits];
      if (course.sws) {
        tempWorkloadCredits[0] += parseInt(course.sws);
      }
      if (course.credits) {
        tempWorkloadCredits[1] += parseInt(course.credits);
      }
      setRows(tempRows);
      setWorkloadCredits(tempWorkloadCredits);
      let overlaps = findOverlappingCourses(tempRows);
      setOverlappingCourses(overlaps);
      if (overlaps.length > overlappingCourses.length) {
        enqueueSnackbar(
          "The course you selected overlaps with another course in your timetable",
          {
            variant: "error",
          }
        );
      }
      localStorage.setItem("elas-e3", JSON.stringify(tempRows));
    } else if (operator === "remove") {
      console.log(course);
      let tempRows = [...rows];
      tempRows = tempRows.filter((row) => row.id !== course.id);
      setRows(tempRows);
      let tempWorkloadCredits = [...workloadCredits];
      if (course.sws) {
        tempWorkloadCredits[0] -= parseInt(course.sws);
      }
      if (course.credits) {
        tempWorkloadCredits[1] -= parseInt(course.credits[0]);
      }
      setWorkloadCredits(tempWorkloadCredits);
      let overlaps = findOverlappingCourses(tempRows);
      setOverlappingCourses(overlaps);
      localStorage.setItem("elas-e3", JSON.stringify(tempRows));
    }
  };

  const findOverlappingCourses = (courses) => {
    const overlapping = (a, b) => {
      const getMinutes = (s) => {
        const p = s.split(":").map(Number);
        return p[0] * 60 + p[1];
      };
      return (
        getMinutes(a.end_time) > getMinutes(b.start_time) &&
        getMinutes(b.end_time) > getMinutes(a.start_time)
      );
    };

    let overlaps = [];
    for (let i = 0; i < courses.length; i++) {
      let isCourseOverlap = false;
      let overlapCourse = {
        name: courses[i].selectedCourses,
        course: courses[i],
        timetable: [],
      };
      for (let j = 0; j < courses[i].timetable.length; j++) {
        for (let k = 0; k < courses.length; k++) {
          if (i !== k) {
            for (let l = 0; l < courses[k].timetable.length; l++) {
              if (
                courses[i].timetable[j].day === courses[k].timetable[l].day &&
                overlapping(courses[i].timetable[j], courses[k].timetable[l])
              ) {
                // Check if the timetable is already in the overlapCourse.timetable array
                if (
                  !overlapCourse.timetable.some(
                    (t) =>
                      t.day === courses[i].timetable[j].day &&
                      t.start_time === courses[i].timetable[j].start_time &&
                      t.end_time === courses[i].timetable[j].end_time
                  )
                ) {
                  overlapCourse.timetable.push(courses[i].timetable[j]);
                  isCourseOverlap = true;
                }
              }
            }
          }
        }
      }
      if (isCourseOverlap) overlaps.push(overlapCourse);
    }
    return overlaps;
  };

  return (
    <>
      <Grid container justifyContent="center" sx={{ py: 4, px: 2 }}>
        <Grid container sx={{ maxWidth: 1500, width: "100%" }} spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent={"center"}>
              <Grid
                item
                component="img"
                src={e3SelectorLogo}
                alt="E3Selector Logo"
                xs={12}
                sm={7}
                md={5}
                sx={{ width: "100%", pb: 2 }}
              />
            </Grid>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12} md={4} lg={3}>
                {/* Work load and credits selected view */}
                <Box
                  sx={{
                    height: 320,
                    width: "100%",
                    border: "2px solid",
                    borderColor: "#A5A5A5",

                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid container justifyContent="center" spacing={2}>
                    <Grid item xs={12} sm={6} md={12}>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="flex-start"
                      >
                        <Grid item xs={6}>
                          <Typography
                            variant="h1"
                            color={
                              overlappingCourses.length > 0
                                ? "error"
                                : "primary"
                            }
                            sx={{ mr: 0.5 }}
                            align="right"
                          >
                            {workloadCredits[0]}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2 }}>
                          <Typography
                            variant="body2"
                            gutterBottom
                            color={
                              overlappingCourses.length > 0
                                ? "error"
                                : "text.secondary"
                            }
                            sx={{ whiteSpace: "pre-line" }}
                          >
                            {`Weekly \n workload`}
                          </Typography>
                          <Typography
                            variant="h5"
                            color={
                              overlappingCourses.length > 0
                                ? "error"
                                : "primary"
                            }
                          >
                            Hours
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} md={12}>
                      <Grid
                        container
                        justifyContent="center"
                        alignItems="flex-end"
                      >
                        <Grid item xs={6}>
                          <Typography
                            variant="h1"
                            align="right"
                            sx={{ mr: 0.5 }}
                            color={
                              overlappingCourses.length > 0
                                ? "error"
                                : "primary"
                            }
                          >
                            {workloadCredits[1]}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mb: 2 }}>
                          <Typography
                            variant="h5"
                            color={
                              overlappingCourses.length > 0
                                ? "error"
                                : "primary"
                            }
                          >
                            Credits
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {/* Selected courses */}
              <Grid item xs={12} md={8} lg={9}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  sx={{
                    height: 320,
                    width: "100%",
                    borderRadius: 2,
                    border: "2px solid",
                    borderColor: "#A5A5A5",
                  }}
                  slots={{
                    noRowsOverlay: () => (
                      <Grid
                        container
                        direction="column"
                        alignItems="center"
                        sx={{ pt: 10 }}
                      >
                        <Grid item>
                          <Typography>No course selected</Typography>
                        </Grid>
                      </Grid>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* TODO: Have a share button that provides a link */}
          {/* <Grid item xs={12}>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<ShareIcon />}
                disabled={rows.length === 0}
              >
                Share
              </Button>
            </Grid>
          </Grid> */}
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Filters
                catalogs={catalogs}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                events={events}
                filters={filters}
                setFilters={setFilters}
                languages={languages}
                locations={locations}
                order={order}
                searchCourse={searchCourse}
                clearSearchCourse={clearSearchCourse}
                handleSearchCourse={handleSearchCourse}
                handleSortCourses={handleSortCourses}
              />
            </Grid>
            <Grid item xs={12}>
              <CourseList
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                e3Courses={e3Courses}
                filters={filters}
                order={order}
                rows={rows}
                searchCourse={searchCourse}
                handleAddCourseToList={handleAddCourseToList}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <CourseDetails
        course={showCourseDetails.course}
        overlappingCourses={overlappingCourses}
        showCourseDetails={showCourseDetails.selected}
        toggleShowCourseDetails={toggleShowCourseDetails}
      />

      <Dialog
        open={showConflicts}
        onClose={toggleShowConflicts}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Conflicts</DialogTitle>
        <DialogContent>
          {overlappingCourses.length === 0 && (
            <Typography color="success">
              Conflicts resolved! You can add the course to your list.
            </Typography>
          )}
          {overlappingCourses.map((course) => (
            <Grid
              container
              sx={{ pb: 1 }}
              key={course.name}
              alignItems="flex-start"
            >
              <Grid item sx={{ mr: 1 }}>
                <Tooltip title="Remove course from list">
                  <IconButton
                    color="error"
                    onClick={() => {
                      handleAddCourseToList(course.course.course, "remove");
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs>
                <Grid item xs={12}>
                  <Typography>{course.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  {course.timetable.map((time, index) => (
                    <Typography
                      variant="body2"
                      gutterBottom
                      key={index}
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      Time:{" "}
                      <b>
                        {time.day} {time.start_time} - {time.end_time}
                      </b>
                    </Typography>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={toggleShowConflicts}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
