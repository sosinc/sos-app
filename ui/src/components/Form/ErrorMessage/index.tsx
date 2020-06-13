import { AiFillExclamationCircle } from 'react-icons/ai';
import c from './style.module.scss';

const ErrorMessage: React.FC<{ error: string }> = (p) => {
  if (!p.error) {
    return null;
  }

  return <AiFillExclamationCircle className={c['error-icon']} title={p.error} />;
};

export default ErrorMessage;
