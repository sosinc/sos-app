import classNames from 'classnames/bind';
import { MdErrorOutline } from 'react-icons/md';

import Modal from '../';
import style from './style.module.scss';

const c = classNames.bind(style);

interface Props {
  isOpen: boolean;
  title: string;
  subTitle: string;
  closeButtonText?: string;
  acceptButtonText?: string;
  onAccept: () => void;
  onCancel: () => void;
}

const WarningModal: React.FC<Props> = (p) => {
  return (
    <Modal isOpen={p.isOpen} onClose={p.onCancel}>
      <div className={c('popup-container')}>
        <div className={c('popup-info')}>
          <MdErrorOutline className={c('popup-icon')} />
          <div className={c('title-container')}>
            <h2 className={c('title')}>{p.title}</h2>
            <span>{p.subTitle}</span>
          </div>
        </div>

        <div className={c('popup-buttons')}>
          <button className={c('close')} onClick={p.onCancel}>
            {p.closeButtonText || 'Cancel'}
          </button>
          <button className={c('accept')} onClick={p.onAccept}>
            {p.acceptButtonText || 'Ok'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WarningModal;
