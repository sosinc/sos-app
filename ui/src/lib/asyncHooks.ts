import { AsyncThunkAction, unwrapResult } from '@reduxjs/toolkit';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useFlash } from 'src/duck/flashMessages';

interface Options {
  rethrowError?: boolean;
  errorTitle?: string;
  successTitle?: string;
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
      const result = await unwrapResult(await dispatch(asyncThunk(args)) as any);

      if (options.successTitle) {
        flash({
          title: options.successTitle,
          type: 'success',
        });
      }

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

  const execute = useCallback(async (arg?: any) => {
    runAsyncThunk(arg);
  }, []);

  return [execute, isFetching] as [(arg?: any) => Promise<void>, boolean];
};

export const useQuery = (
  asyncThunk: (args?: any) => AsyncThunkAction<any, any, any>,
  options: Options = {},
) => {
  const [executeFetch, isFetching] = useAsyncThunk(asyncThunk, options);

  useEffect(() => {
    executeFetch();
  }, [executeFetch]);

  return [isFetching, executeFetch] as [boolean, (arg?: any) => Promise<void>];
};
