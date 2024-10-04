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
    },
    setUserComponents: (state, action) => {
      if (state.user) {
        // TODO
        // @ts-ignore
        state.user.components = action.payload;
      }
    }
  }
});

export default userSlice.reducer;

export const {
  setUser,
  removeUser,
  setUserComponents
} = userSlice.actions;

export const selectUser = (state: any) => state.user;