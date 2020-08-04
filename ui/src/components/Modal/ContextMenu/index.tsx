import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';

import style from './style.module.scss';

const c = classNames.bind(style);

interface Props {
  onClose: () => void;
  children: React.ReactElement;
  isOpen: boolean;
  Header?: React.FC<{ onClose: () => void }>;
}

const ContextMenu: React.FC<Props> = (p) => {
  if (!p.isOpen) {
    return null;
  }

  return (
    <Tippy
      content={p.children}
      interactive={true}
      visible={p.isOpen}
      onClickOutside={p.onClose}
      maxWidth="none"
      placement="bottom"
    >
      <div className={c('container')} onClick={p.onClose}>
        {p.children}
      </div>
    </Tippy>
  );
};

export default ContextMenu;
