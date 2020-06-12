import { useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import EmployeesList from 'src/components/Employees/List';
import NoItemsFound from 'src/components/NoItemsFound';
import Layout from 'src/containers/Layout';
import Header from 'src/containers/Layout/Header';
import { RootState } from 'src/duck';
import { EmployeeState, fetchEmployees } from 'src/duck/employee';

const Index = () => {
  const dispatch = useDispatch();
  const { employees, isFetching } = useSelector<RootState, EmployeeState>(
    (state) => state.employees,
  );

  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);

  if (isFetching) {
    return <span>loading...</span>;
  }

  if (!employees.length) {
    return (
      <NoItemsFound
        Icon={FaUsers}
        message="No Employees Found"
        addItemText="Add new Employee"
        addItemUrl="/employees/add"
      />
    );
  }

  return <EmployeesList employees={employees} />;
};

export default () => (
  <Layout headerTitle={'Snake Oil Software - Organizations'} redirectPath="/">
    <Header
      title={'Employees'}
      redirectPath={'/employees/add'}
      toolTip={'Create Employee'}
      isButtonShown={true}
    />
    <Index />
  </Layout>
);
