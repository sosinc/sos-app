import classNames from 'classnames/bind';
import { FormikHelpers, FormikValues } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import CreateTeam, { CreateTeamFormValues } from 'src/components/Teams/Create';
import config from 'src/config';
import DashboardLayout from 'src/containers/DashboardLayout';
import { RootState } from 'src/duck';
import { employeeSelector, fetchEmployees } from 'src/duck/employees';
import { projectSelector } from 'src/duck/projects';
import { fetchTeam, teamSelector, updateTeamAction } from 'src/duck/teams';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';
import filterOptionalValues from 'src/lib/filterOptionalValues';
import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC<{ teamId: string; projectId: string }> = (p) => {
  const project = useSelector((state: RootState) => projectSelector.selectById(state, p.projectId));
  const team = useSelector((state: RootState) => teamSelector.selectById(state, p.teamId));
  return (
    <div className={c('header')}>
      <span>
        <Link href="/projects">
          <a>{'Projects >'}</a>
        </Link>
        <Link href={`/projects/${p.projectId}`}>
          <a> {project?.name + ' > ' || 'Project > '}</a>
        </Link>
        {team?.name || 'Team'}
      </span>
    </div>
  );
};

const TeamDetails: React.FC<FormikValues & { teamId: string; projectId: string }> = (p) => {
  const [isFetchingTeam] = useQuery(() => fetchTeam({ id: p.teamId }), {
    errorTitle: 'Failed to fetch some team details',
  });
  const project = useSelector((state: RootState) => projectSelector.selectById(state, p.projectId));
  const team = useSelector((state: RootState) => teamSelector.selectById(state, p.teamId));

  const allEmployees = useSelector(employeeSelector.selectAll);
  const employees = allEmployees.filter((e) => e.organization_id === project?.organization_id);

  const [isFetchingEmployees] = useQuery(fetchEmployees, {
    errorTitle: 'Failed to fetch some Employees :-(',
  });

  const [updateTeam] = useAsyncThunk(updateTeamAction, {
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
      const finalValues = filterOptionalValues(values);
      await updateTeam({ ...finalValues, teamId: p.teamId });
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
  const router = useRouter();
  const teamId = String(router.query.teamId);
  const projectId = String(router.query.id);

  return (
    <DashboardLayout
      title={`Team - ${config.appName}`}
      Header={() => <Header teamId={teamId} projectId={projectId} />}
    >
      <TeamDetails teamId={teamId} projectId={projectId} />
    </DashboardLayout>
  );
};
