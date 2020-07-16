import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import {
  createDailyTasks,
  DailyTask,
  fetchManyDailyTasks,
  FetchTasksResponse,
} from 'src/entities/Task';
import { RootState } from '.';

const taskAdapter = createEntityAdapter<DailyTask>({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});
export const taskSelector = taskAdapter.getSelectors<RootState>((state) => state.tasks);

export type TasksState = EntityState<DailyTask>;

export const createDaliyStatusAction = createAsyncThunk<undefined,  DailyTask[]>(
  'user/addDaliyTasks',
  createDailyTasks,
);

export const fetchDailyTasks = createAsyncThunk<
  FetchTasksResponse,
  undefined,
{ rejectValue: Error; state: TasksState }
  >('user/fetchMany', fetchManyDailyTasks );

export default createSlice({
  extraReducers: async (builder) => {

    builder.addCase(fetchDailyTasks.fulfilled, (state, { payload }) => {
      taskAdapter.upsertMany(state, payload.tasks);
    });

     },
  initialState: taskAdapter.getInitialState(),
  name: 'tasks',
  reducers: {},
});
