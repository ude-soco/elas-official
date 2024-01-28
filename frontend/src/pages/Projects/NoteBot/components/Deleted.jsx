import React, { useState, useEffect } from "react";
import { Grid, Typography, Button, Stack, Menu, MenuItem, Paper, TextField } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import noteBotLogo from "../../../../assets/images/noteBot-logo.png";

export default function MyArchive() {
  const navigate = useNavigate();
  const [recentlyDeletedNotes, setRecentlyDeletedNotes] = useState([]);

  useEffect(() => {
    // Fetch recently deleted notes from the backend
    fetchRecentlyDeletedNotes();
  }, []);

  const fetchRecentlyDeletedNotes = () => {
    fetch("/recently-deleted-notes")
      .then(response => response.json())
      .then(data => {
        // Sort the recently deleted notes alphabetically by title
        const sortedNotes = data.sort((a, b) => a.title.localeCompare(b.title));
        setRecentlyDeletedNotes(sortedNotes);
      })
      .catch(error => console.error('Error fetching recently deleted notes:', error));
  };

  const handleRestoreNote = (noteId, noteTitle) => {
    // Implement the logic to restore the note with the given ID and title
    console.log("Restoring note with ID and title:", noteId, noteTitle);
    // Example of sending a request to restore and save the note
    fetch(`/restore-note/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers
      },
      body: JSON.stringify({ title: noteTitle }), // Pass the title to save with the restored note
    })
    .then(response => {
      if (response.ok) {
        console.log("Note restored and saved successfully!");
        // Implement any further actions if needed, such as updating UI or state
      } else {
        console.error("Failed to restore and save note.");
        // Implement error handling if needed
      }
    })
    .catch(error => {
      console.error('Error restoring and saving note:', error);
      // Implement error handling if needed
    });
  };


  const redirectToCourses = () => {
    navigate("/projects/notebot/mycourses");
  };

  const redirectToCreateNote = () => {
    navigate("/projects/notebot/createnote");
  };

  const redirectToNotes = () => {
    navigate("/projects/notebot/mynotes");
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

          <Grid container justifyContent="space-between" spacing={2}>
            <Grid item justifyContent="flex-start">
              <Stack direction="row" justifyContent="flex-start" spacing={2}>
                <NotesButton redirectToNotes={redirectToNotes} />
                <CoursesButton redirectToCourses={redirectToCourses} />
                <Button variant="outlined"
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

          <Grid item sx={{ marginTop: 4 }}>
            <Typography variant="h5" gutterBottom>
              Recently Deleted
            </Typography>
          </Grid>
          {/* Display recently deleted notes */}
          <Grid container spacing={2} sx={{ marginTop: 4 }}>
            {recentlyDeletedNotes.map((note) => (
              <Grid item key={note.id} xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2, height: "100%", backgroundColor: "#f5f5f5" }}>
                  <Typography variant="h6">{note.title}</Typography>
                  <Typography>{note.content}</Typography>
                  {/* Restore Button */}
                  <Button variant="contained" onClick={() => handleRestoreNote(note.id)}>
                    Restore
                  </Button>
                </Paper>
              </Grid>
            ))}
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
      sx={{ width: 200 }}
    />
  );
}

export function NotesButton({ redirectToNotes }) {
  return (
    <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 8 }}>
      <Button variant="contained" onClick={redirectToNotes}>
        My Notes
      </Button>
    </Stack>
  );
}

export function CoursesButton({ redirectToCourses }) {
  return (
    <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 8 }}>
      <Button variant="contained" onClick={redirectToCourses}>
        My Courses
      </Button>
    </Stack>
  );
}

export function CreateButton({ redirectToCreateNote }) {
  return (
    <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 8 }} >
      <Button variant="contained" onClick={redirectToCreateNote}>
        Create Note
      </Button>
    </Stack>
  )
}
