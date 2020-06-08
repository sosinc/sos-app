import classNames from 'classnames/bind';

import HEAD from 'next/head';
import Link from 'next/link';

import style from './index.module.scss';
const c = classNames.bind(style);

const Dashboard = () => {
  return (
    <>
      <HEAD>
        <title>SoS - Dashboard</title>
      </HEAD>
      <div className={c('container')}>
        <div className={c('sidebar')}>
          <div className={c('header')}>
            <Link href="/">
              <img className={c('logo-image')} src="/assets/images/sos-logo.svg" alt="o" />
            </Link>
            <div className={c('pic-container')}>
              <img className={c('pic')} src="/assets/images/avatar.svg" alt="pic" />
              <span className={c('online-status')} />
            </div>
            <span className={c('dot-menu-icon')} />
          </div>
          <div className={c('detail')}>Top Bar</div>
          <div className={c('footer')}>
            <span className={c('feedback-icon')} />
            <a className={c('feedback-text')}>Send Feedback</a>
          </div>
        </div>
        <div>Second Half</div>
      </div>
    </>
  );
};

export default Dashboard;
