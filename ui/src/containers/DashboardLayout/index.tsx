import classNames from 'classnames/bind';
import Head from 'next/head';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa';
import {
  MdBusiness,
  MdFolder,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdMoreHoriz,
} from 'react-icons/md';
import { useSelector } from 'react-redux';

import { useState } from 'react';
import FallbackIcon from 'src/containers/FallbackIcon';
import WithUser from 'src/containers/WithUser';
import { teamSelector } from 'src/duck/teams';
import { Project } from 'src/entities/Project';
import { Team } from 'src/entities/Team';
import { currentUser } from 'src/entities/User/selectors';
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

    <Link href="/projects">
      <div className={c('row')}>
        <MdFolder />
        <span className={c('row-text')}>Projects</span>
      </div>
    </Link>
  </>
);

const team = (t: Team) => {
  return (
    <div className={c('team-row')} key={t.id}>
      <div className={c('team-fallback-icon')}>
        <FallbackIcon logo={t.logo_square} name={t.name} />
      </div>
      <span className={c('team-row-text')}>{t.name}</span>
    </div>
  );
};

const UserProject: React.FC<Project> = ({ ...item }) => {
  const [isMenuOpen, setMenu] = useState<boolean>(false);
  const allTeams = useSelector(teamSelector.selectAll);
  const teams = allTeams.filter((t) => t.project_id === item.id);
  const menuIcons = isMenuOpen ? (
    <MdKeyboardArrowDown className={c('row-menu-icon')} />
  ) : (
    <MdKeyboardArrowRight className={c('row-menu-icon')} />
  );

  return (
    <>
      <div className={c('project-row')} key={item.id}>
        <div className={c('project-container')}>
          <div className={c('fallback-icon')}>
            <FallbackIcon logo={item.logo_square} name={item.name} />
          </div>
          <span className={c('row-text')}>{item.name}</span>
        </div>
        <div className={c('row-menu-container')} onClick={() => setMenu(!isMenuOpen)}>
          {menuIcons}
        </div>
      </div>

      {isMenuOpen && teams.map(team)}
    </>
  );
};

const Index: React.FC<LayoutProps> = (p) => {
  const user = currentUser();
  const role = user.role?.id;
  const projects = user.projects ? user.projects : [];
  const organization = user.organization;

  const userSection = () => {
    const userProjects = projects.map((i) => <UserProject key={i.id} {...i} />);

    return (
      <>
        <Link href="/projects">
          <div className={c('header-row')}> Projects</div>
        </Link>
        {userProjects}
      </>
    );
  };

  return (
    <WithUser inverted={false} redirectPath={'/'}>
      <Head>
        <link rel="shortcut icon" href="/assets/images/sos-logo.svg" />
        <title>{p.title}</title>
      </Head>

      <div className={c('container')}>
        <div className={c('sidebar')}>
          <div className={c('header')}>
            <Link href={role === 'USER' ? '/' : '/organizations'}>
              <div className={c('logo-image', 'fallback-icon')} title={organization?.name}>
                <FallbackIcon logo={organization?.square_logo} name={organization?.name} />
              </div>
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

          <div className={c('section')}>{role !== 'USER' ? adminSection : userSection()}</div>

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
