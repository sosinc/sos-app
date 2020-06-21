import classNames from 'classnames/bind';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { MdAdd, MdBusiness } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import NoItemsFound from 'src/components/NoItemsFound';
import OrganizationsList from 'src/components/Organization/List';
import DashboardLayout from 'src/containers/DashboardLayout';
import { fetchOrganizations, orgSelector } from 'src/duck/organizations';

import style from './style.module.scss';
import { unwrapResult } from '@reduxjs/toolkit';
import { useFlash } from 'src/duck/flashMessages';

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
  const dispatch = useDispatch();
  const organizations = useSelector(orgSelector.selectAll);
  const [flash] = useFlash();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchOrgs = useCallback(async () => {
    try {
      setIsFetching(true);
      await unwrapResult((await dispatch(fetchOrganizations())) as any);
      setIsFetching(false);
    } catch (err) {
      flash({
        body: err.message,
        title: 'Failed to fetch some organizations',
        type: 'error',
      });
    }
  }, []);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

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

  return <OrganizationsList organizations={organizations} isFetching={isFetching} />;
};

export default () => (
  <DashboardLayout title={'Snake Oil Software - Organizations'} Header={Header}>
    <Index />
  </DashboardLayout>
);
