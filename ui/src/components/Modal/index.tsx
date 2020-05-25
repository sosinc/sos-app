import classNames from 'classnames/bind';

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
    <div className={c('container')}>
      <div className={c('modal')}>
        <a className="close" onClick={() => p.onClose()}>
          close
        </a>
        {p.children}
      </div>
    </div>
  );
};

export default Modal;
