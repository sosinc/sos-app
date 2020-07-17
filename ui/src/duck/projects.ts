import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { fetchCurrentUser } from 'src/duck/auth';
import {
  create,
  CreatePayload,
  fetchMany,
  fetchOne,
  GetOnePayload,
  Project,
  ProjectResponse,
} from 'src/entities/Project';
import { RootState } from '.';
import { fetchDailyTasks } from './tasks';

const projectAdapter = createEntityAdapter<Project>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
export const projectSelector = projectAdapter.getSelectors<RootState>((state) => state.projects);

export type ProjectState = EntityState<Project>;

export const fetchProjects = createAsyncThunk<
  Project[],
  undefined,
  { rejectValue: Error; state: ProjectState }
>('projects/fetchMany', fetchMany);

export const fetchProject = createAsyncThunk<
  ProjectResponse,
  GetOnePayload,
  { rejectValue: Error; state: ProjectState }
>('projects/fetchOne', fetchOne);

export const createProjectAction = createAsyncThunk<
  Project,
  CreatePayload,
  { rejectValue: Error; state: ProjectState }
>('project/create', create);

export default createSlice({
  extraReducers: async (builder) => {
    builder.addCase(fetchProjects.fulfilled, projectAdapter.upsertMany);

    builder.addCase(fetchProject.fulfilled, (state, { payload }) => {
      projectAdapter.upsertOne(state, payload.project);
    });

    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      projectAdapter.upsertMany(state, payload.projects);
    });

    builder.addCase('teams/fetchOne/fulfilled', (state, { payload }: any) => {
      projectAdapter.upsertOne(state, payload.project);
    });

    builder.addCase(fetchDailyTasks.fulfilled, (state, { payload }) => {
      projectAdapter.upsertMany(state, payload.projects);
    });
  },
  initialState: projectAdapter.getInitialState(),
  name: 'projects',
  reducers: {},
});
