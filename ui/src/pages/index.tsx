import classNames from 'classnames/bind';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/duck';

import FullPageLayout from 'src/components/FullPageLayout';
import LoginForm from 'src/components/LoginForm';
import Modal from 'src/components/Modal';
import ResetPassword from 'src/components/ResetPassword';
import WithUser from 'src/containers/WithUser';
import { loginUserAction, resetPasswordAction, sendPasswordResetOTPAction } from 'src/duck/auth';
import { useAsyncThunk } from 'src/lib/asyncHooks';

import style from './index.module.scss';

const c = classNames.bind(style);

const Index = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [login] = useAsyncThunk(loginUserAction, {
    errorTitle: 'Login Failed',
    rethrowError: true,
    successTitle: 'Logged in successfully',
  });
  const [resetPasswordOtp] = useAsyncThunk(sendPasswordResetOTPAction, {
    errorTitle: 'Failed to send OTP',
    rethrowError: true,
    successTitle: 'We will send you an OTP',
  });
  const [resetPassword] = useAsyncThunk(resetPasswordAction, {
    errorTitle: 'Reset password failed',
    rethrowError: true,
    successTitle: 'Password reset successfully!',
  });

  const handleLogin = async (values: any) => {
    await login(values);
  };

  const handleSendOtp = async (email: string) => {
    await resetPasswordOtp(email);
  };

  const handleResetPassword = async (values: any) => {
    await resetPassword(values);
    setModalOpen(false);
  };

  const user = useSelector((state: RootState) => {
    return state.auth.user;
  });

  return (
    <WithUser
      inverted={true}
      redirectPath={user && user.role.id === 'USER' ? '/dashboard' : '/organizations'}
    >
      <Head>
        <link rel="shortcut icon" href="/assets/images/sos-logo.svg" />
        <title>{'SoS App - SOS'}</title>
      </Head>

      <FullPageLayout className={c('container')}>
        <header className={c('header')}>
          <nav>
            <Link href="/">
              <a className={c('brand')}>
                <span>S</span>
                <img className={c('logo')} src="/assets/images/sos-logo.svg" alt="o" />
                <span>S</span>
              </a>
            </Link>
          </nav>
        </header>

        <div className={c('content')}>
          <span className={c('brand-name')}>
            <img className={c('super-logo')} src="/assets/images/sos-logo.svg" alt="O" />
            <h4>Snake Oil Software</h4>
          </span>

          <span className={c('hero')}>
            <h1>
              Transparent teams
              <br />
              for mindful development
            </h1>
          </span>

          <span className={c('brief')}>
            <p>
              Missing piece between Jira and Slack, SoS keeps entire team on same page with daily
              commitments, challenges and more.
            </p>
          </span>

          <LoginForm onSubmit={handleLogin} onResetPassword={() => setModalOpen(true)} />
        </div>
        <Modal onClose={() => setModalOpen(false)} isOpen={isModalOpen}>
          <ResetPassword onSendOtp={handleSendOtp} onSubmit={handleResetPassword} />
        </Modal>
      </FullPageLayout>
    </WithUser>
  );
};

export default Index;
