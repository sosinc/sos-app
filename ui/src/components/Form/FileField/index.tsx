import classNames from 'classnames/bind';
import { connect, FormikContextType, getIn } from 'formik';
import { useState } from 'react';

import styles from './style.module.scss';

const c = classNames.bind(styles);

interface FileFieldProps {
  name: string;
  className?: string;
  type?: string;
}

const FileField: React.FC<FileFieldProps & { formik: FormikContextType<{}> }> = ({
  formik,
  ...p
}) => {
  const isTouched = getIn(formik.touched, p.name);
  const error = isTouched && getIn(formik.errors, p.name) ? getIn(formik.errors, p.name) : null;
  // console.log('-----------dd', isTouched, getIn(formik.errors, p.name), p.name);
  const inputProps = formik.getFieldProps(p.name);
  const [previewImage, setPreviewImage] = useState('');

  const MaybeErrorMessage = () => {
    if (!error) {
      return null;
    }

    return <span className={c('error-icon')} title={error} />;
  };

  const containerClass = c(p.className, {
    'has-error': error,
  });

  const handleFileUpload = (event: any) => {
    const url = URL.createObjectURL(event.target.files[0]);
    setPreviewImage(url);
    inputProps.onChange(event);
  };

  const preview = previewImage.length ? (
    <img className={c('preview-image')} src={previewImage} alt="org-image" />
  ) : (
    ''
  );

  return (
    <div className={containerClass}>
      <input
        className={c('input-file')}
        type={p.type || 'file'}
        accept="image/*"
        {...inputProps}
        onChange={handleFileUpload}
        value={inputProps.value === undefined ? '' : inputProps.value}
      />
      <MaybeErrorMessage />
      {preview}
    </div>
  );
};

export default connect(FileField) as React.FC<FileFieldProps>;
