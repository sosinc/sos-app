import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import {
  createDailyTasks,
  DailyTask,
  fetchManyDailyTasks,
  FetchTasksResponse,
  updateDailyTasks,
  UpdateTaskArgs,
} from 'src/entities/Task';
import { RootState } from '.';

const taskAdapter = createEntityAdapter<DailyTask>();
export const taskSelector = taskAdapter.getSelectors<RootState>((state) => state.tasks);

export type TasksState = EntityState<DailyTask>;

export const createDaliyStatusAction = createAsyncThunk<undefined, DailyTask[]>(
  'user/addDaliyTasks',
  createDailyTasks,
);

export const updateDailyStatusActions = createAsyncThunk<{ id: string }, UpdateTaskArgs>(
  'user/updateDailylTask',
  updateDailyTasks,
);

export const fetchDailyTasks = createAsyncThunk<
  FetchTasksResponse,
  undefined,
  { rejectValue: Error; state: TasksState }
>('user/fetchMany', fetchManyDailyTasks);

export default createSlice({
  extraReducers: async (builder) => {
    builder.addCase(fetchDailyTasks.fulfilled, (state, { payload }) => {
      taskAdapter.upsertMany(state, payload.tasks);
    });

    builder.addCase(updateDailyStatusActions.fulfilled, (state, { payload }) => {
      if (!payload) {
        return;
      }
      taskAdapter.updateOne(state, { id: payload.id, changes: payload });
    });
  },
  initialState: taskAdapter.getInitialState(),
  name: 'tasks',
  reducers: {},
});
