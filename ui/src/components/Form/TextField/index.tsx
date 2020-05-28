import classNames from 'classnames/bind';
import { connect, FormikContextType, getIn } from 'formik';
import styles from './style.module.scss';

const c = classNames.bind(styles);

interface TextFieldProps {
  name: string;
  className?: string;
  placeholder?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // tslint:disable-next-line:no-unused-expression
    p.onBlur && p.onBlur(e);
    inputProps.onBlur(e);
  };

  const containerClass = c('input-field-container', p.className, {
    'has-error': error,
  });

  return (
    <div className={containerClass}>
      <input
        type={p.type || 'text'}
        tabIndex={-1}
        placeholder={p.placeholder}
        {...inputProps}
        onBlur={handleBlur}
        value={inputProps.value === undefined ? '' : inputProps.value}
      />

      <MaybeErrorMessage />
    </div>
  );
};

export default connect(TextField) as React.FC<TextFieldProps>;