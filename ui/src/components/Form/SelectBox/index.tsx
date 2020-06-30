import classNames from 'classnames/bind';
import { useState } from 'react';
import { MdExpandMore } from 'react-icons/md';

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
  isLoading?: boolean;
}
const noOptions = <li className={c('select-option')}>{'No data'}</li>;
const SelectBox: React.FC<FileFieldProps> = ({ ...p }) => {
  const [isOpen, setOpen] = useState(false);

  const handleSelectItem = (id: string) => () => {
    console.warn('------', id);
  };

  const handleOpen = () => {
    setOpen(!isOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const containerClass = c('input-field-container', p.className, {
    'is-loading': p.isLoading,
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

  const Icon = () => <MdExpandMore className={c('icon')} />;

  return (
    <div className={containerClass} onClick={handleOpen}>
      <div className={c('select-container')}>
        Select Value
        <Icon />
      </div>
      {isOpen ? selectList : null}
    </div>
  );
};

export default SelectBox;
