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
import { fetchDesignation } from 'src/duck/designation';
import { createEmployee } from 'src/duck/employee';
import { fetchOrganization } from 'src/duck/organization';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    <span>
      <Link href="/employees">
        <a>Employees > </a>
      </Link>
      Create
    </span>
  </div>
);

const AddEmployee: React.FC<FormikProps<FormValues>> = (p) => {
  const dispatch = useDispatch();
  const {
    organization: { organizations },
    designation: { designation },
  } = useSelector((state: RootState) => ({
    designation: state.designations,
    organization: state.organization,
  }));

  useEffect(() => {
    dispatch(fetchOrganization());
    dispatch(fetchDesignation());
  }, []);

  if (!p.values.organization_id && organizations.length) {
    p.setFieldValue('organization_id', organizations[0].id);
  }

  return (
    <DashboardLayout title={'Snake Oil Software - Employees'} Header={Header}>
      <div className={c('container')}>
        <form className={c('form')} onSubmit={p.handleSubmit}>
          <h2 className={c('title')}> Create Employee</h2>

          <div className={c('email-container', 'field-container')}>
            <span className={c('field-title')}>Email</span>
            <TextField
              className={'form-text-field'}
              placeholder="Enter email"
              type="email"
              name="email"
            />
          </div>
          <div className={c('name-container', 'field-container')}>
            <span className={c('field-title')}>Name</span>
            <TextField
              className={'form-text-field'}
              placeholder="Enter name"
              type="text"
              name="name"
            />
          </div>

          <div className={c('logo', 'field-container')}>
            <span className={c('field-title')}>Head Shot</span>
            <ImageUploadField className={'image-container'} type={'file'} name="headshot" />
          </div>

          <div className={c('right-container')}>
            <div className={c('ecode-container', 'field-container')}>
              <span className={c('field-title')}>E-Code</span>
              <TextField
                className={'form-text-field'}
                placeholder="Enter e-code"
                type="text"
                name="ecode"
              />
            </div>

            <div className={c('designation-container', 'field-container')}>
              <span className={c('field-title')}>Designation</span>
              <SelectField className={'org-add-form'} name="designation_id" options={designation} />
            </div>
            <div className={c('org-container', 'field-container')}>
              <span className={c('field-title')}>Organization</span>
              <SelectField
                className={'org-add-form'}
                name="organization_id"
                options={organizations}
              />
            </div>
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
  email: string;
  name: string;
  ecode: string;
  headshot: string;
  designation_id: string;
  organization_id: string;
}

const initialValues = {
  designation_id: '',
  ecode: '',
  email: '',
  headshot: '',
  name: '',
  organization_id: '',
};

const validationSchema = Yup.object().shape({
  designation_id: Yup.string().required('Required'),
  ecode: Yup.string().required('Required'),
  email: Yup.string().email().required('Required'),
  headshot: Yup.string(),
  name: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(16, 'Must be 16 characters or less')
    .required('Required'),
  organization_id: Yup.string().required('Required'),
});

export default () => {
  const dispatch = useDispatch();

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    actions.setSubmitting(true);
    const resp = await dispatch(createEmployee(values));

    actions.setSubmitting(false);

    try {
      unwrapResult(resp as any);
      actions.resetForm();
    } catch (err) {
      if (/uniqueness violation/i.test(err.message)) {
        actions.setFieldError('email', 'An organization with same name already exists');
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
      {AddEmployee}
    </Formik>
  );
};
