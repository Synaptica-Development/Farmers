'use client';

import styles from './ConfirmPopup.module.scss';

interface ConfirmPopupProps {
  title: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmPopup = ({
  title,
  confirmText = 'Yes',
  cancelText = 'No',
  onConfirm,
  onCancel,
}: ConfirmPopupProps) => {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div className={styles.buttons}>
          <button onClick={onConfirm} className={styles.confirmBtn}>
            {confirmText}
          </button>
          <button onClick={onCancel} className={styles.cancelBtn}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
