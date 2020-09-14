import c from 'classnames';
import { connect, FormikContextType, getIn } from 'formik';
import { MutableRefObject } from 'react';
import ErrorMessage from 'src/components/Form/ErrorMessage';

import s from './style.module.scss';

interface TextAreaFieldProps {
  name: string;
  className?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  tabIndex?: number;
  rows?: number;
  cols?: number;
}

const TextAreaField: React.FC<TextAreaFieldProps & { formik: FormikContextType<{}> }> = ({
  formik,
  ...p
}) => {
  const isTouched = getIn(formik.touched, p.name);
  const error = isTouched ? getIn(formik.errors, p.name) : null;
  const inputProps = formik.getFieldProps(p.name);

  const containerClass = c(s['text-area-field-container'], p.className, {
    [s['has-error']]: error,
    [s.field]: !p.className,
  });

  return (
    <div className={containerClass}>
      <textarea
        className={p.className}
        placeholder={p.placeholder}
        rows={p.rows}
        cols={p.cols}
        {...inputProps}
      />

      <ErrorMessage error={error} />
    </div>
  );
};

export default connect(TextAreaField) as React.FC<TextAreaFieldProps>;
