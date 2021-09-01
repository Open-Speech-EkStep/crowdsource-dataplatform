import { ReactNode } from 'react';

interface PageBackgroundProps {
  children: ReactNode;
  image: string;
  size?: string;
}

const PageBackground = ({ children, image, size = 'cover' }: PageBackgroundProps) => {
  const style = {
    backgroundImage: `url(/images/${image})`,
    backgroundSize: size,
    backgroundRepeat: 'no-repeat',
  };

  return (
    <section data-testid="PageBackground" style={style}>
      {children}
    </section>
  );
};

export default PageBackground;
