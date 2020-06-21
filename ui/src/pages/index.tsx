import { unwrapResult } from '@reduxjs/toolkit';
import classNames from 'classnames/bind';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import FullPageLayout from 'src/components/FullPageLayout';
import LoginForm from 'src/components/LoginForm';
import Modal from 'src/components/Modal';
import ResetPassword from 'src/components/ResetPassword';
import WithUser from 'src/containers/WithUser';
import { loginUser, resetPassword, sendPasswordResetOTP } from 'src/duck/auth';
import { useFlash } from 'src/duck/flashMessages';

import style from './index.module.scss';

const c = classNames.bind(style);

const Index = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [flash] = useFlash();

  const handleLogin = async (values: any) => {
    try {
      await unwrapResult((await dispatch(loginUser(values))) as any);
      flash('Logged in successfully!');
    } catch (err) {
      flash({
        body: err.message,
        title: 'Login Failed!',
        type: 'error',
      });
    }
  };

  const handleSendOtp = async (email: string) => {
    try {
      await unwrapResult((await dispatch(sendPasswordResetOTP(email))) as any);
      flash('OTP sent successfully!');
    } catch (err) {
      flash({
        body: err.message,
        title: 'Failed to send OTP',
        type: 'error',
      });

      throw err;
    }
  };

  const handleResetPassword = async (values: any) => {
    try {
      await unwrapResult((await dispatch(resetPassword(values))) as any);

      flash({ body: 'Please login with your new password', title: 'Password reset successfully!' });
      setModalOpen(false);
    } catch (err) {
      flash({
        body: err.message,
        title: 'Failed to send OTP',
        type: 'error',
      });
    }
  };

  return (
    <WithUser inverted={true} redirectPath={'/dashboard'}>
      <Head>
        <link rel="shortcut icon" href="/assets/images/sos-logo.svg" />
        <title>SoS App</title>
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
