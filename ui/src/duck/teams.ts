import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { fetchCurrentUser, logoutUserAction } from 'src/duck/auth';
import {
  create,
  createMember,
  CreateMemberArgs,
  CreateMemberResponse,
  deleteMember,
  fetchOne,
  FetchOneTeamResponse,
  Team,
  TeamArgs,
  update,
} from 'src/entities/Team';
import { RootState } from '.';
import { fetchProject } from './projects';

const teamAdapter = createEntityAdapter<Team>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
export const teamSelector = teamAdapter.getSelectors<RootState>((state) => state.teams);

export type ProjectState = EntityState<Team>;

export const createTeamAction = createAsyncThunk<
  Team,
  TeamArgs,
  { rejectValue: Error; state: ProjectState }
>('team/create', create);

export const updateTeamAction = createAsyncThunk<
  Team,
  TeamArgs,
  { rejectValue: Error; state: ProjectState }
>('team/create', update);

export const createMemberAction = createAsyncThunk<
  CreateMemberResponse,
  CreateMemberArgs,
  { rejectValue: Error; state: ProjectState }
>('team/member/create', createMember);

export const deleteMemberAction = createAsyncThunk<
  CreateMemberResponse,
  CreateMemberArgs,
  { rejectValue: Error; state: ProjectState }
>('team/member/remove', deleteMember);

export const fetchTeam = createAsyncThunk<
  FetchOneTeamResponse,
  { id: string },
  { rejectValue: Error; state: ProjectState }
>('teams/fetchOne', fetchOne);

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchProject.fulfilled, (state, { payload }) => {
      teamAdapter.upsertMany(state, payload.teams);
    });

    builder.addCase(fetchTeam.fulfilled, (state, { payload }) => {
      teamAdapter.upsertOne(state, payload.team);
    });

    builder.addCase(createMemberAction.fulfilled, (state, { payload }) => {
      state.entities[payload.teamId]?.memberIds.push(payload.employeeId);
    });

    builder.addCase(deleteMemberAction.fulfilled, (state, { payload }) => {
      const team = state.entities[payload.teamId];

      if (!team) {
        return;
      }

      team.memberIds = team.memberIds.filter((e) => e !== payload.employeeId);
    });

    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      teamAdapter.upsertMany(state, payload.teams);
    });

    builder.addCase(logoutUserAction.fulfilled, () => {
      return teamAdapter.getInitialState();
    });
  },
  initialState: teamAdapter.getInitialState(),
  name: 'teams',
  reducers: {},
});
