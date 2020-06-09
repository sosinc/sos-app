import classNames from 'classnames/bind';

import Layout from 'src/containers/Layout';
import style from './index.module.scss';
const c = classNames.bind(style);

const Dashboard = () => {
  return (
    <Layout headerTitle={'Snake Oil Software - Dashboard'} redirectPath="/">
      <div className={c('dashboard-container')}>Dashbord</div>
    </Layout>
  );
};

export default Dashboard;
