import React, { useState, useEffect } from "react";
import { Grid, Typography, Button, Stack, Menu, MenuItem, Paper, TextField, IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';

import noteBotLogo from "../../../../assets/images/noteBot-logo.png";

export default function MyFavorites({ favoriteNotes }) {
  const navigate = useNavigate();
  
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

  const [favNotes, setfavNotes] = useState([]);

  useEffect(() => {
    // Fetch favorite notes from backend API endpoint
    fetchFavoriteNotes();
  }, []);

  const fetchFavoriteNotes = async () => {
    try {
      // Make a GET request to your backend API endpoint
      const response = await fetch("/note/users:user_id/favorite"); // Update the URL with your actual backend endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch favorite notes");
      }
      const data = await response.json();
      // Sort the favorite notes alphabetically by title
      data.sort((a, b) => a.title.localeCompare(b.title));
      setfavNotes(data);
    } catch (error) {
      console.error("Error fetching favorite notes:", error);
      // Handle error, e.g., show a message to the user
    }
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
          <Grid item sx={{marginTop: 4}}>
            <Typography variant="h5" gutterBottom>
              My Favorite Notes
            </Typography>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: 4 }}>
            {favNotes.map((note) => (
              <Grid item key={note.id} xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2, height: "100%", backgroundColor: "#f5f5f5", position: 'relative' }}>
                  <Typography variant="h6">{note.title}</Typography>
                  <Typography>{note.content}</Typography>
                  <IconButton
                    sx={{ position: 'absolute', top: 0, right: 0, color: 'red' }} >
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton
                    sx={{ position: 'absolute', bottom: 0, right: 0, color: 'gray' }}>
                    <DeleteIcon />
                  </IconButton>
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
      <Button variant="contained" onClick={redirectToCreateNote}>
        Create Note
      </Button>
    </Stack>
  );
}
