import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { useRef, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { RiNewspaperLine } from 'react-icons/ri';

import NoItemsFound from 'src/components/NoItemsFound';
import SlideBar from 'src/components/SlideBar';
import AddDailyTasksForm from 'src/components/Tasks/AddDailyTasksForm';
import DailyTasks from 'src/components/Tasks/DailyTasks';
import DashboardLayout from 'src/containers/DashboardLayout';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC<{ openSlidebar: () => void }> = (p) => (
  <div className={c('header')}>
    Today's Commitments
    <Tippy content={'Add Task'}>
      <span className={c('add-button')} onClick={p.openSlidebar}>
        <MdAdd className={c('icon')} />
      </span>
    </Tippy>
  </div>
);

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
      title={'Dashboard - Snake Oil Software'}
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
