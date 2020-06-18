import classNames from 'classnames/bind';
import Head from 'next/head';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa';
import { MdBusiness, MdFolder, MdMoreHoriz } from 'react-icons/md';
import { useSelector } from 'react-redux';

import WithUser from 'src/containers/WithUser';
import { RootState } from 'src/duck';
import { AuthState } from 'src/duck/auth';
import { EmployeeState } from 'src/duck/employee';
import { ProjectState } from 'src/duck/project';

import style from './style.module.scss';
const c = classNames.bind(style);

interface LayoutProps {
  title: string;
  Header: React.FC;
}

const adminSection = (
  <>
    <div className={c('header-row')}>Admin</div>
    <Link href="/organizations">
      <div className={c('row')}>
        <MdBusiness />
        <span className={c('row-text')}>Organizations</span>
      </div>
    </Link>

    <Link href="/employees">
      <div className={c('row')}>
        <FaUsers />
        <span className={c('row-text')}>Employees</span>
      </div>
    </Link>
  </>
);

const project = (item: any) => {
  return (
    <Link href="/projects" key={item.id}>
      <div className={c('row')}>
        <MdFolder />
        <span className={c('row-text')}>{item.name}</span>
      </div>
    </Link>
  );
};

const Index: React.FC<LayoutProps> = (p) => {
  const { user, activeEmployeeId } = useSelector<RootState, AuthState>((state) => state.auth);
  const role = user?.role.id;

  const { projects } = useSelector<RootState, ProjectState>((state) => state.projects);
  const { employees } = useSelector<RootState, EmployeeState>((state) => state.employees);
  const orgId = activeEmployeeId?.length
    ? employees.find((e) => e.ecode === activeEmployeeId)
    : null;
  const userProjects = projects.length
    ? projects.filter((pro) => pro.organization_id === orgId?.organization_id)
    : [];

  const userSection = (
    <>
      <div className={c('header-row')}> Projects</div>
      {userProjects.map((pro) => project(pro))}
    </>
  );

  return (
    <WithUser inverted={false} redirectPath="/">
      <Head>
        <title>{p.title}</title>
      </Head>

      <div className={c('container')}>
        <div className={c('sidebar')}>
          <div className={c('header')}>
            <Link href="/">
              <img className={c('logo-image')} src="/assets/images/sos-logo.svg" alt="o" />
            </Link>
            <div className={c('avatar-container')}>
              <img
                className={c('pic')}
                src="/assets/images/avatar.svg"
                alt="pic"
                title={user?.name}
              />
              <span className={c('online-status')} />
            </div>

            <MdMoreHoriz title="more" className={c('dot-menu-icon')} />
          </div>

          <div className={c('section')}>{role !== 'USER' ? adminSection : userSection}</div>

          <div className={c('footer')}>
            <span className={c('feedback-icon')} />
            <a className={c('feedback-text')}>Send Feedback</a>
          </div>
        </div>

        <div className={c('content')}>
          <div className={c('header-container')}>
            <p.Header />
          </div>

          {p.children}
        </div>
      </div>
    </WithUser>
  );
};

export default Index;
