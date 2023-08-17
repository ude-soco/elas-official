import React from "react";
import { Grid, Typography } from "@mui/material";

import courseMatchLogo from "../../../assets/images/courseMatch-logo.png";

export default function CourseMatch() {
  return (
    <Grid container justifyContent="center" sx={{ py: 4, px: 2 }}>
      <Grid container sx={{ maxWidth: 1500, width: "100%" }} spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent={"center"}>
            <Grid
              item
              component="img"
              src={courseMatchLogo}
              alt="Study Match Logo"
              xs={12}
              sm={7}
              md={4}
              sx={{ width: "100%", pb: 2 }}
            />
          </Grid>

          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs>
              <Typography variant="h5" align="center">
                Course Match is a web application that allows students to find
                courses and study programs based on their interests and
                preferences.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
