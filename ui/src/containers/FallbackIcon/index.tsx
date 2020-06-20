import classNames from 'classnames/bind';
import style from './style.module.scss';

const c = classNames.bind(style);

interface Props {
  className?: string;
  logo?: string;
  name?: string;
}

const index: React.FC<Props> = (p) => {
  const containerClass = c('fallback-brand', p.className);

  if (p.logo) {
    return <img className={c('brand')} src={p.logo} />;
  } else if (p.name) {
    return (
      <div className={containerClass}>
        <span>{p.name[0].toUpperCase()}</span>
      </div>
    );
  }
  return (
    <div className={c('defautl-fallback-icon')}>
      <span>?</span>
    </div>
  );
};

export default index;
