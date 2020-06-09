import { unwrapResult } from '@reduxjs/toolkit';
import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import TextField from 'src/components/Form/TextField';
import Layout from 'src/containers/Layout';
import { createOrganization } from 'src/duck/organization';

import style from './style.module.scss';

const c = classNames.bind(style);

const AddOrg: React.FC<FormikProps<FormValues>> = (p) => {
  return (
    <Layout headerTitle={'Snake Oil Software - Organizations'} redirectPath="/">
      <div className={c('org-container')}>
        <form className={c('org-form')} onSubmit={p.handleSubmit}>
          <h2 className={c('title')}> Create Organization</h2>
          <div className={c('name-wrapper', 'wrapper')}>
            <span className={c('field-title')}>Name</span>
            <TextField
              className={'form-text-field'}
              placeholder="Enter organization name"
              type="name"
              name="name"
            />
          </div>

          <div className={c('image-wrapper-logo', 'wrapper')}>
            <span className={c('field-title')}>Logo</span>
            <ImageUploadField className={c('org-logo')} type={'file'} name="square_logo" />
          </div>

          <div className={c('image-wrapper-banner', 'wrapper')}>
            <span className={c('field-title')}>Banner</span>
            <ImageUploadField className={c('org-image-container')} type="file" name="banner" />
          </div>

          <div className={c('button-wrapper')}>
            <button className={c('save-button')} type="submit" disabled={p.isSubmitting}>
              {p.isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
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
    actions.setSubmitting(true);
    const resp = await dispatch(createOrganization(values));

    actions.setSubmitting(false);

    try {
      unwrapResult(resp as any);
    } catch (err) {
      if (/uniqueness violation/i.test(err.message)) {
        actions.setFieldError('name', 'An organization with same name already exists');
      }
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
