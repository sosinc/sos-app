import classNames from 'classnames/bind';
import DashboardLayout from 'src/containers/DashboardLayout';

import style from './index.module.scss';
const c = classNames.bind(style);

const Header: React.FC = () => <div className={c('header')}>Dashboard</div>;

const Dashboard = () => {
  return (
    <DashboardLayout title={'Snake Oil Software - Dashboard'} Header={Header}>
      <span>dashboard</span>
    </DashboardLayout>
  );
};

export default Dashboard;
