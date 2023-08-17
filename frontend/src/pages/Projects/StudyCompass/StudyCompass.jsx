import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { parseDate } from "./utils/functions.js";
import CourseList from "./components/CourseList";
import studyCompassLogo from "../../../assets/images/studyCompass-logo.png";
import {
  getLectureUsingStudyProgramId,
  getStudyPrograms,
} from "./utils/api.js";

const StudyCompass = () => {
  const [courseList, setCourseList] = useState([]);
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [selectStudyProgram, setSelectStudyProgram] = useState({ name: "" });
  const [studyProgramView, setStudyProgramsView] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    async function prepareStudyPrograms() {
      let response = await getStudyPrograms();
      setStudyPrograms(response);
    }
    prepareStudyPrograms();
  }, []);

  const handleSearchCourses = async (studyProgramId) => {
    const response = await getLectureUsingStudyProgramId(studyProgramId);
    let newCourseList = prepareCourses(response);
    setCourseList(newCourseList);
    setStudyProgramsView((prevState) => !prevState);
  };

  return (
    <>
      {!studyProgramView ? (
        <>
          <Grid
            container
            direction="column"
            alignItems="center"
            style={{ padding: 70 }}
          >
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              Welcome to
            </Typography>
            <Grid
              item
              xs
              component="img"
              src={studyCompassLogo}
              alt="StudyCompass Logo"
              style={{ height: 150, paddingBottom: 50 }}
            />

            {!studyPrograms ? (
              <>{loading}</>
            ) : (
              <>
                <Grid item style={{ minWidth: 600, paddingBottom: 25 }}>
                  <Autocomplete
                    style={{ backgroundColor: "#FFF" }}
                    options={studyPrograms}
                    value={selectStudyProgram}
                    fullWidth
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Study program"
                        variant="outlined"
                      />
                    )}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, value) => setSelectStudyProgram(value)}
                  />
                </Grid>

                <Grid item style={{ paddingBottom: 40 }}>
                  <Button
                    style={{
                      backgroundColor: !Boolean(selectStudyProgram.name)
                        ? ""
                        : "#FB9B0E",
                      color: "white",
                    }}
                    startIcon={<SearchIcon />}
                    disabled={!Boolean(selectStudyProgram.name)}
                    variant="contained"
                    onClick={() => handleSearchCourses(selectStudyProgram.id)}
                  >
                    Search courses
                  </Button>
                </Grid>

                <Grid item style={{ minWidth: 600, paddingBottom: 16 }}>
                  <Divider orientation="horizontal" />
                </Grid>

                <Grid item>
                  <Typography
                    color="primary"
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => setOpenModal((prevState) => !prevState)}
                  >
                    What is StudyCompass?
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>

          <Dialog
            open={openModal}
            onClose={() => setOpenModal((prevState) => !prevState)}
            fullWidth
            maxWidth="md"
          >
            <DialogContent>
              <Grid container justifyContent="flex-end">
                <IconButton
                  onClick={() => setOpenModal((prevState) => !prevState)}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>

              <Grid
                container
                direction="column"
                alignItems="center"
                style={{ paddingBottom: 32 }}
              >
                <Grid item xs style={{ paddingBottom: 30 }}>
                  <img
                    src={studyCompassLogo}
                    height="60"
                    alt="StudyCompass Logo"
                  />
                </Grid>

                <Grid item xs style={{ paddingBottom: 24 }}>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: "bold" }}
                    gutterBottom
                  >
                    About StudyCompass
                  </Typography>
                  <Typography>
                    This tool helps you in planning of subjects that you can
                    take in one semester. You will get an overview of all the
                    courses offered by your study program in that semester.
                    Afterwards you can select the courses you like and see their
                    comparison based on course rating and time overlapping.
                  </Typography>
                </Grid>

                <Grid container direction="column">
                  <Grid item xs>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: "bold" }}
                      gutterBottom
                    >
                      What does this tool provide?
                    </Typography>
                  </Grid>

                  <Grid item xs style={{ marginLeft: 16 }}>
                    <ul>
                      <li>
                        <Typography>
                          Visual analysis to support decision making on the
                          selection of the courses
                        </Typography>
                      </li>
                      <li>
                        <Typography>Based on course catalog data</Typography>
                      </li>
                      <li>
                        <Typography>
                          Planning courses according to the semesters
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          Students can select the courses and be able to compare
                          them based on various aspects such as recommendation,
                          understandability and so on which are done by those
                          who have already passed the listed course
                        </Typography>
                      </li>
                    </ul>
                  </Grid>
                </Grid>
              </Grid>

              <Divider style={{ marginBottom: 16 }} />

              <Grid
                container
                justifyContent="space-around"
                style={{ marginBottom: 24 }}
              >
                <Typography
                  color="primary"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() =>
                    window.open(
                      "https://www.uni-due.de/en/university.php",
                      "_blank"
                    )
                  }
                >
                  About UDE
                </Typography>
                <Typography
                  color="primary"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() =>
                    window.open(
                      "https://www.uni-due.de/en/study_courses.php",
                      "_blank"
                    )
                  }
                >
                  Study courses
                </Typography>
                <Typography
                  color="primary"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() =>
                    window.open(
                      "https://www.uni-due.de/en/faculties.php",
                      "_blank"
                    )
                  }
                >
                  Faculties of Engineering
                </Typography>
                <Typography
                  color="primary"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() =>
                    window.open(
                      "https://www.uni-due.de/international/index_en.shtml",
                      "_blank"
                    )
                  }
                >
                  International office
                </Typography>
              </Grid>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          <CourseList
            courseList={courseList}
            selectStudyProgram={selectStudyProgram}
            setStudyProgramsView={setStudyProgramsView}
          />
        </>
      )}
    </>
  );
};

export default StudyCompass;

export const loading = (
  <Grid
    container
    direction="column"
    justifyContent="center"
    alignItems="center"
  >
    <Grid item>
      <CircularProgress />
    </Grid>
    <Grid item>
      <Typography variant="overline"> Loading data </Typography>
    </Grid>
  </Grid>
);

export const prepareCourses = (courses) => {
  courses.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

  let newCourseList = [];
  courses.forEach((course) => {
    let newTimetable = [];
    course.timetable.forEach((time) => {
      let timeFrom = time.time.from;
      let timeTo = time.time.to;
      let newDateArray = [];
      time.dates.forEach((date) => {
        let startDate = parseDate(date, timeFrom);
        let endDate = parseDate(date, timeTo);
        newDateArray.push({ startDate, endDate });
      });
      newTimetable.push({
        ...time,
        duration: {
          from: parseDate(time.duration.from, timeFrom),
          to: parseDate(time.duration.to, timeTo),
        },
        time: {
          from: time.time.from.split(" ")[0],
          to: time.time.to.split(" ")[0],
        },
        dates: newDateArray,
      });
    });

    newCourseList.push({
      ...course,
      timetable: newTimetable,
    });
  });
  return newCourseList;
};
