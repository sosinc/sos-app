import classNames from 'classnames/bind';
import Link from 'next/link';
import { MdAdd, MdFolder } from 'react-icons/md';

import NoItemsFound from 'src/components/NoItemsFound';
import ProjectList from 'src/components/Projects/List';
import DashboardLayout from 'src/containers/DashboardLayout';
import { currentUser } from 'src/entities/User/selectors';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    Projects
    <Link href="/projects/add">
      <a className={c('add-button')} title="Add project">
        <MdAdd className={c('icon')} />
      </a>
    </Link>
  </div>
);

const Index = () => {
  const user = currentUser();
  const projects = user.projects ? user.projects : [];

  if (!projects.length) {
    return (
      <div className={c('not-found-container')}>
        <NoItemsFound
          Icon={MdFolder}
          message="No Projects found"
          addItemText="Add a project"
          addItemUrl="/projects/add"
        />
      </div>
    );
  }

  return <ProjectList projects={projects} />;
};

export default () => (
  <DashboardLayout title={'Snake Oil Software - Projects'} Header={Header}>
    <Index />
  </DashboardLayout>
);