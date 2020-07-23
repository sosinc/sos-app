import classNames from 'classnames/bind';
import Router from 'next/router';
import { useState } from 'react';
import { GoGitPullRequest } from 'react-icons/go';
import { MdCheckCircle, MdMoreHoriz, MdRadioButtonUnchecked } from 'react-icons/md';
import { RiPlayListAddLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import SelectBox, { SelectFieldItem } from 'src/components/Form/SelectBox';
import WarningModal from 'src/components/Modal/Warning';
import NoItemsFound from 'src/components/NoItemsFound';
import FallbackIcon from 'src/containers/FallbackIcon';
import { RootState } from 'src/duck';
import { projectSelector } from 'src/duck/projects';
import { fetchDailyTasks, taskSelector, updateDailyStatusActions } from 'src/duck/tasks';
import { DailyTask } from 'src/entities/Task';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';

import style from './style.module.scss';

const c = classNames.bind(style);

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
    return <MdRadioButtonUnchecked className={c('row-item-icon')} title={'Done'} />;
  }

  return <MdCheckCircle className={c('row-item-icon', 'done-icon')} title={'Todo'} />;
};

const DailyTaskRow: React.FC<DailyTask & { isFetching: boolean }> = ({ isFetching, ...p }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const project = useSelector((state: RootState) =>
    projectSelector.selectById(state, p.project_id),
  );

  // PERF: If performance becomes a concern, move this to parent
  // and accept onChangeStatus as a prop
  const [updateDailyStatus] = useAsyncThunk(updateDailyStatusActions, {
    errorTitle: 'Failed to add statuss',
    rethrowError: true,
    successTitle: 'status added successfully',
  });

  const handleTemplateLink = (id: string, type: string) => {
    const redirectUrl = type === 'pr' ? project?.pr_link_template : project?.issue_link_template;

    if (!redirectUrl) {
      setModalOpen(true);
      return;
    }

    window.open(redirectUrl.replace('{{ID}}', id));
  };

  const handleChangeStatus = async (item: { id: string; name: string }) => {
    await updateDailyStatus({ id: p.id, isDelivered: item.id === 'done' });
  };

  const prField = (task: DailyTask) => (
    <div className={c('pr-container')} onClick={() => handleTemplateLink(task.pr_id, 'pr')}>
      <GoGitPullRequest className={c('pr-icon')} title={'Pr id'} />
      {`#${task.pr_id}`}
    </div>
  );

  const goToProjectSettings = () => {
    Router.push(`/projects/${p.project_id}`);
    setModalOpen(false);
  };

  return (
    <>
      <WarningModal
        onAccept={goToProjectSettings}
        onCancel={() => setModalOpen(false)}
        acceptButtonText={'Setting'}
        closeButtonText="Close"
        isOpen={isModalOpen}
        title={'Warning'}
        subTitle={'Please configure Issue/PR URL template in project settings'}
      />

      <div className={c({ skeleton: isFetching })}>
        <div className={c('task-body')}>
          <div className={c('task-row')}>
            <div className={c('row-left-container')}>
              <MdMoreHoriz className={c('row-item')} title={'More'} />
              <span
                className={c('task-issue')}
                title={p.issue_id ? p.issue_id : 'Issue id'}
                onClick={() => p.issue_id && handleTemplateLink(p.issue_id, 'issue')}
              >
                {p.issue_id ? p.issue_id : '?'}
              </span>
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
              <div className={c('fallback-logo')} title={project?.name}>
                <FallbackIcon logo={project?.logo_square} name={project?.name} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DailyTasks: React.FC = () => {
  const dailyTasks = useSelector(taskSelector.selectAll);
  const [isFetching] = useQuery(fetchDailyTasks, {
    errorTitle: 'Failed to fetch some Tasks',
  });

  const dailyTasksRows = dailyTasks.length ? (
    dailyTasks.map((i) => <DailyTaskRow key={i.id} {...i} isFetching={isFetching} />)
  ) : (
    <NoTodaysCommitment />
  );

  return <>{dailyTasksRows}</>;
};

export default DailyTasks;
