import { useState, useEffect } from "react";
import {
  Avatar,
  Autocomplete,
  Box,
  Divider,
  Grid,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Download as DownloadIcon } from "@mui/icons-material";
import {
  updateUser,
  getSemesterStudyProgramList,
  scrapeE3Data,
  scrapeLSFData,
  getScrapeTaskStatus,
} from "../utils/backend";
import { useAsyncPolling } from "../pages/hooks/hooks";
import { useSnackbar } from "notistack";
import { isValidEmail, isValidUsername } from "../utils/utilities";

export const ScrapeDataSection = () => {
  const [loadingLSF, setLoadingLSF] = useState(false);
  const [loadingE3, setLoadingE3] = useState(false);
  const [lsfUrl, setLsfUrl] = useState("");
  const [e3Url, setE3Url] = useState("");
  const { execute: executeLSF, status: statusLSF } = useAsyncPolling(
    getScrapeTaskStatus,
    2000,
    false
  );
  const { execute: executeE3, status: statusE3 } = useAsyncPolling(
    getScrapeTaskStatus,
    2000,
    false
  );

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (statusLSF === "success") {
      setLoadingLSF(false);
      showSnackbar("LSF data scraping completed!");
    }
    if (statusLSF === "error") {
      setLoadingLSF(false);
      showErrorSnackbar("LSF data scraping failed!");
    }
  }, [statusLSF]);

  useEffect(() => {
    if (statusE3 === "success") {
      setLoadingE3(false);
      showSnackbar("E3 data scraping completed!");
    }
    if (statusE3 === "error") {
      setLoadingE3(false);
      showErrorSnackbar("E3 data scraping failed!");
    }
  }, [statusE3]);

  const showSnackbar = (message) => {
    enqueueSnackbar(message, {
      variant: "success",
      autoHideDuration: 6000,
    });
  };
  const showErrorSnackbar = (message) => {
    enqueueSnackbar(message, {
      variant: "error",
      autoHideDuration: 6000,
    });
  };

  const handleLsfUrl = (event) => {
    setLsfUrl(event.target.value);
  };

  const handleE3Url = (event) => {
    setE3Url(event.target.value);
  };

  const handleScrapeLSF = async () => {
    setLoadingLSF((prevState) => !prevState);
    const { task_id } = await scrapeLSFData({ url: lsfUrl });
    executeLSF(task_id);
  };

  const handleScrapeE3 = async () => {
    setLoadingE3((prevState) => !prevState);
    const { task_id } = await scrapeE3Data({ url: e3Url });
    executeE3(task_id);
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Scrape data
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <TextField
            margin="normal"
            fullWidth
            label="LSF URL"
            name="lsf"
            size="small"
            onChange={handleLsfUrl}
            disabled={loadingLSF}
          />
        </Grid>
        <Grid item>
          <LoadingButton
            loading={loadingLSF}
            onClick={handleScrapeLSF}
            color="primary"
            variant="contained"
            loadingPosition="start"
            startIcon={<DownloadIcon />}
          >
            {loadingLSF ? "Scraping" : "Fetch data"}
          </LoadingButton>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <TextField
            margin="normal"
            fullWidth
            label="E3 URL"
            name="e3"
            size="small"
            onChange={handleE3Url}
            disabled={loadingE3}
          />
        </Grid>
        <Grid item>
          <LoadingButton
            loading={loadingE3}
            onClick={handleScrapeE3}
            color="primary"
            variant="contained"
            loadingPosition="start"
            startIcon={<DownloadIcon />}
          >
            {loadingE3 ? "Scraping" : "Fetch data"}
          </LoadingButton>
        </Grid>
      </Grid>
    </>
  );
};

export const ProfileSettingsSection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState({
    error: false,
    description: "",
  });
  const [errorMessageFirstname, setErrorMessageFirstname] = useState("");
  const [errorMessageLastname, setErrorMessageLastname] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessageUsername, setErrorMessageUsername] = useState("");
  const [formFields, setFormFields] = useState({
    id: JSON.parse(sessionStorage.getItem("elas-user")).id || "",
    firstname: JSON.parse(sessionStorage.getItem("elas-user")).first_name || "",
    lastname: JSON.parse(sessionStorage.getItem("elas-user")).last_name || "",
    username: JSON.parse(sessionStorage.getItem("elas-user")).username || "",
    email: JSON.parse(sessionStorage.getItem("elas-user")).email || "",
  });
  const { enqueueSnackbar } = useSnackbar();

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

    setFormFields(() => ({
      ...formFields,
      [name]: value,
    }));
  };

  const showSnackbar = (message) => {
    enqueueSnackbar(message, {
      variant: "success",
      autoHideDuration: 6000,
    });
  };

  const selectFile = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
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

    try {
      const updatedData = {
        ...JSON.parse(sessionStorage.getItem("elas-user")),
        first_name: formFields.firstname,
        last_name: formFields.lastname,
        email: formFields.email,
        username: formFields.username,
      };
      await updateUser(updatedData);

      sessionStorage.setItem("elas-user", JSON.stringify(updatedData));
      showSnackbar("Profile updated successfully!");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>
      <Typography sx={{ pb: 3 }}>Student ID: {formFields.id}</Typography>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Avatar sx={{ width: 72, height: 72 }} src={previewImage} />
        </Grid>
        <Grid item>
          <Button variant="outlined" color="primary" onClick={handleUpload}>
            Choose photo
            <input
              id="fileInput"
              hidden
              onChange={selectFile}
              type="file"
              accept="image/*"
            />
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              fullWidth
              error={Boolean(errorMessageFirstname)}
              helperText={errorMessageFirstname}
              label="First name"
              name="firstname"
              value={formFields.firstname}
              onChange={handleFormFields}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="normal"
              fullWidth
              error={Boolean(errorMessageLastname)}
              helperText={errorMessageLastname}
              id="lastname"
              label="Lastname"
              name="lastname"
              value={formFields.lastname}
              onChange={handleFormFields}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Grid container>
          <TextField
            margin="normal"
            error={Boolean(errorMessageUsername)}
            helperText={errorMessageUsername}
            fullWidth
            label="Username"
            name="username"
            autoComplete="username"
            onChange={handleFormFields}
            value={formFields.username}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid container>
          <TextField
            margin="normal"
            error={Boolean(errorMessageEmail)}
            helperText={errorMessageEmail}
            fullWidth
            label="E-mail address"
            name="email"
            autoComplete="email"
            onChange={handleFormFields}
            value={formFields.email}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Button
          variant="contained"
          type="submit"
          color="primary"
          sx={{ mt: 2, mb: 1 }}
        >
          Save changes
        </Button>
      </Box>
    </>
  );
};

export const StudySettingsSection = () => {
  const [semesterList, setSemesterList] = useState([{ name: "" }]);
  const [studyProgramList, setStudyProgramList] = useState([
    { url: "", id: "", name: "" },
  ]);
  const [formFields, setFormFields] = useState({
    id: JSON.parse(sessionStorage.getItem("elas-user")).id || "",
    startSemester:
      JSON.parse(sessionStorage.getItem("elas-user")).start_semester || "",
    studyProgram:
      JSON.parse(sessionStorage.getItem("elas-user")).study_program || "",
  });
  const { enqueueSnackbar } = useSnackbar();

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

  const handleStartSemester = (value) => {
    setFormFields(() => ({
      ...formFields,
      startSemester: value ? value.name : "",
    }));
  };

  const handleStudyProgram = (value) => {
    setFormFields(() => ({
      ...formFields,
      studyProgram: value ? value.name : "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updatedData = {
        ...JSON.parse(sessionStorage.getItem("elas-user")),
        start_semester: formFields.startSemester,
        study_program: formFields.studyProgram,
      };
      await updateUser(updatedData);
      sessionStorage.setItem("elas-user", JSON.stringify(updatedData));

      showSnackbar("Study settings updated successfully!");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Study
      </Typography>
      <Typography gutterBottom>
        Warning: Changing these settings may cause a change in your
        recommendations!
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <Autocomplete
              options={semesterList}
              getOptionLabel={(option) => option.name}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  fullWidth
                  label="Start semester"
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
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              options={studyProgramList}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  fullWidth
                  label="Study program"
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
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, mb: 1 }}
        >
          Save changes
        </Button>
      </Box>
    </>
  );
};

export const PasswordSettingsSection = () => {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Password
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField fullWidth label="Old password" variant="outlined" />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="New password" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Confirm password"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Button variant="contained" color="primary" sx={{ mt: 2, mb: 1 }}>
        Save changes
      </Button>
    </>
  );
};
