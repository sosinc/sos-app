import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Designation, fetchMany } from 'src/entities/Designation';

export interface DesignationState {
  isFetching: boolean;
  designation: Designation[];
}

export const fetchDesignation = createAsyncThunk<
  Designation[],
  undefined,
  { rejectValue: Error; state: DesignationState }
>('designations/fetchMany', fetchMany);

const initialState: DesignationState = {
  designation: [],
  isFetching: false,
};

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchDesignation.pending, (state) => {
      state.isFetching = true;
    });

    builder.addCase(fetchDesignation.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.designation = payload;
    });
  },
  initialState,
  name: 'designations',
  reducers: {},
});
