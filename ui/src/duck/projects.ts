import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { fetchCurrentUser, logoutUserAction } from 'src/duck/auth';
import {
  create,
  fetchMany,
  fetchOne,
  GetOnePayload,
  Project,
  ProjectArgs,
  ProjectResponse,
  update,
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
  ProjectArgs,
  { rejectValue: Error; state: ProjectState }
>('project/create', create);

export const updateProjectAction = createAsyncThunk<
  Project,
  ProjectArgs,
  { rejectValue: Error; state: ProjectState }
>('project/update', update);

export default createSlice({
  extraReducers: async (builder) => {
    builder.addCase(fetchProjects.fulfilled, projectAdapter.upsertMany);

    builder.addCase(fetchProject.fulfilled, (state, { payload }) => {
      projectAdapter.upsertOne(state, payload.project);
    });

    builder.addCase(createProjectAction.fulfilled, (state, { payload }) => {
      projectAdapter.upsertOne(state, payload);
    });

    builder.addCase(updateProjectAction.fulfilled, (state, { payload }) => {
      projectAdapter.upsertOne(state, payload);
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

    builder.addCase(logoutUserAction.fulfilled, () => {
      return projectAdapter.getInitialState();
    });
  },
  initialState: projectAdapter.getInitialState(),
  name: 'projects',
  reducers: {},
});
