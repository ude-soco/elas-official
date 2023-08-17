import React from "react";
import { Grid, Typography } from "@mui/material";

import intogenLogo from "../../../assets/images/intogen-logo.png";

export default function Intogen() {
  return (
    <Grid container justifyContent="center" sx={{ py: 4, px: 2 }}>
      <Grid container sx={{ maxWidth: 1500, width: "100%" }} spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent={"center"}>
            <Grid
              item
              component="img"
              src={intogenLogo}
              alt="Learn Spectrum Logo"
              xs={12}
              sm={7}
              md={4}
              sx={{ width: "100%", pb: 2 }}
            />
          </Grid>

          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs>
              <Typography variant="h5" align="center">
                Learn Spectrum is a web application that allows students to
                identify and improve their learning styles based on David Kolb’s
                learning cycle (Kolb’s 40-item questionnaire), and suggest
                courses according to their preferred learning styles. In
                addition, this application allows students to get an overview of
                the learning styles present in other courses, study programs,
                and countries.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
