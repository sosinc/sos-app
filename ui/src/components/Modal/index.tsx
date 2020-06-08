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
    <>
      <div className={c('backdrop')} />
      <div className={c('container')} onClick={p.onClose}>
        <div className={c('modal')} onClick={(e) => e.stopPropagation()}>
          <div className={c('back-icon-container')}>
            <span title="close" className={c('back-icon')} onClick={p.onClose} />
          </div>
          {p.children}
        </div>
      </div>
    </>
  );
};

export default Modal;
