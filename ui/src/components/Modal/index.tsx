import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { AiOutlineClose } from 'react-icons/ai';

import style from './style.module.scss';
const c = classNames.bind(style);

interface ModalProps {
  onClose: () => void;
  children: React.ReactElement;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = (p) => {
  if (!p.isOpen) {
    return null;
  }

  return (
    <>
      <div className={c('backdrop')} />
      <div className={c('container')} onClick={p.onClose}>
        <div className={c('modal')} onClick={(e) => e.stopPropagation()}>
          <div className={c('back-icon-container')}>
            <Tippy content="Close" placement="right-end">
              <span>
                <AiOutlineClose className={c('back-icon')} onClick={p.onClose} />
              </span>
            </Tippy>
          </div>
          {p.children}
        </div>
      </div>
    </>
  );
};

export default Modal;
