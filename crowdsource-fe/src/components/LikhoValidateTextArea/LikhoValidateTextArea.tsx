import type { FunctionComponent } from 'react';
import { useState } from 'react';

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
}) => {
  const [validationError, setValidationError] = useState<typeof TEXT_INPUT_ERROR_CONFIG.validation>();
  const [inputText, setInputText] = useState<string>();

  const autoValidationEnabled = nodeConfig.autoValidation && validate;

  const onChangeText = (inputText: string) => {
    if (
      inputText &&
      autoValidationEnabled &&
      !AutoValidation[initiative](`${fromLanguage || ''}-${toLanguage || ''}`, text, inputText)
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
    />
  );
};

export default ValidateTextArea;
