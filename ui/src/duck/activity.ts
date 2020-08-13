import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import {
  fetchMany, ActivityEvent,
} from 'src/entities/Activity';
import { RootState } from '.';

const activityAdapter = createEntityAdapter<ActivityEvent>();

export const activitySelector = activityAdapter.getSelectors<RootState>((state) => state.activities);

export const fetchTaskActivites = createAsyncThunk<
  ActivityEvent[],
undefined,
{ rejectValue: Error; state: ActivityEvent }
  >('activities/fetchMany', fetchMany);

export type ProjectState = EntityState<ActivityEvent>;

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchTaskActivites.fulfilled,  activityAdapter.upsertMany);

 },
  initialState: activityAdapter.getInitialState(),
  name: 'activities',
  reducers: {},
});
