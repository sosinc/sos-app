import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { create, CreatePayload, fetch, Organization } from 'src/entities/Organizations';

export interface OrganizationState {
  organizations: Organization[];
  error?: string;
  isFetching: boolean;
  isLoading: boolean;
}

export const fetchOrganization = createAsyncThunk<
  Organization[],
  undefined,
  { rejectValue: Error; state: OrganizationState }
>('organizations/fetch', fetch);

export const createOrganization = createAsyncThunk<
  Organization,
  CreatePayload,
{rejectValue: Error; state: OrganizationState}
  >('organization/add', create);

const initialState: OrganizationState = {
  isFetching: false,
  isLoading: false,
  organizations: [],
};

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(createOrganization.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createOrganization.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.error = payload?.message;
    });

    builder.addCase(createOrganization.fulfilled, (state, { payload }) => {
      state.isLoading = false;
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
  },
  initialState,
  name: 'organization',
  reducers: {},
});
