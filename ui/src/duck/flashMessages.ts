import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import setTimeoutP from 'src/lib/setTimeoutP';

export interface FlashMessage {
  id: string;
  title: string;
  body?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

export const showFlashMessage = createAsyncThunk<void, Omit<FlashMessage, 'id'>>(
  'flashMessage/show',
  async (m, { dispatch, requestId }) => {
    await setTimeoutP(m.duration || 5000);

    dispatch(hideFlashMessage(requestId));
  },
);

export const hideFlashMessage = createAction<string | undefined>('flashMessages/hide');

interface FlashMessagesState {
  messages: FlashMessage[];
}

const initialState: FlashMessagesState = { messages: [] };

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(showFlashMessage.pending, (state, { meta: { arg, requestId } }) => {
      state.messages.push({ id: requestId, type: 'info', ...arg });
    });

    builder.addCase(hideFlashMessage, (state, { payload: id }) => {
      state.messages = state.messages.filter((m) => m.id !== id);
    });
  },
  initialState,
  name: 'flashMessage',
  reducers: {},
});
