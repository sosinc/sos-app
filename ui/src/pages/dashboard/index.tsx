import classNames from 'classnames/bind';
import Link from 'next/link';
import { useState } from 'react';
import { MdAdd, MdMoreHoriz, MdKeyboardReturn, MdRadioButtonUnchecked } from 'react-icons/md';
import { RiNewspaperLine, RiPlayListAddLine } from 'react-icons/ri';
import { GoIssueOpened, GoGitPullRequest } from 'react-icons/go';

import NoItemsFound from 'src/components/NoItemsFound';
import DashboardLayout from 'src/containers/DashboardLayout';
import style from './style.module.scss';

import SlideBar from 'src/components/SlideBar';

const c = classNames.bind(style);

const commitments = [];
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

const SlideBarHader: React.FC = () => (
  <div className={c('add-todays-status')}>
    <span className={c('add-title')}> Add Today's Status</span>
    <div className={c('add-buttons')}>
      <span className={c('cancel-button')}>Cancel</span>
      <span className={c('slide-bar-button')}>Save</span>
    </div>
  </div>
);

const StatusRow: React.FC = () => (
  <div className={c('add-status-body')}>
    <div className={c('add-status-row')}>
      <input className={c('add-status')} type={'text'} placeholder="Status" />
      <span className={c('enter-icon-container')}>
        <MdKeyboardReturn />
      </span>
      <div className={c('add-row-items')}>
        <div className={c('add-status-item')}>
          <GoIssueOpened className={c('add-item-icon')} />
          Issues
        </div>
        <div className={c('add-status-item')}>
          <GoGitPullRequest className={c('add-item-icon')} />
          PR
        </div>
        <div className={c('add-status-item')}>
          <GoIssueOpened className={c('add-item-icon')} />
          Name
        </div>
      </div>
    </div>
  </div>
);

const noTodaysCommitment = (
  <div className={c('not-found-container')}>
    <NoItemsFound
      Icon={RiPlayListAddLine}
      message=" You haven't added a status update for today."
      addItemText="Add one"
      addItemUrl=""
    />
  </div>
);

const Dashboard = () => {
  const [isOpen, setOpen] = useState(true);

  return (
    <DashboardLayout title={'Dashboard - Snake Oil Software'} Header={Header}>
      <button onClick={() => setOpen(!isOpen)}>Show</button>
      <SlideBar onClose={() => setOpen(false)} isOpen={isOpen} Header={SlideBarHader}>
        <StatusRow />
      </SlideBar>
      <div className={c('container')}>
        <div className={c('todays-commitments')}>
          {commitments.length ? <CommitmentRow /> : noTodaysCommitment}
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
