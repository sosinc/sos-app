import classNames from 'classnames/bind';
import Link from 'next/link';
import { useEffect } from 'react';
import { MdAdd, MdBusiness } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import NoItemsFound from 'src/components/NoItemsFound';
import OrganizationsList from 'src/components/Organization/List';
import DashboardLayout from 'src/containers/DashboardLayout';
import { RootState } from 'src/duck';
import { fetchOrganization, OrganizationState } from 'src/duck/organization';

import style from './style.module.scss';

const c = classNames.bind(style);

const Index = () => {
  const dispatch = useDispatch();
  const { organizations, isFetching } = useSelector<RootState, OrganizationState>(
    (state) => state.organization,
  );

  useEffect(() => {
    dispatch(fetchOrganization());
  }, []);

  if (isFetching) {
    return <span>loading...</span>;
  }

  if (!organizations.length) {
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

  return <OrganizationsList organizations={organizations} />;
};

const Header: React.FC = () => (
  <div className={c('header')}>
    Organizations
    <Link href="/organizations/add">
      <a className={c('add-button')}>
        <MdAdd className={c('icon')} />
      </a>
    </Link>
  </div>
);

export default () => (
  <DashboardLayout title={'Snake Oil Software - Organizations'} Header={Header}>
    <Index />
  </DashboardLayout>
);
