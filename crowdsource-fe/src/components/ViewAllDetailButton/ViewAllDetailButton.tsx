import { useTranslation } from 'next-i18next';

import Button from 'components/Button';
import Link from 'components/Link';
import routePaths from 'constants/routePaths';

interface ViewAllDetailButtonProps {
  initiative: string;
}

const ViewAllDetailButton = ({ initiative }: ViewAllDetailButtonProps) => {
  const { t } = useTranslation();

  return (
    <div className="d-flex justify-content-center">
      <Link href={routePaths[`${initiative}InitiativeDashboard`]} passHref>
        <Button data-testid="ViewAllDetailButton" as="a">
          {t('viewAllDetail')}
        </Button>
      </Link>
    </div>
  );
};

export default ViewAllDetailButton;
