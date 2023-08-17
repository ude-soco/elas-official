import React, {useState, useEffect} from 'react';

import CourseDetail from './CourseDetail';


function RecommendedCourse({recommendCourses}){

    return(
        <div >
            {recommendCourses.map((course) => {
                return (
                  <CourseDetail course={course}/>
                );
              })}
              
        </div>
    )
}

export default RecommendedCourse;