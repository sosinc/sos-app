import classNames from 'classnames/bind';
import { FormikProps, withFormik } from 'formik';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef } from 'react';
import * as Yup from 'yup';

import TextField from 'src/components/Form/TextField';
import FullPageLayout from 'src/components/FullPageLayout';
import style from './style.module.scss';

const c = classNames.bind(style);

const AddOrg: React.FC<FormikProps<LoginFormValues>> = (props) => {
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const inputEl = useRef(null);

  const handleFileUpload = (event: any) => {
    /* const reader = new FileReader();
     * const file = event.target.files[0]; */
    const url = URL.createObjectURL(event.target.files[0]);
    if (event.target.name === 'logo') {
      setLogo(url);
      return;
    }
    setBanner(url);
    /* reader.onloadend = () => {
     *   setLogo(reader.result);
     * };
     * reader.readAsDataURL(file); */
  };

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
              <h2 className={c('title')}> Create Oranization</h2>
              <div className={c('name-wrapper')}>
                <span className={c('field-title')}>Name</span>
                <TextField
                  className={c('over-ride')}
                  placeholder="> enter your work name"
                  type="name"
                  name="name"
                />
              </div>

              <div className={c('image-preview', 'org-logo')} onClick={() => inputEl.current}>
                <span className={c('field-title')}>Logo</span>
                <input
                  className={c('input-file')}
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  ref={inputEl}
                  style={{ display: 'none' }}
                />
                {logo.length && <img className={c('preview-image')} src={logo} alt="org-logo" />}
              </div>

              <div className={c('image-preview', 'banner')}>
                <span className={c('field-title')}>Banner</span>
                <input
                  className={c('input-file')}
                  name="banner"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                {banner.length && (
                  <img className={c('preview-image')} src={banner} alt="org-banner" />
                )}
              </div>

              <div className={c('button-wrapper')}>
                <button className={c('saveButton')} type="submit">
                  Save
                </button>
              </div>
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
