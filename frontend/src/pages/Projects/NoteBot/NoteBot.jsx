import React, { useState, useEffect } from "react";
import { Grid, Typography, Button, Stack } from "@mui/material";
import { getUserInfo } from "./utils/api.js";
import { useNavigate } from "react-router-dom";

import noteBotLogo from "../../../assets/images/noteBot-logo.png";

export default function NoteBot() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    message: "Server not connected",
    user: {
      uid: "",
      name: "",
      username: "",
    },
  });

 // const history = useHistory(); // Initialize useHistory

  useEffect(() => {
    let elasUser = JSON.parse(sessionStorage.getItem("elas-user"));
    async function getUserInfoFunction(userId) {
      let response = await getUserInfo(userId);
      setUser((prevState) => ({
        ...prevState,
        message: response.message,
        user: {
          uid: response.user.uid,
          name: response.user.name,
          username: response.user.username,
        },
      }));
    }
    getUserInfoFunction(elasUser.id);
  }, []);

  const redirectToNotes = () => {
    navigate("/projects/notebot/mynotes")
  };

  useEffect(() => {
    let elasUser = JSON.parse(sessionStorage.getItem("elas-user"));
    async function getUserInfoFunction(userId) {
      let response = await getUserInfo(userId);
      setUser((prevState) => ({
        ...prevState,
        message: response.message,
        user: {
          uid: response.user.uid,
          name: response.user.name,
          username: response.user.username,
        },
      }));
    }
    getUserInfoFunction(elasUser.id);
  }, []);

  return (
    <Grid container justifyContent="center" sx={{ py: 4, px: 2 }}>
      <Grid container sx={{ maxWidth: 1500, width: "100%" }} spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent={"center"}>
            <Grid
              item
              component="img"
              src={noteBotLogo}
              alt="NoteBot Logo"
              xs={12}
              sm={7}
              md={4}
              sx={{ width: "100%", pb: 2 }}
            />
          </Grid>

          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs>
              <Typography variant="h5" align="center" gutterBottom>
                NoteBot is a learnsourcing application.
              </Typography>

              {user.user.username ? (
                <Typography variant="h5" align="center">
                  Welcome <i>{user.user.name} </i>
                </Typography>
              ) : (
                <Typography variant="h5" align="center">
                  Message from server <i>{user.message} </i>
                </Typography>
              )}

              {/* Include the ContainedButtons component here */}
              <ContainedButtons redirectToNotes={redirectToNotes} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

// Move the ContainedButtons component to the end of the file
export function ContainedButtons({redirectToNotes}) {
  return (
    <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 8 }}>
      <Button variant="contained" onClick={redirectToNotes}>
        Get Started
      </Button>
    </Stack>
  );
}
