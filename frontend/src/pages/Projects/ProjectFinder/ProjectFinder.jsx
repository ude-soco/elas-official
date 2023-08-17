import React from "react";
import { Grid, Typography } from "@mui/material";

import projectFinderLogo from "../../../assets/images/projectFinder-logo.png";

export default function ProjectFinder() {
  return (
    <Grid container justifyContent="center" sx={{ py: 4, px: 2 }}>
      <Grid container sx={{ maxWidth: 1500, width: "100%" }} spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent={"center"}>
            <Grid
              item
              component="img"
              src={projectFinderLogo}
              alt="Project Finder Logo"
              xs={12}
              sm={7}
              md={4}
              sx={{ width: "100%", pb: 2 }}
            />
          </Grid>

          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs>
              <Typography variant="h5" align="center">
                Project Finder is a web application that allows users to find
                projects that are currently being worked on by other users.
                Users can also create their own projects and add other users to
                their projects.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
