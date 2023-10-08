import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate } from "react-router-dom";
import { signUp, getSemesterStudyProgramList } from "../utils/backend";
import { useSnackbar } from "notistack";

import elasLogo from "../assets/images/elas-logo.png";
import { isValidEmail, isValidUsername } from "../utils/utilities";

const Signup = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState({
    error: false,
    description: "",
  });
  const [error, setError] = useState("");
  const [errorMessageFirstname, setErrorMessageFirstname] = useState("");
  const [errorMessageLastname, setErrorMessageLastname] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessageUsername, setErrorMessageUsername] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [semesterList, setSemesterList] = useState([{ name: "" }]);
  const [studyProgramList, setStudyProgramList] = useState([
    {
      url: "",
      id: "",
      name: "",
    },
  ]);
  const [formFields, setFormFields] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    startSemester: "",
    studyProgram: "",
  });

  useEffect(() => {
    getSemesterStudyProgramList().then((message) => {
      setSemesterList(message.semesterData.reverse());
      setStudyProgramList(
        message.studyProgramsData.sort((a, b) => a.name.localeCompare(b.name))
      );
    });
  }, []);

  const showSnackbar = (message) => {
    enqueueSnackbar(message, {
      variant: "success",
      autoHideDuration: 6000,
    });
  };

  const handleStudyProgram = (value) => {
    setFormFields(() => ({
      ...formFields,
      studyProgram: value ? value.name : "",
    }));
  };

  const handleStartSemester = (value) => {
    setFormFields(() => ({
      ...formFields,
      startSemester: value ? value.name : "",
    }));
  };

  const handleFormFields = (event) => {
    if (Boolean(message)) setMessage({ error: false, description: "" });
    const { name, value } = event.target;
    if (Boolean(errorMessageFirstname) && name === "firstname")
      setErrorMessageFirstname("");
    if (Boolean(errorMessageLastname) && name === "lastname")
      setErrorMessageLastname("");
    if (Boolean(errorMessageUsername) && name === "username")
      setErrorMessageUsername("");
    if (Boolean(errorMessageEmail) && name === "email")
      setErrorMessageEmail("");
    if (Boolean(errorMessagePassword) && name === "password")
      setErrorMessagePassword("");
    setFormFields(() => ({
      ...formFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Boolean(formFields.firstname)) {
      setErrorMessageFirstname("Firstname required!");
      return;
    }
    if (!Boolean(formFields.lastname)) {
      setErrorMessageLastname("Lastname required!");
      return;
    }
    if (!Boolean(formFields.username)) {
      setErrorMessageEmail("Username required!");
      return;
    }
    const notValidUsername = isValidUsername(formFields.username);
    if (notValidUsername) {
      setErrorMessageUsername(notValidUsername);
      return;
    }
    if (!Boolean(formFields.email)) {
      setErrorMessageEmail("Email required!");
      return;
    }
    const validEmail = isValidEmail(formFields.email);
    if (!validEmail) {
      setErrorMessageEmail("Email is not valid!");
      return;
    }
    if (!Boolean(formFields.password)) {
      setErrorMessagePassword("Password required!");
      return;
    }

    setLoading(true);
    try {
      const request = {
        first_name: formFields.firstname,
        last_name: formFields.lastname,
        email: formFields.email,
        username: formFields.username,
        password: formFields.password,
        study_program: formFields.studyProgram,
        start_semester: formFields.startSemester,
      };
      if (formFields.studyProgram === "") delete request.study_program;
      if (formFields.startSemester === "") delete request.start_semester;
      await signUp(request);
      showSnackbar("Registration successfully!");
      setTimeout(() => {
        setLoading(false);
        navigate("/sign-in");
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(err);
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
            <Typography sx={{ px: 2 }}>Already have an account?</Typography>
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={() => navigate("/sign-in")}
            >
              Sign In
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
                  Sign up to create an account
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        error={Boolean(errorMessageFirstname)}
                        helperText={errorMessageFirstname}
                        label="*First name"
                        name="firstname"
                        autoComplete="firstname"
                        autoFocus
                        onChange={handleFormFields}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        error={Boolean(errorMessageLastname)}
                        helperText={errorMessageLastname}
                        id="lastname"
                        label="*Lastname"
                        name="lastname"
                        autoComplete="lastname"
                        onChange={handleFormFields}
                      />
                    </Grid>
                  </Grid>

                  <Autocomplete
                    disablePortal
                    options={studyProgramList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        fullWidth
                        label="What's your study program?"
                        name="study_program"
                      />
                    )}
                    getOptionDisabled={(option) => option.name}
                    onChange={(event, value) => handleStudyProgram(value)}
                    value={
                      studyProgramList.find(
                        (option) => option.name === formFields.studyProgram
                      ) || null
                    }
                  />

                  <Autocomplete
                    options={semesterList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        fullWidth
                        label="When did you start your semester?"
                        name="start_semester"
                      />
                    )}
                    getOptionDisabled={(option) => option.name}
                    onChange={(event, value) => handleStartSemester(value)}
                    value={
                      semesterList.find(
                        (option) => option.name === formFields.startSemester
                      ) || null
                    }
                  />

                  <TextField
                    margin="normal"
                    error={Boolean(errorMessageEmail)}
                    helperText={errorMessageEmail}
                    fullWidth
                    label="*E-mail address"
                    name="email"
                    autoComplete="email"
                    onChange={handleFormFields}
                  />
                  <TextField
                    margin="normal"
                    error={Boolean(errorMessageUsername)}
                    helperText={errorMessageUsername}
                    fullWidth
                    label="*Username"
                    name="username"
                    onChange={handleFormFields}
                  />
                  <TextField
                    margin="normal"
                    error={Boolean(errorMessagePassword)}
                    helperText={errorMessagePassword}
                    fullWidth
                    name="password"
                    label="*Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={handleFormFields}
                  />

                  <Grid container sx={{ py: 1 }}>
                    <Typography color="error" variant="body2">
                      {error}
                    </Typography>
                    <LoadingButton
                      type="submit"
                      fullWidth
                      loading={loading}
                      variant="contained"
                      sx={{ mt: 1, mb: 2 }}
                    >
                      <span>Create Account</span>
                    </LoadingButton>
                  </Grid>
                  <Grid container>
                    <Typography variant="body2" align="center">
                      We respect your privacy. Please read{" "}
                      <Link
                        onClick={() => navigate("/privacy")}
                        sx={{ cursor: "pointer" }}
                      >
                        here
                      </Link>{" "}
                      to learn more about our Privacy Policy.
                    </Typography>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Signup;
