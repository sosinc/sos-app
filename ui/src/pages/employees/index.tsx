import classNames from 'classnames/bind';
import Head from 'next/head';
import Link from 'next/link';
import FullPageLayout from 'src/components/FullPageLayout';
import style from './style.module.scss';

import EmployeesList from 'src/pages/employees/employeesList';

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
    <div className={c('content')}>
      <span className={c('org-icon')} />
      <span>You didn't have any Employees</span>
      <Link href="/employees/add">
        <a className={c('org-add', 'org-container')}>
          <span>Add Employee</span>
        </a>
      </Link>
    </div>
  );
};

const Index = () => {
  return (
    <>
      <Head>
        <title>Snake Oil Software - Organizations</title>
      </Head>

      <FullPageLayout className={c('container')}>
        <header className={c('header')}>
          <nav>
            <Link href="/">
              <a className={c('brand')}>
                <span>S</span>
                <img className={c('logo')} src="/assets/images/sos-logo.svg" alt="o" />
                <span>S</span>
              </a>
            </Link>
          </nav>
        </header>
        {!employees.length ? <NoEmployees /> : <EmployeesList list={employees} />}
      </FullPageLayout>
    </>
  );
};

export default Index;
