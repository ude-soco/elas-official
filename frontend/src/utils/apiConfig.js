import axios from "axios";

export const Backend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  responseType: "json",
});

export const setAuthToken = (token) => {
  if (token) {
    Backend.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete Backend.defaults.headers.common["Authorization"];
  }
};
