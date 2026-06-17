import { clsx } from 'clsx';

interface MockImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  quality?: number;
  [key: string]: unknown;
}

const MockNextImage = (props: MockImageProps) => {
  const { src, alt, width, height, className, style, ...rest } = props;
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={clsx(className)}
      style={style}
      {...rest}
    />
  );
};

export default MockNextImage;
