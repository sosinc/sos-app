import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { fetchCurrentUser } from 'src/duck/auth';
import { create, CreatePayload, Employee, fetchMany } from 'src/entities/Employee';
import { RootState } from '.';

const employeeAdapter = createEntityAdapter<Employee>({
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
    builder.addCase(fetchEmployees.fulfilled, (state, { payload }) => {
      // Employees get their unique ID from combination of Ecode and organization ID
      const employees = payload.map((e) => ({ ...e, id: `${e.ecode}-${e.organization_id}` }));

      employeeAdapter.upsertMany(state, employees);
    });

    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      const employees = payload.employees.map((e) => ({ ...e, id: `${e.ecode}-${e.organization_id}` }));

      employeeAdapter.upsertMany(state, employees);
    });
  },
  initialState: employeeAdapter.getInitialState(),
  name: 'employees',
  reducers: {},
});
