import classNames from 'classnames/bind';
import Link from 'next/link';
import { MdAdd, MdBusiness } from 'react-icons/md';
import { useSelector } from 'react-redux';

import Listing, { ListingItemProps } from 'src/components/Listing';
import NoItemsFound from 'src/components/NoItemsFound';
import DashboardLayout from 'src/containers/DashboardLayout';
import { fetchOrganizations, orgSelector } from 'src/duck/organizations';
import { useQuery } from 'src/lib/asyncHooks';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    Organizations
    <Link href="/organizations/add">
      <a className={c('add-button')} title="Add organization">
        <MdAdd className={c('icon')} />
      </a>
    </Link>
  </div>
);

const Index = () => {
  const organizations = useSelector(orgSelector.selectAll);

  const [isFetching, refetchOrg] = useQuery(
    (args = { offset: 0, limit: 3 + 1 }) => fetchOrganizations(args),
    {
      errorTitle: 'Failed to fetch some Organizations',
    },
  );

  const handleOffset = (offset: number, limit: number) => {
    refetchOrg({ offset, limit: limit + 1 });
  };

  if (!organizations.length && !isFetching) {
    return (
      <div className={c('not-found-container')}>
        <NoItemsFound
          Icon={MdBusiness}
          message="No Organizations found"
          addItemText="Add an Organization"
          addItemUrl="/organizations/add"
        />
      </div>
    );
  }

  const listItems: ListingItemProps[] = organizations.map((o) => ({
    href: `/organizations/${o.id}`,
    id: o.id,
    logo: o.square_logo,
    subtitle: `${o.employees_count} employees`,
    title: o.name,
  }));

  return (
    <div className={c('list-container')}>
      <Listing items={listItems} isFetching={isFetching} handlePagination={handleOffset} />
    </div>
  );
};

export default () => (
  <DashboardLayout title={'Snake Oil Software - Organizations'} Header={Header}>
    <Index />
  </DashboardLayout>
);
