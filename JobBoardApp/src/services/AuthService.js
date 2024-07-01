import axiosRequest from "../configs/axiosConfig";

export const signUpAsync = async (data) => {
  try {
    const res = await axiosRequest.post("/auth/signup", data);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const signInOAuth2Async = async (token) =>
  await axiosRequest.post(
    "/auth/google",
    {
      token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

export const signOutAsync = async (data) =>
  await axiosRequest.post("/auth/signout", {
    refreshToken: data,
  });

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
