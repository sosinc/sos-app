import classNames from 'classnames/bind';
import Head from 'next/head';
import Link from 'next/link';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { FaUsers, FaRegBuilding } from 'react-icons/fa';
import WithUser from 'src/containers/WithUser';

import style from './style.module.scss';
const c = classNames.bind(style);

interface LayoutProps {
  children: React.ReactNode;
  headerTitle: string;
  inverted?: boolean;
  redirectPath: string;
}

const Index: React.FC<LayoutProps> = (p) => {
  return (
    <WithUser inverted={p.inverted} redirectPath={p.redirectPath}>
      <Head>
        <title>{p.headerTitle}</title>
      </Head>

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
            <AiOutlineEllipsis title="more" className={c('dot-menu-icon')} />
          </div>
          <div className={c('admin-section')}>
            <span>Admin</span>
            <div className={c('organization-container')}>
              <FaRegBuilding />
              <Link href="/organizations">
                <span className={c('admin-section-title')}>Organizations</span>
              </Link>
            </div>
            <div className={c('employee-container')}>
              <FaUsers />
              <Link href="/employees">
                <span className={c('admin-section-title')}>Employees</span>
              </Link>
            </div>
          </div>
          <div className={c('footer')}>
            <span className={c('feedback-icon')} />
            <a className={c('feedback-text')}>Send Feedback</a>
          </div>
        </div>
        <div className={c('content')}>{p.children}</div>
      </div>
    </WithUser>
  );
};

export default Index;
