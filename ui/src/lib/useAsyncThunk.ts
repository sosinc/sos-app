import { AsyncThunkAction, unwrapResult } from '@reduxjs/toolkit';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useFlash } from 'src/duck/flashMessages';

export const useAsyncThunk = (
  asyncThunk: () => AsyncThunkAction<any, any, any>,
  onError: ((err: Error) => any) | string,
) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [flash] = useFlash();
  const dispatch = useDispatch();

  const fetchEntities = useCallback(async () => {
    try {
      setIsFetching(true);
      await unwrapResult((await dispatch(asyncThunk())) as any);
    } catch (err) {
      if (typeof onError === 'string') {
        flash({
          body: err.message,
          title: onError,
          type: 'error',
        });
      }

      // Need to wrap this in this check; otherwise typescript couldn't decide
      // that onError is a function
      if (typeof onError === 'function') {
        onError(err);
      }
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  return [isFetching];
};
