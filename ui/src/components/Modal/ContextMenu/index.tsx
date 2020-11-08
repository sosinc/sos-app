import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import React, { ReactElement } from 'react';

import style from './style.module.scss';

const c = classNames.bind(style);

export interface ContextMenuProps {
  /**
   * notify parent when dropdown should be closed.
   */
  onClose: () => void;
  /**
   * React Element which makes the content of the open dropdown.
   */
  // tslint:disable-next-line:array-type
  items: Array<React.ReactElement>;
  isOpen: boolean;
  /**
   * CSS class given to the dropdown container.
   */
  className?: string;
  /**
   * It show if user want arrow pinter on box.
   * Its default value is true
   */
  hasArrow?: boolean;
}

interface ContextContentProps {
  // tslint:disable-next-line:array-type
  items: Array<React.ReactElement>;
}

export const Separator = () => <span className={c('separator')} />;
/**
 * Separator provides a separation bettewn Contenxt Menu Items.
 */

export interface ContextMenuItemProps {
  /**
   * All children of ContextMenuItem are wrapped in an HTML element for consistent
   * UX, and rendered as is. To get notified on when a menu item is selected, an
   * event listener should be added to the menu item itself.
   */
  children: ReactElement;
}

/**
 * Convinience wrapper component to give consistent UX for Contenxt Menu Items.
 * Example:
 *
 * ```tsx
 * items = [ <ContextMenuItem><span>My Menu Item</span></ContextMenuItem> ]
 * ```
 */
export const ContextMenuItem: React.FC<ContextMenuItemProps> = (p) => (
  <div className={c('context-item')}>{p.children}</div>
);

const ContextContent: React.FC<ContextContentProps> = (p) => {
  return (
    <div className={c('context-box')}>
      <div className={c('context-container')}>{p.items}</div>
    </div>
  );
};

/**
 * A Context Menu is a popup with a list of options. This component
 * allows creating context menus conviniently. ContextMenuItem and
 * Separator components are provided for consistent UI.
 */
const ContextMenu: React.FC<ContextMenuProps> = (p) => {
  const content = ContextContent({ items: p.items });

  return (
    <div className={`${p.className} ${c('container')}`}>
      <Tippy
        content={content}
        interactive={true}
        visible={p.isOpen}
        onClickOutside={p.onClose}
        maxWidth="none"
        placement="top"
        arrow={!p.hasArrow && true}
      >
        <div>{p.children}</div>
      </Tippy>
    </div>
  );
};

export default ContextMenu;
