import React, { useState, useEffect } from "react";
import { Grid, Typography, Button, Stack } from "@mui/material";
import { getUserInfo } from "./utils/api.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Backend } from "../../../utils/apiConfig.js";

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

  const redirectToNotes = () => {
    navigate("/projects/notebot/mynotes")
  };

  function transformUserObject(elasUser) {
    // Check if elasUser is not null or undefined
    if (!elasUser) {
        console.error("Invalid user object");
        return null;
    }

    // Extracting properties
    const uid = parseInt(elasUser.id.replace(/[^0-9]/g, ''), 10) % 1000; // Extracting numbers from id and limiting to 100,000
    const name = elasUser.first_name;
    const username = elasUser.username;

    // Creating a new object with the desired properties
    const transformedUser = {
        uid: uid,
        name: name,
        username: username
    };

    return transformedUser;
  }
  
  async function transformAndSendPostRequest() {
    let elasUser = JSON.parse(sessionStorage.getItem("elas-user"));
    let transformedUser = transformUserObject(elasUser);

    if (transformedUser) {
        const apiUrl = '/notebot/users/note'; // Adjust the path according to your backend setup

        try {
            const response = await Backend.post(apiUrl, transformedUser);

            // Log or handle the response as needed
            console.log('Success:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.error('Invalid user object. Unable to send POST request.');
    }
  }

  async function sendGetRequest(userId) {
    const apiUrl = `/notebot/users/${userId}`;

    try {
        const response = await Backend.get(apiUrl);
        console.log(Backend);
        console.log(response);
        // Log or handle the response as needed
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
  }

  // let userUidVariable = transformedUser.uid;
  let elasUser = JSON.parse(sessionStorage.getItem("elas-user"));
  let transformedUser = transformUserObject(elasUser);

  console.log(transformedUser);

  transformAndSendPostRequest();

  useEffect(() => {
    let elasUser = JSON.parse(sessionStorage.getItem("elas-user"));
    console.log("ELAS User:", elasUser);
    async function getUserInfoFunction(userId) {
      try {
        let response = await sendGetRequest(userId);
        console.log("API Response:", response);
        if (response && response.user) {
          setUser((prevState) => ({
            ...prevState,
            message: response.message,
            user: {
              uid: response.user.uid || "12345", // Provide a default value if uid is undefined
              name: response.user.name || "test",
              username: response.user.username || "test",
            },
          }));
        } else {
          // Handle the case where response or response.user is undefined
          console.error("Invalid response structure:", response);
        }
      } catch (error) {
        // Handle errors thrown during the API call
        console.error("Error fetching user info:", error);
      }
    }

    getUserInfoFunction(transformedUser.uid);
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

export function ContainedButtons({redirectToNotes}) {
  return (
    <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 8 }}>
      <Button variant="contained" onClick={redirectToNotes}>
        Get Started
      </Button>
    </Stack>
  );
}
