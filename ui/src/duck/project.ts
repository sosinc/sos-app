import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchCurrentUser } from 'src/duck/auth';
import { create, CreatePayload, fetchMany, Project } from 'src/entities/Project';

export interface ProjectState {
  projects: Project[];
  error?: string;
  isFetching: boolean;
}

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

const initialState: ProjectState = {
  isFetching: false,
  projects: [],
};

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(createProject.fulfilled, (state, { payload }) => {
      state.projects.push(payload);
    });

    builder.addCase(fetchProjects.pending, (state) => {
      state.isFetching = true;
    });

    builder.addCase(fetchProjects.rejected, (state, { error }) => {
      state.isFetching = false;
      state.error = error.message;
    });

    builder.addCase(fetchProjects.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.projects = payload;
    });

    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      state.projects = payload.projects;
    });  },
  initialState,
  name: 'projects',
  reducers: {},
});
