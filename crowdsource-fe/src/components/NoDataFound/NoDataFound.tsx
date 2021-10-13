import Container from 'react-bootstrap/Container';

import Button from 'components/Button';
import Link from 'components/Link';

interface NoDataFoundProps {
  url: string;
  initiative: string;
  language: string;
}

const NoDataFound = ({ url, initiative, language }: NoDataFoundProps) => {
  return (
    <Container fluid="lg" className="mt-5 text-center">
      <div className="d-flex flex-column align-items-center">
        <h1>Thank you for your enthusiasm to validate the recordings.</h1>
        <p className="mt-9">{`We do not have any data in ${language} language. Please try again later.`}</p>
        <Link href={url} passHref>
          <Button className="mt-9" as="a" variant="primary">{`Back to ${initiative} India Home`}</Button>
        </Link>
      </div>
    </Container>
  );
};

export default NoDataFound;
