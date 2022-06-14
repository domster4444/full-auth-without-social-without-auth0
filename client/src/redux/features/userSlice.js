import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  name: null,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
    },

    unsetUserInfo: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
  },
});

// export actions
export const { setUserInfo, unsetUserInfo } = userSlice.actions;
// export reducer
export default userSlice.reducer;
