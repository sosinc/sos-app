import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Router from 'next/router';
import { useRef, useState } from 'react';
import { GoGitPullRequest } from 'react-icons/go';
import {
  MdCheckCircle,
  MdDelete,
  MdEdit,
  MdMoreVert,
  MdRadioButtonUnchecked,
} from 'react-icons/md';
import { RiPlayListAddLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import SelectBox, { SelectFieldItem } from 'src/components/Form/SelectBox';
import WarningModal from 'src/components/Modal/Warning';
import NoItemsFound from 'src/components/NoItemsFound';
import SlideBar from 'src/components/SlideBar';
import AddDailyTasksForm from 'src/components/Tasks/AddDailyTasksForm';
import FallbackIcon from 'src/containers/FallbackIcon';
import { RootState } from 'src/duck';
import { projectSelector } from 'src/duck/projects';
import {
  deleteDailyTaskAction,
  fetchDailyTasks,
  setDailyTaskStatusAction,
  taskSelector,
} from 'src/duck/tasks';
import { DailyTask } from 'src/entities/Task';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';

import style from './style.module.scss';

const c = classNames.bind(style);
dayjs.extend(relativeTime);

const selectOptions = [
  {
    Logo: () => <MdRadioButtonUnchecked className={c('selectbox-item-icon')} />,
    id: 'todo',
    name: 'Todo',
  },
  {
    Logo: () => <MdCheckCircle className={c('selectbox-item-todo-icon')} />,
    id: 'done',
    name: 'Done',
  },
];

const selectMoreOptions = [
  {
    Logo: () => <MdEdit className={c('row-item')} title={'Edit task'} />,
    id: 'edit',
    name: 'Edit',
  },
  {
    Logo: () => <MdDelete className={c('row-item')} />,
    id: 'delete',
    name: 'Delete',
  },
];

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

const SelectedValue: React.FC<{ item?: SelectFieldItem }> = (p) => {
  if (!p.item || p.item.id === 'todo') {
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

const MoreOptionIcon = () => (
  <Tippy content="More">
    <span>
      <MdMoreVert className={c('row-item')} />
    </span>
  </Tippy>
);

const DailyTaskRow: React.FC<DailyTask & { isFetching: boolean }> = ({ isFetching, ...p }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState({
    subTitle: '',
    title: '',
    type: '',
  });
  const [isSlideBarOpen, setSlideBar] = useState<boolean>(false);
  const [isDirtyPopupOpen, setIsDirtyPopupOpen] = useState<boolean>(false);
  const isDirtyRef = useRef<boolean>(false);

  const project = useSelector((state: RootState) =>
    projectSelector.selectById(state, p.project_id),
  );

  // PERF: If performance becomes a concern, move this to parent
  // and accept onChangeStatus as a prop
  const [setDailyTaskStatus] = useAsyncThunk(setDailyTaskStatusAction, {
    errorTitle: 'Failed to update status',
    rethrowError: true,
    successTitle: 'Status updated successfully',
  });

  const [deleteDailyTask] = useAsyncThunk(deleteDailyTaskAction, {
    errorTitle: 'Failed to delete task',
    rethrowError: true,
    successTitle: 'Task deleted successfully',
  });

  const handleTemplateLink = (id: string, type: string) => {
    const redirectUrl = type === 'pr' ? project?.pr_link_template : project?.issue_link_template;

    if (!redirectUrl) {
      setModalOpen(true);
      setModalMessage({
        subTitle: 'Please configure Issue/PR URL template in project settings',
        title: 'Warning',
        type: 'templeteUrl',
      });
      return;
    }

    window.open(redirectUrl.replace('{{ID}}', id));
  };

  const handleChangeStatus = async (item: { id: string; name: string }) => {
    await setDailyTaskStatus({ id: p.id, isDelivered: item.id === 'done' });
  };

  const prField = (task: DailyTask) => (
    <Tippy content={task.pr_id}>
      <div className={c('pr-container')} onClick={() => handleTemplateLink(task.pr_id, 'pr')}>
        <GoGitPullRequest className={c('pr-icon')} title={'Pr id'} />
        {`#${task.pr_id}`}
      </div>
    </Tippy>
  );

  const handleSelectMoreOptions = (item: { id: string; name: string }) => {
    if (item.id === 'edit') {
      setSlideBar(true);
      return;
    }
    setModalOpen(true);
    setModalMessage({
      subTitle: 'You want to delete this task',
      title: 'Are you sure?',
      type: 'delete',
    });
    return;
  };

  const handleCloseSlideBar = () => {
    if (isDirtyRef.current && !isDirtyPopupOpen) {
      setIsDirtyPopupOpen(true);
      return;
    }

    setSlideBar(false);
    setIsDirtyPopupOpen(false);
  };

  const handlePopupAccept = () => {
    if (modalMessage.type === 'templeteUrl') {
      goToProjectSettings();
      return;
    }
    deleteDailyTask({ taskId: p.id });
    setModalOpen(false);
  };

  const goToProjectSettings = () => {
    Router.push(`/projects/${p.project_id}`);
    setModalOpen(false);
  };

  const dateFromNow = () => {
    const day = dayjs(p.date);
    if (!day.isBefore(dayjs(), 'day')) {
      return 'Today';
    }

    return day.fromNow();
  };

  const editValue = {
    description: p.description || '',
    estimated_hours: p.estimated_hours || 0,
    issue_id: p.issue_id,
    pr_id: p.pr_id,
    project_id: p.project_id,
    title: p.title,
  };

  return (
    <>
      <WarningModal
        onAccept={handlePopupAccept}
        onCancel={() => setModalOpen(false)}
        acceptButtonText={modalMessage.type === 'templeteUrl' ? 'Setting' : 'Ok'}
        closeButtonText="Close"
        isOpen={isModalOpen}
        title={modalMessage.title}
        subTitle={modalMessage.subTitle}
      />

      <SlideBar
        onClose={handleCloseSlideBar}
        isOpen={isSlideBarOpen}
        isDirtyPopupOpen={isDirtyPopupOpen}
        setIsDirtyPopupOpen={setIsDirtyPopupOpen}
      >
        <AddDailyTasksForm
          onClose={handleCloseSlideBar}
          isDirtyRef={isDirtyRef}
          value={[editValue]}
          taskId={p.id}
        />
      </SlideBar>

      <div className={c({ skeleton: isFetching })}>
        <div className={c('task-body')}>
          <div className={c('task-row')}>
            <div className={c('row-left-container')}>
              <Tippy content={p.issue_id ? `Issue id ${p.issue_id}` : 'Issue id'}>
                <span
                  className={c('task-issue')}
                  onClick={() => p.issue_id && handleTemplateLink(p.issue_id, 'issue')}
                >
                  {p.issue_id ? p.issue_id : '?'}
                </span>
              </Tippy>

              <SelectBox
                className={c('row-status-item')}
                name={'task-status'}
                options={selectOptions}
                onSelect={handleChangeStatus}
                value={p.is_delivered ? 'done' : 'todo'}
                isDropdownIconHidden={true}
                Selected={SelectedValue}
              />
              <span className={c('task-title')}>{p.title}</span>
            </div>
            <div className={c('row-right-container')}>
              {p.pr_id && prField(p)}

              <Tippy content={dayjs(p.date).format('DD, MMM YYYY')}>
                <span className={c('row-date')}>{dateFromNow()}</span>
              </Tippy>

              <Tippy content={project?.name}>
                <div className={c('fallback-logo')}>
                  <FallbackIcon logo={project?.logo_square} name={project?.name} />
                </div>
              </Tippy>
              <SelectBox
                className={c('row-status-item')}
                name={'task-status'}
                options={selectMoreOptions}
                onSelect={handleSelectMoreOptions}
                value=""
                isDropdownIconHidden={true}
                Selected={MoreOptionIcon}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DailyTasks: React.FC = () => {
  const [pagination, setPagination] = useState({ limit: 20, offset: 0 });
  const tasks = useSelector(taskSelector.selectAll);

  const dailyTasks = tasks.slice(0, pagination.offset + pagination.limit);
  const hasNext = tasks.length <= pagination.offset + pagination.limit;

  const onPaginationChange = () => {
    const newOffset = pagination.offset + pagination.limit;
    setPagination({ ...pagination, offset: newOffset });
    refetchTasks({ offset: newOffset, limit: pagination.limit + 1 });

    return;
  };

  const [isFetching, refetchTasks] = useQuery(
    (args = { offset: pagination.offset, limit: pagination.limit + 1 }) => fetchDailyTasks(args),
    {
      errorTitle: 'Failed to fetch some Tasks',
    },
  );

  const row = dailyTasks.map((i) => <DailyTaskRow key={i.id} {...i} isFetching={isFetching} />);

  const dailyTasksRows = dailyTasks.length ? (
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

  return <>{dailyTasksRows}</>;
};

export default DailyTasks;
