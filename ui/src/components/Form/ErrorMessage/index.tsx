import Tippy from '@tippyjs/react';
import { AiFillExclamationCircle } from 'react-icons/ai';

import c from './style.module.scss';

const ErrorMessage: React.FC<{ error: string }> = (p) => {
  if (!p.error) {
    return null;
  }

  return (
    <div className={c['error-icon-container']}>
      <Tippy content={p.error} placement="right-end">
        <span>
          <AiFillExclamationCircle className={c['error-icon']} />
        </span>
      </Tippy>
    </div>
  );
};

export default ErrorMessage;
