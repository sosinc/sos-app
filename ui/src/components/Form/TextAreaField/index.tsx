import { connect, FormikContextType } from 'formik';
import { MutableRefObject } from 'react';

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
  return (
    <div>
      <textarea
        name={p.name}
        className={p.className}
        placeholder={p.placeholder}
        rows={p.rows}
        cols={p.cols}
      />
    </div>
  );
};

export default connect(TextAreaField) as React.FC<TextAreaFieldProps>;
