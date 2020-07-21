import classNames from 'classnames/bind';
import { MdErrorOutline } from 'react-icons/md';

import Modal from 'src/components/Modal';
import style from './style.module.scss';

const c = classNames.bind(style);

interface Props {
  onClose: () => void;
  children: React.ReactElement;
  isOpen: boolean;
  isDirtyPopupOpen?: boolean;
  setIsDirtyPopupOpen?: (isOpen: boolean) => void;
  Header?: React.FC<{ onClose: () => void }>;
}

const SlideBar: React.FC<Props> = (p) => {
  const setIsDirtyPopupOpen = p.setIsDirtyPopupOpen
    ? p.setIsDirtyPopupOpen
    : (_: boolean) => undefined;

  const Popup: React.FC = () => (
    <div className={c('popup-container')}>
      <div className={c('popup-info')}>
        <MdErrorOutline className={c('popup-icon')} />
        <h2>Are you sure </h2>
        <span className={c('popup-message')}>You have unsaved tasks which will not be saved</span>
      </div>
      <div className={c('popup-buttons')}>
        <span className={c('other-button')} onClick={() => setIsDirtyPopupOpen(false)}>
          Cancel
        </span>
        <span className={c('other-button', 'continue-button')} onClick={p.onClose}>
          Ok
        </span>
      </div>
    </div>
  );

  if (!p.isOpen) {
    return null;
  }
  const isFormDirty = (
    <Modal onClose={() => setIsDirtyPopupOpen(false)} isOpen={Boolean(p.isDirtyPopupOpen)}>
      <Popup />
    </Modal>
  );
  return (
    <>
      <div className={c('backdrop')} />
      <div className={c('container')} onClick={p.onClose}>
        <div className={c('content')} onClick={(e) => e.stopPropagation()}>
          {p.Header && <p.Header onClose={p.onClose} />}
          {p.children}
          {isFormDirty}
        </div>
      </div>
    </>
  );
};

export default SlideBar;
