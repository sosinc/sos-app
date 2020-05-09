import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootDuck from 'src/duck';
import rootEpic from 'src/epic';

const epicMiddleware = createEpicMiddleware();

const persistConfig = {
  key: 'sosRoot',
  storage,
  whitelist: [],
};

export default () => {
  const reducer = rootDuck.reducer;
  const persistedReducer = persistReducer(persistConfig, reducer);

  const store = configureStore({
    middleware: [epicMiddleware],
    reducer: persistedReducer,
  });

  epicMiddleware.run(rootEpic);

  const persistor = persistStore(store);

  return { persistor, store };
};
