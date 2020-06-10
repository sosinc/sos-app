import classNames from 'classnames/bind';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa';

import EmployeesList from 'src/components/Employees/List';
import Layout from 'src/containers/Layout';
import Header from 'src/containers/Layout/Header';
import style from './style.module.scss';

const c = classNames.bind(style);

const employees = [
  {
    designation: 'Software Eng',
    headShot: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Pierre-Person.jpg',
    id: '1',
    name: 'Max',
    organization: ['Apple', 'Ciro'],
  },
  { id: '2', name: 'Tom', headShot: '', organization: ['Orange'], designation: 'MG' },
  { id: '3', name: 'Jack', headShot: '', organization: ['Meteor'], designation: 'CE' },
];

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
  return (
    <Layout headerTitle={'Snake Oil Software - Organizations'} redirectPath="/">
      <Header title={'Employees'} redirectPath={'/employees/add'} toolTip={'Create Employee'} />
      {!employees.length ? <NoEmployees /> : <EmployeesList list={employees} />}
    </Layout>
  );
};

export default Index;
