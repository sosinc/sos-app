import classNames from 'classnames/bind';
import Link from 'next/link';
import { useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import EmployeesList from 'src/components/Employees/List';
import Layout from 'src/containers/Layout';
import Header from 'src/containers/Layout/Header';
import { RootState } from 'src/duck';
import { EmployeeState, fetchEmployees } from 'src/duck/employee';

import style from './style.module.scss';

const c = classNames.bind(style);

const NoEmployees = () => {
  return (
    <>
      <FaUsers title="Employees" className={c('add-icon')} />
      <span>You didn't have any Employees</span>
      <Link href="/employees/add">
        <a className={c('add', 'container')}>
          <span>Add Employee</span>
        </a>
      </Link>
    </>
  );
};

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
    return <NoEmployees />;
  }

  return <EmployeesList list={employees} />;
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
