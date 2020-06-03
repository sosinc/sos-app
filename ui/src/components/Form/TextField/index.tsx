import classNames from 'classnames/bind';
import { connect, FormikContextType, getIn } from 'formik';
import styles from './style.module.scss';

const c = classNames.bind(styles);

interface TextFieldProps {
  name: string;
  className?: string;
  placeholder?: string;
  isTabIndexEnable?: boolean;
  type?: string;
}

const TextField: React.FC<TextFieldProps & { formik: FormikContextType<{}> }> = ({
  formik,
  ...p
}) => {
  const isTouched = getIn(formik.touched, p.name);
  const error = isTouched ? getIn(formik.errors, p.name) : null;
  const inputProps = formik.getFieldProps(p.name);

  const MaybeErrorMessage = () => {
    if (!error) {
      return null;
    }

    return <span className={c('error-icon')} title={error} />;
  };

  const containerClass = c('input-field-container', p.className, {
    'has-error': error,
  });

  return (
    <div className={containerClass}>
      <input
        type={p.type || 'text'}
        tabIndex={p.isTabIndexEnable ? -1 : 1}
        placeholder={p.placeholder}
        {...inputProps}
      />
      <MaybeErrorMessage />
    </div>
  );
};

export default connect(TextField) as React.FC<TextFieldProps>;
