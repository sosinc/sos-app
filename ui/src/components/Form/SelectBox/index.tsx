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
  FirstValue?: React.FC;
  isLogoHidden?: boolean;
}
const noOptions = <li className={c('select-option')}>{'No data'}</li>;

const SelectBox: React.FC<FileFieldProps> = ({ ...p }) => {
  const [isOpen, setOpen] = useState(false);

  const SelectFieldRow: React.FC<SelectFieldItem> = (f) => {
    let itemIcon = <FallbackIcon logo={f.logo} name={p.name} />;

    if (f.Logo) {
      itemIcon = <f.Logo />;
    }

    return (
      <>
        {!p.isLogoHidden && <div className={c(f.Logo ? 'logo-container' : 'logo')}>{itemIcon}</div>}
        <div className={c('title')}>{f.name} </div>
      </>
    );
  };
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
        {p.FirstValue && <p.FirstValue />}
        {p.title}
        {!p.isDropdownIconHidden && <Icon />}
      </div>
      {isOpen ? selectList : null}
    </div>
  );
};

export default SelectBox;
