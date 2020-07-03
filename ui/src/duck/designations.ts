import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { Designation, fetchMany } from 'src/entities/Designation';
import { RootState } from '.';

const designationAdapter = createEntityAdapter<Designation>();
export const designationSelector = designationAdapter.getSelectors<RootState>(
  (s) => s.designations,
);

export type DesignationState = EntityState<Designation>;

export const fetchDesignations = createAsyncThunk<
  Designation[],
  undefined,
  { rejectValue: Error; state: DesignationState }
>('designations/fetchMany', fetchMany);

const initialState: DesignationState = designationAdapter.getInitialState();

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchDesignations.fulfilled, designationAdapter.upsertMany);
  },
  initialState,
  name: 'designations',
  reducers: {},
});
