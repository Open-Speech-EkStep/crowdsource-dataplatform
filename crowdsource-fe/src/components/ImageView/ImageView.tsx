import type { FunctionComponent } from 'react';
import { Fragment, useState } from 'react';

import { useTranslation } from 'next-i18next';

import Button from 'components/Button';
import Modal from 'components/Modal';
import nodeConfig from 'constants/nodeConfig';

import styles from './ImageView.module.scss';

interface ImageViewProps {
  imageUrl: string;
}

const ImageView: FunctionComponent<ImageViewProps> = ({ imageUrl }) => {
  const { t } = useTranslation();
  const [viewExpand, setViewExpand] = useState(false);

  const url = nodeConfig.cdnUrl + '/' + imageUrl;

  return (
    <Fragment>
      <div className="d-flex flex-column">
        <div
          className={`${styles.bg} bg-light p-8 rounded-8 border border-1 border-primary-20 position-relative`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="img-fluid" src={url} alt="OCR Data" />
        </div>
        <Button
          className="display-6 ms-auto mt-1 text-primary-60"
          variant="normal"
          onClick={() => {
            setViewExpand(true);
          }}
        >
          {t('expandViewText')}
        </Button>
      </div>
      {viewExpand && (
        <Modal
          data-testid="expandedView"
          show={true}
          onHide={() => {
            setViewExpand(false);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="img-fluid" src={url} alt="OCR Data" />
        </Modal>
      )}
    </Fragment>
  );
};

export default ImageView;
