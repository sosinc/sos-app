import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import SelectField from 'src/components/Form/SelectField';
import TextField from 'src/components/Form/TextField';
import DashboardLayout from 'src/containers/DashboardLayout';
import { fetchOrganizations, orgSelector } from 'src/duck/organizations';
import { createProject } from 'src/duck/project';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';

import style from './style.module.scss';

import { currentUser } from 'src/entities/User/selectors';

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

const AddProject: React.FC<FormikProps<FormValues>> = (p) => {
  const user = currentUser();
  let userOrganizations = user.organization ? [user.organization] : [];
  let isFetchingOrgs = false;

  if (user.role.id === 'APP_ADMIN') {
    userOrganizations = useSelector(orgSelector.selectAll);
    [isFetchingOrgs] = useQuery(fetchOrganizations, {
      errorTitle: 'Failed to fetch organizations. Please refresh the page',
    });
  }

  if (userOrganizations.length && !p.values.organization_id) {
    p.setFieldValue('organization_id', userOrganizations[0].id);
  }

  return (
    <div className={c('container')}>
      <form className={c('form')} onSubmit={p.handleSubmit}>
        <h2 className={c('title')}> Create Project</h2>

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
          <ImageUploadField className={'image-container'} type={'file'} name="logo_square" />
        </div>

        <div className={c('right-container')}>
          <div className={c('issue-link-container', 'field-container')}>
            <span className={c('field-title')}>Issue-Link-Template</span>
            <TextField
              placeholder="Enter issue-Link-Template"
              type="text"
              name="issue_link_template"
            />
          </div>
          <div className={c('org-container', 'field-container')}>
            <span className={c('field-title')}>Organization</span>
            <SelectField
              className={'org-add-form'}
              name="organization_id"
              options={userOrganizations}
              isLoading={isFetchingOrgs}
            />
          </div>
        </div>

        <div className={c('pr-link-container', 'field-container')}>
          <span className={c('field-title')}>Pr-Link-Template</span>
          <TextField placeholder="Enter pr-link-template" type="text" name="pr_link_template" />
        </div>

        <div className={c('button-container')}>
          <button className={c('save-button')} type="submit" disabled={p.isSubmitting}>
            {p.isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

interface FormValues {
  description: string;
  issue_link_template: string;
  name: string;
  organization_id: string;
  pr_link_template: string;
  logo_square: string;
}

const initialValues = {
  description: '',
  issue_link_template: '',
  logo_square: '',
  name: '',
  organization_id: '',
  pr_link_template: '',
};

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

export default () => {
  const [createPro] = useAsyncThunk(createProject, {
    errorTitle: 'Failed to create Project',
    rethrowError: true,
    successTitle: 'Project created successfully',
  });

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    try {
      actions.setSubmitting(true);
      await createPro(values);
      actions.resetForm();
    } catch (err) {
      if (/Duplicate project name/i.test(err.message)) {
        actions.setFieldError('name', 'An project with same name already exists');
      }
      actions.setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title={'Projects - Snake Oil Software'} Header={Header}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {AddProject}
      </Formik>
    </DashboardLayout>
  );
};
