import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers, Reducer } from 'redux';

import auth from './auth';
import designations from './designations';
import employees from './employees';
import flashMessages from './flashMessages';
import organizations from './organizations';
import projects from './projects';
import teams from './teams';

const reducer = combineReducers({
  [auth.name]: auth.reducer,
  [designations.name]: designations.reducer,
  [flashMessages.name]: flashMessages.reducer,
  [employees.name]: employees.reducer,
  [organizations.name]: organizations.reducer,
  [projects.name]: projects.reducer,
  [teams.name]: teams.reducer,
});

const rootReducer: Reducer<RootState> = (state, action): RootState => {
  if (action.type === HYDRATE) {
    return { ...state, ...action.payload };
  }

  return reducer(state, action);
};

export type RootState = ReturnType<typeof reducer>;

export default rootReducer;
