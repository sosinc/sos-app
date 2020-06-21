import classNames from 'classnames/bind';
import Link from 'next/link';
import { MdAdd, MdMoreHoriz, MdRadioButtonUnchecked } from 'react-icons/md';

import DashboardLayout from 'src/containers/DashboardLayout';
import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    Today's Commitments
    <Link href="/">
      <a className={c('add-button')} title="Add">
        <MdAdd className={c('icon')} />
      </a>
    </Link>
  </div>
);

const CommitmentRow: React.FC = (p) => (
  <div className={c('commitments-body')}>
    <div className={c('status-row')}>{p.children}</div>
  </div>
);

const Dashboard = () => {
  return (
    <DashboardLayout title={'Dashboard - Snake Oil Software'} Header={Header}>
      <div className={c('container')}>
        <div className={c('todays-commitments')}>
          <CommitmentRow>
            <div className={c('status-row-left')}>
              <MdMoreHoriz className={c('row-item')} />
              <span className={c('row-item')}>CHSL-34</span>
              <MdRadioButtonUnchecked />
              <span>Fix bug</span>
            </div>
            <div className={c('status-row-right')}>
              <MdRadioButtonUnchecked />
            </div>
          </CommitmentRow>
        </div>

        <div className={c('team-activity')}>
          <div className={c('activity-header')}>
            <span>Team Activity</span>
            <span className={c('activity-filter')}>+Filter</span>
          </div>

          <div className={c('activity-feed')}>null</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
