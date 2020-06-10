import classNames from 'classnames/bind';
import Link from 'next/link';
import { useEffect } from 'react';
import { FaRegBuilding } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import OrganizationList from 'src/components/Organization/List';
import Layout from 'src/containers/Layout';
import Header from 'src/containers/Layout/Header';
import { RootState } from 'src/duck';
import { fetchOrganization, OrganizationState } from 'src/duck/organization';
import style from './style.module.scss';

const c = classNames.bind(style);

const NoOrganizations = () => {
  return (
    <>
      <FaRegBuilding title="Organizations" className={c('org-icon')} />
      <span>You didn't have any Organization</span>
      <Link href="/organizations/add">
        <a className={c('org-add', 'org-container')}>
          <span>Add Organization</span>
        </a>
      </Link>
    </>
  );
};

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
    return <NoOrganizations />;
  }

  return <OrganizationList list={organizations} />;
};

export default () => (
  <Layout headerTitle={'Snake Oil Software - Organizations'} redirectPath="/">
    <Header
      title={'Organizations'}
      redirectPath={'/organizations/add'}
      toolTip={'Create Organization'}
    />
    <Index />
  </Layout>
);
