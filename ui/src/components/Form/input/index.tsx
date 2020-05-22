import classNames from 'classnames/bind';
import { FieldInputProps, FieldMetaProps } from 'formik';
import c from './style.module.scss';

const cx = classNames.bind(c);

const TextField: React.FC<{
  className?: string;
  placeholder?: string;
  type?: string;
  meta: FieldMetaProps<string>;
  field: FieldInputProps<string>;
}> = (p) => {
  const hasError = p.meta.touched && p.meta.error;
  const MaybeErrorMessage = () => {
    if (!hasError) {
      return null;
    }

    return <span className={cx('error-icon')} title={p.meta.error} />;
  };

  const containerClass = cx('input-field-container', p.className, {
    'has-error': hasError,
  });

  return (
    <div className={containerClass}>
      <input type={p.type || 'text'} placeholder={p.placeholder} {...p.field} />

      <MaybeErrorMessage />
    </div>
  );
};

export default TextField;
