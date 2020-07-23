import classNames from 'classnames/bind';
import { useState } from 'react';
import { GoGitPullRequest } from 'react-icons/go';
import { MdCheckCircle, MdMoreHoriz, MdRadioButtonUnchecked } from 'react-icons/md';
import { RiPlayListAddLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import Router from 'next/router';

import SelectBox, { SelectFieldItem } from 'src/components/Form/SelectBox';
import WarningModal from 'src/components/Modal/Warning';
import NoItemsFound from 'src/components/NoItemsFound';
import FallbackIcon from 'src/containers/FallbackIcon';
import { fetchDailyTasks, taskSelector, updateDailyStatusActions } from 'src/duck/tasks';
import { DailyTask } from 'src/entities/Task';
import { currentUser } from 'src/entities/User/selectors';
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

const DailyTasks: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [projectId, setProjectId] = useState('');

  const [updateDailyStatus] = useAsyncThunk(updateDailyStatusActions, {
    errorTitle: 'Failed to add statuss',
    rethrowError: true,
    successTitle: 'status added successfully',
  });

  const [isFetching] = useQuery(fetchDailyTasks, {
    errorTitle: 'Failed to fetch some Tasks',
  });

  const user = currentUser();
  const projects = user.projects || [];
  const getProject = (id: string) => projects.find((i) => i.id === id);
  const dailyTasks = useSelector(taskSelector.selectAll);

  const checkTemplateLink = (id: string, projectid: string, type: string) => {
    const project = getProject(projectid);
    const redirectUrl = type === 'pr' ? project?.pr_link_template : project?.issue_link_template;

    if (!redirectUrl) {
      setModalOpen(true);
      setProjectId(projectid);
      return;
    }

    window.open(redirectUrl.replace('{{ID}}', id));
  };

  const prField = (task: DailyTask) => (
    <div
      className={c('pr-container')}
      onClick={() => checkTemplateLink(task.pr_id, task.project_id, 'pr')}
    >
      <GoGitPullRequest className={c('pr-icon')} title={'Pr id'} />
      {`#${task.pr_id}`}
    </div>
  );

  const ListingItem: React.FC<DailyTask> = (p) => {
    const handleChangeStatus = async (item: { id: string; name: string }) => {
      await updateDailyStatus({ id: p.id, isDelivered: item.id === 'done' });
    };

    return (
      <div className={c({ skeleton: isFetching })} key={p.id}>
        <div className={c('task-body')}>
          <div className={c('task-row')}>
            <div className={c('row-left-container')}>
              <MdMoreHoriz className={c('row-item')} title={'More'} />
              <span
                className={c('task-issue')}
                title={p.issue_id ? p.issue_id : 'Issue id'}
                onClick={() => p.issue_id && checkTemplateLink(p.issue_id, p.project_id, 'issue')}
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

  const setTemplateUrl = () => {
    Router.push(`/projects/${projectId}`);
    setModalOpen(false);
  };

  return (
    <>
      <WarningModal
        onAccept={setTemplateUrl}
        onCancel={() => setModalOpen(false)}
        isOpen={isModalOpen}
        title={'Warning'}
        subTitle={'Please configure Issue/PR URL template in project settings'}
      />
      {dailyTasks.length ? dailyTasks.map((i) => ListingItem({ ...i })) : <NoTodaysCommitment />}
    </>
  );
};

export default DailyTasks;
