import React, {useState, useEffect} from 'react';
import {Button, 
  Grid, 
  Icon, 
  Paper, 
  Typography, 
  Card, 
  CardActions,
  IconButton,
  Collapse,
  CardContent,
  Divider} 
  from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    // padding: theme.spacing(2),
    textAlign: 'left',
    alignItems:'stretch',
    color: theme.palette.text.secondary,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },

}));

function CourseDetail({course}){
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    const urlHandler = (url)=> {
      const w=window.open('about:blank');
      w.location.href=url;
    }

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    return(
        <div >
            {/* {recommendCourses.map((course) => {
                return ( */}
                  <Card style={{marginTop:"10px"}} >
                  <Grid container >
                  <Grid item xs={12} className={classes.card}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={3} >
                          <Typography style={{textAlign: 'left', paddingLeft:"30%"}}>{course.relevance_score}</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography >{course.name}</Typography>
                        </Grid>
                        <Grid item xs={1} style={{textAlign:"right"}}>
                        <CardActions disableSpacing>
                        <IconButton
                          className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                          })}
                          onClick={handleExpandClick}
                          aria-expanded={expanded}
                          aria-label="show more"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                        </CardActions>
                        
                        </Grid>
                      </Grid>
                  </Grid>
                </Grid>
                <Divider />
                <Grid container item xs={12}>
                <Grid item xs={1}/>
                <Grid item xs={10}>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography paragraph style={{ fontWeight: "Bold" }}>Description</Typography>
                      <Typography paragraph className={classes.card} >
                      {course.description}
                      </Typography>
                      <Button 
                        color="primary"
                        variant="outlined"
                        style={{ color: "#FA9010", marginRight:"50px"}}
                        onClick={()=>{urlHandler(course.url)}}
                        >
                        LSF
                      </Button>
                    </CardContent>
                  </Collapse>
                  </Grid>
                  <Grid item xs={1}/>
                </Grid>
                  
                </Card>

              
        </div>
    )
}

export default CourseDetail;