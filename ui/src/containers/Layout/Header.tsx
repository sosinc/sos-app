import classNames from 'classnames/bind';
import Link from 'next/link';
import { AiOutlinePlus } from 'react-icons/ai';

import style from './style.module.scss';
const c = classNames.bind(style);

interface HeaderProps {
  title: string;
  subTitle?: string;
  redirectPath: string;
  toolTip?: string;
  isButtonShown?: boolean;
}

const Header: React.FC<HeaderProps> = (p) => {
  const addButton = (
    <Link href={p.redirectPath}>
      <AiOutlinePlus title={p.toolTip} className={c('plus-icon')} />
    </Link>
  );

  return (
    <div className={c('header-container')}>
      <div className={c('title-container')}>
        <Link href={p.redirectPath}>
          <span className={c('header-title')}>{p.title}</span>
        </Link>
        <span>{p.subTitle}</span>
      </div>

      {p.isButtonShown && addButton}
    </div>
  );
};

export default Header;
