import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/duck';
import { AuthState, fetchCurrentUser } from 'src/duck/auth';

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
    return <p>Logging in...</p>;
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
