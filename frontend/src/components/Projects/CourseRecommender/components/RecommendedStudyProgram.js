import React, {useState, useEffect} from 'react';
import {Button, 
  Grid, 
  Typography, 
  Card} 
  from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    padding: theme.spacing(2),
    textAlign: 'left',
    alignItems:'stretch',
    color: theme.palette.text.secondary,
  },
  button: {

  }
}));

function RecommendedStudyProgram({recommendStudyProgram}){
    const classes = useStyles();

    const urlHandler = (url)=> {
      const w=window.open('about:blank');
      w.location.href=url;
    }

    return(
        <div>
            {recommendStudyProgram.map((studyProgram) => {
                return (
                  <Card style={{marginTop:"10px"}} >
                  <Grid container >
                  <Grid item xs={12} className={classes.card}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={3} >
                          <Typography style={{textAlign: 'left', paddingLeft:"20%"}}>{studyProgram.relevance_score}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography >{studyProgram.name}</Typography>
                        </Grid>
                        <Grid item xs={3} style={{textAlign:"right"}}>
                        <Button 
                            color="primary"
                            variant="outlined"
                            style={{ color: "#FA9010", }}
                            onClick={()=>{urlHandler(studyProgram.url)}}
                            >
                            LSF
                          </Button>
                        
                        </Grid>
                      </Grid>
                  </Grid>
                  </Grid>
                  </Card>
                );
                
              })}
        </div>
    )
}

export default RecommendedStudyProgram;