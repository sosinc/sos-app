import { unwrapResult } from '@reduxjs/toolkit';
import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import SelectField from 'src/components/Form/SelectField';
import TextField from 'src/components/Form/TextField';
import DashboardLayout from 'src/containers/DashboardLayout';
import { RootState } from 'src/duck';
import { fetchOrganizations } from 'src/duck/organizations';
import { createProject } from 'src/duck/project';

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
  const userData = currentUser();
  let userOrganizations = [];

  const dispatch = useDispatch();
  const {
    organiztion: { organizations, isFetching: isFetchingOrganizations },
  } = useSelector((state: RootState) => ({ organiztion: state.organization }));

  useEffect(() => {
    if (userData.role?.id === 'APP_ADMIN' && userData.organization) {
      dispatch(fetchOrganizations());
    }
  }, []);

  if (isFetchingOrganizations) {
    return <span>loading...</span>;
  }

  userOrganizations = organizations;

  if (userData.role?.id === 'USER' && userData.organization) {
    userOrganizations = userData.organization ? [userData.organization] : [];
  }

  return (
    <DashboardLayout title={'Projects - Snake Oil Software'} Header={Header}>
      <div className={c('container')}>
        <form className={c('form')} onSubmit={p.handleSubmit}>
          <h2 className={c('title')}> Create Project</h2>

          <div className={c('name-container', 'field-container')}>
            <span className={c('field-title')}>Name</span>
            <TextField
              className={'form-text-field'}
              placeholder="Enter Name"
              type="text"
              name="name"
            />
          </div>
          <div className={c('description-container', 'field-container')}>
            <span className={c('field-title')}>Description</span>
            <TextField
              className={'form-text-field'}
              placeholder="Enter Description"
              type="text"
              name="description"
            />
          </div>

          <div className={c('square-logo', 'field-container')}>
            <span className={c('field-title')}>Square Logo</span>
            <ImageUploadField className={'image-container'} type={'file'} name="logo_square" />
          </div>

          <div className={c('right-container')}>
            <div className={c('issue-link-container', 'field-container')}>
              <span className={c('field-title')}>Issue-Link-Template</span>
              <TextField
                className={'form-text-field'}
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
                autoSelectFirst={true}
              />
            </div>
          </div>

          <div className={c('pr-link-container', 'field-container')}>
            <span className={c('field-title')}>Pr-Link-Template</span>
            <TextField
              className={'form-text-field'}
              placeholder="Enter pr-link-template"
              type="text"
              name="pr_link_template"
            />
          </div>

          <div className={c('button-container')}>
            <button className={c('save-button')} type="submit" disabled={p.isSubmitting}>
              {p.isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
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
  const dispatch = useDispatch();

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    actions.setSubmitting(true);
    const resp = await dispatch(createProject(values));

    actions.setSubmitting(false);

    try {
      unwrapResult(resp as any);
      actions.resetForm();
    } catch (err) {
      if (/uniqueness violation/i.test(err.message)) {
        actions.setFieldError('name', 'A project with same name already exists');
      }

      // tslint:disable-next-line:no-console
      console.error('Something went wrong', err.message);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {AddProject}
    </Formik>
  );
};
