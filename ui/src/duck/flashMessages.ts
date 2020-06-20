import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

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

export const useFlash = () => {
  const dispatch = useDispatch();

  const show = (m: Omit<FlashMessage, 'id'>) => {
    dispatch(showFlashMessage(m));
  };

  const hide = (id: string) => {
    dispatch(hideFlashMessage(id));
  };

  // without explicit cast, typescript kept treating the return value as unition of both functions
  return [show, hide] as [typeof show, typeof hide];
};

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
