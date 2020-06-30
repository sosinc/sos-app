import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { create, CreateMemberPayload,  CreatePayload, createTeamMember, fetchOne, Team, TeamResponse } from 'src/entities/Team';
import { RootState } from '.';
import { fetchProject } from './projects';

const TeamAdapter = createEntityAdapter<Team>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
export const teamSelector = TeamAdapter.getSelectors<RootState>((state) => state.teams);

export type ProjectState = EntityState<Team>;

export const createTeamAction = createAsyncThunk<
  Team,
  CreatePayload,
  { rejectValue: Error; state: ProjectState }
>('team/create', create);

export const createMemberAction = createAsyncThunk<
  {id: string},
CreateMemberPayload,
{ rejectValue: Error; state: ProjectState }
  >('team/create', createTeamMember);

export const fetchTeam = createAsyncThunk<
  TeamResponse,
{id: string},
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

  },
  initialState: TeamAdapter.getInitialState(),
  name: 'teams',
  reducers: {},
});
