import classNames from 'classnames/bind';
import { useState } from 'react';
import { MdAdd, MdMoreHoriz, MdRadioButtonUnchecked } from 'react-icons/md';
import { RiNewspaperLine, RiPlayListAddLine } from 'react-icons/ri';

import DailyStatusForm from 'src/components/DailyStatusForm';
import NoItemsFound from 'src/components/NoItemsFound';
import SlideBar from 'src/components/SlideBar';
import DashboardLayout from 'src/containers/DashboardLayout';

import style from './style.module.scss';

const c = classNames.bind(style);

const commitments = [];
const Header: React.FC<{ openSlidebar: () => void }> = (p) => (
  <div className={c('header')}>
    Today's Commitments
    <span className={c('add-button')} title="Add" onClick={p.openSlidebar}>
      <MdAdd className={c('icon')} />
    </span>
  </div>
);

const CommitmentRow: React.FC = () => (
  <div className={c('commitments-body')}>
    <div className={c('status-row')}>
      <div className={c('status-row-left')}>
        <MdMoreHoriz className={c('row-item')} />
        <span className={c('row-item')}>CHSL-34</span>
        <MdRadioButtonUnchecked />
        <span>Fix bug</span>
      </div>
      <div className={c('status-row-right')}>
        <MdRadioButtonUnchecked />
      </div>
    </div>
  </div>
);

const NoTodaysCommitment: React.FC<{ addItemCb: () => void }> = (p) => (
  <div className={c('not-found-container')}>
    <NoItemsFound
      Icon={RiPlayListAddLine}
      message=" You haven't added a status update for today."
      addItemText="Add one"
      addItemUrl=""
      addItemCb={p.addItemCb}
    />
  </div>
);

const Dashboard = () => {
  const [isOpen, setOpen] = useState(true);
  const commitmentData = commitments.length ? (
    <CommitmentRow />
  ) : (
    <NoTodaysCommitment addItemCb={() => setOpen(true)} />
  );

  return (
    <DashboardLayout
      title={'Dashboard - Snake Oil Software'}
      Header={() => <Header openSlidebar={() => setOpen(true)} />}
    >
      <SlideBar onClose={() => setOpen(false)} isOpen={isOpen}>
        <DailyStatusForm onClose={() => setOpen(false)} />
      </SlideBar>
      <div className={c('container')}>
        <div className={c('todays-commitments')}>{commitmentData}</div>

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
