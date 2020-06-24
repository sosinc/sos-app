import classNames from 'classnames/bind';
import { FormikHelpers, FormikValues } from 'formik';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import CreateProject, { CreateProjectFormValues } from 'src/components/Projects/Create';
import DashboardLayout from 'src/containers/DashboardLayout';
import { fetchProject, projectSelector } from 'src/duck/project';
import { fetchOrganizations, orgSelector } from 'src/duck/organizations';
import { createProjectAction } from 'src/duck/project';
import { currentUser } from 'src/entities/User/selectors';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';
import style from './style.module.scss';
import { useRouter } from 'next/router';
import { RootState } from 'src/duck';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    <span>
      <Link href="/projects">
        <a>Projects > </a>
      </Link>
      Details
    </span>
  </div>
);

const ProjectDetails: React.FC<FormikValues> = () => {
  const router = useRouter();
  const queryId = String(router.query.id);
  const project = useSelector((state: RootState) => projectSelector.selectById(state, queryId));

  const [isFetchingProject] = useQuery(() => fetchProject({ id: queryId }), {
    errorTitle: 'Failed to fetch some project details',
  });

  const user = currentUser();
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
      await createProject(values);
      helpers.resetForm();
    } catch (err) {
      if (/Duplicate project name/i.test(err.message)) {
        helpers.setFieldError('name', 'An project with same name already exists');
      }
      helpers.setSubmitting(false);
    }
  };

  const values: CreateProjectFormValues = {
    description: project?.description || '',
    issue_link_template: project?.issue_link_template || '',
    logo_square: project?.logo_square || '',
    name: project?.name || '',
    organization_id: project?.organization_id || '',
    pr_link_template: project?.pr_link_template || '',
  };

  return (
    <CreateProject
      onSubmit={handleSubmit}
      isFetchingOrgs={isFetchingOrgs}
      organizations={userOrganizations}
      values={values}
      isFetchingProject={isFetchingProject}
      isEditMode={true}
    />
  );
};

export default () => {
  return (
    <DashboardLayout title={'Projects - Snake Oil Software'} Header={Header}>
      <ProjectDetails />
    </DashboardLayout>
  );
};
