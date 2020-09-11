import c from 'classnames';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/duck';
import { AuthState, fetchCurrentUser } from 'src/duck/auth';

import s from './style.module.scss';

interface WithUserProps {
  children: ReactNode;
  /**
   * Converts WithUser to WithoutUser
   */
  inverted?: boolean;
  redirectPath: string;
}

const WithUser: React.FC<WithUserProps> = (p) => {
  const dispatch = useDispatch();
  const { user, isFetchingUser } = useSelector<RootState, AuthState>((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);

  if (isFetchingUser) {
    return (
      <div className={c(s['loader-container'])}>
        <div className={c(s['lds-ripple'])}>
          <div />
          <div />
        </div>
        <p>Loading...</p>
      </div>
    );
  }

  if ((user && p.inverted) || (!user && !p.inverted)) {
    if (process.browser) {
      router.push(p.redirectPath);
    }

    return null;
  }

  return <>{p.children}</>;
};

export default WithUser;
