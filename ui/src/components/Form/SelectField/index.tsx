import classNames from 'classnames/bind';
import { connect, FormikContextType, getIn } from 'formik';
import { useState } from 'react';

import styles from './style.module.scss';

const c = classNames.bind(styles);

interface SelectFieldItem {
  id: string;
  name: string;
  avatar?: string;
}

interface FileFieldProps {
  name: string;
  className?: string;
  options: SelectFieldItem[];
  defaultSelectValue?: boolean;
}
const noOptions = <li className={c('select-option')}>{'No data'}</li>;
const SelectField: React.FC<FileFieldProps & { formik: FormikContextType<{}> }> = ({
  formik,
  ...p
}) => {
  const isTouched = getIn(formik.touched, p.name);
  const error = isTouched && getIn(formik.errors, p.name) ? getIn(formik.errors, p.name) : null;
  const inputProps = formik.getFieldProps(p.name);

  const [isOpen, setOpen] = useState(false);

  const handleSelectItem = (id: string) => () => {
    formik.setFieldValue(p.name, id);
  };

  const MaybeErrorMessage = () => {
    if (!error) {
      return null;
    }

    return <span className={c('error-icon')} title={error} />;
  };

  const containerClass = c('input-field-container', p.className, {
    'has-error': error,
  });

  const selectOptions = p.options.map((item) => (
    <li
      className={c('select-option')}
      data-name={item.name}
      key={item.id}
      onClick={handleSelectItem(item.id)}>
      {item.name}
    </li>
  ));

  const selectedItem = p.options.find((i) => i.id === inputProps.value);
  const defautlValue =
    p.options.length && p.defaultSelectValue ? p.options[0].name : 'Choose value';

  return (
    <div className={containerClass} onClick={() => setOpen(!isOpen)}>
      <div className={c('select-container')} {...inputProps}>
        {selectedItem ? selectedItem.name : defautlValue}
      </div>
      {isOpen && (
        <>
          <div className={c('select-backdrop')} onClick={() => setOpen(false)} />
          <ul className={c('select-options')}>{p.options.length ? selectOptions : noOptions}</ul>
        </>
      )}
      <MaybeErrorMessage />
    </div>
  );
};

export default connect(SelectField) as React.FC<FileFieldProps>;
