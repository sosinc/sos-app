import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { GoGitPullRequest } from 'react-icons/go';
import { MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';
import { RiNewspaperLine } from 'react-icons/ri';
import { TiDeleteOutline } from 'react-icons/ti';
import { useSelector } from 'react-redux';

import NoItemsFound from 'src/components/NoItemsFound';
import FallbackIcon from 'src/containers/FallbackIcon';
import { RootState } from 'src/duck';
import { activitySelector, fetchTaskActivites } from 'src/duck/activity';
import { projectSelector } from 'src/duck/projects';
import { ActivityEvent } from 'src/entities/Activity';
import { useQuery } from 'src/lib/asyncHooks';
import groupBy from 'src/lib/groupBy';

import style from './style.module.scss';

const c = classNames.bind(style);
dayjs.extend(relativeTime);

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
      <Tippy content={<span>Pending</span>}>
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

const TaskDeleted = () => {
  return (
    <Tippy content={<span>Deleted</span>}>
      <span>
        <TiDeleteOutline className={c('row-item-icon')} />
      </span>
    </Tippy>
  );
};

interface TaskActivity {
  title: string;
  taskType?: string;
  pr_id: string;
  issue_id: string;
  is_delivered: boolean;
}

const TaskActivityRow: React.FC<TaskActivity & { project_id: string }> = ({ project_id, ...p }) => {
  const project = useSelector((state: RootState) => projectSelector.selectById(state, project_id));

  const prField = (prId: string) => (
    <Tippy content={prId}>
      <div className={c('pr-container')}>
        <GoGitPullRequest className={c('pr-icon')} />
        <div className={c('pr-text')}>{`#${prId}`}</div>
      </div>
    </Tippy>
  );

  if (!project) {
    return null;
  }

  const isDeleted = p.taskType === 'TASK_DELETED';

  const rowStatus = isDeleted ? <TaskDeleted /> : <TaskStatus status={p.is_delivered} />;

  return (
    <div className={c('task-body')}>
      <div className={c('task-row')}>
        <div className={c('row-left-container')}>
          <Tippy content={p.issue_id ? `Issue id ${p.issue_id}` : 'Issue id'}>
            <span className={c('task-issue')}>{p.issue_id ? p.issue_id : '?'}</span>
          </Tippy>
          <div className={c('row-status-item')}>{rowStatus}</div>
          <span className={c(isDeleted ? 'deleted-row' : 'task-title')}>{p.title}</span>
        </div>
        <div className={c('row-right-container')}>
          {p.pr_id && prField(p.pr_id)}

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

interface ActivitiesRowProps {
  events: ActivityEvent[];
  logo: string | undefined;
  title: string;
  subtitle: string;
  isFetching: boolean;
}

const ActivitiesRow: React.FC<ActivitiesRowProps> = (p) => {
  const day = dayjs(p.subtitle);
  const date = day.fromNow();
  const tasks = p.events.map((event) => (
    <TaskActivityRow key={event.id} {...event.payload} project_id={event.project_id} />
  ));

  return (
    <>
      <div className={c('container')}>
        <div className={c('user-container')}>
          <div className={c('user-logo')}>
            <FallbackIcon logo={p.logo} name={p.title} />
          </div>
          <span className={c('user-info')}>
            <span>{p.title}</span>
            <Tippy content={dayjs(p.subtitle).format('DD, MMM YYYY hh:mm a')}>
              <span className={c('task-time')}>{date}</span>
            </Tippy>
          </span>
        </div>

        <div className={c('activites')}>{tasks}</div>
      </div>
    </>
  );
};

const TeamActivity: React.FC = () => {
  const [pagination, setPagination] = useState({ limit: 20, offset: 0 });
  const allActivities = useSelector(activitySelector.selectAll);

  const activities = allActivities.slice(0, pagination.offset + pagination.limit);
  const hasNext = allActivities.length <= pagination.offset + pagination.limit;

  const [isFetching, getTaskActivities] = useQuery(
    (args = { offset: pagination.offset, limit: pagination.limit + 1 }) => fetchTaskActivites(args),
    {},
  );

  const onPaginationChange = () => {
    const newOffset = pagination.offset + pagination.limit;
    setPagination({ ...pagination, offset: newOffset });

    if (!hasNext) {
      getTaskActivities({ offset: newOffset, limit: pagination.limit + 1 });
    }

    return;
  };

  useEffect(() => {
    const reFecth = setInterval(() => {
      onPaginationChange();
    }, 600000);

    return () => {
      clearInterval(reFecth);
    };
  });

  const teamActivities: ActivityEvent[][] = groupBy(activities, 'user_id');
  const sectionProps = teamActivities
    .map((group) => {
      const firstActivity = group[0];

      if (!firstActivity) {
        return null;
      }

      const reGroup = group.filter(
        (v, i, a) => a.findIndex((t) => t.payload.id === v.payload.id) === i,
      );

      const taskType =
        firstActivity.type === 'TASK_ADDED' ? 'added a task' : 'update the task status';
      return {
        events: reGroup,
        logo: firstActivity.user.avatar,
        subtitle: firstActivity.created_at,
        title: `${firstActivity.user.name} ${taskType}`,
      };
    })
    .filter(Boolean) as Array<Omit<ActivitiesRowProps, 'isFetching'>>;

  const row = sectionProps.map((section, index) => (
    <ActivitiesRow key={index} {...section} isFetching={isFetching} />
  ));

  const activityRow = sectionProps.length ? (
    <>
      {row}
      <div className={c('pagination-container')}>
        <button className={c('pagination-button')} onClick={onPaginationChange} disabled={hasNext}>
          More
        </button>
      </div>
    </>
  ) : (
    <NoTodaysCommitment />
  );

  return <>{activityRow}</>;
};

export default TeamActivity;
