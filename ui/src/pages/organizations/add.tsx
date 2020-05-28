import classNames from 'classnames/bind';
import { FormikProps, withFormik } from 'formik';
import Head from 'next/head';
import Link from 'next/link';
import * as Yup from 'yup';

import TextField from 'src/components/Form/TextField';
import FullPageLayout from 'src/components/FullPageLayout';
import hasFormError from 'src/lib/hasFormError';
import style from './style.module.scss';

const c = classNames.bind(style);

const AddOrg: React.FC<FormikProps<LoginFormValues>> = (props) => {
  const formHasError = hasFormError(props);
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
            <form
              className={c('org-form', { 'has-error': formHasError })}
              onSubmit={props.handleSubmit}>
              <h2 className={c('title')}> Create Oranization</h2>
              <div className={c('name-wrapper')}>
                <TextField placeholder="> enter your work name" type="name" name="name" />
              </div>
              <div className={c('image-preview', 'logo')}>
                <span>Logo</span>
                <TextField
                  className={c('preview')}
                  placeholder="select logo"
                  type="file"
                  name="logo"
                />
              </div>
              <div className={c('image-preview', 'banner')}>
                <span>Banner</span>
                <TextField
                  className={c('preview')}
                  placeholder="select banner"
                  type="file"
                  name="banner"
                />
              </div>

              <button className={c('saveButton')} type="submit">
                Save
              </button>
            </form>{' '}
          </div>
        </div>
      </FullPageLayout>
    </>
  );
};

interface LoginFormValues {
  name: string;
  banner: string;
  logo: string;
}

export default withFormik<{}, LoginFormValues>({
  validationSchema: Yup.object({
    name: Yup.string()
      .min(5, 'Must be 5 characters or more')
      .max(10, 'Must be 10 characters or less')
      .required('Required'),
    banner: Yup.string().required('Required'),
    logo: Yup.string().required('Required'),
  }),

  handleSubmit: (values, bag) => {
    console.warn('SUBMITTING', values, bag);
  },
})(AddOrg);
