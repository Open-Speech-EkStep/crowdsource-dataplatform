import type { FunctionComponent } from 'react';
import { useState, Fragment } from 'react';

import TextEditArea from 'components/TextEditArea';
import { TEXT_INPUT_ERROR_CONFIG } from 'constants/Keyboard';
import nodeConfig from 'constants/nodeConfig';
import type { InitiativeType } from 'types/InitiativeType';
import AutoValidation from 'utils/validations';

import styles from './EditTextBlock.module.scss';

interface EditTextBlockProps {
  initiative: InitiativeType;
  fromLanguage: string | null;
  toLanguage: string | null;
  text: string;
  leftTextAreaLabel: string;
  rightTextAreaLabel: string;
  setHasError: (value: boolean) => void;
  updateText: Function;
  validate: boolean;
}

const EditTextBlock: FunctionComponent<EditTextBlockProps> = ({
  initiative,
  fromLanguage,
  toLanguage,
  text,
  leftTextAreaLabel,
  rightTextAreaLabel,
  setHasError,
  updateText,
  validate,
}) => {
  const [validationError, setValidationError] = useState<typeof TEXT_INPUT_ERROR_CONFIG.validation>();
  const [inputText, setInputText] = useState<string>();

  const autoValidationEnabled = nodeConfig.autoValidation && validate;

  const onChangeText = (inputText: string) => {
    if (
      inputText &&
      autoValidationEnabled &&
      !AutoValidation[initiative](fromLanguage || '', text, inputText)
    ) {
      setValidationError(TEXT_INPUT_ERROR_CONFIG.validation);
    } else setValidationError(undefined);

    setInputText(inputText);
    updateText(inputText);
  };

  const setError = (value: boolean) => {
    if (text === inputText) {
      setHasError(true);
    } else setHasError(value);
  };

  return (
    <Fragment>
      <div className={styles.textarea}>
        <TextEditArea
          id="originalText"
          isTextareaDisabled={false}
          language={fromLanguage || ''}
          initiative={initiative}
          setTextValue={() => {}}
          textValue={text}
          roundedLeft
          readOnly
          label={leftTextAreaLabel}
          onError={() => {}}
        />
      </div>
      <div className={styles.textarea}>
        <TextEditArea
          id="editText"
          isTextareaDisabled={false}
          language={toLanguage || ''}
          initiative={initiative}
          setTextValue={onChangeText}
          textValue={text}
          roundedRight
          label={rightTextAreaLabel}
          onError={setError}
          validationError={validationError}
          showTip
        />
      </div>
    </Fragment>
  );
};

export default EditTextBlock;
