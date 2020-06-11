import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { create, CreatePayload, Employee, fetchMany } from 'src/entities/Employee';

export interface EmployeeState {
  employees: Employee[];
  error?: string;
  isFetching: boolean;
}

export const fetchEmployees = createAsyncThunk<
  Employee[],
  undefined,
  { rejectValue: Error; state: EmployeeState }
>('employees/fetch/many', fetchMany);

export const createEmployee = createAsyncThunk<
  Employee,
  CreatePayload,
{rejectValue: Error; state: EmployeeState}
  >('employees/create', create);

const initialState: EmployeeState = {
  employees: [],
  isFetching: false,
};

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(createEmployee.fulfilled, (state, { payload }) => {
      state.employees.push(payload);
    });

    builder.addCase(fetchEmployees.pending, (state) => {
      state.isFetching = true;
    });

    builder.addCase(fetchEmployees.rejected, (state, { error }) => {
      state.isFetching = false;
      state.error = error.message;
    });

    builder.addCase(fetchEmployees.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.employees = payload;
    });
  },
  initialState,
  name: 'employees',
  reducers: {},
});
