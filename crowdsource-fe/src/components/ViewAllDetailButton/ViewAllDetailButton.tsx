import { useTranslation } from 'next-i18next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'components/Button';
import Link from 'components/Link';
import routePaths from 'constants/routePaths';

interface ViewAllDetailButtonProps {
  initiative: string;
}

const ViewAllDetailButton = ({ initiative }: ViewAllDetailButtonProps) => {
  const { t } = useTranslation();

  return (
    <Row className="mb-9 mt-md-12">
      <Col className="d-flex justify-content-center">
        <Link href={routePaths[`${initiative}IndiaDashboard`]} passHref>
          <Button data-testid="StartParticipating" as="a">
            {t('viewAllDetail')}
          </Button>
        </Link>
      </Col>
    </Row>
  );
};

export default ViewAllDetailButton;
