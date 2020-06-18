import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  CurrentUserResponse,
  fetchCurrentUser as apiFetchCurrentUser,
  login,
  LoginPayload,
  User,
} from 'src/entities/User';

export interface AuthState {
  user?: User;
  activeEmployeeId?: string;
  error?: string;
  isLoggingIn: boolean;
  isFetchingUser: boolean;
}

export const loginUser = createAsyncThunk<
  User,
  LoginPayload,
  { rejectValue: Error; state: AuthState }
>('auth/login', (payload) => {
  return login(payload);
});

export const fetchCurrentUser = createAsyncThunk<
  CurrentUserResponse,
  undefined,
  { rejectValue: Error; state: AuthState }
>('auth/fetchCurrentUser', apiFetchCurrentUser);

const initialState: AuthState = {
  isFetchingUser: true,
  isLoggingIn: false,
};

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoggingIn = true;
    });

    builder.addCase(loginUser.rejected, (state, { payload }) => {
      state.isLoggingIn = false;
      state.error = payload?.message;
    });

    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.isLoggingIn = false;
      state.user = payload;
    });

    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.isFetchingUser = true;
    });

    builder.addCase(fetchCurrentUser.rejected, (state, { payload }) => {
      state.isFetchingUser = false;
      state.error = payload?.message;
    });

    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      state.isFetchingUser = false;
      state.user = payload.user;
      state.activeEmployeeId = payload.employees.length ? payload.employees[0].ecode : undefined;
    });
  },
  initialState,
  name: 'auth',
  reducers: {},
});
