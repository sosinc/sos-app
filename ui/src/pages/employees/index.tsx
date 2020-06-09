import classNames from 'classnames/bind';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa';

import EmployeesList from 'src/components/Employees/List';
import Layout from 'src/containers/Layout';
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
      <FaUsers title="Employees" className={c('org-icon')} />
      <span>You didn't have any Employees</span>
      <Link href="/employees/add">
        <a className={c('org-add', 'org-container')}>
          <span>Add Employee</span>
        </a>
      </Link>
    </>
  );
};

const Index = () => {
  return (
    <Layout headerTitle={'Snake Oil Software - Organizations'} redirectPath="/">
      {!employees.length ? <NoEmployees /> : <EmployeesList list={employees} />}
    </Layout>
  );
};

export default Index;
