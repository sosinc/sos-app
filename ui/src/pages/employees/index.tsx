import classNames from 'classnames/bind';
import Link from 'next/link';
import { useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import EmployeesList from 'src/components/Employees/List';
import NoItemsFound from 'src/components/NoItemsFound';
import DashboardLayout from 'src/containers/DashboardLayout';
import { RootState } from 'src/duck';
import { EmployeeState, fetchEmployees } from 'src/duck/employee';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    Employees
    <Link href="/employees/add">
      <a className={c('add-button')} title="Add employee">
        <MdAdd className={c('icon')} />
      </a>
    </Link>
  </div>
);

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
      <div className={c('not-found-container')}>
        <NoItemsFound
          Icon={FaUsers}
          message="No Employees Found"
          addItemText="Add new Employee"
          addItemUrl="/employees/add"
        />
      </div>
    );
  }

  return <EmployeesList employees={employees} />;
};

export default () => (
  <DashboardLayout title={'Snake Oil Software - Organizations'} Header={Header}>
    <Index />
  </DashboardLayout>
);
