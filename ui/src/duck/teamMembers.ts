import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { create, CreatePayload, Member} from 'src/entities/TeamMember';
import { RootState } from '.';
import { fetchTeam } from './teams';

const MemberAdapter = createEntityAdapter<Member>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
export const memberSelector = MemberAdapter.getSelectors<RootState>((state) => state.members);

export type MemberState = EntityState<Member>;

export const createMemberAction = createAsyncThunk<
  {id: string},
  CreatePayload,
{ rejectValue: Error; state: MemberState }
  >('team/member/create', create);

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchTeam.fulfilled, (state, { payload }) => {
     MemberAdapter.upsertMany(state, payload.members);
    });
  },
  initialState: MemberAdapter.getInitialState(),
  name: 'members',
  reducers: {},
});
