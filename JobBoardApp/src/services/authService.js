import axiosRequest from "../configs/axiosConfig";

export const signUpAsync = async (data) => {
  try {
    const res = await axiosRequest.post("/auth/signup", data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const signInAysnc = async (data) => {
  try {
    const res = await axiosRequest.post("/auth/signin", data);

    return res;
  } catch (error) {
    console.log(">>> error: ", error);
    if (typeof error.response.data.message === "string") {
      switch (error.response.data.message) {
        case "Bad credentials":
          return "Bad credentials";
        case "User not found":
          return "User not found";
      }
    }
  }
};
