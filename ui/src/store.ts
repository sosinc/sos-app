import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { createEpicMiddleware } from 'redux-observable';

import reducer from 'src/duck';
import rootEpic from 'src/epic';

const epicMiddleware = createEpicMiddleware();

const initStore = () => {
  const store = configureStore({
    middleware: [epicMiddleware, ...getDefaultMiddleware()],
    reducer,
  });

  epicMiddleware.run(rootEpic);

  return store;
};

export const wrapper = createWrapper(initStore);
