import classNames from 'classnames/bind';
import { FormikHelpers, FormikValues } from 'formik';
import Link from 'next/link';

import CreateOrganization, { CreateOrgFormValues } from 'src/components/Organization/Create';
import DashboardLayout from 'src/containers/DashboardLayout';
import { createOrganizationAction } from 'src/duck/organizations';
import { useAsyncThunk } from 'src/lib/asyncHooks';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    <span>
      <Link href="/organizations">
        <a>{'Organizations >'}</a>
      </Link>
      Create
    </span>
  </div>
);

const AddOrg: React.FC<FormikValues> = () => {
  const [createOrganization] = useAsyncThunk(createOrganizationAction, {
    errorTitle: 'Failed to create Organization',
    rethrowError: true,
    successTitle: 'Organization created successfully',
  });

  const handleSubmit = async (
    values: CreateOrgFormValues,
    helpers: FormikHelpers<CreateOrgFormValues>,
  ) => {
    try {
      helpers.setSubmitting(true);
      await createOrganization(values);
      helpers.resetForm();
    } catch (err) {
      if (/Duplicate organization name/i.test(err.message)) {
        helpers.setFieldError('name', 'An organization with same name already exists');
      }
    }
    helpers.setSubmitting(false);
  };

  return <CreateOrganization onSubmit={handleSubmit} />;
};

export default () => {
  return (
    <DashboardLayout title={'Snake Oil Software - Organizations'} Header={Header}>
      <AddOrg />
    </DashboardLayout>
  );
};
