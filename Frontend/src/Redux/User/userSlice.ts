import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state) => {
      state.isLoggedIn = true;
    },
    logOutUser: (state) => {
      state.isLoggedIn = false;
    },
  },
});

 

export const { loginUser, logOutUser } = userSlice.actions;

export default userSlice.reducer;
