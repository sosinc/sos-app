import HEAD from 'next/head';
import Link from 'next/link';
import c from './index.module.scss';

const Dashboard = () => {
  return (
    <>
      <HEAD>
        <title>SoS - Dashboard</title>
      </HEAD>
      <div className={c.container}>
        <div className={c.sidebar}>
          <div className={c.header}>
            <Link href="/">
              <img className={c.logoImage} src="/assets/images/sos-logo.svg" alt="o" />
            </Link>
            <div className={c.picContainer}>
              <img className={c.pic} src="/assets/images/avatar.svg" alt="pic" />
              <span className={c.onlineStatus} />
            </div>
            <span className={c.contextMenu} />
          </div>
          <div className={c.detail}>Top Bar</div>
          <div className={c.footer}>
            <span className={c.feedbackIcon} />
            <a className={c.feedbackText}>Send Feedback</a>
          </div>
        </div>
        <div>Second Half</div>
      </div>
    </>
  );
};

export default Dashboard;
