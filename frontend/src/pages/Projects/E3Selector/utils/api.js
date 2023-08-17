import { Backend, setAuthToken } from "../../../../utils/apiConfig";

export const getE3Courses = async () => {
  try {
    // setAuthToken(sessionStorage.getItem("elas-token"));
    const response = await Backend.get("/e3selector/e3-courses/");
    const { data } = response;

    return data;
  } catch (err) {
    console.log(err.details);
    throw err;
  }
};
