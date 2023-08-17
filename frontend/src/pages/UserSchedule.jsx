import { Grid, Typography } from "@mui/material";

const UserSchedule = () => {
  return (
    <>
      <Grid container justifyContent="center" sx={{ p: 4 }}>
        <Grid item sx={{ maxWidth: "1000px", width: "100%" }}>
          <Typography variant="h5" gutterBottom>
            Schedule
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default UserSchedule;
