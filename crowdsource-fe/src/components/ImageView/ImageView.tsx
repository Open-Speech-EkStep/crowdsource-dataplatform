import type { FunctionComponent } from 'react';
import { Fragment, useState } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'react-bootstrap/Image';

import Button from 'components/Button';
import Modal from 'components/Modal';
import nodeConfig from 'constants/nodeConfig';

interface ImageViewProps {
  imageUrl: string;
}

const ImageView: FunctionComponent<ImageViewProps> = ({ imageUrl }) => {
  const { t } = useTranslation();
  const [viewExpand, setViewExpand] = useState(false);

  return (
    <Fragment>
      <Image alt="OCR Image Data" src={nodeConfig.cdnUrl + '/' + imageUrl} />
      <Button
        onClick={() => {
          setViewExpand(true);
        }}
      >
        {t('expandViewText')}
      </Button>
      {viewExpand && (
        <Modal
          data-testid="expandedView"
          show={true}
          onHide={() => {
            setViewExpand(false);
          }}
        >
          <Image alt="OCR Image Data" src={nodeConfig.cdnUrl + '/' + imageUrl} />
        </Modal>
      )}
    </Fragment>
  );
};

export default ImageView;
