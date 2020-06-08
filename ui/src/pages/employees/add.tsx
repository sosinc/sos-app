import classNames from 'classnames/bind';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import SelectField from 'src/components/Form/SelectField';
import TextField from 'src/components/Form/TextField';
import Layout from 'src/containers/Layout';
import style from './style.module.scss';

const c = classNames.bind(style);

const designation = [
  { id: '1', name: 'Sd', avtar: '' },
  { id: '2', name: 'De', avtar: '' },
  { id: '3', name: 'Bd', avtar: '' },
];

const organizations = [
  { id: '1', name: 'Aaaaa', avtar: '' },
  { id: '2', name: 'Baaaa', avtar: '' },
  { id: '3', name: 'Caaaa', avtar: '' },
];

const AddOrg: React.FC<FormikProps<EmployeeFormValues>> = (props) => {
  return (
    <Layout headerTitle={'Snake Oil Software - Employees'} redirectPath="/">
      <div className={c('org-container')}>
        <form className={c('org-form')} onSubmit={props.handleSubmit}>
          <h2 className={c('title')}> Create Employee</h2>

          <div className={c('name-wrapper', 'wrapper')}>
            <span className={c('field-title')}>Name</span>
            <TextField
              className={'form-text-field'}
              placeholder="Enter employee name"
              type="text"
              name="name"
            />
          </div>

          <div className={c('image-wrapper-logo', 'wrapper')}>
            <span className={c('field-title')}>Head Shot</span>
            <ImageUploadField className={'org-image-container'} type={'file'} name="headShot" />
          </div>

          <div className={c('employee-fields-container')}>
            <div className={c('ecode-wrapper', 'wrapper')}>
              <span className={c('field-title')}>E-Code</span>
              <TextField
                className={'form-text-field'}
                placeholder="Enter e-code"
                type="text"
                name="ecode"
              />
            </div>

            <div className={c('designation-wrapper', 'wrapper')}>
              <span className={c('field-title')}>Designation</span>
              <SelectField className={'org-add-form'} name="designation" options={designation} />
            </div>
            <div className={c('orgn-wrapper', 'wrapper')}>
              <span className={c('field-title')}>Organization</span>
              <SelectField
                className={'org-add-form'}
                name="organization"
                options={organizations}
                autoSelectFirst={true}
              />
            </div>
          </div>

          <div className={c('button-wrapper')}>
            <button className={c('save-button')} type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

interface EmployeeFormValues {
  name: string;
  ecode: string;
  headShot: string;
  designation: string;
  organization: string;
}

const handleSubmit = (values: object, actions: object) => {
  console.warn('SUBMITTING', values, actions);
};

const initialValues = {
  designation: '',
  ecode: '',
  headShot: '',
  name: '',
  organization: '',
};

const validationSchema = Yup.object().shape({
  designation: Yup.string().required('Required'),
  ecode: Yup.string().required('Required'),
  headShot: Yup.string().required('Required'),
  name: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(16, 'Must be 16 characters or less')
    .required('Required'),
  organization: Yup.string().required('Required'),
});

export default () => (
  <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
    {AddOrg}
  </Formik>
);
