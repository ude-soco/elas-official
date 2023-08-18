import { Backend, setAuthToken } from "../../../../utils/apiConfig";

export const getStudyPrograms = async () => {
  try {
    setAuthToken(sessionStorage.getItem("elas-token"));
    const response = await Backend.get("/app/studycompass/get-studyprograms/");
    const {
      data: { message },
    } = response;

    return message;
  } catch (err) {
    console.log(err.details);
    throw err;
  }
};

export const getLectureUsingStudyProgramId = async (studyProgramId) => {
  try {
    setAuthToken(sessionStorage.getItem("elas-token"));

    const response = await Backend.get(
      `/app/studycompass/get-lectures-with-id/${studyProgramId}/`
    );
    const {
      data: { message },
    } = response;
    return message;
  } catch (err) {
    console.log(err.details);
    throw err;
  }
};
