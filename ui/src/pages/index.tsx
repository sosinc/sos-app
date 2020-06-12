import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';

import Head from 'next/head';
import Link from 'next/link';
import FullPageLayout from 'src/components/FullPageLayout';
import LoginForm from 'src/components/LoginForm';
import WithUser from 'src/containers/WithUser';
import { loginUser } from 'src/duck/auth';

import style from './index.module.scss';
const c = classNames.bind(style);

const Index = () => {
  const dispatch = useDispatch();

  const handleLogin = (values: any) => {
    dispatch(loginUser(values));
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

          <LoginForm onSubmit={handleLogin} />
        </div>
      </FullPageLayout>
    </WithUser>
  );
};

export default Index;
