import { clsx } from 'clsx';
import Image from 'next/image';
import styles from './avatar.module.scss';

export interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 40, className }: AvatarProps) {
  if (!src) {
    const initial = alt.charAt(0).toUpperCase();
    return (
      <div
        className={clsx(styles.avatarFallback, className)}
        style={{ width: size, height: size, fontSize: size * 0.45 }}
        aria-label={alt}
        role="img"
      >
        {initial}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={clsx(styles.avatar, className)}
    />
  );
}
