import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import SaveButton from 'src/components/Form/SaveButton';
import TextField from 'src/components/Form/TextField';
import { Organization } from 'src/entities/Organizations';
import style from './style.module.scss';

const c = classNames.bind(style);

interface CreateOrgProps {
  values?: CreateOrgFormValues;
  isFetchingOrganization?: boolean;
  organization?: Organization;
}

const CreateOrgForm: React.FC<FormikProps<CreateOrgFormValues> & CreateOrgProps> = (p) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUploading = (status: boolean) => {
    setIsUploading(status);
  };

  return (
    <div className={c('org-container')}>
      <div className={c({ skeleton: p.isFetchingOrganization })}>
        <form className={c('org-form')} onSubmit={p.handleSubmit}>
          <div className={c('title-container')}>
            <h2>{p.values.name ? p.values.name : 'Create Organization'} </h2>
            <span className={c('sub-title')}>Manage your organization</span>
          </div>
          <div className={c('name-container', 'field-container')}>
            <span className={c('field-title')}>Name</span>
            <TextField placeholder="Enter organization name" type="name" name="name" />
          </div>

          <div className={c('image-container-logo', 'field-container')}>
            <span className={c('field-title')}>Logo</span>
            <ImageUploadField
              className={c('org-logo')}
              type={'file'}
              name="square_logo"
              uploadStatus={handleUploading}
            />
          </div>

          <div className={c('image-container-banner', 'field-container')}>
            <span className={c('field-title')}>Banner</span>
            <ImageUploadField
              className={c('org-banner')}
              type="file"
              name="banner"
              uploadStatus={handleUploading}
            />
          </div>

          <SaveButton
            isSubmitting={p.isSubmitting}
            isUploading={isUploading}
            className={c('save-button')}
          />
        </form>
      </div>
    </div>
  );
};

// ---

export interface CreateOrgFormValues {
  banner: string;
  name: string;
  square_logo: string;
}

const validationSchema = Yup.object().shape({
  banner: Yup.string(),
  name: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(50, 'Must be 50 characters or less')
    .trim()
    .required('Required'),
  square_logo: Yup.string(),
});

interface OuterFormProps extends CreateOrgProps {
  onSubmit: (
    values: CreateOrgFormValues,
    helpers: FormikHelpers<CreateOrgFormValues>,
  ) => Promise<void>;
}

const initialValues = {
  banner: '',
  name: '',
  square_logo: '',
};

const OuterForm: React.FC<OuterFormProps> = (p) => {
  const InnerForm = (formikProps: FormikProps<CreateOrgFormValues>) => (
    <CreateOrgForm
      {...formikProps}
      isFetchingOrganization={p.isFetchingOrganization}
      organization={p.organization}
    />
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={p.values ? p.values : initialValues}
        validationSchema={validationSchema}
        onSubmit={p.onSubmit}
      >
        {InnerForm}
      </Formik>
    </>
  );
};

export default OuterForm;
