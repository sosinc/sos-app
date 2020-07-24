import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import SelectField from 'src/components/Form/SelectField';
import TextField from 'src/components/Form/TextField';
import { Designation } from 'src/entities/Designation';
import { Employee } from 'src/entities/Employee';
import { Organization } from 'src/entities/Organizations';

import style from './style.module.scss';

const c = classNames.bind(style);

interface CreateEmployeeProps {
  values?: CreateEmployeeFormValues;
  isFetchingDesignations: boolean;
  isFetchingOrgs: boolean;
  isFetchingEmployees?: boolean;
  designations: Designation[];
  organizations: Organization[];
  employee?: Employee;
}

const CreateEmployeeForm: React.FC<FormikProps<CreateEmployeeFormValues> & CreateEmployeeProps> = (
  p,
) => {
  if (p.organizations.length && !p.values.organization_id) {
    p.setFieldValue('organization_id', p.organizations[0].id);
  }

  return (
    <div className={c('container')}>
      <div className={c({ skeleton: p.isFetchingEmployees })}>
        <form className={c('form')} onSubmit={p.handleSubmit}>
          <div className={c('title-container')}>
            <h2>{p.values ? p.values.name : 'Create Employee'} </h2>
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
                options={p.designations.map((d) => ({ id: d.id, name: d.name }))}
                isLoading={p.isFetchingDesignations}
                isLogoHidden={true}
              />
            </div>
            <div className={c('org-container', 'field-container')}>
              <span className={c('field-title')}>Organization</span>
              <SelectField
                className={'org-add-form'}
                name="organization_id"
                options={p.organizations.map((o) => ({
                  id: o.id,
                  name: o.name,
                  logo: o.square_logo,
                }))}
                isLoading={p.isFetchingOrgs}
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
    </div>
  );
};

// ---

export interface CreateEmployeeFormValues {
  email: string;
  name: string;
  ecode: string;
  headshot: string;
  designation_id: string;
  organization_id: string;
}

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

interface OuterFormProps extends CreateEmployeeProps {
  onSubmit: (
    values: CreateEmployeeFormValues,
    helpers: FormikHelpers<CreateEmployeeFormValues>,
  ) => Promise<void>;
}

const initialValues = {
  designation_id: '',
  ecode: '',
  email: '',
  headshot: '',
  name: '',
  organization_id: '',
};
const OuterForm: React.FC<OuterFormProps> = (p) => {
  const InnerForm = (formikProps: FormikProps<CreateEmployeeFormValues>) => (
    <CreateEmployeeForm
      {...formikProps}
      isFetchingEmployees={p.isFetchingEmployees}
      isFetchingDesignations={p.isFetchingDesignations}
      isFetchingOrgs={p.isFetchingOrgs}
      employee={p.employee}
      designations={p.designations}
      organizations={p.organizations}
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
