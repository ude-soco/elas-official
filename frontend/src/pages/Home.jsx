import { useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import projectsInfo from "../assets/data/projects";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <Grid container sx={{ p: 4 }}>
        <TextField
          placeholder="Search project..."
          value={search}
          onChange={handleSearch}
          variant="outlined"
          sx={{ width: "100%", bgcolor: "white" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={1} sx={{ py: 3 }} justifyContent="center">
          {projectsInfo
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((project, index) => {
              let nameToSearch = project.name.toLowerCase();
              const found = nameToSearch.includes(search.toLowerCase());
              if (!found) return null;
              return (
                <Grid item key={index}>
                  <ProjectCards project={project} />
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </>
  );
}

const ProjectCards = ({ project }) => {
  const navigate = useNavigate();
  const loggedIn = !!sessionStorage.getItem("elas-token");
  const cardSize = 300;
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      <Card
        sx={{
          width: cardSize,
          m: 1,
          "&:hover": { boxShadow: 5 },
          cursor: "pointer",
        }}
      >
        <Tooltip title="View project" placement="bottom">
          <CardActionArea
            onClick={
              // loggedIn
              // ?
              () => navigate(`/projects/${project.shortName}`)
              // : () =>
              // navigate("/sign-in", {
              // state: { from: `/projects/${project.shortName}` },
              // })
            }
          >
            <CardMedia
              image={project.image}
              title={project.description}
              sx={{ height: cardSize }}
            />
            <CardMedia image={project.image} title={project.description} />
          </CardActionArea>
        </Tooltip>
        <CardActions disableSpacing>
          <Grid container alignContent="center" alignItems="center">
            <Typography variant="h6">{project.name}</Typography>
          </Grid>
          <Grid item>
            <Tooltip
              arrow
              placement="bottom"
              title={
                <Typography>
                  {expanded ? "Hide details" : "Show details"}
                </Typography>
              }
            >
              <IconButton onClick={handleExpandClick} size="large">
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography gutterBottom>
              <b>Description</b>
            </Typography>
            <Typography gutterBottom style={{ marginBottom: 16 }}>
              {project.description}
            </Typography>
            <Typography gutterBottom>
              <b>Group members</b>
            </Typography>
            <Typography gutterBottom>{project.teamMembers}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};
