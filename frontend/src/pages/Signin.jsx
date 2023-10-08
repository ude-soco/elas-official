import React, { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate, useLocation } from "react-router-dom";
import { signIn } from "../utils/backend";
import { useSnackbar } from "notistack";

import elasLogo from "../assets/images/elas-logo.png";

const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const prevLocation = location.state?.from || { pathname: "/" };
  const [errorMessageUsername, setErrorMessageUsername] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = React.useState({
    username: "",
    password: "",
  });

  const handleFormFields = (event) => {
    const { name, value } = event.target;
    if (Boolean(errorMessageUsername) && name === "username")
      setErrorMessageUsername("");
    if (Boolean(errorMessagePassword) && name === "password")
      setErrorMessagePassword("");
    setFormFields(() => ({
      ...formFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Boolean(formFields.username)) {
      setErrorMessageUsername("Username required!");
      return;
    }
    if (!Boolean(formFields.password)) {
      setErrorMessagePassword("Password required!");
      return;
    }
    setLoading(true);
    try {
      await signIn(formFields);
      setLoading(false);
      enqueueSnackbar("User logged in successfully!", {
        variant: "success",
        autoHideDuration: 6000,
      });
      window.location.href = prevLocation.pathname;
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err.response.data.error, {
        variant: "error",
        autoHideDuration: 6000,
      });
    }
  };

  return (
    <>
      <Grid container sx={{ py: 2, px: 3 }} justifyContent="space-between">
        <Grid
          item
          component="img"
          sx={{ height: 30, cursor: "pointer" }}
          src={elasLogo}
          alt="Soco logo"
          onClick={() => navigate("/")}
        />
        <Grid item>
          <Grid container alignItems="center">
            <Typography sx={{ px: 2 }}>Don't have an account yet?</Typography>
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Box
        sx={{
          height: "88vh",
          display: "flex",
          pt: 12,
          justifyContent: "center",
        }}
      >
        <Grid container sx={{ px: 2, maxWidth: 500 }} justifyContent="center">
          <Grid item>
            <Grid
              container
              component={Box}
              sx={{
                p: 4,
                borderRadius: 3,
              }}
            >
              <Grid item xs={12} sx={{ pb: 1 }}>
                <Typography variant="h5" align="center" color="grey.700">
                  Sign in to your account
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    margin="normal"
                    fullWidth
                    error={Boolean(errorMessageUsername)}
                    helperText={errorMessageUsername}
                    label="Username"
                    name="username"
                    // autoComplete="email"
                    placeholder="johnsmith"
                    autoFocus
                    onChange={handleFormFields}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    error={Boolean(errorMessagePassword)}
                    helperText={errorMessagePassword}
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={handleFormFields}
                    sx={{ pb: 1 }}
                  />
                  <LoadingButton
                    type="submit"
                    fullWidth
                    loading={loading}
                    variant="contained"
                    sx={{ mt: 1, mb: 2 }}
                  >
                    <span>Sign In</span>
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Signin;
