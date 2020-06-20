import c from 'classnames';
import { connect, FormikContextType, getIn } from 'formik';
import { MutableRefObject } from 'react';
import ErrorMessage from 'src/components/Form/ErrorMessage';

import s from './style.module.scss';

interface TextFieldProps {
  name: string;
  className?: string;
  placeholder?: string;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  tabIndex?: number;
  type?: string;
}

const TextField: React.FC<TextFieldProps & { formik: FormikContextType<{}> }> = ({
  formik,
  ...p
}) => {
  const isTouched = getIn(formik.touched, p.name);
  const error = isTouched ? getIn(formik.errors, p.name) : null;
  const inputProps = formik.getFieldProps(p.name);

  const containerClass = c(s['input-field-container'], p.className, {
    [s['has-error']]: error,
    [s.field]: !p.className,
  });

  return (
    <div className={containerClass}>
      <input
        type={p.type || 'text'}
        tabIndex={p.tabIndex}
        placeholder={p.placeholder}
        {...inputProps}
        ref={p.inputRef}
        disabled={formik.isSubmitting}
      />
      <ErrorMessage error={error} />
    </div>
  );
};

export default connect(TextField) as React.FC<TextFieldProps>;
