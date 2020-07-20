import classNames from 'classnames/bind';
import { GoGitPullRequest } from 'react-icons/go';
import { MdCheckCircle, MdMoreHoriz, MdRadioButtonUnchecked } from 'react-icons/md';
import { RiPlayListAddLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import SelectBox from 'src/components/Form/SelectBox';
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

const CommitmentRow: React.FC = () => {
  const user = currentUser();
  const projects = user.projects || [];
  const getProject = (id: string) => projects.find((i) => i.id === id);

  const [updateDailyStatus] = useAsyncThunk(updateDailyStatusActions, {
    errorTitle: 'Failed to add statuss',
    rethrowError: true,
    successTitle: 'status added successfully',
  });

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
    const handleChangeStatus = async (status: string) => {
      await updateDailyStatus({ id: p.id, isDelivered: status === 'done' });
    };

    const Logo: React.FC = () => {
      const statusLogo = p.is_delivered ? (
        <MdCheckCircle className={c('row-item')} title={'Todo'} />
      ) : (
        <MdRadioButtonUnchecked className={c('row-item')} title={'Done'} />
      );
      return <>{statusLogo}</>;
    };

    return (
      <div className={c({ skeleton: isFetching })} key={p.id}>
        <div className={c('task-body')}>
          <div className={c('task-row')}>
            <div className={c('row-left-container')}>
              <MdMoreHoriz className={c('row-item')} title={'More'} />
              <span className={c('row-item')} title={p.issue_id ? p.issue_id : 'Issue id'}>
                {p.issue_id ? p.issue_id : '?'}
              </span>
              <SelectBox
                className={c('row-status-item')}
                name={'task-status'}
                options={selectOptions}
                onSelect={handleChangeStatus}
                isDropdownIconHidden={true}
                Header={Logo}
              />
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

export default CommitmentRow;
