import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { useRef, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import SlideBar from 'src/components/SlideBar';
import config from 'src/config';
import AddDailyTasksForm from 'src/components/Tasks/AddDailyTasksForm';
import DailyTasks from 'src/components/Tasks/DailyTasks';
import TeamActivity from 'src/components/Tasks/TeamActivity';
import DashboardLayout from 'src/containers/DashboardLayout';
import { currentUser } from 'src/entities/User/selectors';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC<{ openSlidebar: () => void }> = (p) => {
  const user = currentUser();
  const role = user.role?.id;
  const addTask = (
    <Tippy content="Add Task">
      <span className={c('add-button')} onClick={p.openSlidebar}>
        <MdAdd className={c('icon')} />
      </span>
    </Tippy>
  );

  return (
    <div className={c('header')}>
      Today's Commitments
      {role === 'USER' && addTask}
    </div>
  );
};

const Dashboard = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isDirtyPopupOpen, setIsDirtyPopupOpen] = useState<boolean>(false);
  const isDirtyRef = useRef<boolean>(false);

  const handleCloseSlideBar = () => {
    if (isDirtyRef.current && !isDirtyPopupOpen) {
      setIsDirtyPopupOpen(true);
      return;
    }

    setOpen(false);
    setIsDirtyPopupOpen(false);
  };

  return (
    <DashboardLayout
      title={`Dashboard - ${config.appName}`}
      Header={() => <Header openSlidebar={() => setOpen(true)} />}
    >
      <SlideBar
        onClose={handleCloseSlideBar}
        isOpen={isOpen}
        isDirtyPopupOpen={isDirtyPopupOpen}
        setIsDirtyPopupOpen={setIsDirtyPopupOpen}
      >
        <AddDailyTasksForm onClose={handleCloseSlideBar} isDirtyRef={isDirtyRef} />
      </SlideBar>
      <div className={c('container')}>
        <div className={c('todays-commitments')}>
          <DailyTasks />
        </div>

        <div className={c('team-activity')}>
          <div className={c('activity-header')}>
            <span>Team Activity</span>
            <span className={c('activity-filter')}>+Filter</span>
          </div>

          <div className={c('activity-feed')}>
            <TeamActivity />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
