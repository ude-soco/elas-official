import React, { useState, useEffect } from "react";
import { Grid, Typography, Button, Stack, Menu, MenuItem, Paper, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import noteBotLogo from "../../../../assets/images/noteBot-logo.png";

export default function MyNotes() {
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
  const [favoriteNotes, setFavoriteNotes] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [snackbarFavoritesOpen, setSnackbarFavoritesOpen] = useState(false);
  const [snackbarDeleteOpen, setSnackbarDeleteOpen] = useState(false);
  const [savedNotes, setSavedNotes] = useState([]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const addToFavorites = (note) => {
    // Check if the note is already in favorites
    const isNoteInFavorites = favoriteNotes.some((favNote) => favNote.id === note.id);
  
    if (!isNoteInFavorites) {
      // Add the note to favorites
      setFavoriteNotes((prevNotes) => {
        let tempFav = [...prevNotes, note];
        sessionStorage.setItem("notebot-favnotes", JSON.stringify(tempFav));
        return tempFav;
      });
      setSnackbarFavoritesOpen(true);
    } else {
      // Remove the note from favorites if it already exists
      setFavoriteNotes((prevNotes) => {
        let tempFav = prevNotes.filter((n) => n.id !== note.id);
        sessionStorage.setItem("notebot-favnotes", JSON.stringify(tempFav));
        return tempFav;
      });
    }
  };

  useEffect(() => {
    // Fetch saved notes from the backend
    axios.get("/api/saved-notes")
      .then(response => {
        // Sort the fetched notes alphabetically by title
        const sortedNotes = response.data.sort((a, b) => a.title.localeCompare(b.title));
        setSavedNotes(sortedNotes);
      })
      .catch(error => {
        console.error('Error fetching saved notes:', error);
      });
  }, []);
  
  const openDeleteDialog = (note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setNoteToDelete(null);
    setDeleteDialogOpen(false);
  };

  const confirmDelete = () => {
    // Send a request to delete the note from the backend
    axios.delete(`/api/delete-note/${noteToDelete.id}`)
      .then(response => {
        if (response.status === 200) {
          // Remove the deleted note from the savedNotes array
          const updatedNotes = savedNotes.filter(note => note.id !== noteToDelete.id);
          setSavedNotes(updatedNotes);
          
          // Show Snackbar for delete confirmation
          setSnackbarDeleteOpen(true);
        } else {
          // Handle error response from backend
          console.error('Error deleting note:', response.data);
        }
      })
      .catch(error => {
        // Handle fetch error
        console.error('Error deleting note:', error);
      });
  };

  const closeSnackbarFavorites = () => {
    setSnackbarFavoritesOpen(false);
  };

  const closeSnackbarDelete = () => {
    setSnackbarDeleteOpen(false);
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
          </Grid>
          <Grid item sx={{marginTop: 4}}>
            <Typography variant="h5" gutterBottom>
              My Notes
            </Typography>
          </Grid>
          <Grid container spacing={2} sx={{ marginTop: 4 }}>
          {savedNotes.map((note) => (
            <Grid item key={note.id} xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 2, height: "100%", backgroundColor: "#f5f5f5", position: 'relative' }}>
                <Typography variant="h6">{note.title}</Typography>
                <Typography>{note.content}</Typography>
                <IconButton sx={{ position: 'absolute', top: 0, right: 0, color: favoriteNotes.some((favNote) => favNote.id === note.id) ? 'red' : 'gray' }}
                  onClick={() => addToFavorites(note)}>
                  <FavoriteIcon />
                </IconButton>
                <IconButton sx={{ position: 'absolute', bottom: 0, right: 0, color: 'gray' }}
                  onClick={() => openDeleteDialog(note)}>
                  <DeleteIcon />
                </IconButton>
              </Paper>
            </Grid>
          ))}
          </Grid>
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this note?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar for Favorites Confirmation */}
      <Snackbar
      open={snackbarFavoritesOpen}
      autoHideDuration={3000}
      onClose={closeSnackbarFavorites}
      message="Note added to favorites!"/>
      {/* Snackbar for Delete Confirmation */}
      <Snackbar
      open={snackbarDeleteOpen}
      autoHideDuration={3000}
      onClose={closeSnackbarDelete}
      message="Note deleted successfully!"/>
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
      <Button variant="outlined" onClick={redirectToNotes}>
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
  )
}
