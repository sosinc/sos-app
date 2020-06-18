import { unwrapResult } from '@reduxjs/toolkit';
import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import TextField from 'src/components/Form/TextField';
import DashboardLayout from 'src/containers/DashboardLayout';
import { createOrganization } from 'src/duck/organization';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    <span>
      <Link href="/organizations">
        <a>Organizations > </a>
      </Link>
      Create
    </span>
  </div>
);

const AddOrg: React.FC<FormikProps<FormValues>> = (p) => {
  return (
    <DashboardLayout title={'Snake Oil Software - Organizations'} Header={Header}>
      <div className={c('org-container')}>
        <form className={c('org-form')} onSubmit={p.handleSubmit}>
          <h2 className={c('title')}> Create Organization</h2>
          <div className={c('name-container', 'field-container')}>
            <span className={c('field-title')}>Name</span>
            <TextField
              className={'form-text-field'}
              placeholder="Enter organization name"
              type="name"
              name="name"
            />
          </div>

          <div className={c('image-container-logo', 'field-container')}>
            <span className={c('field-title')}>Logo</span>
            <ImageUploadField className={c('org-logo')} type={'file'} name="square_logo" />
          </div>

          <div className={c('image-container-banner', 'field-container')}>
            <span className={c('field-title')}>Banner</span>
            <ImageUploadField className={c('org-banner')} type="file" name="banner" />
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
  name: string;
  banner: string;
  square_logo: string;
}

const initialValues = {
  banner: '',
  name: '',
  square_logo: '',
};

const validationSchema = Yup.object().shape({
  banner: Yup.string(),
  name: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(16, 'Must be 16 characters or less')
    .required('Required'),
  square_logo: Yup.string(),
});

export default () => {
  const dispatch = useDispatch();

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    console.warn('VALUES', values);
    actions.setSubmitting(true);
    const resp = await dispatch(createOrganization(values));

    actions.setSubmitting(false);

    try {
      unwrapResult(resp as any);
      actions.resetForm();
    } catch (err) {
      if (/uniqueness violation/i.test(err.message)) {
        actions.setFieldError('name', 'An organization with same name already exists');
      }
      // tslint:disable-next-line:no-console
      console.error('Something went wrong');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {AddOrg}
    </Formik>
  );
};
