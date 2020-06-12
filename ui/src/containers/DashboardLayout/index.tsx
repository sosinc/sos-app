import classNames from 'classnames/bind';
import Head from 'next/head';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa';
import { MdBusiness, MdMoreHoriz } from 'react-icons/md';

import WithUser from 'src/containers/WithUser';

import style from './style.module.scss';
const c = classNames.bind(style);

interface LayoutProps {
  title: string;
  Header: React.FC;
}

const Index: React.FC<LayoutProps> = (p) => {
  return (
    <WithUser inverted={false} redirectPath="/">
      <Head>
        <title>{p.title}</title>
      </Head>

      <div className={c('container')}>
        <div className={c('sidebar')}>
          <div className={c('header')}>
            <Link href="/">
              <img className={c('logo-image')} src="/assets/images/sos-logo.svg" alt="o" />
            </Link>
            <div className={c('avatar-container')}>
              <img className={c('pic')} src="/assets/images/avatar.svg" alt="pic" />
              <span className={c('online-status')} />
            </div>

            <MdMoreHoriz title="more" className={c('dot-menu-icon')} />
          </div>

          <div className={c('section')}>
            <div className={c('header-row')}>Admin</div>

            <Link href="/organizations">
              <div className={c('row')}>
                <MdBusiness />
                <span className={c('row-text')}>Organizations</span>
              </div>
            </Link>

            <Link href="/employees">
              <div className={c('row')}>
                <FaUsers />
                <span className={c('row-text')}>Employees</span>
              </div>
            </Link>
          </div>

          <div className={c('footer')}>
            <span className={c('feedback-icon')} />
            <a className={c('feedback-text')}>Send Feedback</a>
          </div>
        </div>

        <div className={c('content')}>
          <div className={c('header-container')}>
            <p.Header />
          </div>

          {p.children}
        </div>
      </div>
    </WithUser>
  );
};

export default Index;