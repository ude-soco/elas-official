import React, {useEffect, useState} from 'react';
import Backend from "../../../assets/functions/Backend";

const StudentConnector = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    Backend.get("/studentconnector/home").then((response) => {
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

export default StudentConnector;