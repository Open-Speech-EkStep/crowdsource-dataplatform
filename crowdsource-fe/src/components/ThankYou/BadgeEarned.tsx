import Image from 'next/image';

import ContributionDetails from 'components/ContributionDetails';
import Link from 'components/Link';
import SocialShareIcons from 'components/SocialShareIcons';
import TwoColumn from 'components/TwoColumn';

import styles from './ThankYou.module.scss';

const BadgeImage = () => (
  <div className={`${styles.medal} mx-auto`}>
    <Image
      src={`/images/en/badges/en_bolo_bronze_contribute.svg`}
      width="140"
      height="180"
      alt={`Bronze Badge english`}
    />
  </div>
);

const ShareOn = () => (
  <div
    className={`${styles.socialShare} d-inline-flex align-items-center border border-1 border-primary px-4`}
  >
    <span className="me-3">Share on</span>
    <SocialShareIcons />
  </div>
);

const DownloadAndShare = () => (
  <div className="d-flex flex-column align-items-center flex-md-row align-items-md-baseline">
    <Link href="http://test.com">
      <a
        className={`${styles.download} d-inline-flex align-items-center border border-1 border-primary px-4`}
      >
        Download
        <span className="d-flex ms-2">
          <Image src="/images/download_icon.svg" width="12" height="15" alt="download-image" />
        </span>
      </a>
    </Link>
    <div className="mt-4 mt-md-0 ms-md-4">
      <ShareOn />
    </div>
  </div>
);

const BadgeEarned = () => {
  return (
    <ContributionDetails
      top={
        <TwoColumn
          left={<BadgeImage />}
          right={
            <div className="text-center text-md-start">
              <h4 className="px-8 px-md-0">
                You’ve earned your Suno India{' '}
                <span className="text-strong-warning">Bronze Bhasha Samarthak</span> badge.
              </h4>
              <p className="display-3 mt-5 mt-6">
                Transcribed <strong>5 sentence(s)</strong> in Hindi
              </p>
            </div>
          }
          withSep={false}
        />
      }
      bottom={<DownloadAndShare />}
    />
  );
};

export default BadgeEarned;
