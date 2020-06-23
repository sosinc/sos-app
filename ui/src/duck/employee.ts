import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { fetchCurrentUser } from 'src/duck/auth';
import { create, CreatePayload, Employee, fetchMany } from 'src/entities/Employee';
import { RootState } from '.';

const employeeAdapter = createEntityAdapter<Employee>({
  // Employees get their unique ID from combination of Ecode and organization ID
  selectId: (e) => `${e.ecode}-${e.organization_id}`,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
export const employeeSelector = employeeAdapter.getSelectors<RootState>((state) => state.employees);

export type EmployeeState = EntityState<Employee>;

export const fetchEmployees = createAsyncThunk<
  Employee[],
  undefined,
  { rejectValue: Error; state: EmployeeState }
>('employees/fetchMany', fetchMany);

export const createEmployeeAction = createAsyncThunk<
  Employee,
  CreatePayload,
  { rejectValue: Error; state: EmployeeState }
>('employees/create', create);

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.fulfilled, employeeAdapter.upsertMany);

    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      employeeAdapter.upsertMany(state, payload.employees);
    });
  },
  initialState: employeeAdapter.getInitialState(),
  name: 'employees',
  reducers: {},
});
