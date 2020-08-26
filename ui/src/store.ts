import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import reducer from 'src/duck';

const initStore = () => {
  const store = configureStore({
    middleware: getDefaultMiddleware(),
    reducer,
  });
  return store;
};

export const wrapper = createWrapper(initStore);
