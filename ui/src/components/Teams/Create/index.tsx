import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { AiOutlineTeam } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import SelectBox from 'src/components/Form/SelectBox';
import TextField from 'src/components/Form/TextField';
import Listing, { ListItemProps } from 'src/components/Listing';
import NoItemsFound from 'src/components/NoItemsFound';
import { RootState } from 'src/duck';
import { createMemberAction } from 'src/duck/teams';
import { Employee } from 'src/entities/Employee';
import { TeamResponse } from 'src/entities/Team';
import { useAsyncThunk } from 'src/lib/asyncHooks';

import style from './style.module.scss';

const c = classNames.bind(style);

interface CreateTeamProps {
  values?: CreateTeamFormValues;
  isFetchingTeam?: boolean;
  team?: TeamResponse;
}

const CreateTeamForm: React.FC<FormikProps<CreateTeamFormValues> & CreateTeamProps> = (p) => {
  return (
    <div className={c('container')}>
      <div className={c({ skeleton: p.isFetchingTeam })}>
        <form className={c('form')} onSubmit={p.handleSubmit}>
          <div className={c('title-container')}>
            <h2>{p.team ? p.values.name : 'Create Team'}</h2>
          </div>
          <div className={c('name-container', 'field-container')}>
            <span className={c('field-title')}>Name</span>
            <TextField placeholder="Enter Name" type="text" name="name" />
          </div>
          <div className={c('square-logo', 'field-container')}>
            <span className={c('field-title')}>Square Logo</span>
            <ImageUploadField className={c('image-container')} type={'file'} name="logo_square" />
          </div>
          <div className={c('right-container')}>
            <div className={c('issue-link-container', 'field-container')}>
              <span className={c('field-title')}>Issue Link Template</span>
              <TextField
                placeholder="Enter issue Link Template"
                type="text"
                name="issue_link_template"
              />
            </div>
            <div className={c('pr-link-container', 'field-container')}>
              <span className={c('field-title')}>Pr Link Template</span>
              <TextField placeholder="Enter pr link template" type="text" name="pr_link_template" />
            </div>
          </div>
          <button className={c('save-button')} type="submit" disabled={p.isSubmitting}>
            <div className={c({ 'saving-in': p.isSubmitting })}>
              {p.isSubmitting ? 'Saving...' : 'Save'}
              <span />
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

const NoTeamMembers = () => {
  return (
    <NoItemsFound
      Icon={AiOutlineTeam}
      message="No Team members found"
      addItemText=""
      addItemUrl=""
    />
  );
};

const TeamMembers = (p: {
  team: TeamResponse;
  employees: Employee[];
  isFetchingEmployees: boolean;
}) => {
  const [createMember] = useAsyncThunk(createMemberAction, {
    errorTitle: 'Failed to create Member',
    rethrowError: true,
    successTitle: 'Member created successfully',
  });

  const members = useSelector((state: RootState) => {
    return p.team.memberIds.map((mid) => state.employees.entities[mid]);
  }).filter((m) => Boolean(m)) as Employee[];

  const teamListItems: ListItemProps[] = members.map((m: Employee) => ({
    id: m.id,
    logo: m.headshot,
    subtitle: m.designation_id,
    title: m.name,
  }));

  const isProjectTeams = members.length ? <Listing items={teamListItems} /> : NoTeamMembers();

  const handleAddMember = async (id: string) => {
    const member = p.employees.find((e: Employee) => e.id === id);

    if (!member) {
      console.warn('Failed to add employee');
      return;
    }

    await createMember({
      ecode: member.ecode,
      organization_id: member.organization_id,
      team_id: p.team.id,
    });
  };

  return (
    <div className={c('team-member-container', 'form')}>
      <div className={c('title-container', 'add-team')}>
        <div className={c('title')}>
          <h3>Team Members </h3>
          <span className={c('sub-title')}>Manage this project' team members</span>
        </div>
      </div>
      <div className={c('team-container')}>
        <div className={c('emp-container', 'field-container')}>
          <SelectBox
            className={c('org-add-form')}
            name="member"
            options={p.employees}
            isLoading={p.isFetchingEmployees}
            onSelect={handleAddMember}
          />
        </div>
        <div className={c('item-container')}>{isProjectTeams}</div>
      </div>
    </div>
  );
};

// ---

export interface CreateTeamFormValues {
  issue_link_template: string;
  name: string;
  pr_link_template: string;
  logo_square: string;
  employee_id: string;
}

const validationSchema = Yup.object().shape({
  employee_id: Yup.string(),
  issue_link_template: Yup.string(),
  logo_square: Yup.string(),
  name: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(16, 'Must be 16 characters or less')
    .required('Required'),
  pr_link_template: Yup.string(),
});

interface OuterFormProps extends CreateTeamProps {
  employees: Employee[];
  isFetchingEmployees?: boolean;
  onSubmit: (
    values: CreateTeamFormValues,
    helpers: FormikHelpers<CreateTeamFormValues>,
  ) => Promise<void>;
}

const initialValues = {
  employee_id: '',
  issue_link_template: '',
  logo_square: '',
  name: '',
  pr_link_template: '',
};

const OuterForm: React.FC<OuterFormProps> = (p) => {
  const InnerForm = (formikProps: FormikProps<CreateTeamFormValues>) => (
    <CreateTeamForm isFetchingTeam={p.isFetchingTeam} team={p.team} {...formikProps} />
  );

  const TeamMembersForm = p.team && (
    <TeamMembers
      employees={p.employees}
      isFetchingEmployees={Boolean(p.isFetchingEmployees)}
      team={p.team}
    />
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={p.values ? p.values : initialValues}
        validationSchema={validationSchema}
        onSubmit={p.onSubmit}
      >
        {InnerForm}
      </Formik>

      {TeamMembersForm}
    </>
  );
};

export default OuterForm;
