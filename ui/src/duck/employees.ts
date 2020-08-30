import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { fetchCurrentUser, logoutUserAction } from 'src/duck/auth';
import {
  create,
  deleteEmployee,
  Employee,
  EmployeeArgs,
  fetchMany,
  fetchOne,
  update,
} from 'src/entities/Employee';
import { PaginationArgs } from 'src/lib/paginationArgs';
import { RootState } from '.';

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
  { id: string },
  { rejectValue: Error; state: EmployeeState }
>('employees/fetchOne', fetchOne);

export const createEmployeeAction = createAsyncThunk<
  Employee,
  EmployeeArgs,
  { rejectValue: Error; state: EmployeeState }
>('employees/create', create);

export const deleteEmployeeAction = createAsyncThunk<
  Employee,
  { id: string },
  { rejectValue: Error; state: EmployeeState }
>('employees/delete', deleteEmployee);

export const updateEmployeeAction = createAsyncThunk<
  Employee,
  EmployeeArgs,
  { rejectValue: Error; state: EmployeeState }
>('employees/update', update);

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.fulfilled, (state, { payload }) => {
      employeeAdapter.upsertMany(state, payload);
    });

    builder.addCase(fetchEmployee.fulfilled, (state, { payload }) => {
      employeeAdapter.upsertOne(state, payload);
    });

    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      employeeAdapter.upsertMany(state, payload.employees);
    });

    builder.addCase(logoutUserAction.fulfilled, () => {
      return employeeAdapter.getInitialState();
    });

    builder.addCase(deleteEmployeeAction.fulfilled, (state, { payload }) => {
      employeeAdapter.removeOne(state, payload.id);
    });
  },
  initialState: employeeAdapter.getInitialState(),
  name: 'employees',
  reducers: {},
});
