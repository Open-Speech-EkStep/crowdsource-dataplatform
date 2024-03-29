import type { FunctionComponent } from 'react';
import { useEffect, useState, Fragment } from 'react';

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
  closeKeyboard: boolean;
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
  closeKeyboard,
}) => {
  const [validationError, setValidationError] = useState<typeof TEXT_INPUT_ERROR_CONFIG.validation>();
  const [inputText, setInputText] = useState<string>(text);
  const [error, setError] = useState<Boolean>(false);

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

  useEffect(() => {
    if (!error && text !== inputText) setHasError(false);
    else {
      setHasError(true);
      setValidationError(undefined);
    }
  }, [error, inputText, setHasError, text]);

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
          closeKeyboard={closeKeyboard}
        />
      </div>
    </Fragment>
  );
};

export default EditTextBlock;
