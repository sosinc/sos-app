import classNames from 'classnames/bind';
import { useState } from 'react';
import { MdExpandMore } from 'react-icons/md';

import FallbackIcon from 'src/containers/FallbackIcon';
import styles from './style.module.scss';

const c = classNames.bind(styles);

interface SelectFieldItem {
  id: string;
  name: string;
  logo?: string;
  Logo?: React.FC;
}

interface FileFieldProps {
  name: string;
  className?: string;
  isDropdownIconHidden?: boolean;
  title?: string;
  options: SelectFieldItem[];
  isLoading?: boolean;
  onSelect?: any;
  Header?: React.FC;
}
const noOptions = <li className={c('select-option')}>{'No data'}</li>;

const SelectFieldRow: React.FC<SelectFieldItem> = (p) => {
  let Icon = <FallbackIcon logo={p.logo} name={p.name} />;

  if (p.Logo) {
    Icon = <p.Logo />;
  }

  return (
    <>
      <div className={c(p.Logo ? 'logo-container' : 'logo')}>{Icon}</div>
      <div className={c('title')}>{p.name} </div>
    </>
  );
};
const SelectBox: React.FC<FileFieldProps> = ({ ...p }) => {
  const [isOpen, setOpen] = useState(false);

  const handleSelectItem = (id: string) => () => {
    p.onSelect(id);
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
      <SelectFieldRow {...item} />
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
        {p.Header && <p.Header />}
        {p.title}
        {!p.isDropdownIconHidden && <Icon />}
      </div>
      {isOpen ? selectList : null}
    </div>
  );
};

export default SelectBox;
