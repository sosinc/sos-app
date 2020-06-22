import { AsyncThunkAction, unwrapResult } from '@reduxjs/toolkit';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useFlash } from 'src/duck/flashMessages';

interface Options {
  rethrowError?: boolean;
  errorTitle?: string;
}

export const useAsyncThunk = (
  asyncThunk: (args?: any) => AsyncThunkAction<any, any, any>,
  options: Options = {},
) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [flash] = useFlash();
  const dispatch = useDispatch();

  const runAsyncThunk = useCallback(async (args?: any) => {
    try {
      setIsFetching(true);
      const result = await unwrapResult((await dispatch(asyncThunk(args))) as any);

      return result;
    } catch (err) {
      if (options.errorTitle) {
        flash({
          body: err.message,
          title: options.errorTitle,
          type: 'error',
        });
      }

      if (options.rethrowError || !options.errorTitle) {
        throw err;
      }
    } finally {
      setIsFetching(false);
    }
  }, []);

  const execute = (arg?: any) => {
    return runAsyncThunk(arg);
  };

  return [execute, isFetching] as [(arg?: any) => void, boolean];
};
