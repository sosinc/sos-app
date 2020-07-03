import classNames from 'classnames/bind';
import Link from 'next/link';
import { FaUsers } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { useSelector } from 'react-redux';

import Listing, { ListingItemProps } from 'src/components/Listing';
import NoItemsFound from 'src/components/NoItemsFound';
import DashboardLayout from 'src/containers/DashboardLayout';
import { employeeSelector, fetchEmployees } from 'src/duck/employees';
import { useQuery } from 'src/lib/asyncHooks';

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
  const employees = useSelector(employeeSelector.selectAll);
  const [isFetching] = useQuery(fetchEmployees, {
    errorTitle: 'Failed to fetch some Employees :-(',
  });

  if (!employees.length && !isFetching) {
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

  const listItems: ListingItemProps[] = employees.map((e) => ({
    id: e.ecode,
    logo: e.headshot,
    subtitle: `${e.designation_id}`,
    title: e.name,
  }));

  return (
    <div className={c('list-container')}>
      <Listing items={listItems} isFetching={isFetching} />
    </div>
  );
};

export default () => (
  <DashboardLayout title={'Snake Oil Software - Organizations'} Header={Header}>
    <Index />
  </DashboardLayout>
);
