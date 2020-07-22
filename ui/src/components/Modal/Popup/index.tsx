import classNames from 'classnames/bind';
import { MdErrorOutline } from 'react-icons/md';

import style from './style.module.scss';

const c = classNames.bind(style);

interface Props {
  onClose: () => void;
  setIsDirtyPopupOpen?: (isOpen: boolean) => void;
  title: string;
  subTitle: string;
  icon?: React.FC<{}>;
}
const Popup: React.FC<Props> = (p) => {
  const setIsDirtyPopupOpen = p.setIsDirtyPopupOpen
    ? p.setIsDirtyPopupOpen
    : (_: boolean) => undefined;

  return (
    <div className={c('popup-container')}>
      <div className={c('popup-info')}>
        <MdErrorOutline className={c('popup-icon')} />
        <h2>{p.title}</h2>
        <span className={c('popup-message')}>{p.subTitle}</span>
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
};

export default Popup;
