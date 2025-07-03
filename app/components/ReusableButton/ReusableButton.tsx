import React from 'react';
import styles from './ReusableButton.module.scss';

type ButtonSize = 'large' | 'normal' | 'small';

interface Props {
  title: string;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
}

const ReusableButton: React.FC<Props> = ({
  title,
  size = 'large',
  onClick,
  disabled = false,
}) => {
    
  let sizeClass = styles.largeSize;

  if (size === 'normal') sizeClass = styles.normalSize;
  if (size === 'small') sizeClass = styles.smallSize;

  return (
    <button
      className={`${styles.buttonBase} ${sizeClass} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default ReusableButton;
