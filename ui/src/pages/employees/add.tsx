import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import SelectField from 'src/components/Form/SelectField';
import TextField from 'src/components/Form/TextField';
import DashboardLayout from 'src/containers/DashboardLayout';
import { RootState } from 'src/duck';
import { designationSelector, fetchDesignations } from 'src/duck/designations';
import { createEmployeeAction } from 'src/duck/employees';
import { fetchOrganizations, orgSelector } from 'src/duck/organizations';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';

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
  const { organizations, designations } = useSelector((state: RootState) => ({
    designations: designationSelector.selectAll(state),
    organizations: orgSelector.selectAll(state),
  }));
  const [isFetchingOrgs] = useQuery(fetchOrganizations, {
    errorTitle: 'Failed to fetch organizations. Please refresh the page',
  });
  const [isFetchingDesignations] = useQuery(fetchDesignations, {
    errorTitle: 'Failed to fetch designations. Please refresh the page',
  });

  if (organizations.length && !p.values.organization_id) {
    p.setFieldValue('organization_id', organizations[0].id);
  }

  return (
    <div className={c('container')}>
      <form className={c('form')} onSubmit={p.handleSubmit}>
        <div className={c('title-container')}>
          <h2> Create Employee</h2>
          <span className={c('sub-title')}>Manage your employee</span>
        </div>

        <div className={c('email-container', 'field-container')}>
          <span className={c('field-title')}>Email</span>
          <TextField placeholder="Enter email" type="email" name="email" />
        </div>
        <div className={c('name-container', 'field-container')}>
          <span className={c('field-title')}>Name</span>
          <TextField placeholder="Enter name" type="text" name="name" />
        </div>

        <div className={c('logo', 'field-container')}>
          <span className={c('field-title')}>Head Shot</span>
          <ImageUploadField className={'image-container'} type={'file'} name="headshot" />
        </div>

        <div className={c('right-container')}>
          <div className={c('ecode-container', 'field-container')}>
            <span className={c('field-title')}>E-Code</span>
            <TextField placeholder="Enter e-code" type="text" name="ecode" />
          </div>

          <div className={c('designation-container', 'field-container')}>
            <span className={c('field-title')}>Designation</span>
            <SelectField
              className={'org-add-form'}
              name="designation_id"
              options={designations}
              isLoading={isFetchingDesignations}
            />
          </div>
          <div className={c('org-container', 'field-container')}>
            <span className={c('field-title')}>Organization</span>
            <SelectField
              className={'org-add-form'}
              name="organization_id"
              options={organizations}
              isLoading={isFetchingOrgs}
            />
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
  email: Yup.string()
    .email()
    .required('Required'),
  headshot: Yup.string(),
  name: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(16, 'Must be 16 characters or less')
    .required('Required'),
  organization_id: Yup.string().required('Required'),
});

export default () => {
  const [createEmployee] = useAsyncThunk(createEmployeeAction, {
    errorTitle: 'Failed to crate Employee',
    rethrowError: true,
    successTitle: 'Employee created successfully',
  });

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    try {
      actions.setSubmitting(true);
      await createEmployee(values);
      actions.resetForm();
    } catch (err) {
      if (/Duplicate employee email/i.test(err.message)) {
        actions.setFieldError('email', 'A employee with same email already exists');
      }
      actions.setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title={'Snake Oil Software - Employees'} Header={Header}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {AddEmployee}
      </Formik>
    </DashboardLayout>
  );
};
