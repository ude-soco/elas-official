import { Backend, setAuthToken } from "../../../../utils/apiConfig";

export const createUser = async () => {
  try {
    const response = await Backend.get(`/notebot/users`);
    const {
      data: { message },
    } = response;

    return message;
  } catch (err) {
    console.log(err);
    return err.response.data.message;
  }
};
