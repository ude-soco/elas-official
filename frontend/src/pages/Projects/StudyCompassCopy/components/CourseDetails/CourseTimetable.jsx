import React, { useMemo, useState } from "react";
import {
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { createScheduleData } from "../Filters/Timetable";

const CourseTimetable = ({
  selectedTime,
  addRemoveSchedule,
  timetable,
  handleSelectedTime,
}) => {
  const theme = useTheme();
  const rows = useMemo(() => createScheduleData(), []);
  const [state, setState] = useState();

  const days = ["Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];

  const validate = (timetable, rowDay) => {
    return timetable.filter(
      (item) =>
        item.day === rowDay.day &&
        (item.time.from === rowDay.time.from || item.time.to === rowDay.time.to)
    );
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          {selectedTime.time ? (
            <>
              <Grid
                container
                sx={{ pb: 3 }}
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>Time: </span>{" "}
                    {selectedTime.time}
                  </Typography>
                </Grid>
                <Grid item>{addRemoveSchedule}</Grid>
              </Grid>
            </>
          ) : (
            <></>
          )}

          {selectedTime.room ? (
            <>
              <Typography
                style={{ paddingBottom: selectedTime.elearn ? 8 : 16 }}
              >
                <span style={{ fontWeight: "bold" }}>Room: </span>{" "}
                {selectedTime.room}
              </Typography>
            </>
          ) : (
            <></>
          )}

          {selectedTime.elearn ? (
            <>
              <Typography style={{ paddingBottom: 16 }}>
                <span style={{ fontWeight: "bold" }}>Event type: </span>{" "}
                {selectedTime.elearn}
              </Typography>
            </>
          ) : (
            <></>
          )}
        </Grid>

        {selectedTime.time ? (
          <>
            <Grid item xs={12}>
              <TableContainer component={Paper} elevation={0}>
                <Table padding="none" size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ borderBottom: "none" }}></TableCell>
                      {days.map((day, index) => {
                        return (
                          <TableCell
                            key={index}
                            align="center"
                            style={{ borderBottom: "none", fontWeight: "bold" }}
                          >
                            {day}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows?.map((row, index_row) => {
                      return (
                        <>
                          <TableRow key={index_row}>
                            {Object.keys(row).map((key, index_table) => {
                              if (index_table === 1) {
                                return (
                                  <TableCell
                                    key={index_table}
                                    component="th"
                                    scope="row"
                                    align="center"
                                    style={{
                                      borderBottom: "none",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {row[key]}
                                  </TableCell>
                                );
                              } else if (index_table >= 1)
                                return (
                                  <TableCell
                                    key={index_table}
                                    align="center"
                                    style={{ borderBottom: "none" }}
                                  >
                                    <Tooltip
                                      arrow
                                      title={
                                        Boolean(
                                          validate(timetable, row[key]).length
                                        )
                                          ? state
                                            ? state
                                            : ""
                                          : undefined
                                      }
                                    >
                                      <Checkbox
                                        disabled={
                                          !Boolean(
                                            validate(timetable, row[key]).length
                                          )
                                        }
                                        onMouseEnter={() => {
                                          let temp = validate(
                                            timetable,
                                            row[key]
                                          );
                                          // console.log(temp);
                                          setState(timetableTooltip(temp));
                                        }}
                                        checked={Boolean(
                                          validate(timetable, row[key]).length
                                        )}
                                        onClick={() => {
                                          let temp = validate(
                                            timetable,
                                            row[key]
                                          );
                                          handleSelectedTime(temp);
                                        }}
                                        checkedIcon={
                                          <span
                                            style={{
                                              borderRadius: 3,
                                              width: 24,
                                              height: 24,
                                              backgroundColor:
                                                theme.palette.primary.main,
                                              "hover ~ &": {
                                                backgroundColor:
                                                  theme.palette.primary.light,
                                              },
                                              outline: Boolean(
                                                validate(timetable, row[key])
                                                  .length
                                              )
                                                ? selectedTime.value.id ===
                                                  validate(
                                                    timetable,
                                                    row[key]
                                                  )[0].id
                                                  ? "4px solid #F39617"
                                                  : ""
                                                : "",
                                            }}
                                          />
                                        }
                                        icon={
                                          <span
                                            style={{
                                              borderRadius: 3,
                                              width: 24,
                                              height: 24,
                                              boxShadow:
                                                "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
                                              backgroundColor: "#f5f8fa",
                                              "hover ~ &": {
                                                backgroundColor: "#ebf1f5",
                                              },
                                              "disabled ~ &": {
                                                boxShadow: "none",
                                                background:
                                                  "rgba(206,217,224,.5)",
                                              },
                                            }}
                                          />
                                        }
                                      />
                                    </Tooltip>
                                  </TableCell>
                                );
                            })}
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
};

export default CourseTimetable;

const timetableTooltip = (timetable) => {
  const tempTime = timetable[0];
  return (
    <>
      <Grid container direction="column">
        <Grid item>
          <Typography>
            <span style={{ fontWeight: "bold" }}>Day:</span> {tempTime.day}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            <span style={{ fontWeight: "bold" }}>Time: </span>
            {tempTime.time.from} - {timetable[0].time.to}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            <span style={{ fontWeight: "bold" }}>Room:</span> {tempTime.room}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>
            <span style={{ fontWeight: "bold" }}>Event type: </span>
            {tempTime.elearn}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};
