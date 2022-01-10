import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';

import TextEditArea from 'components/TextEditArea';
import { TEXT_INPUT_ERROR_CONFIG } from 'constants/Keyboard';
import nodeConfig from 'constants/nodeConfig';
import type { InitiativeType } from 'types/InitiativeType';
import AutoValidation from 'utils/validations';

interface ValidateTextAreaProps {
  initiative: InitiativeType;
  fromLanguage: string | null;
  toLanguage: string | null;
  text: string;
  textAreaLabel: string;
  setHasError: (value: boolean) => void;
  updateText: Function;
  validate: boolean;
  closeKeyboard: boolean;
}

const ValidateTextArea: FunctionComponent<ValidateTextAreaProps> = ({
  initiative,
  fromLanguage,
  toLanguage,
  text,
  textAreaLabel,
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
      !AutoValidation[initiative](`${fromLanguage}-${toLanguage}`, text, inputText)
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
    <TextEditArea
      id="editText"
      isTextareaDisabled={false}
      language={toLanguage ?? ''}
      initiative={initiative}
      setTextValue={onChangeText}
      textValue={text}
      label={textAreaLabel}
      onError={setError}
      validationError={validationError}
      closeKeyboard={closeKeyboard}
    />
  );
};

export default ValidateTextArea;
