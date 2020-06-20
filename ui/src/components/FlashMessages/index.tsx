import { MdClose, MdError } from 'react-icons/md';
import { FlashMessage } from 'src/duck/flashMessages';

import s from './style.module.scss';

interface Props {
  messages: FlashMessage[];
  onClose: (id: string) => void;
}

const Message: React.FC<{ message: FlashMessage } & Pick<Props, 'onClose'>> = (p) => (
  <div className={s['message-container']}>
    <div className={s['status-icon']}>
      <MdError />
    </div>

    <div className={s.message}>
      <div className={s.title}>{p.message.title}</div>
      <div className={s.body}>{p.message.body}</div>
    </div>

    <MdClose className={s['close-icon']} onClick={() => p.onClose(p.message.id)} />
  </div>
);

const FlashMessages: React.FC<Props> = (p) => {
  const messages = p.messages.map((m) => <Message key={m.id} message={m} onClose={p.onClose} />);

  return <div className={s.container}>{messages}</div>;
};

export default FlashMessages;
