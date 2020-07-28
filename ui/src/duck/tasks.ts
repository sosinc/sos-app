import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import {
  createDailyTasks,
  DailyTask,
  deleteDailyTask,
  fetchManyDailyTasks,
  FetchTasksResponse,
  setDailyTaskStatus,
  updateDailyTask,
  UpdateTaskArgs,
} from 'src/entities/Task';
import { RootState } from '.';

const taskAdapter = createEntityAdapter<DailyTask>();
export const taskSelector = taskAdapter.getSelectors<RootState>((state) => state.tasks);

export type TasksState = EntityState<DailyTask>;

export const createDailyTaskAction = createAsyncThunk<undefined, DailyTask[]>(
  'user/addDaliyTasks',
  createDailyTasks,
);

export const updateDailyTaskAction = createAsyncThunk<{ id: string }, UpdateTaskArgs>(
  'user/updateDailylTask',
  updateDailyTask,
);

export const setDailyTaskStatusAction = createAsyncThunk<{ id: string }, UpdateTaskArgs>(
  'user/setDailylTaskStatus',
  setDailyTaskStatus,
);

export const deleteDailyTaskAction = createAsyncThunk<{ id: string }, { id: string }>(
  'user/deleteDailylTask',
  deleteDailyTask,
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

    builder.addCase(updateDailyTaskAction.fulfilled, (state, { payload }) => {
      if (!payload) {
        return;
      }
      taskAdapter.updateOne(state, { id: payload.id, changes: payload });
    });

    builder.addCase(setDailyTaskStatusAction.fulfilled, (state, { payload }) => {
      if (!payload) {
        return;
      }
      taskAdapter.updateOne(state, { id: payload.id, changes: payload });
    });

    builder.addCase(deleteDailyTaskAction.fulfilled, (state, { payload }) => {
      if (!payload) {
        return;
      }
      taskAdapter.removeOne(state, payload.id);
    });
  },
  initialState: taskAdapter.getInitialState(),
  name: 'tasks',
  reducers: {},
});
