import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { fetchCurrentUser } from 'src/duck/auth';
import { create, CreatePayload, fetchMany, Organization } from 'src/entities/Organizations';
import { RootState } from '.';

const orgAdapter = createEntityAdapter<Organization>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const orgSelector = orgAdapter.getSelectors<RootState>((state) => state.organizations);

export const createOrganization = createAsyncThunk<
  Organization,
  CreatePayload,
  { rejectValue: Error; state: OrganizationState }
>('organizations/create', create);

export const fetchOrganizations = createAsyncThunk<
  Organization[],
  undefined,
  { rejectValue: Error; state: OrganizationState }
>('organizations/fetchMany', fetchMany);

export type OrganizationState = EntityState<Organization>;

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchOrganizations.fulfilled, orgAdapter.upsertMany);

    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      orgAdapter.upsertMany(state, payload.organizations);
    });
  },
  initialState: orgAdapter.getInitialState(),
  name: 'organizations',
  reducers: {},
});
