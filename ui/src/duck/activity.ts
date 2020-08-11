import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import {
  fetchMany, Activity,
} from 'src/entities/Activity';
import { RootState } from '.';

const activityAdapter = createEntityAdapter<Activity>();

export const activitySelector = activityAdapter.getSelectors<RootState>((state) => state.activities);

export const fetchTaskActivites = createAsyncThunk<
  Activity[],
undefined,
{ rejectValue: Error; state: Activity }
  >('activities/fetchMany', fetchMany);

export type ProjectState = EntityState<Activity>;

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchTaskActivites.fulfilled, activityAdapter.upsertMany);

 },
  initialState: activityAdapter.getInitialState(),
  name: 'activities',
  reducers: {},
});
