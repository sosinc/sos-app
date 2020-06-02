import classNames from 'classnames/bind';
import { Formik, FormikProps } from 'formik';
import Head from 'next/head';
import Link from 'next/link';
import * as Yup from 'yup';

import FileField from 'src/components/Form/FileField';
import TextField from 'src/components/Form/TextField';
import FullPageLayout from 'src/components/FullPageLayout';
import style from './style.module.scss';

const c = classNames.bind(style);

const AddOrg: React.FC<FormikProps<OrganizationFormValues>> = (props) => {
  return (
    <>
      <Head>
        <title>Snake Oil Softwware - Organizations</title>
      </Head>

      <FullPageLayout className={c('container')}>
        <header className={c('header')}>
          <nav>
            <Link href="/">
              <a className={c('brand')}>
                <span>S</span>
                <img className={c('logo')} src="/assets/images/sos-logo.svg" alt="o" />
                <span>S</span>
              </a>
            </Link>
          </nav>
        </header>

        <div className={c('content')}>
          <div className={c('org-container')}>
            <form className={c('org-form')} onSubmit={props.handleSubmit}>
              <h2 className={c('title')}> Create Organization</h2>
              <div className={c('name-wrapper', 'wrapper')}>
                <span className={c('field-title')}>Name</span>
                <TextField
                  className={'org-add-form'}
                  placeholder="Enter organization name"
                  type="name"
                  name="name"
                />
              </div>

              <div className={c('image-wrapper-logo', 'wrapper')}>
                <span className={c('field-title')}>Logo</span>
                <FileField className={'org-logo'} type={'file'} name="logo" />
              </div>

              <div className={c('image-wrapper-banner', 'wrapper')}>
                <span className={c('field-title')}>Banner</span>
                <FileField className={'org-image-container'} type="file" name="banner" />
              </div>

              <div className={c('button-wrapper')}>
                <button className={c('saveButton')} type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </FullPageLayout>
    </>
  );
};

interface OrganizationFormValues {
  name: string;
  banner: string;
  logo: string;
}

const handleSubmit = (values: object, actions: object) => {
  console.warn('SUBMITTING', values, actions);
};

const initialValues = {
  banner: '',
  logo: '',
  name: '',
};

const validationSchema = Yup.object().shape({
  banner: Yup.string().required('Required'),
  logo: Yup.string().required('Required'),
  name: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(16, 'Must be 16 characters or less')
    .required('Required'),
});

export default () => (
  <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
    {AddOrg}
  </Formik>
);
