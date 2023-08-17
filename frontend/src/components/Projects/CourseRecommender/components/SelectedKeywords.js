import React, { useEffect, useState } from "react";
import {Grid, IconButton, Paper, Typography} from "@material-ui/core";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import Slider from "@material-ui/core/Slider";

const SelectedKeywords = ({keyword,selectedKeywords,setSelectedKeywords}) => {

  let [sliderValue, setSliderValue] = useState(0)

  const removeKeywordHandler = ()=>{
    let deleteIndex = selectedKeywords.indexOf(keyword);
    // const newSelectedKeywords = selectedKeywords.splice(deleteIndex,1);//only deleted left
    const newSelectedKeywords = [];
    for (var i=0; i<selectedKeywords.length; i++){
      if (i !== deleteIndex) {
        newSelectedKeywords.push(selectedKeywords[i]);
    }}
    setSelectedKeywords(newSelectedKeywords);
  };

  // const sliderHandler = (e) => {
  //   // console.log(e);

  // };

  function valuetext(value) {
    setSliderValue(value);
  };

  useEffect(()=>{
    //当slider改变了，先找到该keyword在selectedkeywords中对应的地方，然后修改selectedkeywords中的value
    let sliderChangedIndex = selectedKeywords.indexOf(keyword);
    selectedKeywords[sliderChangedIndex].value = sliderValue;
    setSelectedKeywords(selectedKeywords);
},[sliderValue]);

  return (
    <>
      <Paper style={{padding: 10}}>
        <Grid container alignItems="center">
          <Grid item xs={2}>
            <IconButton>
              <RemoveCircleIcon style={{color: "red"}} onClick={removeKeywordHandler}/>
            </IconButton>
          </Grid>

          <Grid item xs={8} style={{paddingLeft: 8, paddingRight: 4}}>
            <Grid container>
              <Grid item xs={12}>
                <Typography>{keyword.name}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Slider 
                  aria-labelledby="discrete-slider-small-steps"
                  // value={keyword.value} 
                  defaultValue={3}
                  getAriaValueText={valuetext}
                  min={1} 
                  max={5} 
                  step={1}
                  marks
                  style={{color: "#FA9F00"}}
                  // onChange={sliderHandler}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={2}>
            <Grid container justify="center">
              <Typography variant="h4">{sliderValue}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>);
};

export default SelectedKeywords;
