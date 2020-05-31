import classNames from 'classnames/bind';
import { FormikProps, withFormik } from 'formik';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import * as Yup from 'yup';

import TextField from 'src/components/Form/TextField';
import FullPageLayout from 'src/components/FullPageLayout';
import style from './style.module.scss';

const c = classNames.bind(style);

const AddOrg: React.FC<FormikProps<OrganizationFormValues>> = (props) => {
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');

  const logoMeta = props.getFieldMeta('logo');

  console.log(logoMeta.error);

  const handleFileUpload = (event: any) => {
    const url = URL.createObjectURL(event.target.files[0]);
    if (event.target.name === 'logo') {
      setLogo(url);
    } else {
      setBanner(url);
    }
    const fieldProps = props.getFieldProps(event.target.name);
    fieldProps.onChange(event);
  };

  const orgLogo = logo.length ? (
    <img className={c('preview-image')} src={logo} alt="org-logo" />
  ) : (
    ''
  );

  const orgBanner = banner.length ? (
    <img className={c('preview-image')} src={banner} alt="org-banner" />
  ) : (
    ''
  );

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
              <div className={c('name-wrapper', 'wrapper')}>
                <span className={c('field-title')}>Name</span>
                <TextField
                  className={'reset-form'}
                  placeholder="> enter your work name"
                  type="name"
                  name="name"
                />
              </div>

              <div className={c('image-wrapper-logo', 'wrapper')}>
                <span className={c('field-title')}>Logo</span>
                <div className={c('org-logo')}>
                  <input
                    className={c('input-file')}
                    type="file"
                    accept="image/*"
                    {...props.getFieldProps('logo')}
                    onChange={handleFileUpload}
                  />
                  {orgLogo}
                </div>
              </div>

              <div className={c('image-wrapper-banner', 'wrapper')}>
                <span className={c('field-title')}>Banner</span>
                <div className={c('banner')}>
                  <input
                    className={c('input-file')}
                    type="file"
                    accept="image/*"
                    {...props.getFieldProps('banner')}
                    onChange={handleFileUpload}
                  />
                  {orgBanner}
                </div>
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
  banner: File;
  logo: File;
}

const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

export default withFormik<{}, OrganizationFormValues>({
  handleSubmit: (values, bag) => {
    console.warn('SUBMITTING', values, bag);
  },
  validationSchema: Yup.object().shape({
    banner: Yup.mixed()
      .required('A file is required')
      .test('fileSize', 'File too large', (value) => value && value.size <= FILE_SIZE)
      .test(
        'fileFormat',
        'Unsupported Format',
        (value) => value && SUPPORTED_FORMATS.includes(value.type),
      ),
    logo: Yup.mixed()
      .required('A file is required')
      .test('fileSize', 'File too large', (value) => value && value.size <= FILE_SIZE)
      .test(
        'fileFormat',
        'Unsupported Format',
        (value) => value && SUPPORTED_FORMATS.includes(value.type),
      ),
    name: Yup.string()
      .min(2, 'Must be 2 characters or more')
      .max(16, 'Must be 16 characters or less')
      .required('Required'),
  }),
})(AddOrg);
