import classNames from 'classnames/bind';
import Link from 'next/link';
import Layout from 'src/containers/Layout';

import style from './style.module.scss';

const c = classNames.bind(style);

const Index = () => {
  return (
    <Layout headerTitle={'Snake Oil Software - Organizations'} redirectPath="/">
      <span className={c('org-icon')} />
      <span>You didn't have any Organization</span>
      <Link href="/organizations/add">
        <a className={c('org-add', 'org-container')}>
          <span>Add Organization</span>
        </a>
      </Link>
    </Layout>
  );
};

export default Index;
