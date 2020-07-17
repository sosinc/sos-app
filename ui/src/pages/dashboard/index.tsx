import classNames from 'classnames/bind';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { RiNewspaperLine } from 'react-icons/ri';

import DailyStatusForm from 'src/components/DailyStatusForm';
import CommitmentRow from 'src/components/DailyStatusForm/Listin';
import NoItemsFound from 'src/components/NoItemsFound';
import SlideBar from 'src/components/SlideBar';
import DashboardLayout from 'src/containers/DashboardLayout';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC<{ openSlidebar: () => void }> = (p) => (
  <div className={c('header')}>
    Today's Commitments
    <span className={c('add-button')} title="Add" onClick={p.openSlidebar}>
      <MdAdd className={c('icon')} />
    </span>
  </div>
);

const Dashboard = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <DashboardLayout
      title={'Dashboard - Snake Oil Software'}
      Header={() => <Header openSlidebar={() => setOpen(true)} />}
    >
      <SlideBar onClose={() => setOpen(false)} isOpen={isOpen}>
        <DailyStatusForm onClose={() => setOpen(false)} />
      </SlideBar>
      <div className={c('container')}>
        <div className={c('todays-commitments')}>
          <CommitmentRow />
        </div>

        <div className={c('team-activity')}>
          <div className={c('activity-header')}>
            <span>Team Activity</span>
            <span className={c('activity-filter')}>+Filter</span>
          </div>

          <div className={c('activity-feed')}>
            <div className={c('not-found-container')}>
              <NoItemsFound
                Icon={RiNewspaperLine}
                message=" There is no activity from your team yet"
                addItemText=""
                addItemUrl=""
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
