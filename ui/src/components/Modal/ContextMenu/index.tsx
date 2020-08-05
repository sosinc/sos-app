import Tippy from '@tippyjs/react';

interface Props {
  onClose: () => void;
  content: React.ReactElement;
  isOpen: boolean;
  Header?: React.FC<{ onClose: () => void }>;
  className?: string;
  tippyClassName?: string;
}

const ContextMenu: React.FC<Props> = (p) => {
  if (!p.isOpen) {
    return null;
  }
  return (
    <div className={p.className}>
      <Tippy
        content={p.content}
        className={p.tippyClassName}
        interactive={true}
        visible={p.isOpen}
        onClickOutside={p.onClose}
        maxWidth="none"
        placement="top"
        arrow={true}
      >
        <div>{p.children}</div>
      </Tippy>
    </div>
  );
};

export default ContextMenu;
