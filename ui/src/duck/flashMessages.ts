import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import setTimeoutP from 'src/lib/setTimeoutP';

export interface FlashMessage {
  id: string;
  title: string;
  body?: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export const showFlashMessage = createAsyncThunk<void, FlashMessage>(
  'flashMessage/show',
  async (m, { dispatch }) => {
    await setTimeoutP(m.duration || 3000);

    dispatch(hideFlashMessage(m.id));
  },
);

export const hideFlashMessage = createAction<string>('flashMessages/hide');

interface FlashMessagesState {
  messages: FlashMessage[];
}

const initialState: FlashMessagesState = { messages: [] };

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(showFlashMessage.pending, (state, { meta: { arg } }) => {
      state.messages.push(arg);
    });

    builder.addCase(hideFlashMessage, (state, { payload: id }) => {
      state.messages = state.messages.filter((m) => m.id !== id);
    });
  },
  initialState,
  name: 'flashMessage',
  reducers: {},
});
