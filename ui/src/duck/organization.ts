import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { create, CreatePayload, fetch, Employee } from 'src/entities/Organizations';

export interface OrganizationState {
  organizations: Employee[];
  error?: string;
  isFetching: boolean;
}

export const fetchOrganization = createAsyncThunk<
  Employee[],
  undefined,
  { rejectValue: Error; state: OrganizationState }
>('organizations/fetch', fetch);

export const createOrganization = createAsyncThunk<
  Employee,
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
