import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Launch as LaunchIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import Plot from "react-plotly.js";

export default function CourseDetails({
  course,
  showCourseDetails,
  overlappingCourses = [],
  toggleShowCourseDetails,
}) {
  const [plotData, setPlotData] = useState({
    type: "scatterpolar",
    r: [5, 3, 4.2, 3, 2, 4.6, 3.3],
    theta: [
      "fairness",
      "support",
      "material",
      "fun",
      "comprehensibility",
      "interesting",
      "grade_effort",
    ],
    fill: "toself",
  });

  useEffect(() => {
    function transformRatingToSeriesAndOptions(rating) {
      const values = [];
      const types = [];

      for (const key in rating) {
        values.push(rating[key] * 5);
        types.push(key);
      }

      return { values, types };
    }

    const { values, types } = transformRatingToSeriesAndOptions(course.ratings);
    setPlotData({
      ...plotData,
      r: values,
      theta: types,
    });
  }, [showCourseDetails]);

  return (
    <>
      <Dialog
        // fullScreen
        open={showCourseDetails}
        onClose={toggleShowCourseDetails}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle sx={{ mb: -1 }}>
          <Grid container justifyContent="space-between">
            <Grid item xs>
              <Typography variant="h5" sx={{ pr: 0.5 }}>
                {course.course_name}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={toggleShowCourseDetails} color="primary">
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Grid container>
                <Grid item xs={12}>
                  <Plot
                    data={[plotData]}
                    layout={{
                      autosize: true,
                      title: "Ratings",
                      polar: {
                        radialaxis: {
                          visible: true,
                          range: [0, 5],
                        },
                      },
                    }}
                    useResizeHandler
                    style={{ width: "100%", height: "100%" }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ pb: 2 }}>
                  <Typography variant="body2" align="center">
                    Ratings are based on{" "}
                    <a href="https://www.meinprof.de/" target="_blank">
                      MeinProf.de
                    </a>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="overline">Course Details</Typography>
                  <Grid container spacing={1} sx={{ pb: 1 }}>
                    {course.catalog && (
                      <Grid item xs={6}>
                        <Typography variant="overline">Catalog</Typography>
                        <Typography gutterBottom>{course.catalog}</Typography>
                      </Grid>
                    )}
                    {course.type && (
                      <Grid item xs={6}>
                        <Typography variant="overline">Type</Typography>
                        <Typography gutterBottom>{course.type}</Typography>
                      </Grid>
                    )}
                    {course.sws && (
                      <Grid item xs={6}>
                        <>
                          <Typography variant="overline">SWS</Typography>
                          <Typography gutterBottom>{course.sws}</Typography>
                        </>
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      {course.credits && (
                        <>
                          <Typography variant="overline">Credits</Typography>
                          <Typography gutterBottom>{course.credits}</Typography>
                        </>
                      )}
                    </Grid>
                    {course.timetable && (
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={12}>
                            <Typography variant="overline">
                              Timetable
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container spacing={1}>
                              {course.timetable.map((time, index) => {
                                return (
                                  <Grid item xs={6} sx={{ pb: 1 }} key={index}>
                                    <Grid container alignItems="center">
                                      <Typography
                                        variant="body2"
                                        gutterBottom
                                        sx={{ whiteSpace: "pre-line" }}
                                      >
                                        Time:{" "}
                                        <b>
                                          {time.day} {time.start_time} -{" "}
                                          {time.end_time}
                                        </b>
                                      </Typography>
                                      {/* TODO: Add warning icon */}
                                      {overlappingCourses.map(
                                        (overlapCourse, index) => {
                                          if (
                                            overlapCourse.selectedName ===
                                            course.name
                                          ) {
                                            if (
                                              overlapCourse.timetable.includes(
                                                time
                                              )
                                            ) {
                                              return (
                                                <WarningIcon
                                                  color="error"
                                                  key={index}
                                                />
                                              );
                                            }
                                          }
                                        }
                                      )}
                                    </Grid>

                                    <Typography
                                      variant="body2"
                                      gutterBottom
                                      sx={{ whiteSpace: "pre-line" }}
                                    >
                                      Rhythm: {time.rhythm}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      gutterBottom
                                      sx={{ whiteSpace: "pre-line" }}
                                    >
                                      E-learning: {time.elearn}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      gutterBottom
                                      sx={{ whiteSpace: "pre-line" }}
                                    >
                                      Comments: {time.comment}
                                    </Typography>
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}

                    {course.location && course.location !== "unknown" && (
                      <Grid item xs={6}>
                        <Typography variant="overline">Location</Typography>
                        <Typography gutterBottom>{course.location}</Typography>
                      </Grid>
                    )}
                    {course.language && (
                      <Grid item xs={6}>
                        <Typography variant="overline">Language</Typography>
                        <Typography gutterBottom>{course.language}</Typography>
                      </Grid>
                    )}
                    {course.exam && course.exam !== "unknown" && (
                      <Grid item xs={6}>
                        <Grid container>
                          <Grid item xs={12}>
                            <Typography variant="overline">Exam</Typography>
                          </Grid>
                          <Grid item>
                            <Typography gutterBottom>{course.exam}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    {course.max_participants?.trim() && (
                      <Grid item xs={6}>
                        <Typography variant="overline">
                          #Participants
                        </Typography>
                        <Typography gutterBottom>
                          {course.max_participants}
                        </Typography>
                      </Grid>
                    )}
                    {course.study_programs && (
                      <Grid item xs={6}>
                        <Typography variant="overline">
                          Compatible study programs
                        </Typography>
                        <Typography
                          gutterBottom
                          sx={{ whiteSpace: "pre-line" }}
                        >
                          {course.study_programs === "ALLE"
                            ? "All study programs"
                            : course.study_programs.replace(/;/g, "\n")}
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography variant="overline" gutterBottom>
                            Links
                          </Typography>
                        </Grid>
                        <Button
                          startIcon={<LaunchIcon />}
                          onClick={() => window.open(course.url)}
                          sx={{ mb: 1 }}
                        >
                          LSF
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="overline" gutterBottom>
                    Course Description
                  </Typography>
                  <Typography gutterBottom sx={{ whiteSpace: "pre-line" }}>
                    {course.description}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
