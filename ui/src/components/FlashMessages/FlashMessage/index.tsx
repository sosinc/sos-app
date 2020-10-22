import c from 'classnames';
import React from 'react';
import { MdCheckCircle, MdClose, MdError } from 'react-icons/md';

import { FlashMessage as FullFlashMessageType } from '../duck';

import s from './style.module.scss';

export type FlashMessageType = Omit<FullFlashMessageType, 'duration'>;

export interface FlashMessageProps extends FlashMessageType {
  /**
   * A plain callback to notify the parent to remove the FlashMessage by
   * removing it from the state.
   */
  onClose: (id: string) => void;
}

/**
 * Used *internally* by `FlashMessages`. You shouldn't need to use this component directly.
 */
export const FlashMessage: React.FC<FlashMessageProps> = (p) => {
  const Icon =
    p.type === 'success' ? (
      <MdCheckCircle className={s['flash-icon']} />
    ) : (
        <MdError className={s['flash-icon']} />
      );

  return (
    <div className={s.container}>
      <div className={c(s['status-icon'], s[p.type])}>{Icon}</div>

      <div className={s.message}>
        <div className={s.title}>{p.title}</div>
        <div className={s.body}>{p.body}</div>
      </div>

      <MdClose className={s['close-icon']} onClick={() => p.onClose(p.id)} title="Close" />
    </div>
  );
};

export default FlashMessage;
