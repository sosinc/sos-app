/**
 * Use this component when you need to show a listing of some kind (e.g organization, employees) etc
 * but there are no items found.
 */

import classNames from 'classnames/bind';
import Link from 'next/link';
import { IconType } from 'react-icons/lib/cjs';

import style from './style.module.scss';
const c = classNames.bind(style);

interface Props {
  Icon: IconType;
  message: string;
  addItemText: string;
  addItemUrl: string;
  addItemCb?: () => void;
}

const NoItemsFound: React.FC<Props> = (p) => {
  const addItem = p.addItemCb ? (
    <span className={c('add-item')} onClick={p.addItemCb}>
      {p.addItemText}
    </span>
  ) : (
    <Link href={p.addItemUrl}>
      <a className={c('add-item')}>
        <span>{p.addItemText}</span>
      </a>
    </Link>
  );

  return (
    <>
      <p.Icon className={c('icon')} />
      <div className={c('message')}>{p.message}</div>
      {addItem}
    </>
  );
};

export default NoItemsFound;
