import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import {
  createDailyTasks,
  DailyTask,
  deleteDailyTask,
  fetchManyDailyTasks,
  FetchTasksResponse,
  updateDailyTask,
  updateDailyTaskStatus,
  UpdateTaskArgs,
} from 'src/entities/Task';
import { RootState } from '.';

const taskAdapter = createEntityAdapter<DailyTask>();
export const taskSelector = taskAdapter.getSelectors<RootState>((state) => state.tasks);

export type TasksState = EntityState<DailyTask>;

export const createDaliyTaskAction = createAsyncThunk<undefined, DailyTask[]>(
  'user/addDaliyTasks',
  createDailyTasks,
);

export const updateDailyTaskActions = createAsyncThunk<{ id: string }, UpdateTaskArgs>(
  'user/updateDailylTask',
  updateDailyTask,
);

export const updateDailyTaskStatusActions = createAsyncThunk<{ id: string }, UpdateTaskArgs>(
  'user/updateDailylTaskStatus',
  updateDailyTaskStatus,
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

    builder.addCase(updateDailyTaskActions.fulfilled, (state, { payload }) => {
      if (!payload) {
        return;
      }
      taskAdapter.updateOne(state, { id: payload.id, changes: payload });
    });

    builder.addCase(updateDailyTaskStatusActions.fulfilled, (state, { payload }) => {
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
