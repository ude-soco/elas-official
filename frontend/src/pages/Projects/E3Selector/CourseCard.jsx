import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  CardContent,
  CardActions,
  Card,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import CourseDetails from "./CourseDetails";
import { useSnackbar } from "notistack";

export default function CourseCard({ rows, course, handleAddCourseToList }) {
  const { enqueueSnackbar } = useSnackbar();
  const [showCourseDetails, setShowCourseDetails] = useState(false);

  const handleSelectCourse = (course, operator) => {
    handleAddCourseToList(course, operator);
    if (operator === "add") {
      enqueueSnackbar(`Course is added to your list!`, {
        variant: "success",
      });
    }
  };
  const toggleShowCourseDetails = () => {
    setShowCourseDetails((prevState) => !prevState);
  };

  return (
    <>
      <Card
        sx={{
          width: "100%",
          minHeight: "370px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          "&:hover": {
            boxShadow: 5,
          },
          borderRadius: 2,
          border: "2px solid",
          borderColor: "#A5A5A5",
        }}
        elevation={0}
      >
        <CardContent>
          <Typography variant="body2" gutterBottom>
            {course.catalog ? `${course.catalog} • ` : ""}
            {course.type ? `${course.type} • ` : ""}
            {course.language ? `${course.language}` : ""}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {course.course_name}
          </Typography>
          {course.max_participants.trim() && (
            <Typography variant="body2" gutterBottom>
              #Participants: {course.max_participants}
            </Typography>
          )}
          {course.credits && (
            <Typography variant="body2" gutterBottom>
              Credits: {course.credits}
            </Typography>
          )}
          {course.sws && (
            <Typography variant="body2" gutterBottom>
              SWS: {course.sws}
            </Typography>
          )}
          {course.timetable.length === 1 && (
            <>
              <Grid container alignItems="center">
                <Typography variant="body2" gutterBottom>
                  Time:{" "}
                  <b>
                    {course.timetable !== undefined &&
                    course.timetable.length !== 0 &&
                    course.timetable !== ""
                      ? `${course.timetable[0].day} ${course.timetable[0].start_time} - ${course.timetable[0].end_time}`
                      : ""}
                  </b>
                </Typography>
              </Grid>
            </>
          )}
          {course.timetable.length > 1 && (
            <>
              <Grid container alignItems="center">
                <Typography variant="body2" gutterBottom>
                  Multiple timeslots available
                </Typography>
              </Grid>
            </>
          )}

          {course.location && course.location !== "unknown" && (
            <Typography variant="body2" gutterBottom>
              Location: {course.location}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Grid container justifyContent={"space-between"} sx={{ px: 1 }}>
            <Button onClick={toggleShowCourseDetails} size="small">
              More details
            </Button>
            {!rows.some(
              (row) => row.selectedCourses === course.course_name
            ) && (
              <Button
                variant="contained"
                size="small"
                onClick={() => handleSelectCourse(course, "add")}
              >
                Select
              </Button>
            )}
            {rows.some((row) => row.selectedCourses === course.course_name) && (
              <Button
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => handleSelectCourse(course, "remove")}
              >
                Remove
              </Button>
            )}
          </Grid>
        </CardActions>
      </Card>
      <CourseDetails
        course={course}
        showCourseDetails={showCourseDetails}
        toggleShowCourseDetails={toggleShowCourseDetails}
      />
    </>
  );
}
