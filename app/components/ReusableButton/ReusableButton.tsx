import React from 'react';
import styles from './ReusableButton.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type ButtonSize = 'large' | 'medium' | 'normal' | 'small';

interface Props {
  title: string;
  size?: ButtonSize;
  onClick?: () => void;
  img?: string;
  imgHeight?: number;
  imgWidth?: number;
  deleteButton?: boolean;
  link?: string;
}

const ReusableButton: React.FC<Props> = ({
  title,
  size = 'large',
  onClick,
  img,
  imgHeight = 12,
  imgWidth = 12,
  deleteButton = false,
  link
}) => {
  const router = useRouter();

  let sizeClass = styles.largeSize;

  if (size === 'normal') sizeClass = styles.normalSize;
  if (size === 'medium') sizeClass = styles.mediumSize;
  if (size === 'small') sizeClass = styles.smallSize;


  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick();
    if (link) router.push(link);
  };



  return (
    <button
      className={`${styles.buttonBase} ${sizeClass}  ${deleteButton && styles.deleteStyle}`}
      onClick={handleClick}
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
