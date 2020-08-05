import classNames from 'classnames/bind';
import style from './style.module.scss';

const c = classNames.bind(style);

interface Props {
  className?: string;
  logo?: string;
  name?: string;
}

const index: React.FC<Props> = (p) => {
  if (p.logo) {
    return <img className={c(p.className, 'brand')} src={p.logo} />;
  }

  if (p.name) {
    return (
      <div className={c(p.className, 'name')}>
        <span>{p.name[0].toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className={c(p.className, 'default-icon')}>
      <span>?</span>
    </div>
  );
};

export default index;
