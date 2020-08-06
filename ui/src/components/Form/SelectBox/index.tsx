import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

import FallbackIcon from 'src/containers/FallbackIcon';
import styles from './style.module.scss';

const c = classNames.bind(styles);

export interface SelectFieldItem {
  id: string;
  name: string;
  logo?: string;
  Logo?: React.FC;
}

interface FileFieldProps {
  name?: string;
  className?: string;
  isDropdownIconHidden?: boolean;
  options: SelectFieldItem[];
  isLoading?: boolean;
  onSelect: (item: SelectFieldItem) => void;
  value: string;
  Selected: React.FC<{ item?: SelectFieldItem }>;
  isFullWidth?: boolean;
}

const noOptions = <li className={c('select-option')}>{'No data'}</li>;

const SelectFieldRow: React.FC<SelectFieldItem> = (f) => {
  let itemIcon = <FallbackIcon logo={f.logo} name={f.name} />;

  if (f.Logo) {
    itemIcon = <f.Logo />;
  }

  return (
    <>
      <div className={c(f.Logo ? 'logo-container' : 'logo')}>{itemIcon}</div>
      <div className={c('title')}>{f.name} </div>
    </>
  );
};

const SelectBox: React.FC<FileFieldProps> = (p) => {
  const [isOpen, setOpen] = useState(false);

  const handleSelectItem = (item: SelectFieldItem) => () => {
    if (item.id !== p.value) {
      p.onSelect(item);
    }
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
      onClick={handleSelectItem(item)}
    >
      <SelectFieldRow {...item} />
    </li>
  ));

  const selectList = (
    <ul className={c('select-options')}>{p.options.length ? selectOptions : noOptions}</ul>
  );

  const Icon = () => <MdKeyboardArrowDown className={c('icon')} />;

  return (
    <div className={c({ 'full-width-container': p.isFullWidth })} onClick={handleOpen}>
      <Tippy
        content={selectList}
        interactive={true}
        visible={isOpen}
        onClickOutside={handleClose}
        arrow={false}
        className={c('tippy-container')}
        maxWidth="none"
        placement="bottom"
      >
        <div className={containerClass}>
          <div className={c('select-container')}>
            <p.Selected item={p.options.find((i) => i.id === p.value)} />
            {!p.isDropdownIconHidden && <Icon />}
          </div>
        </div>
      </Tippy>
    </div>
  );
};

export default SelectBox;
