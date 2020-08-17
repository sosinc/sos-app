import classNames from 'classnames/bind';
import { FormikHelpers, FormikValues } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import CreateOrganization, { CreateOrgFormValues } from 'src/components/Organization/Create';
import DashboardLayout from 'src/containers/DashboardLayout';
import { RootState } from 'src/duck';
import { fetchOrganization, orgSelector, updateOrganizationAction } from 'src/duck/organizations';
import { useAsyncThunk, useQuery } from 'src/lib/asyncHooks';

import style from '../style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => {
  const router = useRouter();
  const organizationId = String(router.query.id);
  const organization = useSelector((state: RootState) =>
    orgSelector.selectById(state, organizationId),
  );

  return (
    <div className={c('header')}>
      <span>
        <Link href="/organizations">
          <a>{'Organizations >'} </a>
        </Link>
        {organization?.name || 'Organization'}
      </span>
    </div>
  );
};

const OrganizationDetails: React.FC<FormikValues> = () => {
  const router = useRouter();
  const queryId = String(router.query.id);
  const organization = useSelector((state: RootState) => orgSelector.selectById(state, queryId));

  const [isFetchingOrg] = useQuery(() => fetchOrganization({ id: queryId }), {
    errorTitle: 'Failed to fetch some Organization details',
  });

  const [createOrganization] = useAsyncThunk(updateOrganizationAction, {
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
      await createOrganization({ ...values, orgId: queryId });
    } catch (err) {
      if (/Duplicate organization name/i.test(err.message)) {
        helpers.setFieldError('name', 'An organization with same name already exists');
      }
      helpers.setSubmitting(false);
    }
  };

  const formValues: CreateOrgFormValues = {
    banner: organization?.banner || '',
    name: organization?.name || '',
    square_logo: organization?.square_logo || '',
  };

  return (
    <CreateOrganization
      onSubmit={handleSubmit}
      isFetchingOrganization={isFetchingOrg}
      values={formValues}
    />
  );
};

export default () => {
  return (
    <DashboardLayout title={'Organization - Snake Oil Software'} Header={Header}>
      <OrganizationDetails />
    </DashboardLayout>
  );
};
