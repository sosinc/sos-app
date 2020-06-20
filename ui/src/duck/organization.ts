import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchCurrentUser } from 'src/duck/auth';
import { create, CreatePayload, fetchMany, Organization } from 'src/entities/Organizations';

export interface OrganizationState {
  organizations: Organization[];
  error?: string;
  isFetching: boolean;
}

export const fetchOrganization = createAsyncThunk<
  Organization[],
  undefined,
  { rejectValue: Error; state: OrganizationState }
>('organizations/fetchMany', fetchMany);

export const createOrganization = createAsyncThunk<
  Organization,
  CreatePayload,
  { rejectValue: Error; state: OrganizationState }
>('organizations/create', create);

const initialState: OrganizationState = {
  isFetching: false,
  organizations: [],
};

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(createOrganization.fulfilled, (state, { payload }) => {
      state.organizations.push(payload);
    });

    builder.addCase(fetchOrganization.pending, (state) => {
      state.isFetching = true;
    });

    builder.addCase(fetchOrganization.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.error = payload?.message;
    });

    builder.addCase(fetchOrganization.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.organizations = payload;
    });

    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      state.organizations = payload.organizations;
    });
  },
  initialState,
  name: 'organization',
  reducers: {},
});
