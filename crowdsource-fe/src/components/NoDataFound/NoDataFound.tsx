import Button from 'components/Button';
import Link from 'components/Link';

import styles from './NoDataFound.module.scss';

interface NoDataFoundProps {
  url: string;
  title?: string;
  text?: string;
  buttonLabel: string;
}

const NoDataFound = ({ url, title, text, buttonLabel }: NoDataFoundProps) => {
  return (
    <div
      className={`${styles.root} d-flex flex-column align-items-center justify-content-center text-center mx-auto p-5`}
    >
      {title && <h4 className="mb-5">{title}</h4>}
      {text && <p className="display-3">{text}</p>}
      <Link href={url} passHref>
        <Button className="mt-8" as="a" variant="primary">
          {buttonLabel}
        </Button>
      </Link>
    </div>
  );
};

export default NoDataFound;
