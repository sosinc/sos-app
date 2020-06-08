import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import reducer from 'src/duck';

import rootEpic from 'src/epic';

const epicMiddleware = createEpicMiddleware();

export default () => {
  const store = configureStore({
    middleware: [epicMiddleware, ...getDefaultMiddleware()],
    reducer,
  });

  epicMiddleware.run(rootEpic);

  return { store };
};
