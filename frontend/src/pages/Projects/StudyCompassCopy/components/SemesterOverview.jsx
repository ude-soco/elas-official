import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Grid,
  Paper,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import TodayIcon from "@mui/icons-material/Today";
import { v4 as uuidv4 } from "uuid";

const SemesterOverview = ({
  handleOpenSchedule,
  swsCount,
  selectedCourses,
  setCurrentSchedule,
}) => {
  const [conflicts, setConflicts] = useState([]);
  const [conflictFeedback, setConflictFeedback] = useState(false);
  const [resolveFeedback, setResolveFeedback] = useState(false);

  useEffect(() => {
    if (selectedCourses.length !== 0) {
      let schedule = isOverlapping(selectedCourses);
      if (schedule.conflicts.length !== 0) {
        setConflictFeedback((prevState) => !prevState);
      } else if (schedule.conflicts.length === 0 && conflictFeedback) {
        setConflictFeedback((prevState) => !prevState);
        setResolveFeedback((prevState) => !prevState);
      }
      setConflicts(schedule.conflicts);
      setCurrentSchedule(schedule.newSchedule);
    } else {
      setCurrentSchedule([]);
    }
  }, [selectedCourses]);

  const overlapping = (a, b) => {
    let aFrom = new Date(a.startDate);
    let aTo = new Date(a.endDate);
    let bFrom = new Date(b.startDate);
    let bTo = new Date(b.endDate);
    if ((aFrom >= bFrom && aFrom < bTo) || (aTo > bFrom && aTo < bTo)) {
      return true;
    }
  };

  const isOverlapping = (selectedCourses) => {
    let tempSchedule = [];
    selectedCourses.forEach((course) => {
      course.selectedTime.value.dates.forEach((date) => {
        tempSchedule.push({
          id: uuidv4(),
          courseId: course.id,
          timeId: course.selectedTime.value.id,
          startDate: date.startDate,
          endDate: date.endDate,
          title: course.name,
          color: "green",
        });
      });
    });

    let conflicts = [];
    tempSchedule.forEach((current) => {
      tempSchedule.forEach((validateDate) => {
        if (current.timeId !== validateDate.timeId) {
          if (overlapping(current, validateDate)) {
            if (!conflicts.some((item) => item.id === validateDate.id)) {
              let tempValidateDate = {
                ...validateDate,
                color: "red",
              };
              conflicts.push(tempValidateDate);
            }
          }
        }
      });
    });

    const filteredCurrentSchedule = tempSchedule.filter(
      (elem) => !conflicts.find(({ id }) => elem.id === id)
    );

    let newSchedule = [...filteredCurrentSchedule, ...conflicts];

    return { conflicts, newSchedule };
  };

  return (
    <>
      <Grid item style={{ paddingBottom: 8 }}>
        <Typography variant="h6" color="textSecondary">
          Your semester overview
        </Typography>
      </Grid>

      <Grid item>
        <Paper style={{ padding: 32 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={6} style={{ paddingRight: 32 }}>
              <Grid container alignItems="center" justifyContent="center">
                <Grid item style={{ marginRight: 16 }}>
                  <Typography variant="h1" color="primary">
                    {swsCount}
                  </Typography>
                </Grid>
                <Grid item style={{ width: 24 }}>
                  <Typography
                    color="textSecondary"
                    style={{ fontWeight: "bold" }}
                  >
                    Hours weekly load
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              {conflicts.length === 0 ? (
                <Grid container justifyContent="center" alignItems="center">
                  <Grid item style={{ paddingTop: 4, marginRight: 8 }}>
                    <CheckCircleIcon
                      fontSize="large"
                      style={{ color: "green" }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      style={{ backgroundColor: "#FB9B0E", color: "white" }}
                      startIcon={<TodayIcon />}
                      variant="contained"
                      onClick={handleOpenSchedule}
                    >
                      Calender
                    </Button>
                  </Grid>
                  <Grid item xs={12} style={{ paddingTop: 4 }}>
                    <Typography
                      color="textSecondary"
                      align="center"
                      style={{ fontWeight: "bold" }}
                    >
                      No schedule overlaps
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Grid container justifyContent="center" alignItems="center">
                  <Grid item style={{ paddingTop: 4, marginRight: 8 }}>
                    <WarningIcon fontSize="large" style={{ color: "red" }} />
                  </Grid>
                  <Grid item>
                    <Tooltip
                      arrow
                      title={
                        <Typography>
                          {" "}
                          Click here to fix schedule overlapping!{" "}
                        </Typography>
                      }
                    >
                      <Button
                        style={{ backgroundColor: "red", color: "white" }}
                        startIcon={<TodayIcon />}
                        variant="contained"
                        onClick={handleOpenSchedule}
                      >
                        Calender
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} style={{ paddingTop: 4 }}>
                    <Typography
                      color="textSecondary"
                      align="center"
                      style={{ fontWeight: "bold" }}
                    >
                      Schedule overlapped!
                    </Typography>
                  </Grid>
                </Grid>
                // <Tooltip
                //   arrow
                //   title={
                //     <Typography>
                //       Click here to fix schedule overlapping!
                //     </Typography>
                //   }
                // >
                //   <Card style={{backgroundColor: "#FFDCD4"}}>
                //     <CardActionArea style={{padding: 16}} onClick={handleOpenSchedule}>
                //       <Grid container direction="column" alignItems="center">
                //         <Grid item>
                //           <WarningIcon fontSize="large" style={{color: "red"}}/>
                //         </Grid>
                //         <Grid item xs>
                //           <Grid container alignItems="center">
                //             <Grid item style={{paddingRight: 4}}>
                //               <Typography
                //                 color="textSecondary"
                //                 align="center"
                //                 style={{fontWeight: "bold"}}
                //               >
                //                 Schedule overlapped!
                //               </Typography>
                //             </Grid>
                //           </Grid>
                //         </Grid>
                //       </Grid>
                //     </CardActionArea>
                //   </Card>
                // </Tooltip>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Snackbar
        open={conflictFeedback}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" style={{ backgroundColor: "#FFDCD4" }}>
          Schedule conflicts detected! Check schedule!
        </Alert>
      </Snackbar>

      <Snackbar
        open={resolveFeedback}
        onClose={() => setResolveFeedback((prevState) => !prevState)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert>Conflicts resolved!</Alert>
      </Snackbar>
    </>
  );
};

export default SemesterOverview;
