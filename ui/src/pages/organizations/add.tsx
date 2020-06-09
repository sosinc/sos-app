import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import TextField from 'src/components/Form/TextField';
import Layout from 'src/containers/Layout';
import { RootState } from 'src/duck';
import { createOrganization, OrganizationState } from 'src/duck/organization';

import style from './style.module.scss';

const c = classNames.bind(style);

const AddOrg: React.FC<FormikProps<FormValues>> = (props) => {
  return (
    <Layout headerTitle={'Snake Oil Software - Organizations'} redirectPath="/">
      <div className={c('org-container')}>
        <form className={c('org-form')} onSubmit={props.handleSubmit}>
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
            <button className={c('save-button')} type="submit">
              Save
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
  const { isLoading } = useSelector<RootState, OrganizationState>((state) => state.organization);

  const handleAddOrganization = (values: FormValues) => {
    dispatch(createOrganization(values));
  };

  const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    console.warn('SUBMITTING', values, actions);
    handleAddOrganization(values);
  };

  if (isLoading) {
    return (
      <Layout headerTitle={'Snake Oil Software - Organizations'} redirectPath="/">
        <p>Loading....</p>
      </Layout>
    );
  }

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
