import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { connect, FormikContextType, getIn } from 'formik';
import { ChangeEvent, useState } from 'react';
import { MdFileUpload } from 'react-icons/md';

import ErrorMessage from 'src/components/Form/ErrorMessage';
import resolveStorageFile from 'src/lib/resolveStorageFile';
import uploadFile from 'src/lib/uploadFile';

import styles from './style.module.scss';

const c = classNames.bind(styles);

interface Props {
  name: string;
  className?: string;
  type?: string;
}

const Placeholder: React.FC<{ isUploading: boolean }> = (p) => (
  <div className={c('upload-container')}>
    <Tippy content="Upload image">
      <span>
        <MdFileUpload className={c('upload-icon')} />
      </span>
    </Tippy>

    <span className={c('upload-text')}>{p.isUploading ? 'Uploading...' : 'Browse Files'}</span>
  </div>
);

const ImagePreviewField = ({ image }: { image?: string }) => (
  <img className={c('preview-image')} src={image} alt="preview_img" />
);

const ImageUploadField: React.FC<Props & { formik: FormikContextType<{}> }> = ({
  formik,
  ...p
}) => {
  const isTouched = getIn(formik.touched, p.name);
  const error = isTouched && getIn(formik.errors, p.name) ? getIn(formik.errors, p.name) : null;
  const inputProps = formik.getFieldProps(p.name);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const containerClass = c('upload-logo-container', p.className, {
    'has-error': error,
  });

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files.length ? event.target.files[0] : null;

    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      const uploadedFilePath = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      formik.setFieldValue(p.name, uploadedFilePath);
    } catch (err) {
      formik.setFieldError(p.name, err?.message || 'Upload Failed');
    }

    setIsUploading(false);
  };

  const Content = () =>
    inputProps.value ? (
      <ImagePreviewField image={resolveStorageFile(inputProps.value)} />
    ) : (
      <Placeholder isUploading={isUploading} />
    );

  return (
    <div className={containerClass}>
      <input
        className={c('input-file')}
        type={p.type || 'file'}
        accept="image/*"
        {...inputProps}
        value=""
        onChange={handleImageUpload}
        disabled={formik.isSubmitting}
      />
      <Content />
      <ErrorMessage error={error} />

      <div
        className={c('progress-bar', { 'is-active': isUploading })}
        style={{ width: `${uploadProgress}%` }}
      />
    </div>
  );
};

export default connect(ImageUploadField) as React.FC<Props>;
