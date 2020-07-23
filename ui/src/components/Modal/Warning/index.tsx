import classNames from 'classnames/bind';
import { MdErrorOutline } from 'react-icons/md';

import Modal from '../';
import style from './style.module.scss';

const c = classNames.bind(style);

interface Props {
  isOpen: boolean;
  title: string;
  subTitle: string;
  onAccept: () => void;
  onCancel: () => void;
}

const WarningModal: React.FC<Props> = (p) => {
  return (
    <Modal isOpen={p.isOpen} onClose={p.onCancel}>
      <div className={c('popup-container')}>
        <div className={c('popup-info')}>
          <MdErrorOutline className={c('popup-icon')} />
          <h2>{p.title}</h2>
          <span className={c('popup-message')}>{p.subTitle}</span>
        </div>

        <div className={c('popup-buttons')}>
          <span className={c('other-button')} onClick={p.onCancel}>
            Cancel
          </span>
          <span className={c('other-button', 'continue-button')} onClick={p.onAccept}>
            Ok
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default WarningModal;
