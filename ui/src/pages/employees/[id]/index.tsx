import classNames from 'classnames/bind';
import { FormikHelpers, FormikValues } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import CreateEmployee, { CreateEmployeeFormValues } from 'src/components/Employee/Create';
import DashboardLayout from 'src/containers/DashboardLayout';
import { RootState } from 'src/duck';
import { designationSelector, fetchDesignations } from 'src/duck/designations';
import { employeeSelector, fetchEmployee, updateEmployeeAction } from 'src/duck/employees';
import { fetchOrganizations, orgSelector } from 'src/duck/organizations';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';

import style from '../style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => {
  const router = useRouter();
  const EmployeeId = String(router.query.id);
  const Employee = useSelector((state: RootState) =>
    employeeSelector.selectById(state, EmployeeId),
  );

  return (
    <div className={c('header')}>
      <span>
        <Link href="/employees">
          <a>{'Employee >'}</a>
        </Link>
        {Employee?.name || 'Employee'}
      </span>
    </div>
  );
};

const EmployeeDetails: React.FC<FormikValues> = () => {
  const router = useRouter();
  const queryId = String(router.query.id);
  const employee = useSelector((state: RootState) => employeeSelector.selectById(state, queryId));
  const employeeId = queryId.split('-');

  const [isFetchingEmployee] = useQuery(
    () => fetchEmployee({ orgId: employeeId.slice(1).join('-'), ecode: employeeId[0] }),
    {
      errorTitle: 'Failed to fetch some employee details',
    },
  );
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

  const [createEmployee] = useAsyncThunk(updateEmployeeAction, {
    errorTitle: 'Failed to update Employee',
    rethrowError: true,
    successTitle: 'Employee updated successfully',
  });

  const handleSubmit = async (
    values: CreateEmployeeFormValues,
    helpers: FormikHelpers<CreateEmployeeFormValues>,
  ) => {
    try {
      helpers.setSubmitting(true);
      await createEmployee({
        ...values,
        currentEcode: employee?.ecode,
        currentOrgId: employee?.organization_id,
      });
    } catch (err) {
      if (/Duplicate employee ecode/i.test(err.message)) {
        helpers.setFieldError('ecode', 'A employee with same ecode already exists');
      }
      helpers.setSubmitting(false);
    }
  };

  const formValues: CreateEmployeeFormValues = {
    designation_id: employee?.designation_id || '',
    ecode: employee?.ecode || '',
    email: employee?.email || '',
    headshot: employee?.headshot || '',
    name: employee?.name || '',
    organization_id: employee?.organization_id || '',
  };

  return (
    <CreateEmployee
      isFetchingOrgs={isFetchingOrgs}
      isFetchingDesignations={isFetchingDesignations}
      isFetchingEmployees={isFetchingEmployee}
      employee={employee}
      organizations={organizations}
      designations={designations}
      values={formValues}
      onSubmit={handleSubmit}
    />
  );
};

export default () => {
  return (
    <DashboardLayout title={'Organization - Snake Oil Software'} Header={Header}>
      <EmployeeDetails />
    </DashboardLayout>
  );
};
