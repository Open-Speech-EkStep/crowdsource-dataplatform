import { useState } from 'react';

import classnames from 'classnames';
import { useTranslation } from 'next-i18next';

import Button from 'components/Button';

import styles from './Switch.module.scss';

interface SwitchProps {
  optionOne: string;
  optionTwo: string;
  toggleSwitch: (option: any) => void;
}

const Switch = ({ optionOne, optionTwo, toggleSwitch }: SwitchProps) => {
  const { t } = useTranslation();
  const [activeOption, setActiveOption] = useState(optionOne);

  const handleToggleSwitch = (option: string) => {
    setActiveOption(option);
    toggleSwitch(option);
  };

  return (
    <div
      data-testid="Switch"
      className={`${styles.root} d-flex align-items-center rounded-20 text-primary-40`}
    >
      <Button
        variant="normal"
        className={classnames(`${styles.option} flex-fill px-2 rounded-12`, {
          [`${styles.activeOption} text-light bg-primary`]: activeOption === optionOne,
        })}
        onClick={() => handleToggleSwitch(optionOne)}
      >
        {t(optionOne)}
      </Button>
      <Button
        variant="normal"
        className={classnames(`${styles.option} flex-fill px-2 rounded-12`, {
          [`${styles.activeOption} text-light bg-primary`]: activeOption === optionTwo,
        })}
        onClick={() => handleToggleSwitch(optionTwo)}
      >
        {t(optionTwo)}
      </Button>
    </div>
  );
};

export default Switch;
