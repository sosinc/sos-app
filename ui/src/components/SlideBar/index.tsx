import classNames from 'classnames/bind';

import WarningModal from 'src/components/Modal/Warning';
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

  if (!p.isOpen) {
    return null;
  }
  const dirtyFormPrompt = (
    <WarningModal
      isOpen={Boolean(p.isDirtyPopupOpen)}
      title={'Are you sure ?'}
      subTitle={' You have unsaved tasks which will not be saved'}
      onAccept={p.onClose}
      onCancel={() => setIsDirtyPopupOpen(false)}
    />
  );

  return (
    <>
      <div className={c('backdrop')} />
      <div className={c('container')} onClick={p.onClose}>
        <div className={c('content')} onClick={(e) => e.stopPropagation()}>
          {p.Header && <p.Header onClose={p.onClose} />}
          {p.children}
          {dirtyFormPrompt}
        </div>
      </div>
    </>
  );
};

export default SlideBar;
