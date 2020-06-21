import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import setTimeoutP from 'src/lib/setTimeoutP';

export interface FlashMessage {
  id: string;
  title: string;
  body?: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ShowFlashPayload {
  title: string;
  body?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

export const showFlashMessage = createAsyncThunk<void, ShowFlashPayload>(
  'flashMessage/show',
  async (m, { dispatch, requestId }) => {
    await setTimeoutP(m.duration || 5000);

    dispatch(hideFlashMessage(requestId));
  },
);

export const hideFlashMessage = createAction<string | undefined>('flashMessages/hide');

export const useFlash = () => {
  const dispatch = useDispatch();

  const show = (m: ShowFlashPayload | string) => {
    let message: ShowFlashPayload;

    if (typeof m === 'string') {
      message = {
        title: m,
        type: 'info',
      };
    } else {
      message = m;
    }

    dispatch(showFlashMessage(message));
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
