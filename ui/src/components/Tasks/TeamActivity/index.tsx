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
import { activitySelector, fetchTaskActivites } from 'src/duck/activity';
import { projectSelector } from 'src/duck/projects';
import { taskSelector } from 'src/duck/tasks';
import { Activity } from 'src/entities/Activity';
import { useQuery } from 'src/lib/asyncHooks';

import style from './style.module.scss';

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
  if (!p.status) {
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

const TaskActivityRow: React.FC<{ taskId: string; project_id: string; status: boolean }> = (p) => {
  const project = useSelector((state: RootState) =>
    projectSelector.selectById(state, p.project_id),
  );
  const task = useSelector((state: RootState) => taskSelector.selectById(state, p.taskId));

  const prField = (t: any) => (
    <Tippy content={t.pr_id}>
      <div className={c('pr-container')}>
        <GoGitPullRequest className={c('pr-icon')} />
        <div className={c('pr-text')}>{`#${t.pr_id}`}</div>
      </div>
    </Tippy>
  );

  return (
    <div className={c('task-body')}>
      <div className={c('task-row')}>
        <div className={c('row-left-container')}>
          <Tippy content={task?.issue_id ? `Issue id ${task?.issue_id}` : 'Issue id'}>
            <span className={c('task-issue')}>{task?.issue_id ? task.issue_id : '?'}</span>
          </Tippy>
          <div className={c('row-status-item')}>
            <TaskStatus status={p.status} />
          </div>
          <span className={c('task-title')}>{task?.title}</span>
        </div>
        <div className={c('row-right-container')}>
          {task?.pr_id && prField(p)}

          <Tippy content={project?.name}>
            <div className={c('fallback-logo')}>
              <FallbackIcon logo={project?.logo_square} name={project?.name} />
            </div>
          </Tippy>
        </div>
      </div>
    </div>
  );
};

const ActivitiesRow: React.FC<Activity & { isFetching: boolean }> = ({ isFetching, ...p }) => {
  const dateFromNow = () => {
    const day = dayjs(p.updated_at);
    return day.fromNow();
  };

  const taskType = p.type === 'TASK_ADDED' ? 'added a task' : 'update the task status';

  return (
    <>
      <div className={c({ skeleton: isFetching })}>
        <div className={c('container')}>
          <div className={c('user-container')}>
            <div className={c('user-logo')}>
              <FallbackIcon logo={p.user.avatar} name={p.user.name} />
            </div>
            <span className={c('user-info')}>
              <span>{`${p.user.name} ${taskType}`}</span>
              <Tippy content={dayjs(p.updated_at).format('DD, MMM YYYY')}>
                <span className={c('task-time')}>{dateFromNow()}</span>
              </Tippy>
            </span>
          </div>

          <div className={c('activites')}>
            <TaskActivityRow
              taskId={p.task_id}
              project_id={p.project_id}
              status={p.payload.new_status}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const TeamActivity: React.FC = () => {
  const teamActivities = useSelector(activitySelector.selectAll);
  const [isFetching] = useQuery(fetchTaskActivites, {
    errorTitle: 'Failed to fetch some Tasks activities',
  });

  const activityRow = teamActivities.length ? (
    teamActivities.map((i, index) => <ActivitiesRow key={index} {...i} isFetching={isFetching} />)
  ) : (
    <NoTodaysCommitment />
  );

  return <>{activityRow}</>;
};

export default TeamActivity;
