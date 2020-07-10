import classNames from 'classnames/bind';
import { useState } from 'react';
import { GoGitPullRequest, GoIssueOpened } from 'react-icons/go';
import { MdAdd, MdKeyboardReturn, MdMoreHoriz, MdRadioButtonUnchecked } from 'react-icons/md';
import { RiNewspaperLine, RiPlayListAddLine } from 'react-icons/ri';

import NoItemsFound from 'src/components/NoItemsFound';
import DashboardLayout from 'src/containers/DashboardLayout';
import FallbackIcon from 'src/containers/FallbackIcon';
import { currentUser } from 'src/entities/User/selectors';
import style from './style.module.scss';

import SlideBar from 'src/components/SlideBar';

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

const StatusRowHeader: React.FC<{ onClose: () => void }> = (p) => (
  <div className={c('add-todays-status')}>
    <div className={c('status-header-container')}>
      <span className={c('add-title')}> Add Today's Status</span>
      <div className={c('add-buttons')}>
        <span className={c('cancel-button')} onClick={p.onClose}>
          Cancel
        </span>
        <span className={c('slide-bar-button')}>Save</span>
      </div>
    </div>
  </div>
);

const StatusRow: React.FC = () => {
  const user = currentUser();
  return (
    <div className={c('add-status-body')}>
      <div className={c('add-status-row')}>
        <input className={c('add-status')} type={'text'} placeholder="Status" />
        <span className={c('enter-icon-container')}>
          <MdKeyboardReturn />
        </span>
      </div>
      <div className={c('add-row-items')}>
        <div className={c('add-status-item')}>
          <GoIssueOpened className={c('add-item-icon')} />
          <input className={c('add-issue')} type={'text'} placeholder="Issue" />
        </div>
        <div className={c('add-status-item')}>
          <GoGitPullRequest className={c('add-item-icon')} />
          <input className={c('add-issue')} type={'text'} placeholder="PR" />
        </div>
        <div className={c('add-status-item', 'add-status-user')}>
          <span className={c('add-item-icon')}>
            <FallbackIcon logo={user.avatar} name={user.name} />
          </span>
          <span className={c('add-item-text')}>{user.name} </span>
        </div>
      </div>
    </div>
  );
};

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
  const [isOpen, setOpen] = useState(false);
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
      <SlideBar onClose={() => setOpen(false)} isOpen={isOpen} Header={StatusRowHeader}>
        <StatusRow />
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
