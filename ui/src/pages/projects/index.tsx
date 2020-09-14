import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { MdAdd, MdFolder } from 'react-icons/md';
import { useSelector } from 'react-redux';

import config from 'src/config';
import Listing, { ListingItemProps } from 'src/components/Listing';
import NoItemsFound from 'src/components/NoItemsFound';
import DashboardLayout from 'src/containers/DashboardLayout';
import { fetchProjects, projectSelector } from 'src/duck/projects';
import { useQuery } from 'src/lib/asyncHooks';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    Projects
    <Tippy content="Add project">
      <span>
        <Link href="/projects/add">
          <a className={c('add-button')}>
            <MdAdd className={c('icon')} />
          </a>
        </Link>
      </span>
    </Tippy>
  </div>
);

const Index = () => {
  const projects = useSelector(projectSelector.selectAll);

  const [isFetching, refetchProjects] = useQuery(
    (args = { offset: 0, limit: 20 + 1 }) => fetchProjects(args),
    {
      errorTitle: 'Failed to fetch some Projects :-(',
    },
  );

  const handleOffset = (args: { offset: number; limit: number }) => {
    refetchProjects({ offset: args.offset, limit: args.limit });
  };

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

  const listItems: ListingItemProps[] = projects.map((p) => ({
    href: `/projects/${p.id}`,
    id: p.id,
    logo: p.logo_square,
    subtitle: `${p.teams_count} teams`,
    title: p.name,
  }));

  return (
    <div className={c('list-container')}>
      <Listing items={listItems} isFetching={isFetching} onPaginate={handleOffset} />
    </div>
  );
};

export default () => (
  <DashboardLayout title={`Projects - ${config.appName}`} Header={Header}>
    <Index />
  </DashboardLayout>
);
