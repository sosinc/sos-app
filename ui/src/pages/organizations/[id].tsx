import { unwrapResult } from '@reduxjs/toolkit';
import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import TextField from 'src/components/Form/TextField';
import Layout from 'src/containers/Layout';
import Header from 'src/containers/Layout/Header';
import { RootState } from 'src/duck';
import { createOrganization, fetchOrganization } from 'src/duck/organization';
import { Organization } from 'src/entities/Organizations';

import style from './style.module.scss';

const c = classNames.bind(style);

const EditOrg: React.FC<FormikProps<FormValues>> = (p) => {
  return (
    <Layout headerTitle={'Snake Oil Software - Organizations'} redirectPath="/">
      <Header
        title={'Organizations > '}
        subTitle={'-'}
        redirectPath={'/organizations'}
        toolTip={'Back'}
      />
      <div className={c('org-container')}>
        <form className={c('org-form')} onSubmit={p.handleSubmit}>
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
            <button className={c('save-button')} type="submit" disabled={!p.isSubmitting}>
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
  employees?: any;
}

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

  const router = useRouter();
  const queryId = router.query.id;
  const id = Array.isArray(queryId) ? queryId[0] : queryId;

  const { organization, isFetching } = useSelector<
    RootState,
    { organization?: Organization; isFetching: boolean }
  >((state) => {
    const organization = state.organization.organizations.find((org) => org.id === id);
    const isFetching = state.organization.isFetching;

    return {
      organization,
      isFetching,
    };
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(fetchOrganization({ id: id }));
  }, [id]);

  if (isFetching) {
    return <span>loading...</span>;
  }

  const initialValues = {
    banner: '',
    name: organization ? organization.name : '',
    square_logo: '',
  };

  console.warn('ORG', organization, id);

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
      {EditOrg}
    </Formik>
  );
};
