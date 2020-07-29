import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  CurrentUserResponse,
  fetchCurrentUser as apiFetchCurrentUser,
  login,
  LoginPayload,
  logout,
  resetPassword as apiResetPassword,
  ResetPasswordPayload,
  sendPasswordResetOTP as apiResetPasswordOTP,
  User,
} from 'src/entities/User';

export interface AuthState {
  user?: User;
  activeEmployeeId?: string;
  error?: string;
  isLoggingIn: boolean;
  isFetchingUser: boolean;
}

export const loginUserAction = createAsyncThunk<
  User,
  LoginPayload,
  { rejectValue: Error; state: AuthState }
>('auth/login', (payload) => {
  return login(payload);
});

export const logoutUserAction = createAsyncThunk<
  undefined,
  undefined,
{ rejectValue: Error; state: AuthState }
  >('auth/logout', logout);

export const fetchCurrentUser = createAsyncThunk<
  CurrentUserResponse,
  undefined,
  { rejectValue: Error; state: AuthState }
>('auth/fetchCurrentUser', apiFetchCurrentUser);

export const sendPasswordResetOTPAction = createAsyncThunk<undefined, string>(
  'auth/sendPasswordResetOTP',
  apiResetPasswordOTP,
);

export const resetPasswordAction = createAsyncThunk<undefined, ResetPasswordPayload>(
  'auth/resetPassword',
  apiResetPassword,
);

const initialState: AuthState = {
  isFetchingUser: true,
  isLoggingIn: false,
};

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(loginUserAction.pending, (state) => {
      state.isLoggingIn = true;
    });

    builder.addCase(loginUserAction.rejected, (state, { payload }) => {
      state.isLoggingIn = false;
      state.error = payload?.message;
    });

    builder.addCase(loginUserAction.fulfilled, (state, { payload }) => {
      state.isLoggingIn = false;
      state.user = payload;
    });

    builder.addCase(logoutUserAction.fulfilled, () => {
      return initialState;
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
      const employee = payload.employees.length && payload.employees[0];

      state.activeEmployeeId = employee
        ? `${employee.ecode}-${employee.organization_id}`
        : undefined;
    });
  },
  initialState,
  name: 'auth',
  reducers: {},
});
