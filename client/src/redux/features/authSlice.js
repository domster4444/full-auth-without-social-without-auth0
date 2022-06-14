//? this stores token in global state too,
// so that this global state will be later used for protecetd routes to find if user is loggedin or not

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.token = action.payload.token;
    },
    unsetUserToken: (state, action) => {
      state.token = null;
    },
  },
});

export const { setUserToken, unsetUserToken } = authSlice.actions;
export default authSlice.reducer;
