import React, { useEffect, useState } from "react";
import {
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import SelectedKeywords from "./components/SelectedKeywords";
import RecommendedKeywords from "./components/RecommendedKeywords";
import Backend from "../../../assets/functions/Backend";
import SelectedCourses from "./components/SelectedCourses";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Button from "@material-ui/core/Button";
// import Header from "../UDEStudyCompass/components/Header";
import AutocompleteSearch from "./components/AutocompleteSearch";
import RecommendedCourse from "./components/RecommendedCourse";
import RecommendedStudyProgram from "./components/RecommendedStudyProgram";
import Header from "./components/Header";

function objectUnique (arr) { //make object elements in array are unique through name
  for (var i = 0; i < arr.length - 1; i++) {
     for (var j = i + 1; j < arr.length; j++) {
        if (arr[i].name == arr[j].name) { 
           arr.splice(j, 1);
           j--;
        }
     }
  }
  return arr
}

function arrayUnique (arr) { //make array elements in array are unique through item value
  for (var i = 0; i < arr.length - 1; i++) {
     for (var j = i + 1; j < arr.length; j++) {
        if (arr[i][1] == arr[j][1]) { 
           arr.splice(j, 1);
           j--;
        }
     }
  }
  return arr
}


const CourseRecommender = () => {
  const [tabValue, setTabValue] = useState(0);

  let [selectedKeywords, setSelectedKeywords] = useState([]);
  let [recommendResults, setRecommendResults] = useState([]);
  let [recommendCourses, setRecommendCourses] = useState([]);
  let [recommendKeywords, setRecommendKeywords] = useState([]);
  let [recommendStudyProgram, setRecommendStudyProgram] = useState([]);
 
  // selectedKeywords = [
  //   { name: "Machine Learning", value: 3 },
  //   { name: "Artificial Intelligence", value: 4 },
  //   { name: "Recommender Systems", value: 4 },
  // ];

  // const recommendedKeywords = ["Natural Language Processing", "Deep Learning"];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Backend.get("/studycompass/get_lectures_with_root_id", {
    //   params: { id: "304760" },
    // }).then((response) => {
    //   let tempCourses = [...response.data];
    //   tempCourses.sort((a, b) =>
    //     a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    //   );
    //   setCourses(tempCourses);
    // });
  }, []);

  const submitHandler = () => {
    // console.log(selectedKeywords);
    const selected_keywords = {};
    for (let i=0; i< selectedKeywords.length; i++){
      const dictKey = selectedKeywords[i].name;
      const dictValue = selectedKeywords[i].value;
      selected_keywords[dictKey] = dictValue;
    }
    console.log(selected_keywords);

    Backend.get("/course_and_study_program_recommendations", {
      params: { selected_keywords: selected_keywords },
    }).then((response) => {
      setRecommendResults(response.data);
      setRecommendCourses(objectUnique(response.data.recommend_courses));
      setRecommendKeywords(arrayUnique(response.data.similar_keywords_recommendation));
      setRecommendStudyProgram(objectUnique(response.data.study_program_recommendation));
      console.log(response.data); 
    }); 
  };

  return (
    <Grid container style={{ padding: 32 }}>
      <Grid container justify="center">
        <Grid item style={{ paddingBottom: 50 }}>
          <img
            src="/images/course-recommender.svg"
            height="45"
            alt="CourseRecommender Logo"
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={2} />

        <Grid item xs={8}>
          <Grid container>
            <Grid container>
              <Typography
                gutterBottom
                color="textSecondary"
                style={{ fontWeight: "bold" }}
              >
                Search for Interests
              </Typography>
            </Grid>

            <Grid item xs={12} style={{ paddingBottom: 24 }}>
              <AutocompleteSearch selectedKeywords={selectedKeywords} setSelectedKeywords={setSelectedKeywords}/>
            </Grid>

            <Grid container>
              <Typography
                gutterBottom
                color="textSecondary"
                style={{ fontWeight: "bold" }}
              >
                Selected Interests
              </Typography>
            </Grid>

            <Grid container spacing={2}>
              {selectedKeywords.filter(selectedKeyword=>selectedKeyword.name !== "").map((keyword) => {
                  return (
                    <Grid item xs={4}>
                      <SelectedKeywords keyword={keyword} selectedKeywords={selectedKeywords} setSelectedKeywords={setSelectedKeywords}/>
                    </Grid>
                  );
              })}
            </Grid>

            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ paddingTop: 32 }}
            >
              <Grid item xs={4} />
              <Grid item xs={4}>
                <Button
                  fullWidth
                  style={{ backgroundColor: "#FB9B0E", color: "#FFF" }}
                  endIcon={<ThumbUpIcon />}
                  onClick={submitHandler}
                >
                  Generate recommendations
                </Button>
              </Grid>
              <Grid item xs={4} />
            </Grid>

            <Grid item xs={12} style={{ padding: "32px 0px 32px 0px" }}>
              <Divider />
            </Grid>

            <Grid container>
              <Typography
                gutterBottom
                color="textSecondary"
                style={{ fontWeight: "bold" }}
              >
                Recommended Similar Interests
              </Typography>
            </Grid>

            <Grid container spacing={2} style={{ paddingBottom: 32 }}>
              {recommendKeywords.map((keyword) => {
                return (
                  <Grid item xs={4}>
                    <RecommendedKeywords keyword={keyword} selectedKeywords={selectedKeywords} setSelectedKeywords={setSelectedKeywords} />
                  </Grid>
                );
              })}
            </Grid>
            <Grid item xs style={{ paddingBottom: 24 }}>
              <Paper>
                <Tabs
                  indicatorColor="primary"
                  textColor="primary"
                  value={tabValue}
                  variant="fullWidth"
                  onChange={(event, value) => setTabValue(value)}
                >
                  <Tab label="Recommended study programs" />
                  <Tab label="Recommended courses" />
                </Tabs>
                <Header style={{marginTop:"10px"}}/>
              </Paper>
              {tabValue === 0 && <RecommendedStudyProgram recommendStudyProgram={recommendStudyProgram} />}
              {tabValue === 1 && <RecommendedCourse recommendCourses={recommendCourses} />}
              
            </Grid>
          </Grid>

          {/* TODO: You can use the Course component from  src/components/Projects/UDEStudyCompass/components/CourseDetails/Course to populate the list of courses. Check the commented code below to iterate through Course component */}

          {/* 
          {courses?.map((course) => {
              return (
                <Course
                  key={course.id}
                  course={course}
                  handleCourse={handleSelectCourse}
                />
              );
            })}
          */}
        </Grid>

        <Grid item xs={2} />
      </Grid>
    </Grid>
  );
};

export default CourseRecommender;
