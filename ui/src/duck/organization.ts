import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { create, CreatePayload, fetchMany, fetchOne, GetOnePayload, Organization } from 'src/entities/Organizations';

export interface OrganizationState {
  organizations: Organization[];
  error?: string;
  isFetching: boolean;
}

export const fetchOrganizations = createAsyncThunk<
  Organization[],
  undefined,
  { rejectValue: Error; state: OrganizationState }
>('organizations/fetchMany', fetchMany);

export const fetchOrganization = createAsyncThunk<
  Organization,
  GetOnePayload,
{ rejectValue: Error; state: OrganizationState }
  >('organizations/fetchOne', fetchOne);

export const createOrganization = createAsyncThunk<
  Organization,
  CreatePayload,
{rejectValue: Error; state: OrganizationState}
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

    builder.addCase(fetchOrganizations.pending, (state) => {
      state.isFetching = true;
    });

    builder.addCase(fetchOrganizations.rejected, (state, { payload }) => {
      state.isFetching = false;
      state.error = payload?.message;
    });

    builder.addCase(fetchOrganizations.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.organizations = payload;
    });

    builder.addCase(fetchOrganization.pending, (state) => {
      state.isFetching = true;
    });

    builder.addCase(fetchOrganization.rejected, (state, { error }) => {
      state.isFetching = false;
      state.error = error?.message;
    });

    builder.addCase(fetchOrganization.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.organizations = [ ...state.organizations , payload];
    });
  },
  initialState,
  name: 'organization',
  reducers: {},
});
