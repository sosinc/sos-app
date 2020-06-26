import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { create, CreatePayload, Team } from 'src/entities/Team';
import { RootState } from '.';

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

export default createSlice({
  initialState: TeamAdapter.getInitialState(),
  name: 'teams',
  reducers: {},
});
