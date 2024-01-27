import React, { useState } from 'react';
import { Grid, Typography, Button, Stack, Menu, MenuItem, Paper, TextField } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChatIcon from '@mui/icons-material/Chat';
import Chat from "./Chat";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import noteBotLogo from "../../../../assets/images/noteBot-logo.png";

export default function TextEditor() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

  const redirectToCourses = () => {
    navigate("/projects/notebot/mycourses")
  };
  
  const redirectToCreateNote = () => {
    navigate("/projects/notebot/createnote")
  }

  const redirectToNotes = () => {
    navigate("/projects/notebot/mynotes")
  };

  const redirectToMyFavorites = () => {
    navigate("/projects/notebot/myfavorites");
  };

  const redirectToDeleted = () => {
    navigate("/projects/notebot/deleted");
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSaveNote = () => {
    axios.post('/api/saveNote', { title, content })
      .then(response => {
        console.log(response.data);
        // Handle success (e.g., show a success message)
      })
      .catch(error => {
        console.error(error);
        // Handle error (e.g., show an error message)
      });
  };

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
                  sx={{ width: "100%", pb: 2 }}/>
              </Grid>
              <Grid container justifyContent="space-between" spacing={2}>
              <Grid item justifyContent="flex-start">
                  <Stack direction="row" justifyContent="flex-start" spacing={2}>
                  <NotesButton redirectToNotes={redirectToNotes} />
                  <CoursesButton redirectToCourses={redirectToCourses} /> 
                   <Button variant="contained"
                   endIcon={<KeyboardArrowDownIcon />}
                   onClick={handleMenuClick}>
                    Archive
                    </Button>
                    <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}>
                    <MenuItem onClick={redirectToMyFavorites}>Favorite Notes</MenuItem>
                    <MenuItem onClick={redirectToDeleted}>Recently Deleted</MenuItem>
                  </Menu>
                  <CreateButton redirectToCreateNote={redirectToCreateNote} />
                  </Stack>
                </Grid>
                <Grid item justifyContent="flex-end" spacing={2}>
                    {/* Search Bar Component */}
                    <SearchBar />
                  </Grid>
              </Grid>
              <Grid item sx={{marginTop: 4}}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h5" gutterBottom>
                  Create Note
                </Typography>
                <Button variant="contained" onClick={handleSaveNote}>
                  Save Note
                </Button>
              </Stack>
              </Grid>
              <Grid item sx={{ marginTop: 4 }}>
                <Grid item sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    placeholder="Enter Note Title"
                    value={title}
                    onChange={handleTitleChange}/>
                </Grid>
                <Grid item sx={{ width: "100%", marginTop: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={10}
                    maxRows={20}
                    placeholder="Enter Note Content"
                    value={content}
                    onChange={handleContentChange}/>
                </Grid>
              </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

function SearchBar() {
    return (
      <TextField
        variant="standard"
        placeholder="Search..."
        sx={{ width: 200 }} // Adjust the width based on your design
      />
    );
  }
  
  export function NotesButton({redirectToNotes}) {
    return (
      <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 8 }}>
        <Button variant="contained" onClick={redirectToNotes}>
          My Notes
        </Button>
      </Stack>
    );
  }
  
  export function CoursesButton({redirectToCourses}) {
    return (
      <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 8 }}>
        <Button variant="contained" onClick={redirectToCourses}>
          My Courses
        </Button>
      </Stack>
    );
  }
  
  export function CreateButton({redirectToCreateNote}) {
    return (
      <Stack direction="row" justifyContent="center" spacing={2} sx={{mt: 8}} >
        <Button variant="outlined" onClick={redirectToCreateNote}>
          Create Note
        </Button>
      </Stack>
    )
  }
  