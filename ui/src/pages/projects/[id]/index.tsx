import classNames from 'classnames/bind';
import { FormikHelpers, FormikValues } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import CreateProject, { CreateProjectFormValues } from 'src/components/Projects/Create';
import DashboardLayout from 'src/containers/DashboardLayout';
import { RootState } from 'src/duck';
import { fetchOrganizations, orgSelector } from 'src/duck/organizations';
import { fetchProject, projectSelector } from 'src/duck/projects';
import { updateProjectAction } from 'src/duck/projects';
import { currentUser } from 'src/entities/User/selectors';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';
import filterOptionalValues from 'src/utils/filterOptionalValues';
import style from '../style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => {
  const router = useRouter();
  const queryId = String(router.query.id);
  const project = useSelector((state: RootState) => projectSelector.selectById(state, queryId));
  return (
    <div className={c('header')}>
      <span>
        <Link href="/projects">
          <a>{'Projects > '}</a>
        </Link>
        {project?.name || 'Project'}
      </span>
    </div>
  );
};

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

  const [updateProject] = useAsyncThunk(updateProjectAction, {
    errorTitle: 'Failed to update Project',
    rethrowError: true,
    successTitle: 'Project update successfully',
  });

  const handleSubmit = async (
    values: CreateProjectFormValues,
    helpers: FormikHelpers<CreateProjectFormValues>,
  ) => {
    try {
      helpers.setSubmitting(true);
      const finalValues = filterOptionalValues(values);
      await updateProject({ ...finalValues, projectId: queryId });
    } catch (err) {
      if (/Duplicate project name/i.test(err.message)) {
        helpers.setFieldError('name', 'An project with same name already exists');
      }
      helpers.setSubmitting(false);
    }
  };

  const formValues: CreateProjectFormValues = {
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
      values={formValues}
      isFetchingProject={isFetchingProject}
      projectId={queryId || ''}
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
