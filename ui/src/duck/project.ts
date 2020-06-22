import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { fetchCurrentUser } from 'src/duck/auth';
import { create, CreatePayload, fetchMany, Project } from 'src/entities/Project';
import { RootState } from '.';

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

export const createProject = createAsyncThunk<
  Project,
  CreatePayload,
  { rejectValue: Error; state: ProjectState }
>('project/create', create);

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(createProject.fulfilled, projectAdapter.addOne);

    builder.addCase(fetchProjects.fulfilled, projectAdapter.upsertMany);

    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      projectAdapter.upsertMany(state, payload.projects);
    });
  },
  initialState: projectAdapter.getInitialState(),
  name: 'projects',
  reducers: {},
});
