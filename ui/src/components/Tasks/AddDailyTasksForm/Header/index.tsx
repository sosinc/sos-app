import s from './style.module.scss';

const StatusRowHeader: React.FC<{
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}> = (p) => {
  const saveButton = p.isSubmitting ? (
    <div className={s['slide-bar-button']}>
      <span className={s['saving-in']}>
        Saving
        <span />
      </span>
    </div>
  ) : (
    <span className={s['slide-bar-button']} onClick={p.onSubmit}>
      Save
    </span>
  );

  return (
    <div className={s['add-todays-status']}>
      <div className={s['status-header-container']}>
        <span className={s['add-title']}> Add Today's Status</span>
        <div className={s['add-buttons']}>
          <span className={s['cancel-button']} onClick={p.onClose}>
            Cancel
          </span>
          {saveButton}
        </div>
      </div>
    </div>
  );
};

export default StatusRowHeader;
