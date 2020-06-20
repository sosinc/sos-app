import classNames from 'classnames/bind';
import style from './style.module.scss';

const c = classNames.bind(style);

interface Props {
  className?: string;
  logo?: string;
  name: string;
}

const index: React.FC<Props> = (p) => {
  const containerClass = c('fallback-brand', p.className);

  const firstLetter = p.name[0].toUpperCase();
  if (p.logo) {
    return <img className={c('brand')} src={p.logo} />;
  }

  return (
    <div className={containerClass}>
      <span className={c('fallback-icon')}>{firstLetter}</span>
    </div>
  );
};

export default index;
