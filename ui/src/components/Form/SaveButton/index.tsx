import classNames from 'classnames/bind';

import style from './style.module.scss';

const c = classNames.bind(style);

export interface Props {
  buttonText?: string;
  className?: string;
  isSubmitting: boolean;
  isUploading?: boolean;
}

const SaveButton: React.FC<Props> = (p) => {
  const text = p.buttonText || 'Save';
  const containerClass = p.isSubmitting || p?.isUploading ? 'disable-button' : 'save-button';

  return (
    <>
      <button
        className={c(containerClass, p?.className)}
        type="submit"
        disabled={p.isSubmitting || p?.isUploading}
      >
        <div className={c({ 'saving-in': p.isSubmitting })}>
          {p.isSubmitting ? `${text}ing` : text}
          <span />
        </div>
      </button>
    </>
  );
};

export default SaveButton;
