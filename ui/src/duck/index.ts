import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers, Reducer } from 'redux';

import auth from './auth';
import designation from './designation';
import employee from './employee';
import flashMessages from './flashMessages';
import organization from './organizations';
import project from './project';
import team from './team';

const reducer = combineReducers({
  [auth.name]: auth.reducer,
  [designation.name]: designation.reducer,
  [flashMessages.name]: flashMessages.reducer,
  [employee.name]: employee.reducer,
  [organization.name]: organization.reducer,
  [project.name]: project.reducer,
  [team.name]: team.reducer,
});

const rootReducer: Reducer<RootState> = (state, action): RootState => {
  if (action.type === HYDRATE) {
    return { ...state, ...action.payload };
  }

  return reducer(state, action);
};

export type RootState = ReturnType<typeof reducer>;

export default rootReducer;
