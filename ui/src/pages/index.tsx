import classNames from 'classnames/bind';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import ResetPassword from 'src/components/ResetPassword';
import FullPageLayout from 'src/components/FullPageLayout';
import LoginForm from 'src/components/LoginForm';
import WithUser from 'src/containers/WithUser';
import { loginUser, sendPasswordResetOTP, resetPassword } from 'src/duck/auth';

import Modal from 'src/components/Modal';
import style from './index.module.scss';

const c = classNames.bind(style);

const Index = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLogin = (values: any) => {
    dispatch(loginUser(values));
  };

  const handleSendOtp = (email: string) => {
    dispatch(sendPasswordResetOTP(email));
  };

  const handleResetPassword = async (values: any) => {
    await dispatch(resetPassword(values));
    setModalOpen(false);
  };

  return (
    <WithUser inverted={true} redirectPath={'/dashboard'}>
      <Head>
        <title>'snake oil software - app'</title>
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
