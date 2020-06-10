import classNames from 'classnames/bind';
import { AiFillPlusSquare } from 'react-icons/ai';

import Layout from 'src/containers/Layout';
import style from './index.module.scss';
const c = classNames.bind(style);

const Dashboard = () => {
  return (
    <Layout headerTitle={'Snake Oil Software - Dashboard'} redirectPath="/">
      <div className={c('header-container')}>
        <span className={c('header-title')}> Dashboard </span>
        <AiFillPlusSquare title="Open" className={c('plus-icon')} />
      </div>
    </Layout>
  );
};

export default Dashboard;
