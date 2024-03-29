import { useEffect } from 'react';

import Button from 'components/Button';

import styles from './DashboardNotification.module.scss';

interface DashboardNotificationProps {
  text: string;
  buttonLabel: string;
  onClick: () => any;
}

const DashboardNotification = ({ text, buttonLabel, onClick }: DashboardNotificationProps) => {
  useEffect(() => {
    document.getElementById('float')!!.style.width = '100%';
  }, []);

  return (
    <div
      className={`${styles.root} d-flex mt-3 mt-xl-0 flex-column flex-md-row justify-content-md-between align-items-center text-center text-md-start p-5 rounded-12 bg-primary`}
    >
      <span className="text-light display-4">{text}</span>
      <Button className="ms-md-5 mt-5 mt-md-0" variant="secondary" onClick={onClick}>
        {buttonLabel}
      </Button>
    </div>
  );
};

export default DashboardNotification;
