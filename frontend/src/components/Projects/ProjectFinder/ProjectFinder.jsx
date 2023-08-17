import React, {useEffect, useState} from 'react';
import Backend from "../../../assets/functions/Backend";

const ProjectFinder = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(()=> {
    Backend.get("/projectfinder/home").then((response) => {
      let res = response.data
      setGreeting(res)
    });
  })
  return (
    <>
      <h1>{greeting}</h1>
    </>
  );

}

export default ProjectFinder;