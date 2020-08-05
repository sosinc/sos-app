import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { fetchCurrentUser, logoutUserAction } from 'src/duck/auth';
import { create, Employee, EmployeeArgs, fetchMany, fetchOne, update } from 'src/entities/Employee';
import { RootState } from '.';
import { PaginationArgs } from 'src/utils/paginationArgs';

const employeeAdapter = createEntityAdapter<Employee>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
export const employeeSelector = employeeAdapter.getSelectors<RootState>((state) => state.employees);

export type EmployeeState = EntityState<Employee>;

export const fetchEmployees = createAsyncThunk<
  Employee[],
  PaginationArgs,
  { rejectValue: Error; state: EmployeeState }
>('employees/fetchMany', fetchMany);

export const fetchEmployee = createAsyncThunk<
  Employee,
  { orgId: string; ecode: string },
  { rejectValue: Error; state: EmployeeState }
>('employees/fetchOne', fetchOne);

export const createEmployeeAction = createAsyncThunk<
  Employee,
  EmployeeArgs,
  { rejectValue: Error; state: EmployeeState }
>('employees/create', create);

export const updateEmployeeAction = createAsyncThunk<
  Employee,
  EmployeeArgs,
  { rejectValue: Error; state: EmployeeState }
>('employees/update', update);

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.fulfilled, (state, { payload }) => {
      // Employees get their unique ID from combination of Ecode and organization ID
      const employees = payload.map((e) => ({ ...e, id: `${e.ecode}-${e.organization_id}` }));

      employeeAdapter.upsertMany(state, employees);
    });

    builder.addCase(fetchEmployee.fulfilled, (state, { payload }) => {
      employeeAdapter.upsertOne(state, payload);
    });

    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      const employees = payload.employees.map((e) => ({
        ...e,
        id: `${e.ecode}-${e.organization_id}`,
      }));

      employeeAdapter.upsertMany(state, employees);
    });

    builder.addCase(logoutUserAction.fulfilled, () => {
      return employeeAdapter.getInitialState();
    });
  },
  initialState: employeeAdapter.getInitialState(),
  name: 'employees',
  reducers: {},
});
