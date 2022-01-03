import type { FunctionComponent } from 'react';

import classnames from 'classnames';
import { useTranslation } from 'next-i18next';

import Button from 'components/Button';
import ImageBasePath from 'components/ImageBasePath';
import nodeConfig from 'constants/nodeConfig';

import styles from './ImageView.module.scss';

interface ImageViewProps {
  imageUrl: string;
  expandState: boolean;
  handleExpandView: (expandState: boolean) => void;
}

const ImageView: FunctionComponent<ImageViewProps> = ({ imageUrl, expandState, handleExpandView }) => {
  const { t } = useTranslation();

  const url = nodeConfig.cdnUrl + '/' + imageUrl;

  return (
    <div data-testid="ImageView" className="position-relative">
      {expandState && (
        <Button
          data-testid="CollapseView"
          variant="normal"
          className={`${styles.close} d-inline-flex position-absolute p-2 bg-light rounded-50 border border-1 border-primary-20`}
          onClick={() => handleExpandView(false)}
        >
          <ImageBasePath width="20" height="20" src="/images/close.svg" alt="Collapse" />
        </Button>
      )}
      <div
        className={classnames(
          `${styles.bg} bg-light p-3 rounded-8 border border-1 border-primary-20 position-relative overflow-auto`
        )}
      >
        {!expandState && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="img-fluid" src={url} alt="OCR Data" />
        )}
        {expandState && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="OCR Data Expanded" />
        )}
      </div>
      <div className={`${styles.expandText} d-flex justify-content-end`}>
        {!expandState && (
          <Button
            data-testid="ExpandView"
            className="display-6 ms-auto mt-1 text-primary-60"
            variant="normal"
            onClick={() => handleExpandView(true)}
          >
            {t('expandViewText')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageView;
