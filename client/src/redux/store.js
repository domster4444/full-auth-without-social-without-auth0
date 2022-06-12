import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
// reducers
// import postReducer from 'redux/features/postSlice';

//rtk api
import { userAuthApi } from './api/auth/userAuthApi';

export const store = configureStore({
  reducer: {
    //? Toolkit Reducers
    //add the authReducer to reducer object
    //todo: userPosts:postReducer
    //?RTK Api
    //todo: [postApi.reducerPath]:postApi.reducer
    [userAuthApi.reducerPath]: userAuthApi.reducer,
    //? show dev tools only in development
    devTools: process.env.NODE_ENV !== 'production',
  },

  // middleware: (getDefaultMiddleware) => {
  // return getDefaultMiddleware().concat(pokemonApi.middleware);
  // },
});

setupListeners(store.dispatch);
