import s from './style.module.scss';

const StatusRowHeader: React.FC<{ onClose: () => void; onSubmit: () => void }> = (p) => {
  return (
    <div className={s['add-todays-status']}>
      <div className={s['status-header-container']}>
        <span className={s['add-title']}> Add Today's Status</span>
        <div className={s['add-buttons']}>
          <span className={s['cancel-button']} onClick={p.onClose}>
            Cancel
          </span>
          <span className={s['slide-bar-button']} onClick={p.onSubmit}>
            Save
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusRowHeader;
