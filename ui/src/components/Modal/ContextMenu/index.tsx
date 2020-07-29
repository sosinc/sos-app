import classNames from 'classnames/bind';

import style from './style.module.scss';

const c = classNames.bind(style);

interface Props {
  onClose: () => void;
  children: React.ReactElement;
  isOpen: boolean;
  Header?: React.FC<{ onClose: () => void }>;
}

const SlideBar: React.FC<Props> = (p) => {
  if (!p.isOpen) {
    return null;
  }

  return (
    <>
      <div className={c('backdrop')} />
      <div className={c('container')} onClick={p.onClose}>
        <div className={c('content')}>
          {p.Header && <p.Header onClose={p.onClose} />}
          {p.children}
        </div>
      </div>
    </>
  );
};

export default SlideBar;
