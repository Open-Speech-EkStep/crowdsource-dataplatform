import Image from 'next/image';

import nodeConfig from 'constants/nodeConfig';

interface ImageBasePathProps {
  src: string;
  width: string;
  height: string;
  alt: string;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager' | undefined;
  placeholder?: 'blur' | 'empty' | undefined;
  blurDataURL?: string;
}

const ImageBasePath = ({ src, alt, ...rest }: ImageBasePathProps) => {
  return <Image {...rest} src={`${nodeConfig.contextRoot}${src}`} alt={alt} />;
};

export default ImageBasePath;
