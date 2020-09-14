import classNames from 'classnames/bind';
import { FormikHelpers, FormikValues } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useSelector } from 'react-redux';
import CreateTeam, { CreateTeamFormValues } from 'src/components/Teams/Create';
import config from 'src/config';
import DashboardLayout from 'src/containers/DashboardLayout';
import { RootState } from 'src/duck';
import { fetchProject, projectSelector } from 'src/duck/projects';
import { createTeamAction } from 'src/duck/teams';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';
import filterOptionalValues from 'src/lib/filterOptionalValues';
import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => {
  const router = useRouter();
  const projectId = String(router.query.id);
  useQuery(() => fetchProject({ id: projectId }), {
    errorTitle: 'Failed to fetch some project details',
  });

  const project = useSelector((state: RootState) => projectSelector.selectById(state, projectId));
  return (
    <div className={c('header')}>
      <span>
        <Link href="/projects">
          <a>{'Projects >'}</a>
        </Link>
        <Link href={`/projects/${projectId}`}>
          <a> {project?.name + ' > ' || 'Project > '} </a>
        </Link>
        Add Team
      </span>
    </div>
  );
};

const AddTeam: React.FC<FormikValues> = () => {
  const router = useRouter();
  const projectId = String(router.query.id);

  const [createTeam] = useAsyncThunk(createTeamAction, {
    errorTitle: 'Failed to create Team',
    rethrowError: true,
    successTitle: 'Team created successfully',
  });

  const handleSubmit = async (
    values: CreateTeamFormValues,
    helpers: FormikHelpers<CreateTeamFormValues>,
  ) => {
    try {
      helpers.setSubmitting(true);
      const finalValues = filterOptionalValues(values);
      await createTeam({ ...finalValues, project_id: projectId });
      helpers.resetForm();
    } catch (err) {
      if (/Duplicate team name/i.test(err.message)) {
        helpers.setFieldError('name', 'A team with same name already exists');
      }
      helpers.setSubmitting(false);
    }
  };

  return <CreateTeam onSubmit={handleSubmit} employees={[]} />;
};

export default () => {
  return (
    <DashboardLayout title={`Team - ${config.appName}`} Header={Header}>
      <AddTeam />
    </DashboardLayout>
  );
};
