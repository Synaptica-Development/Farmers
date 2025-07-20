import React from 'react';
import styles from './ReusableButton.module.scss';
import Image from 'next/image';

type ButtonSize = 'large' | 'medium' | 'normal' | 'small';

interface Props {
  title: string;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  img?: string;
  imgHeight?: number;
  imgWidth?: number;
  deleteButton?: boolean;
}

const ReusableButton: React.FC<Props> = ({
  title,
  size = 'large',
  onClick,
  disabled = false,
  img,
  imgHeight = 12,
  imgWidth = 12,
  deleteButton = false,
}) => {

  let sizeClass = styles.largeSize;

  if (size === 'normal') sizeClass = styles.normalSize;
  if (size === 'medium') sizeClass = styles.mediumSize;
  if (size === 'small') sizeClass = styles.smallSize;

  return (
    <button
      className={`${styles.buttonBase} ${sizeClass} ${disabled && styles.disabled} ${deleteButton && styles.deleteStyle}`}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
      {img && (
        <Image
          src={`${img}.svg`}
          alt='icon'
          width={imgWidth}
          height={imgHeight}
        />
      )}
    </button>
  );
};

export default ReusableButton;
