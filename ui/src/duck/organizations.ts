import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { fetchCurrentUser, logoutUserAction } from 'src/duck/auth';
import {
  create,
  fetchMany,
  fetchOne,
  Organization,
  OrganizationArgs,
  update,
} from 'src/entities/Organizations';
import { RootState } from '.';
import { PaginationArgs } from 'src/utils/paginationArgs';

const orgAdapter = createEntityAdapter<Organization>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const orgSelector = orgAdapter.getSelectors<RootState>((state) => state.organizations);

export const createOrganizationAction = createAsyncThunk<
  Organization,
  OrganizationArgs,
  { rejectValue: Error; state: OrganizationState }
>('organizations/create', create);

export const updateOrganizationAction = createAsyncThunk<
  Organization,
  OrganizationArgs,
  { rejectValue: Error; state: OrganizationState }
>('organizations/update', update);

export const fetchOrganizations = createAsyncThunk<
  Organization[],
  PaginationArgs,
  { rejectValue: Error; state: OrganizationState }
>('organizations/fetchMany', fetchMany);

export const fetchOrganization = createAsyncThunk<
  Organization,
  { id: string },
  { rejectValue: Error; state: OrganizationState }
>('organizations/fetchOne', fetchOne);

export type OrganizationState = EntityState<Organization>;

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchOrganizations.fulfilled, orgAdapter.upsertMany);

    builder.addCase(fetchOrganization.fulfilled, (state, { payload }) => {
      orgAdapter.upsertOne(state, payload);
    });

    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      orgAdapter.upsertMany(state, payload.organizations);
    });

    builder.addCase(logoutUserAction.fulfilled, () => {
      return orgAdapter.getInitialState();
    });
  },
  initialState: orgAdapter.getInitialState(),
  name: 'organizations',
  reducers: {},
});
