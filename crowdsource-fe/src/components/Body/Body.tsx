import type { ReactNode } from 'react';

interface BodyProps {
  children: ReactNode;
}

const Body = ({ children }: BodyProps) => {
  return (
    <main data-testid="Body" role="main" className="container-xxl my-md-4">
      {children}
    </main>
  );
};

export default Body;
