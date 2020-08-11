import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { GoGitPullRequest } from 'react-icons/go';
import { MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';
import { RiNewspaperLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import NoItemsFound from 'src/components/NoItemsFound';
import FallbackIcon from 'src/containers/FallbackIcon';
import { RootState } from 'src/duck';
import { projectSelector } from 'src/duck/projects';

import style from './style.module.scss';

import { currentUser } from 'src/entities/User/selectors';
// import { useQuery } from 'src/lib/asyncHooks';
// import { activitySelector, fetchTaskActivites } from 'src/duck/activity';

const c = classNames.bind(style);
dayjs.extend(relativeTime);

// const NoTodaysCommitment: React.FC<{ addItemCb: () => void }> = (p) => (
const NoTodaysCommitment = () => (
  <div className={c('not-found-container')}>
    <NoItemsFound
      Icon={RiNewspaperLine}
      message=" There is no activity from your team yet"
      addItemText=""
      addItemUrl=""
    />
  </div>
);

const TaskStatus: React.FC<{ status: boolean }> = (p) => {
  if (p.status) {
    return (
      <Tippy content={<span>Todo</span>}>
        <span>
          <MdRadioButtonUnchecked className={c('row-item-icon')} />
        </span>
      </Tippy>
    );
  }

  return (
    <Tippy content={<span>Done</span>}>
      <span>
        <MdCheckCircle className={c('row-item-icon', 'done-icon')} />
      </span>
    </Tippy>
  );
};

const TaskActivityRow: React.FC<any & { isFetching: boolean }> = ({ isFetching, ...p }) => {
  const project = useSelector((state: RootState) =>
    projectSelector.selectById(state, p.project_id),
  );

  const prField = (task: any) => (
    <Tippy content={task.pr_id}>
      <div className={c('pr-container')}>
        <GoGitPullRequest className={c('pr-icon')} />
        <div className={c('pr-text')}>{`#${task.pr_id}`}</div>
      </div>
    </Tippy>
  );

  return (
    <div className={c({ skeleton: isFetching })} key={p.id}>
      <div className={c('task-body')}>
        <div className={c('task-row')}>
          <div className={c('row-left-container')}>
            <Tippy content={p.issue_id ? `Issue id ${p.issue_id}` : 'Issue id'}>
              <span className={c('task-issue')}>{p.issue_id ? p.issue_id : '?'}</span>
            </Tippy>
            <div className={c('row-status-item')}>
              <TaskStatus status={p.is_delivered} />
            </div>
            <span className={c('task-title')}>{p.title}</span>
          </div>
          <div className={c('row-right-container')}>
            {p.pr_id && prField(p)}

            <Tippy content={project?.name}>
              <div className={c('fallback-logo')}>
                <FallbackIcon logo={project?.logo_square} name={project?.name} />
              </div>
            </Tippy>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivitiesRow: React.FC<any & { isFetching: boolean }> = ({ isFetching, ...p }) => {
  const user = currentUser();

  const dateFromNow = () => {
    const day = dayjs(p.date);
    if (!day.isBefore(dayjs(), 'day')) {
      return 'Today';
    }

    return day.fromNow();
  };

  return (
    <>
      <div className={c({ skeleton: isFetching })}>
        <div className={c('container')}>
          <div className={c('user-container')}>
            <div className={c('user-logo')}>
              <FallbackIcon logo={user.avatar} name={user.name} />
            </div>
            <span className={c('user-info')}>
              <span>{user.name} added status</span>
              <Tippy content={dayjs(p.date).format('DD, MMM YYYY')}>
                <span className={c('task-time')}>{dateFromNow()}</span>
              </Tippy>
            </span>
          </div>

          <div className={c('activites')}>
            {p.tasks.map((i: any) => TaskActivityRow({ ...i, isFetching: false }))}
          </div>
        </div>
      </div>
    </>
  );
};

const TasksActivity: React.FC = () => {
  /* const tasksActivities = useSelector(activitySelector.selectAll);
   * const [isFetching] = useQuery(fetchTaskActivites, {
   *   errorTitle: 'Failed to fetch some Tasks activities',
   * }); */

  const activites = [
    {
      date: '',
      id: '3f444-d16a1cff-840f-4587-bd4d-562b14c71092',
      taskType: 'added',
      tasks: [
        {
          id: '000-0-232-0l',
          is_delivered: false,
          issue_id: '000-ee',
          pr_id: '80sd-ds',
          project_id: 'da33aaa9-b304-40ab-8b5b-aa4852105069',
          title: 'Fix some issues',
        },
        {
          id: '000-0-232-099090',
          is_delivered: true,
          issue_id: '000-ee',
          pr_id: '80sd-ds',
          project_id: 'da33aaa9-b304-40ab-8b5b-aa4852105069',
          title: 'Working on some issues',
        },
      ],
    },
    {
      date: '',
      id: '3f444-d16a1cff-840f-4587-bd4d-562b14c71092',
      taskType: 'added',
      tasks: [
        {
          id: '000-0-232-0l',
          is_delivered: false,
          issue_id: '000-ee',
          pr_id: '80sd-ds',
          project_id: 'da33aaa9-b304-40ab-8b5b-aa4852105069',
          title: 'Working on some buges',
        },
      ],
    },
  ];
  // const [isFetching] = false;
  const activityRow = activites.length ? (
    activites.map((i, index) => <ActivitiesRow key={index} {...i} isFetching={false} />)
  ) : (
    <NoTodaysCommitment />
  );

  return <>{activityRow}</>;
};

export default TasksActivity;
