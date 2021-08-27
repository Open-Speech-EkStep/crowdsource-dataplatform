import type { ReactNode } from 'react';

import Container from 'react-bootstrap/Container';

interface BodyProps {
  children: ReactNode;
}

const Body = ({ children }: BodyProps) => {
  return (
    <Container as="main" data-testid="Body" role="main" fluid="xxl" className="my-md-4">
      {children}
    </Container>
  );
};

export default Body;
