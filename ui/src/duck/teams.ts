import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import {
  create,
  createMember,
  CreateMemberArgs,
  CreateTeamArgs,
  fetchOne,
  TeamResponse,
  FetchOneTeamResponse,
  CreateMemberResponse,
} from 'src/entities/Team';
import { RootState } from '.';
import { fetchProject } from './projects';

const TeamAdapter = createEntityAdapter<TeamResponse>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
export const teamSelector = TeamAdapter.getSelectors<RootState>((state) => state.teams);

export type ProjectState = EntityState<TeamResponse>;

export const createTeamAction = createAsyncThunk<
  TeamResponse,
  CreateTeamArgs,
  { rejectValue: Error; state: ProjectState }
>('team/create', create);

export const createMemberAction = createAsyncThunk<
  CreateMemberResponse,
  CreateMemberArgs,
  { rejectValue: Error; state: ProjectState }
>('team/member/create', createMember);

export const fetchTeam = createAsyncThunk<
  FetchOneTeamResponse,
  { id: string },
  { rejectValue: Error; state: ProjectState }
>('teams/fetchOne', fetchOne);

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchProject.fulfilled, (state, { payload }) => {
      TeamAdapter.upsertMany(state, payload.teams);
    });

    builder.addCase(fetchTeam.fulfilled, (state, { payload }) => {
      TeamAdapter.upsertOne(state, payload.team);
    });

    builder.addCase(createMemberAction.fulfilled, (state, { payload }) => {
      state.entities[payload.teamId]?.memberIds.push(payload.employeeId);
    });
  },
  initialState: TeamAdapter.getInitialState(),
  name: 'teams',
  reducers: {},
});
