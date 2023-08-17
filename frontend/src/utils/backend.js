import { Backend, setAuthToken } from "./apiConfig";

export const signIn = async (data) => {
  try {
    const response = await Backend.post("/auth/login/", data);
    const { user, access, refresh } = response.data;

    sessionStorage.setItem("elas-user", JSON.stringify(user));
    sessionStorage.setItem("elas-token", access);
    sessionStorage.setItem("refresh-token", refresh);

    setAuthToken(access);

    return response;
  } catch (err) {
    throw err;
  }
};

export const signOut = async () => {
  try {
    setAuthToken(sessionStorage.getItem("elas-token"));

    const response = await Backend.post("/auth/logout/", {
      refresh: sessionStorage.getItem("refresh-token"),
    });

    localStorage.clear();
    sessionStorage.clear();

    setAuthToken(null);
    window.location.href = "/";
    return response;
  } catch (err) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
    throw err;
  }
};

export const signUp = async (data) => {
  try {
    const response = await Backend.post("/auth/register/", data);
    return response;
  } catch (err) {
    throw err;
  }
};
export const updateUser = async (updatedData) => {
  setAuthToken(sessionStorage.getItem("elas-token"));

  try {
    const response = await Backend.put(
      `/auth/update/${updatedData.id}/`,
      updatedData
    );
    return response;
  } catch (err) {
    throw err;
  }
};

export const getSemesterStudyProgramList = async () => {
  try {
    const response = await Backend.get("/auth/semester-study-program-list/");
    const {
      data: {
        message: { semester_data, study_programs },
      },
    } = response;
    let message = {
      semesterData: semester_data,
      studyProgramsData: study_programs,
    };
    return message;
  } catch (err) {
    throw err;
  }
};

export const scrapeLSFData = async (url) => {
  try {
    const response = await Backend.post("/studycompass/scrape/", url);
    const {
      data: { task_id, message },
    } = response;
    return { task_id, message };
  } catch (err) {
    throw err;
  }
};

export const scrapeE3Data = async (url) => {
  try {
    const response = await Backend.post("/e3selector/scrape/", url);
    const {
      data: { task_id, message },
    } = response;
    return { task_id, message };
  } catch (err) {
    throw err;
  }
};

// TODO: This function needs to be updated. The API endpoint has to be fixed.
export const getScrapeTaskStatus = async (task_id) => {
  try {
    const response = await Backend.get(`/status/task/${task_id}/`);
    const {
      data: { status, message },
    } = response;
    return { status, message };
  } catch (err) {
    throw err;
  }
};
