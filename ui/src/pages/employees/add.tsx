import classNames from 'classnames/bind';
import { FormikHelpers, FormikValues } from 'formik';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import CreateEmployee, { CreateEmployeeFormValues } from 'src/components/Employee/Create';
import config from 'src/config';
import DashboardLayout from 'src/containers/DashboardLayout';
import { RootState } from 'src/duck';
import { designationSelector, fetchDesignations } from 'src/duck/designations';
import { createEmployeeAction } from 'src/duck/employees';
import { fetchOrganizations, orgSelector } from 'src/duck/organizations';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    <span>
      <Link href="/employees">
        <a>{'Employee >'}</a>
      </Link>
      Create
    </span>
  </div>
);

const AddEmployee: React.FC<FormikValues> = () => {
  const { organizations, designations } = useSelector((state: RootState) => ({
    designations: designationSelector.selectAll(state),
    organizations: orgSelector.selectAll(state),
  }));
  const [isFetchingOrgs] = useQuery(fetchOrganizations, {
    errorTitle: 'Failed to fetch organizations. Please refresh the page',
  });
  const [isFetchingDesignations] = useQuery(fetchDesignations, {
    errorTitle: 'Failed to fetch designations. Please refresh the page',
  });

  const [createEmployee] = useAsyncThunk(createEmployeeAction, {
    errorTitle: 'Failed to crate Employee',
    rethrowError: true,
    successTitle: 'Employee created successfully',
  });

  const handleSubmit = async (
    values: CreateEmployeeFormValues,
    helpers: FormikHelpers<CreateEmployeeFormValues>,
  ) => {
    try {
      helpers.setSubmitting(true);
      await createEmployee(values);
      helpers.resetForm();
    } catch (err) {
      if (/Duplicate employee ecode/i.test(err.message)) {
        helpers.setFieldError('ecode', 'A employee with same ecode already exists');
      }
      helpers.setSubmitting(false);
    }
  };

  return (
    <CreateEmployee
      isFetchingOrgs={isFetchingOrgs}
      isFetchingDesignations={isFetchingDesignations}
      organizations={organizations}
      designations={designations}
      onSubmit={handleSubmit}
    />
  );
};

export default () => {
  return (
    <DashboardLayout title={`Employee - ${config.appName}`} Header={Header}>
      <AddEmployee />
    </DashboardLayout>
  );
};
