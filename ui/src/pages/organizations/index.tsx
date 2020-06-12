import { useEffect } from 'react';
import { FaRegBuilding } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import OrganizationsList from 'src/components/Organization/List';
import NoItemsFound from 'src/components/NoItemsFound';
import Layout from 'src/containers/Layout';
import Header from 'src/containers/Layout/Header';
import { RootState } from 'src/duck';
import { fetchOrganization, OrganizationState } from 'src/duck/organization';

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
      <NoItemsFound
        Icon={FaRegBuilding}
        message="No Organizations found"
        addItemText="Add an Organization"
        addItemUrl="/organizations/add"
      />
    );
  }

  return <OrganizationsList organizations={organizations} />;
};

export default () => (
  <Layout headerTitle={'Snake Oil Software - Organizations'} redirectPath="/">
    <Header
      title={'Organizations'}
      redirectPath={'/organizations/add'}
      toolTip={'Create Organization'}
      isButtonShown={true}
    />
    <Index />
  </Layout>
);
