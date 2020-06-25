import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import Link from 'next/link';
import { useEffect } from 'react';
import { AiOutlineTeam } from 'react-icons/ai';
import { MdAdd } from 'react-icons/md';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import SelectField from 'src/components/Form/SelectField';
import TextField from 'src/components/Form/TextField';
import NoItemsFound from 'src/components/NoItemsFound';
import TeamsList from 'src/components/Projects/TemsList';
import { Organization } from 'src/entities/Organizations';

import style from './style.module.scss';

const c = classNames.bind(style);

interface Props {
  organizations: Organization[];
  isFetchingOrgs: boolean;
  values?: CreateProjectFormValues;
  isEditMode?: boolean;
  isFetchingProject?: boolean;
  projectId?: string;
}

const ProjectForm: React.FC<FormikProps<CreateProjectFormValues> & Props> = (p) => (
  <form className={c('form')} onSubmit={p.handleSubmit}>
    <div className={c('title-container')}>
      <h2>{p.isEditMode ? p.values.name : 'Create Project'} </h2>
    </div>
    <div className={c('name-container', 'field-container')}>
      <span className={c('field-title')}>Name</span>
      <TextField placeholder="Enter Name" type="text" name="name" />
    </div>
    <div className={c('description-container', 'field-container')}>
      <span className={c('field-title')}>Description</span>
      <TextField placeholder="Enter Description" type="text" name="description" />
    </div>

    <div className={c('square-logo', 'field-container')}>
      <span className={c('field-title')}>Square Logo</span>
      <ImageUploadField className={c('image-container')} type={'file'} name="logo_square" />
    </div>

    <div className={c('right-container')}>
      <div className={c('issue-link-container', 'field-container')}>
        <span className={c('field-title')}>Issue Link Template</span>
        <TextField placeholder="Enter issue Link Template" type="text" name="issue_link_template" />
      </div>

      <div className={c('org-container', 'field-container')}>
        <span className={c('field-title')}>Organization</span>
        <SelectField
          className={c('org-add-form')}
          name="organization_id"
          options={p.organizations}
          isLoading={p.isFetchingOrgs}
        />
      </div>
    </div>

    <div className={c('pr-link-container', 'field-container')}>
      <span className={c('field-title')}>Pr Link Template</span>
      <TextField placeholder="Enter pr link template" type="text" name="pr_link_template" />
    </div>
    {!p.isEditMode ? submitButton(p) : addTeam(p.projectId)}
  </form>
);

const submitButton = (p: any) => {
  return (
    <div className={c('button-container')}>
      <button className={c('save-button')} type="submit" disabled={p.isSubmitting}>
        {p.isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

const noTeam = (projectId: string) => {
  return (
    <NoItemsFound
      Icon={AiOutlineTeam}
      message="No Teams found"
      addItemText="Add a team"
      addItemUrl={`/projects/${projectId}/teams/add`}
    />
  );
};

const addTeam = (projectId: any) => {
  const teams = [
    {
      banner: '',
      id: '122',
      issue_link_template: '',
      logo_square: '',
      name: 'AB',
      pr_link_template: '',
      project_id: '',
    },
  ];
  return (
    <>
      <div className={c('title-container', 'add-team')}>
        <div className={c('title')}>
          <h3>Teams </h3>
          <span className={c('sub-title')}>Manage this project teams</span>
        </div>
        <Link href={`/projects/${projectId}/teams/add`}>
          <a className={c('add-button')} title="Add Team">
            <MdAdd className={c('icon')} />
          </a>
        </Link>
      </div>
      <div className={c('team-container')}>
        {!teams.length ? <TeamsList teams={teams} /> : noTeam(projectId)}
      </div>
    </>
  );
};

const CreateProjectForm: React.FC<FormikProps<CreateProjectFormValues> & Props> = (p) => {
  useEffect(() => {
    if (p.organizations.length && !p.values.organization_id) {
      p.setFieldValue('organization_id', p.organizations[0].id);
    }
  }, [p.organizations.length]);

  return (
    <div className={c('container')}>
      <div className={c({ skeleton: p.isFetchingProject })}>
        <ProjectForm {...p} />
      </div>
    </div>
  );
};

// ---

export interface CreateProjectFormValues {
  description: string;
  issue_link_template: string;
  name: string;
  organization_id: string;
  pr_link_template: string;
  logo_square: string;
}

const validationSchema = Yup.object().shape({
  description: Yup.string(),
  issue_link_template: Yup.string(),
  logo_square: Yup.string(),
  name: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(16, 'Must be 16 characters or less')
    .required('Required'),
  organization_id: Yup.string().required('Required'),
  pr_link_template: Yup.string(),
});

interface OuterFormProps extends Props {
  onSubmit: (
    values: CreateProjectFormValues,
    helpers: FormikHelpers<CreateProjectFormValues>,
  ) => Promise<void>;
}

const initialValues: CreateProjectFormValues = {
  description: '',
  issue_link_template: '',
  logo_square: '',
  name: '',
  organization_id: '',
  pr_link_template: '',
};

const OuterForm: React.FC<OuterFormProps> = (p) => {
  const InnerForm = (formikProps: FormikProps<CreateProjectFormValues>) => (
    <CreateProjectForm
      isFetchingProject={p.isFetchingProject}
      organizations={p.organizations}
      isFetchingOrgs={p.isFetchingOrgs}
      isEditMode={p.isEditMode}
      projectId={p.projectId}
      {...formikProps}
    />
  );
  return (
    <Formik
      enableReinitialize={true}
      initialValues={p.values ? p.values : initialValues}
      validationSchema={validationSchema}
      onSubmit={p.onSubmit}
    >
      {InnerForm}
    </Formik>
  );
};

export default OuterForm;