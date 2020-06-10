import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Designation, fetch } from 'src/entities/Designation';

export interface DesignationState {
  error?: string;
  isLoading: boolean;
  designation: Designation[];
}

export const fetchDesignation = createAsyncThunk<
  Designation[],
undefined,
{ rejectValue: Error; state: DesignationState }
  >('designations/fetch', fetch);

const initialState: DesignationState = {
  designation: [],
  isLoading: false,
};

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchDesignation.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(fetchDesignation.rejected, (state, { error }) => {
      state.isLoading = false;
      state.error = error.message;
    });

    builder.addCase(fetchDesignation.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.designation = payload;
    });

  },
  initialState,
  name: 'designations',
  reducers: {},
});
