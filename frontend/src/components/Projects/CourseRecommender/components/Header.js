import React, { useState } from "react";
import { Grid, IconButton, Paper, Typography } from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

const Header = ({type}) => {
  return (
    <>
      <Grid item xs={12} style={{ paddingBottom: 12 }}>
        <Paper style={{ padding: "16px 8px 16px 4px" }} elevation={0}>
          <Grid container alignItems="center">
            <Grid item xs={4} style={{paddingLeft: '1rem'}}>
              <Typography
                color="textSecondary"
                variant="body2"
                style={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                Relevance Score
              </Typography>
            </Grid>
            {/* <Grid item xs={1}>
              <Typography
                color="textSecondary"
                variant="body2"
                style={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                SWS
              </Typography>
            </Grid> */}

            <Grid item xs={4} style={{textAlign: 'center'}}>
              <Grid container alignItems="center">
                {/* <Grid item>
                  <IconButton
                    size="small"
                    style={{
                      transform: state.courseTitle ? "rotate(180deg)" : "",
                    }}
                    onClick={() => handleDirectionCourseTitle(courses)}
                  >
                    <ArrowDownwardIcon />
                  </IconButton>
                </Grid> */}
                <Grid item xs>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                    style={{ fontWeight: "bold", textTransform: "uppercase" }}
                  >
                    Title
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={4} style={{paddingRight: '1rem', textAlign: 'right'}}>
              <Typography
                color="textSecondary"
                variant="body2"
                style={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                More Detail
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};

export default Header;
