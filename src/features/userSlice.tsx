import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
    }
  }
});

export default userSlice.reducer;

export const {
  setUser,
  removeUser
} = userSlice.actions;

export const selectUser = (state: any) => state.user;