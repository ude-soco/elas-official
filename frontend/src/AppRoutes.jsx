import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  AppBar,
  Avatar,
  CssBaseline,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
  Link,
  Paper,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarMonthIcon,
  SimCardDownload as SimCardDownloadIcon,
  Key as KeyIcon,
  MenuBook as MenuBookIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  YouTube as YouTubeIcon,
  GitHub as GitHubIcon,
} from "@mui/icons-material";
import { signOut } from "./utils/backend";
import { SnackbarProvider } from "notistack";
import elasLogo from "./assets/images/elas-logo.png";
import Home from "./pages/Home";
import {
  ScrapeDataSection,
  ProfileSettingsSection,
  StudySettingsSection,
  PasswordSettingsSection,
} from "./pages/SettingsMenu";
import Privacy from "./pages/Privacy";
import UserSchedule from "./pages/UserSchedule";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import E3Selector from "./pages/Projects/E3Selector/E3Selector";
import ProjectFinder from "./pages/Projects/ProjectFinder/ProjectFinder";
import CourseRecommender from "./pages/Projects/CourseRecommender/CourseRecommender";
import Intogen from "./pages/Projects/Intogen/Intogen";
import NoteBot from "./pages/Projects/NoteBot/NoteBot";
import CourseDetail from "./pages/Projects/StudyCompassCopy/components/CoueseDetail";
import StudyCompassNew from "./pages/Projects/StudyCompassCopy/StudyCompassNew";

export default function AppRoutes() {
  const isAuthenticated = !!sessionStorage.getItem("elas-token");
  const location = useLocation();
  const showNavBar =
    location.pathname === "/" ||
    location.pathname.startsWith("/projects/") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/schedule") ||
    location.pathname.startsWith("/privacy");

  const publicRoutes = (
    <>
      <Route index element={<Home />} />
      <Route path="projects">
        <Route path="e3-selector">
          <Route index element={<E3Selector />} />
        </Route>
        <Route path="study-compass">
          <Route index element={<StudyCompassNew />} />
          <Route path="detail" element={<CourseDetail />} />
        </Route>
        <Route path="project-finder">
          <Route index element={<ProjectFinder />} />
        </Route>
        <Route path="course-recommender">
          <Route index element={<CourseRecommender />} />
        </Route>
        <Route path="intogen">
          <Route index element={<Intogen />} />
        </Route>
      </Route>
      <Route path="sign-in" element={<Signin />} />
      <Route path="sign-up" element={<Signup />} />
      <Route path="privacy" element={<Privacy />} />
    </>
  );

  const privateRoutes = (
    <>
      <Route path="projects">
        <Route path="notebot">
          <Route index element={<NoteBot />} />
        </Route>
      </Route>
      <Route path="settings" element={<Settings />} />
      <Route path="schedule" element={<UserSchedule />} />
    </>
  );

  return (
    <SnackbarProvider maxSnack={3}>
      <CssBaseline />
      {showNavBar && <NavBar />}
      <Grid container justifyContent="center">
        <Box sx={{ maxWidth: 1250, width: "100%", minHeight: "88vh" }}>
          <Routes>
            <Route path="/">
              {isAuthenticated ? (
                <>
                  {publicRoutes}
                  {privateRoutes}
                </>
              ) : (
                <Route
                  path="*"
                  element={<Navigate to={"/sign-in"} replace />}
                />
              )}
              {publicRoutes}
            </Route>

            <Route path="*" element={<Navigate to={"/"} replace />} />
          </Routes>
        </Box>
      </Grid>
      <Footer />
    </SnackbarProvider>
  );
}

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      sx={{
        bgcolor: "white",
        px: 2,
        py: 3,
        borderTop: 2,
        borderColor: "grey.300",
      }}
      justifyContent="space-between"
      component={Box}
      alignItems="center"
    >
      <Grid item>
        <Typography variant="body2" color="grey.700">
          {" Copyright @ "}
          <Link
            color="inherit"
            href="https://www.uni-due.de/soco"
            target="_blank"
          >
            Social Computing Group
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container alignItems="center">
          <Typography
            sx={{ color: "grey.700", mr: 3, cursor: "pointer" }}
            variant="body2"
          >
            <Link color="inherit" onClick={() => navigate("/privacy")}>
              Privacy
            </Link>
          </Typography>
          <Typography sx={{ color: "grey.700", mr: 1 }} variant="body2">
            Follow us{" "}
          </Typography>
          <IconButton
            sx={{ color: "grey.700" }}
            onClick={() =>
              window.open(
                "https://www.youtube.com/channel/UCQV36Dfq-mfmAG0SqrQ_QbA"
              )
            }
          >
            <YouTubeIcon />
          </IconButton>
          <IconButton
            sx={{ color: "grey.700" }}
            onClick={() => window.open("https://github.com/ude-soco")}
          >
            <GitHubIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

const NavBar = () => {
  const navigate = useNavigate();
  const accessToken = !!sessionStorage.getItem("elas-token");
  const isAdmin =
    JSON.parse(sessionStorage.getItem("elas-user"))?.is_staff || false;
  const [menu, setMenu] = useState(null);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleViewProfileSettings = () => {
    sessionStorage.setItem("elas-settings", "profile");
    navigate("/settings");
    setMenu(null);
  };

  const handleViewSchedule = () => {
    navigate("/schedule");
    setMenu(null);
  };

  const handleHomeView = () => {
    sessionStorage.removeItem("elas-settings");
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "white" }}>
      <Grid container justifyContent="center">
        <Toolbar sx={{ maxWidth: 1250, width: "100%" }}>
          <Box
            component="img"
            src={elasLogo}
            sx={{ height: 32, cursor: "pointer" }}
            onClick={handleHomeView}
          />
          <Box sx={{ flexGrow: 1 }} />
          {accessToken ? (
            <>
              <Box
                sx={{ cursor: "pointer" }}
                onClick={(event) => setMenu(event.currentTarget)}
              >
                <Grid container alignItems="center">
                  <Grid item>
                    <Avatar sx={{ bgcolor: "primary.main" }} />
                  </Grid>
                  <Grid item>
                    <KeyboardArrowDownIcon
                      sx={{ fontSize: "2.5rem", mt: 1, color: "primary.main" }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Menu
                anchorEl={menu}
                open={Boolean(menu)}
                onClose={() => setMenu(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Box sx={{ width: "100%", minWidth: 170 }}>
                  {/* <MenuItem>
                  <ListItemIcon sx={{ mr: 1 }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem> */}
                  {!isAdmin && (
                    <>
                      <MenuItem onClick={handleViewSchedule}>
                        <ListItemIcon sx={{ mr: 1 }}>
                          <CalendarMonthIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText>Schedule</ListItemText>
                      </MenuItem>
                      <Divider />
                    </>
                  )}
                  <MenuItem onClick={handleViewProfileSettings}>
                    <ListItemIcon sx={{ mr: 1 }}>
                      <SettingsIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText>Profile settings</ListItemText>
                  </MenuItem>

                  <MenuItem onClick={handleSignOut}>
                    <ListItemIcon sx={{ mr: 1 }}>
                      <LogoutIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText>Sign out</ListItemText>
                  </MenuItem>
                </Box>
              </Menu>
            </>
          ) : (
            <Button variant="contained" onClick={() => navigate("/sign-in")}>
              Login
            </Button>
          )}
        </Toolbar>
      </Grid>
    </AppBar>
  );
};

function Settings() {
  const [openSettingsMenu, setOpenSettingsMenu] = useState(true);
  const [selected, setSelected] = useState(
    sessionStorage.getItem("elas-settings") || "profile"
  );
  const isAdmin =
    JSON.parse(sessionStorage.getItem("elas-user")).is_staff || false;

  const handleOpenSettingsMenu = () => {
    setOpenSettingsMenu(!openSettingsMenu);
  };

  const handleListItemClick = (index) => {
    setSelected(index);
    sessionStorage.setItem("elas-settings", index);
  };

  return (
    <Grid container justifyContent="center" sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid
          item
          sx={{
            width: { xs: "100%", sm: "30%", lg: "20%" },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs>
              <Paper>
                <List
                  subheader={
                    <ListSubheader component="div">
                      <Grid container justifyContent="space-between">
                        Settings menu
                        <Grid item>
                          <IconButton
                            size="small"
                            onClick={handleOpenSettingsMenu}
                          >
                            <KeyboardArrowDownIcon
                              sx={{
                                transform: !openSettingsMenu
                                  ? "rotate(180deg)"
                                  : "",
                                transition: "transform 0.3s",
                              }}
                            />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </ListSubheader>
                  }
                >
                  <Collapse in={openSettingsMenu}>
                    <ListItemButton
                      selected={selected === "profile"}
                      onClick={() => handleListItemClick("profile")}
                    >
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                    </ListItemButton>

                    {isAdmin && (
                      <ListItemButton
                        selected={selected === "scrape"}
                        onClick={() => handleListItemClick("scrape")}
                      >
                        <ListItemIcon>
                          <SimCardDownloadIcon />
                        </ListItemIcon>
                        <ListItemText primary="Scrape data" />
                      </ListItemButton>
                    )}

                    {!isAdmin && (
                      <>
                        <ListItemButton
                          selected={selected === "study"}
                          onClick={() => handleListItemClick("study")}
                        >
                          <ListItemIcon>
                            <MenuBookIcon />
                          </ListItemIcon>
                          <ListItemText primary="Study" />
                        </ListItemButton>

                        <ListItemButton
                          selected={selected === "password"}
                          onClick={() => handleListItemClick("password")}
                        >
                          <ListItemIcon>
                            <KeyIcon />
                          </ListItemIcon>
                          <ListItemText primary="Password" />
                        </ListItemButton>
                      </>
                    )}
                  </Collapse>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          sx={{
            width: { xs: "100%", sm: "70%", lg: "80%" },
          }}
        >
          <Paper sx={{ p: 3 }}>
            {selected === "profile" && <ProfileSettingsSection />}
            {selected === "scrape" && <ScrapeDataSection />}
            {selected === "study" && <StudySettingsSection />}
            {selected === "password" && <PasswordSettingsSection />}
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
