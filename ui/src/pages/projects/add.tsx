import classNames from 'classnames/bind';
import { FormikHelpers, FormikValues } from 'formik';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import CreateProject, { CreateProjectFormValues } from 'src/components/Projects/Create';
import DashboardLayout from 'src/containers/DashboardLayout';
import { fetchOrganizations, orgSelector } from 'src/duck/organizations';
import { createProjectAction } from 'src/duck/projects';
import { currentUser } from 'src/entities/User/selectors';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';
import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    <span>
      <Link href="/projects">
        <a>Projects > </a>
      </Link>
      Create
    </span>
  </div>
);

const AddProject: React.FC<FormikValues> = () => {
  const user = currentUser();
  const isCurrentOrg = user.employee?.isCurrent;
  let userOrganizations = user.organization ? [user.organization] : [];
  let isFetchingOrgs = false;

  if (user.role.id === 'APP_ADMIN') {
    userOrganizations = useSelector(orgSelector.selectAll);
    [isFetchingOrgs] = useQuery(fetchOrganizations, {
      errorTitle: 'Failed to fetch organizations. Please refresh the page',
    });
  }

  userOrganizations = useSelector(orgSelector.selectAll);

  const [createProject] = useAsyncThunk(createProjectAction, {
    errorTitle: 'Failed to create Project',
    rethrowError: true,
    successTitle: 'Project created successfully',
  });

  const handleSubmit = async (
    values: CreateProjectFormValues,
    helpers: FormikHelpers<CreateProjectFormValues>,
  ) => {
    try {
      helpers.setSubmitting(true);
      await createProject(isCurrentOrg ? { ...values, organization_id: '' } : values);
      helpers.resetForm();
    } catch (err) {
      if (/Duplicate project name/i.test(err.message)) {
        helpers.setFieldError('name', 'An project with same name already exists');
      }
      helpers.setSubmitting(false);
    }
  };

  return (
    <CreateProject
      onSubmit={handleSubmit}
      isFetchingOrgs={isFetchingOrgs}
      organizations={userOrganizations}
    />
  );
};

export default () => {
  return (
    <DashboardLayout title={'Projects - Snake Oil Software'} Header={Header}>
      <AddProject />
    </DashboardLayout>
  );
};
