import React from "react";
import {Grid, IconButton, Paper, Typography} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const RecommendedKeywords = ({keyword,selectedKeywords,setSelectedKeywords}) => {

  const addKeywordHandler = ()=>{
    let newKeyword = {};
    newKeyword.name = keyword[1];
    newKeyword.value = 3;
    setSelectedKeywords([...selectedKeywords,newKeyword]);
  }

  return (
    <>
      <Paper>
        <Grid container alignItems="center">
          <Grid item xs={3} lg={2}>
            <IconButton>
              <AddCircleIcon style={{color: "green"}} onClick={addKeywordHandler}/>
            </IconButton>
          </Grid>

          <Grid item xs={7} lg={10}>
            <Typography>{keyword[1]}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default RecommendedKeywords;
