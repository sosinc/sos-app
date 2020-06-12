import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers, Reducer } from 'redux';

import auth from './auth';
import designation from './designation';
import employee from './employee';
import organization from './organization';

const reducer = combineReducers({
  [auth.name]: auth.reducer,
  [designation.name]: designation.reducer,
  [organization.name]: organization.reducer,
  [employee.name]: employee.reducer,
});

const rootReducer: Reducer<RootState> = (state, action): RootState => {
  if (action.type === HYDRATE) {
    return { ...state, ...action.payload };
  }

  return reducer(state, action);
};

export type RootState = ReturnType<typeof reducer>;

export default rootReducer;
