import classNames from 'classnames/bind';
import React from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

import style from './style.module.scss';

const c = classNames.bind(style);

export interface ButtonProps {
  /**
   * Rander button content
   */
  children: React.ReactElement;
  /**
   * If user want to show down icon
   */
  hasNoUpArrow?: boolean;
}

/**
 * A BorderButton is a container wher user can rander image or text with dropdown icon.
 */

const BorderButton: React.FC<ButtonProps> = (p) => {
  return (
    <>
      <div className={c('container')}>
        <div className={c('just-button')}>
          {p.children}
          {!p.hasNoUpArrow && <MdKeyboardArrowDown className={c('up-icon')} />}
        </div>
      </div>
    </>
  );
};

export default BorderButton;
