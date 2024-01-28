import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, Stack, Menu, MenuItem, Paper, TextField, Toolbar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import DeleteIcon from '@mui/icons-material/Delete';
//import ChatIcon from '@mui/icons-material/Chat';
import Chat from "./Chat";
import noteBotLogo from "../../../../assets/images/noteBot-logo.png";
import Chatbot from "../assets/Chatbot.png"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TextEditor() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState(12);
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openNewCourseDialog, setOpenNewCourseDialog] = useState(false);
    const [courseTitle, setCourseTitle] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] = useState(false);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        // Fetch courses from backend when component mounts
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            // Replace 'your-backend-api-endpoint' with your actual backend API endpoint
            const response = await axios.get('your-backend-api-endpoint');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSaveNote = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteConfirmation = () => {
      setOpenDeleteConfirmationDialog(true);
    };

    const handleConfirmDeleteNote = () => {
      // Add logic to delete the note from the backend
      console.log("Note deleted");
      setOpenDeleteConfirmationDialog(false); // Close the confirmation dialog after deletion
    };

    const handleCloseDeleteConfirmation = () => {
      setOpenDeleteConfirmationDialog(false);
    };


    const handleExistingCourse = () => {
        setOpenDialog(true);
    };

    const handleCreateCourse = () => {
        setOpenNewCourseDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenNewCourseDialog(false);
    };

    const handleCourseTitleChange = (e) => {
        setCourseTitle(e.target.value);
    };

    const handleSaveCourse = async () => {
        try {
            // Replace 'your-backend-api-endpoint' with your actual backend API endpoint
            const response = await axios.post('your-backend-api-endpoint', { title: courseTitle });
            // Assuming the response contains the newly created course details
            const newCourse = response.data;
            
            // Save the note with the new course title and note title
            const noteData = {
                course: newCourse.title, // Use the newly created course title
                noteTitle: title, // Use the note title
                content: content // Use the note content
            };
            // Replace 'your-backend-api-endpoint' with your actual backend API endpoint for saving notes
            await axios.post('your-backend-api-notes-endpoint', noteData);
            
            setCourses([...courses, newCourse]); // Update the list of courses with the newly created course
            setCourseTitle(''); // Clear the course title field
        } catch (error) {
            console.error('Error creating course:', error);
        } finally {
            setOpenNewCourseDialog(false); // Close the dialog after saving the course
        }
    };

    const handleCancelCourse = () => {
        setCourseTitle('');
        setOpenNewCourseDialog(false);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const toggleChat = () => {
        setShowChat(!showChat);
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
                    <Grid item sx={{ marginTop: 4 }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h5" gutterBottom>
                                Create Note
                            </Typography>
                            <Grid item>
                            <Button variant="contained" sx={{marginRight: 2}} onClick={handleSaveNote}>
                                Save Note
                            </Button>
                            <IconButton onClick={handleDeleteConfirmation}>
                              <DeleteIcon />
                            </IconButton>
                            </Grid>
                            {/*Dialog for Delete confirmation*/}
                            <Dialog open={openDeleteConfirmationDialog} onClose={handleCloseDeleteConfirmation}>
                              <DialogTitle>Delete Note</DialogTitle>
                              <DialogContent>
                                <Typography variant="body1">Are you sure you want to delete this note?</Typography>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={handleCloseDeleteConfirmation}>Cancel</Button>
                                <Button onClick={handleConfirmDeleteNote} variant="contained" autoFocus>
                                  Confirm
                                </Button>
                              </DialogActions>
                            </Dialog>
                            {/*Dialog for Adding note to new or existing course*/}
                            <Dialog open={open} onClose={handleClose}>
                                <DialogTitle>Add Note to Course</DialogTitle>
                                <DialogContent>
                                    <Button variant="contained" sx={{ marginRight: 2 }} onClick={handleExistingCourse}>Add to Existing Course</Button>
                                    <Button variant="contained" onClick={handleCreateCourse}>Create New Course</Button>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose}>Cancel</Button>
                                </DialogActions>
                            </Dialog>
                            {/*Dialog for chosing course from library*/}
                            <Dialog open={openDialog} onClose={handleCloseDialog}>
                                <DialogTitle>Select Course</DialogTitle>
                                <DialogContent>
                                    {loading ? (
                                        <CircularProgress />
                                    ) : (
                                        <FormControl fullWidth>
                                            <Select
                                                value={courseTitle}
                                                onChange={handleCourseTitleChange}>
                                                {courses.map((course) => (
                                                    <MenuItem key={course.id} value={course.title}>
                                                        {course.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog}>Cancel</Button>
                                    <Button onClick={handleSaveCourse} variant="contained" autoFocus>
                                        Save To Course
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            {/*Dialog for creating a new course*/}
                            <Dialog open={openNewCourseDialog} onClose={handleCloseDialog}>
                                <DialogTitle>Create New Course</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        fullWidth
                                        label="Course Title"
                                        value={courseTitle}
                                        onChange={handleCourseTitleChange} />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCancelCourse}>Cancel</Button>
                                    <Button onClick={handleSaveCourse} variant="contained" autoFocus>
                                        Save Course
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Stack>
                    </Grid>
                    {/*Toolbar for text editing and text*/}
                    <Grid item sx={{ marginTop: 4 }}>
                        <Toolbar sx={{ marginLeft: -4.5 }}>
                            <IconButton>
                                <FormatBoldIcon />
                            </IconButton>
                            <IconButton>
                                <FormatItalicIcon />
                            </IconButton>
                            <IconButton>
                                <FormatUnderlinedIcon />
                            </IconButton>
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                    value={fontFamily}
                                    onChange={(e) => setFontFamily(e.target.value)}>
                                    <MenuItem value="Arial">Arial</MenuItem>
                                    <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                                    {/* more fonts */}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 80 }}>
                                <Select
                                    value={fontSize}
                                    onChange={(e) => setFontSize(e.target.value)}>
                                    <MenuItem value={12}>12</MenuItem>
                                    <MenuItem value={14}>14</MenuItem>
                                    {/* more font sizes */}
                                </Select>
                            </FormControl>
                        </Toolbar>
                    </Grid>
                    <Grid item sx={{ marginTop: 4 }}>
                        <Grid item sx={{ width: "100%" }}>
                            <TextField
                                fullWidth
                                placeholder="Enter Note Title"
                                value={title}
                                onChange={handleTitleChange} />
                        </Grid>
                        <Grid item sx={{ width: "100%", marginTop: 2 }}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={10}
                                maxRows={20}
                                placeholder="Enter Note Content"
                                value={content}
                                onChange={handleContentChange} />
                        </Grid>
                    </Grid>
                    {/* Replace ChatIcon with custom chat icon image */}
                    <img
                    src={Chatbot}
                    alt="Chat Icon"
                    onClick={toggleChat}
                    style={{
                    position: 'fixed',
                    bottom: '80px',
                    right: '70px',
                    width: '60px', // Adjust width as needed
                    height: '60px', // Adjust height as needed
                    cursor: 'pointer',
                    }}/>
                    {/* Chat window */}
                    {showChat && (
                    <div
                    style={{
                    position: 'fixed',
                    bottom: '200px', // Adjust as needed to position the chat window above the icon
                    right: '700px',
                    zIndex: 9999, // Ensure the chat window appears above other elements
                    }}>
                    <Chat onClose={toggleChat} />
                    </div>
                    )}
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
            sx={{ width: 200 }} />
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
            <Button variant="outlined" onClick={redirectToCreateNote}>
                Create Note
            </Button>
        </Stack>
    )
}