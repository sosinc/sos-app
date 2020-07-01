import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
/* import { useState } from 'react'; */
import { AiOutlineTeam } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import SelectBox from 'src/components/Form/SelectBox';
import TextField from 'src/components/Form/TextField';
import Listing, { ListItemProps } from 'src/components/Listing';
import NoItemsFound from 'src/components/NoItemsFound';
import { Employee } from 'src/entities/Employee';
import { Member } from 'src/entities/TeamMember';

import { createMemberAction, memberSelector } from 'src/duck/teamMembers';
import { useAsyncThunk } from 'src/lib/asyncHooks';

import style from './style.module.scss';

const c = classNames.bind(style);

interface Props {
  employees: Employee[];
  isFetchingEmployees?: boolean;
  values?: CreateTeamFormValues;
  isFetchingTeam?: boolean;
  teamId?: string;
}

const CreateTeamForm: React.FC<FormikProps<CreateTeamFormValues> & Props> = (p) => {
  return (
    <div className={c('container')}>
      <div className={c({ skeleton: p.isFetchingTeam })}>
        <form className={c('form')} onSubmit={p.handleSubmit}>
          <div className={c('title-container')}>
            <h2>{p.teamId ? p.values.name : 'Create Team'}</h2>
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

const TeamMembers = (p: any) => {
  const members = useSelector(memberSelector.selectAll);
  const [createMember] = useAsyncThunk(createMemberAction, {
    errorTitle: 'Failed to create Member',
    rethrowError: true,
    successTitle: 'Member created successfully',
  });

  console.warn('-------members----', members);
  const teamListItems: ListItemProps[] = members.map((m: Member) => ({
    id: m.id,
    logo: m.headshot,
    subtitle: m.designation_id,
    title: m.name,
  }));

  const isProjectTeams = members.length ? <Listing items={teamListItems} /> : NoTeamMembers();

  const handleAddMember = async (id: string) => {
    let member = p.employees.filter((e: Employee) => {
      return e.id === id;
    });
    member = member[0];
    await createMember({
      ecode: member.ecode,
      organization_id: member.organization_id,
      team_id: p.teamId,
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
          <span className={c('field-title')}>Add Team Member</span>
          <SelectBox
            className={c('org-add-form')}
            name="employee_id"
            options={p.employees}
            isLoading={p.isFetchingEmployees}
            onSelect={handleAddMember}
          />
        </div>

        {isProjectTeams}
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

interface OuterFormProps extends Props {
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
  /* const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string>('lol'); */

  const employees = p.employees.filter((e: any) => {
    // don't show if this employee is also in selectedEmployees
    /* return selectedEmployeeIds.find((sid) => sid === e.id); */
    return e;
  });

  /* setSelectedEmployeeIds('lol');
   * console.warn('------selet', selectedEmployeeIds); */

  const InnerForm = (formikProps: FormikProps<CreateTeamFormValues>) => (
    <CreateTeamForm
      isFetchingTeam={p.isFetchingTeam}
      employees={employees}
      isFetchingEmployees={p.isFetchingEmployees}
      teamId={p.teamId}
      {...formikProps}
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

      <TeamMembers employees={employees} teamId={p.teamId} />
    </>
  );
};

export default OuterForm;
