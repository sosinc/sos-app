import { AsyncThunkAction, unwrapResult } from '@reduxjs/toolkit';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useFlash } from 'src/duck/flashMessages';

interface Options {
  rethrowError?: boolean;
  errorTitle?: string;
  successTitle?: string;
}

/**
 * useAsyncThunk return a callback
 * it return a promise which is resolved/rejected to notify user when the operation is completed via flash message
 */
export const useAsyncThunk = (
  asyncThunk: (args?: any) => AsyncThunkAction<any, any, any>,
  options: Options = {},
) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [flash] = useFlash();
  const dispatch = useDispatch();

  const runAsyncThunk = useCallback(async (args) => {
    try {
      setIsFetching(true);
      const result = await unwrapResult((await dispatch(asyncThunk(args))) as any);

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

  return [runAsyncThunk, isFetching] as [(arg?: any) => Promise<void>, boolean];
};

/**
 * useQuery basically calls the useAsyncThunk function inside the useEffect hook
 * it returns a loading state and a promise
 */
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
