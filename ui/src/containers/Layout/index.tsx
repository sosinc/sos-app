import Head from 'next/head';
import Link from 'next/link';
import FullPageLayout from 'src/components/FullPageLayout';
import WithUser from 'src/containers/WithUser';

import c from './style.module.scss';

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

      <FullPageLayout className={c.container}>
        <header className={c.header}>
          <nav>
            <Link href="/">
              <a className={c.brand}>
                <span>S</span>
                <img className={c.logo} src="/assets/images/sos-logo.svg" alt="o" />
                <span>S</span>
              </a>
            </Link>
          </nav>
        </header>

        <div className={c.content}>{p.children}</div>
      </FullPageLayout>
    </WithUser>
  );
};

export default Index;
