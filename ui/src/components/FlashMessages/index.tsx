import c from 'classnames';
import { MdCheckCircle, MdClose, MdError } from 'react-icons/md';
import { FlashMessage } from 'src/duck/flashMessages';

import s from './style.module.scss';

interface Props {
  messages: FlashMessage[];
  onClose: (id: string) => void;
}

const Message: React.FC<{ message: FlashMessage } & Pick<Props, 'onClose'>> = (p) => {
  const Icon =
    p.message.type === 'success' ? (
      <MdCheckCircle className={c(s['flash-icon'])} />
    ) : (
      <MdError className={c(s['flash-icon'])} />
    );

  return (
    <div className={s['message-container']}>
      <div className={c(s['status-icon'], s[p.message.type])}>{Icon}</div>

      <div className={s.message}>
        <div className={s.title}>{p.message.title}</div>
        <div className={s.body}>{p.message.body}</div>
      </div>

      <MdClose className={s['close-icon']} onClick={() => p.onClose(p.message.id)} title="Close" />
    </div>
  );
};

const FlashMessages: React.FC<Props> = (p) => {
  const messages = p.messages.map((m) => <Message key={m.id} message={m} onClose={p.onClose} />);

  return <div className={s.container}>{messages}</div>;
};

export default FlashMessages;
