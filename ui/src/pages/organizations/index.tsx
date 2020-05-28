import classNames from 'classnames/bind';
import Head from 'next/head';
import Link from 'next/link';
import FullPageLayout from 'src/components/FullPageLayout';
import style from './style.module.scss';

const c = classNames.bind(style);

const Index = () => {
  return (
    <>
      <Head>
        <title>Snake Oil Software - Organizations</title>
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
          <div className={c('org-container')}>
            <span className={c('org-icon')} />
            <span>You didn't have any Organization</span>
            <Link href="/organizations/add">
              <a className={c('org-add')}>
                <span>Add Organization</span>
              </a>
            </Link>
          </div>
        </div>
      </FullPageLayout>
    </>
  );
};

export default Index;
