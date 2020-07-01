import classNames from 'classnames/bind';
import { FormikHelpers, FormikValues } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import CreateTeam, { CreateTeamFormValues } from 'src/components/Teams/Create';
import DashboardLayout from 'src/containers/DashboardLayout';
import { fetchEmployees, employeeSelector } from 'src/duck/employees';
import { RootState } from 'src/duck';
import { fetchTeam, teamSelector } from 'src/duck/teams';
import { projectSelector } from 'src/duck/projects';
import { createTeamAction } from 'src/duck/teams';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => {
  const router = useRouter();
  const projectId = String(router.query.id);
  const teamId = String(router.query.teamId);
  const project = useSelector((state: RootState) => projectSelector.selectById(state, projectId));
  const team = useSelector((state: RootState) => teamSelector.selectById(state, teamId));

  return (
    <div className={c('header')}>
      <span>
        <Link href="/projects">
          <a>Projects > </a>
        </Link>
        <Link href={`/projects/${projectId}`}>
          <a> {project?.name || 'Project'} > </a>
        </Link>
        {team?.name || 'Team'}
      </span>
    </div>
  );
};

const TeamDetails: React.FC<FormikValues> = () => {
  const router = useRouter();
  const teamId = String(router.query.teamId);

  const [isFetchingTeam] = useQuery(() => fetchTeam({ id: teamId }), {
    errorTitle: 'Failed to fetch some team details',
  });
  const team = useSelector((state: RootState) => teamSelector.selectById(state, teamId));

  const employees = useSelector(employeeSelector.selectAll);

  const [isFetchingEmployees] = useQuery(fetchEmployees, {
    errorTitle: 'Failed to fetch some Employees :-(',
  });

  const [createTeam] = useAsyncThunk(createTeamAction, {
    errorTitle: 'Failed to create team member',
    rethrowError: true,
    successTitle: 'Created successfully',
  });

  const handleSubmit = async (
    values: CreateTeamFormValues,
    helpers: FormikHelpers<CreateTeamFormValues>,
  ) => {
    try {
      helpers.setSubmitting(true);
      await createTeam(values);
      helpers.resetForm();
    } catch (err) {
      if (/Duplicate project name/i.test(err.message)) {
        helpers.setFieldError('name', 'An member with same name already exists');
      }
      helpers.setSubmitting(false);
    }
  };

  const formValues: CreateTeamFormValues = {
    issue_link_template: team?.issue_link_template || '',
    logo_square: team?.logo_square || '',
    name: team?.name || '',
    pr_link_template: team?.pr_link_template || '',
    employee_id: '',
  };

  return (
    <CreateTeam
      onSubmit={handleSubmit}
      isFetchingTeam={isFetchingTeam}
      values={formValues}
      isFetchingEmployees={isFetchingEmployees}
      employees={employees}
      team={team}
    />
  );
};

export default () => {
  return (
    <DashboardLayout title={'Teams - Snake Oil Software'} Header={Header}>
      <TeamDetails />
    </DashboardLayout>
  );
};
