import classNames from 'classnames/bind';
import { connect, FormikContextType, getIn } from 'formik';
import styles from './style.module.scss';

const c = classNames.bind(styles);

interface TextFieldProps {
  name: string;
  className?: string;
  placeholder?: string;
  type?: string;
}

const TextField: React.FC<TextFieldProps & { formik: FormikContextType<{}> }> = ({
  formik,
  ...p
}) => {
  const error = getIn(formik.errors, p.name);
  const inputProps = formik.getFieldProps(p.name);

  const MaybeErrorMessage = () => {
    if (!error) {
      return null;
    }

    return <span className={c('error-icon')} title={error} />;
  };

  console.warn('INPUT PROPS', inputProps);

  const containerClass = c('input-field-container', p.className, {
    'has-error': error,
  });

  return (
    <div className={containerClass}>
      <input type={p.type || 'text'} tabIndex={-1} placeholder={p.placeholder} {...inputProps} />

      <MaybeErrorMessage />
    </div>
  );
};

export default connect(TextField) as React.FC<TextFieldProps>;
