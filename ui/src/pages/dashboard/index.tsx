import classNames from 'classnames/bind';
import { useState } from 'react';
import { GoGitPullRequest } from 'react-icons/go';
import { MdAdd, MdMoreHoriz, MdRadioButtonUnchecked } from 'react-icons/md';
import { RiNewspaperLine, RiPlayListAddLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import { currentUser } from 'src/entities/User/selectors';
import DailyStatusForm from 'src/components/DailyStatusForm';
import NoItemsFound from 'src/components/NoItemsFound';
import SlideBar from 'src/components/SlideBar';
import DashboardLayout from 'src/containers/DashboardLayout';
import FallbackIcon from 'src/containers/FallbackIcon';
import { fetchDailyTasks, taskSelector } from 'src/duck/tasks';
import { DailyTask } from 'src/entities/Task';
import { useQuery } from 'src/lib/asyncHooks';

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

const CommitmentRow: React.FC = () => {
  const user = currentUser();
  const projects = user.projects || [];
  const getProject = (id: string) => projects.find((i) => i.id === id);

  const dailyTasks = useSelector(taskSelector.selectAll);
  const [isFetching] = useQuery(fetchDailyTasks, {
    errorTitle: 'Failed to fetch some Tasks',
  });

  const prField = (prId: string) => (
    <div className={c('pr-container')}>
      <GoGitPullRequest className={c('pr-icon')} title={'Pr id'} />
      {`#${prId}`}
    </div>
  );

  const ListingItem: React.FC<DailyTask> = (p) => {
    return (
      <div className={c({ skeleton: isFetching })} key={p.id}>
        <div className={c('task-body')}>
          <div className={c('task-row')}>
            <div className={c('row-left-container')}>
              <MdMoreHoriz className={c('row-item')} title={'More'} />
              <span className={c('row-item')} title={p.issue_id ? p.issue_id : 'Issue id'}>
                {p.issue_id ? p.issue_id : '?'}
              </span>
              <MdRadioButtonUnchecked className={c('row-item')} />
              <span className={c('task-title')}>{p.title}</span>
            </div>
            <div className={c('row-right-container')}>
              {p.pr_id && prField(p.pr_id)}
              <div className={c('fallback-logo')} title={getProject(p.project_id)?.name}>
                <FallbackIcon
                  logo={getProject(p.project_id)?.logo_square}
                  name={getProject(p.project_id)?.name}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>{dailyTasks.length ? dailyTasks.map((i) => ListingItem({ ...i })) : <NoTodaysCommitment />}</>
  );
};

// const NoTodaysCommitment: React.FC<{ addItemCb: () => void }> = (p) => (
const NoTodaysCommitment = () => (
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
