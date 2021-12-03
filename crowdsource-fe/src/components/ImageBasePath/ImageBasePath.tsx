import Image from 'next/image';

import nodeConfig from 'constants/nodeConfig';

interface ImageBasePathProps {
  src: string;
  width: string;
  height: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

const ImageBasePath = ({ src, alt, ...rest }: ImageBasePathProps) => {
  return <Image {...rest} src={`${nodeConfig.contextRoot}${src}`} alt={alt} />;
};

export default ImageBasePath;
