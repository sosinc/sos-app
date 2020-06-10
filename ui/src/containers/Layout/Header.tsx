import classNames from 'classnames/bind';
import Router from 'next/router';
import { AiOutlinePlus } from 'react-icons/ai';

import style from './style.module.scss';
const c = classNames.bind(style);

interface HeaderProps {
  title: string;
  redirectPath: string;
  toolTip?: string;
}

const Header: React.FC<HeaderProps> = (p) => {
  return (
    <div className={c('header-container')}>
      <span className={c('header-title')}> {p.title} </span>
      <AiOutlinePlus
        title={p.toolTip}
        className={c('plus-icon')}
        onClick={() => Router.push(p.redirectPath)}
      />
    </div>
  );
};

export default Header;
