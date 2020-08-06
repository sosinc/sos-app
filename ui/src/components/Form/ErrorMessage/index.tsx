import Tippy from '@tippyjs/react';
import { AiFillExclamationCircle } from 'react-icons/ai';

import c from './style.module.scss';

const ErrorMessage: React.FC<{ error: string }> = (p) => {
  if (!p.error) {
    return null;
  }

  return (
    <Tippy content={p.error}>
      <span>
        <AiFillExclamationCircle className={c['error-icon']} />
      </span>
    </Tippy>
  );
};

export default ErrorMessage;
