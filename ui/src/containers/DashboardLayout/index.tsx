import classNames from 'classnames/bind';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import {
  MdBusiness,
  MdFolder,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdMoreHoriz,
} from 'react-icons/md';
import { useSelector } from 'react-redux';

import SelectBox from 'src/components/Form/SelectBox';
import ContextMenu from 'src/components/Modal/ContextMenu';
import FallbackIcon from 'src/containers/FallbackIcon';
import WithUser from 'src/containers/WithUser';
import { logoutUserAction } from 'src/duck/auth';
import { orgSelector } from 'src/duck/organizations';
import { teamSelector } from 'src/duck/teams';
import { Organization } from 'src/entities/Organizations';
import { Project } from 'src/entities/Project';
import { Team } from 'src/entities/Team';
import { currentUser } from 'src/entities/User/selectors';
import { useAsyncThunk } from 'src/lib/asyncHooks';
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
  const currentRoute = Router.pathname;
  const name =
    currentRoute !== '/dashboard' ? (
      <Link href={`/projects/${t.project_id}/teams/${t.id}`}>
        <a className={c('linked-team-row-text')}>{t.name}</a>
      </Link>
    ) : (
      <span className={c('team-row-text')}>{t.name}</span>
    );

  return (
    <div className={c('team-row')} key={t.id}>
      <div className={c('team-fallback-icon')}>
        <FallbackIcon logo={t.logo_square} name={t.name} />
      </div>
      {name}
    </div>
  );
};

const UserProject: React.FC<Project> = ({ ...item }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const currentRoute = Router.pathname;
  const allTeams = useSelector(teamSelector.selectAll);
  const teams = allTeams.filter((t) => t.project_id === item.id);
  const menuIcon = isMenuOpen ? (
    <MdKeyboardArrowDown className={c('row-menu-icon')} />
  ) : (
    <MdKeyboardArrowRight className={c('row-menu-icon')} />
  );

  const name =
    currentRoute !== '/dashboard' ? (
      <Link href={`/projects/${item.id}`}>
        <a className={c('linked-row-text')}>{item.name}</a>
      </Link>
    ) : (
      <span className={c('row-text')}>{item.name}</span>
    );

  return (
    <>
      <div className={c('project-row')}>
        <div className={c('project-container')}>
          <div className={c('fallback-icon')}>
            <FallbackIcon logo={item.logo_square} name={item.name} />
          </div>
          {name}
        </div>
        <div className={c('row-menu-container')} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {menuIcon}
        </div>
      </div>

      {isMenuOpen && teams.map(team)}
    </>
  );
};

const UserContext: React.FC = () => {
  const [logout] = useAsyncThunk(logoutUserAction, {
    errorTitle: 'Logout Failed',
    rethrowError: true,
    successTitle: 'Logout successfully',
  });

  const handleLogout = async () => {
    await logout();
    Router.replace(`/`);
  };

  return (
    <>
      <div className={c('pointer')} />
      <div className={c('context-box')}>
        <div className={c('context-container')}>
          <Link href={'/profile'}>
            <a className={c('context-item')}>Settings</a>
          </Link>
          <Link href={'/profile'}>
            <a className={c('context-item')}>Profile</a>
          </Link>
          <span className={c('separator')} />
          <span className={c('context-item')} onClick={handleLogout}>
            Logout
          </span>
        </div>
      </div>
    </>
  );
};

const OrgSelectBox: React.FC<{ activeOrg?: Organization }> = ({ activeOrg: o }) => {
  const organizations = useSelector(orgSelector.selectAll);
  const handleOrgChange = () => {
    // console.warn('-----change');
    return;
  };

  const currentOrgLogo = (
    <div className={c('logo-image', 'fallback-icon')} title={o?.name || 'No Organization'}>
      <FallbackIcon logo={o?.square_logo} name={o?.name} />
    </div>
  );

  if (!o) {
    return <Link href={'/organizations'}>{currentOrgLogo}</Link>;
  }

  return (
    <SelectBox
      className={c('org-select-box')}
      options={organizations.map((org) => ({ ...org, logo: org.square_logo }))}
      onSelect={handleOrgChange}
      value={o.id || ''}
      isDropdownIconHidden={true}
      Selected={() => currentOrgLogo}
    />
  );
};

const Index: React.FC<LayoutProps> = (p) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const user = currentUser();
  const role = user.role?.id;
  const projects = user.projects ? user.projects : [];
  const activeOrg = user.organization;

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

      <ContextMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)}>
        <UserContext />
      </ContextMenu>

      <div className={c('container')}>
        <div className={c('sidebar')}>
          <div className={c('header')}>
            <OrgSelectBox activeOrg={activeOrg} />

            <div className={c('avatar-container')} onClick={() => setIsUserMenuOpen(true)}>
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
