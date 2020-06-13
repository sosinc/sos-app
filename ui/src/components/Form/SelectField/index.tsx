import classNames from 'classnames/bind';
import { connect, FormikContextType, getIn } from 'formik';
import { useState } from 'react';

import ErrorMessage from 'src/components/Form/ErrorMessage';
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
  autoSelectFirst?: boolean;
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

  const handleOpen = () => {
    if (formik.isSubmitting) {
      return;
    }
    setOpen(!isOpen);
  };

  const handleClose = () => {
    setOpen(false);
    formik.setFieldTouched(inputProps.name, true);
  };

  const containerClass = c('input-field-container', p.className, {
    'has-error': error,
  });

  const selectOptions = p.options.map((item) => (
    <li
      className={c('select-option')}
      data-name={item.name}
      key={item.id}
      onClick={handleSelectItem(item.id)}
    >
      {item.name}
    </li>
  ));

  const selectList = (
    <>
      <div className={c('select-backdrop')} onClick={handleClose} />
      <ul className={c('select-options')}>{p.options.length ? selectOptions : noOptions}</ul>
    </>
  );

  const selectedItem = p.options.find((i) => i.id === inputProps.value);

  if (p.autoSelectFirst && !inputProps.value && p.options.length) {
    formik.setFieldValue(inputProps.name, p.options[0].id);
  }

  return (
    <div className={containerClass} onClick={handleOpen}>
      <div className={c('select-container')} {...inputProps}>
        {selectedItem ? selectedItem.name : 'Select Value'}
      </div>
      {isOpen ? selectList : null}
      <ErrorMessage error={error} />
    </div>
  );
};

export default connect(SelectField) as React.FC<FileFieldProps>;
