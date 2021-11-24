import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Form from 'react-bootstrap/Form';
import Draggable from 'react-draggable';
import Keyboard from 'react-simple-keyboard';

import Button from 'components/Button';
import ImageBasePath from 'components/ImageBasePath';
import { KeyboardLanguageLayout } from 'constants/Keyboard';
import type { InitiativeType } from 'types/InitiativeType';
import { findInputError } from 'utils/utils';

import styles from './TextEditArea.module.scss';
import TextErrorMessage from './TextErrorMessage';

import 'react-simple-keyboard/build/css/index.css';

interface TextEditAreaProps {
  id: string;
  language: string;
  initiative: InitiativeType;
  setTextValue: (value: string) => void;
  textValue?: string;
  isTextareaDisabled: boolean;
  roundedLeft?: boolean;
  roundedRight?: boolean;
  readOnly?: boolean;
  readOnlyActive?: boolean;
  label: string;
  onError: (value: boolean) => void;
  showTip?: boolean;
  closeKeyboard?: boolean;
  readonlyAllBorders?: boolean;
  validationError?: { errorTextKey: string };
}

const TextEditArea = ({
  id,
  language,
  isTextareaDisabled,
  initiative,
  setTextValue,
  textValue,
  roundedLeft = false,
  roundedRight = false,
  readOnly = false,
  readOnlyActive = false,
  label,
  onError,
  showTip = false,
  closeKeyboard,
  readonlyAllBorders = false,
  validationError,
}: TextEditAreaProps) => {
  const { t } = useTranslation();
  const [input, setInput] = useState(textValue);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [layout, setLayout] = useState<any>();
  const [isUsingPhysicalKeyboard, setIsUsingPhysicalKeyboard] = useState(false);
  const [layoutName, setLayoutName] = useState<string>('default');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const nodeRef = useRef(null);
  const chromeExtension = useRef<any>(null);
  let keyboard: any = useRef();

  const keyBoardRef = useCallback(
    node => {
      if (node !== null) {
        node.setInput(input);
        keyboard.current = node;
      }
    },
    [input]
  );

  useEffect(() => {
    chromeExtension.current = document.getElementById('GOOGLE_INPUT_CHEXT_FLAG');
    if (!textValue) {
      setShowError(false);
    }
    setLayout(KeyboardLanguageLayout[language]);
    setInput(textValue ?? '');
  }, [language, textValue]);

  useEffect(() => {
    setShowKeyboard(false);
  }, [closeKeyboard]);

  const toggleError = (state: boolean) => {
    setShowError(state);
    onError(state);
  };

  const handleError = (input: string) => {
    const error = findInputError(input, initiative, language);
    if (error) {
      setErrorMessage(t(error.errorTextKey));
      toggleError(true);
    } else if (validationError) {
      setErrorMessage(t(validationError.errorTextKey));
      setShowError(true);
      onError(false);
    } else toggleError(false);
  };

  useEffect(() => {
    handleError(input || '');
  }, [input]);

  const onChange = (input: any) => {
    setIsUsingPhysicalKeyboard(false);
    setTextValue(input);
    setInput(input);
    handleError(input);
  };

  const onKeyPress = (button: any) => {
    if (['{lock}', '{shift}'].includes(button)) handleShiftButton();
  };

  const handleShiftButton = () => {
    setLayoutName(layoutName === 'default' ? 'shift' : 'default');
  };

  const onChangeInput = (event: any) => {
    setIsUsingPhysicalKeyboard(true);
    const input = event.target.value;
    handleError(input);
    setTextValue(input);
    setInput(input);
    keyboard && keyboard.current && keyboard.current.setInput(input);
    if (!input) {
      setShowKeyboard(false);
    }
  };

  return (
    <Fragment>
      <div
        data-testid="TextEditArea"
        className={classNames('position-relative p-4', styles.addText, {
          [styles.addTextDisabled]: isTextareaDisabled,
          [styles.roundedLeft]: roundedLeft,
          [styles.roundedRight]: roundedRight,
          ['rounded-8']: !roundedLeft && !roundedRight,
          [styles.readOnly]: readOnly,
          [styles.readOnlyActive]: readOnlyActive,
          ['border border-2 border-primary-10']: readonlyAllBorders,
        })}
      >
        {showTip && <span className={`${styles.tip} position-absolute`} />}
        <div className={`${isTextareaDisabled && `${styles.textAreaDisabled}`}`}>
          <Form.Group controlId={id}>
            <Form.Label className={`${styles.textareaLabel} display-6`}>{label}</Form.Label>
            <Form.Control
              as="textarea"
              disabled={isTextareaDisabled}
              value={input}
              onFocus={() => {
                if (!isUsingPhysicalKeyboard && !chromeExtension.current && !readOnly && !readOnlyActive) {
                  setShowKeyboard(true);
                }
              }}
              onChange={onChangeInput}
              readOnly={readOnly}
              placeholder={t('typingPlaceholder')}
              className={`${styles.textarea} border-0 p-0 display-3`}
            />
          </Form.Group>
          {!(readOnly || readOnlyActive) && (
            <div className={`${styles.keyboardIcon} d-none  d-md-block  position-absolute`}>
              <Button
                disabled={isTextareaDisabled}
                variant="normal"
                onClick={() => setShowKeyboard(true)}
                className="d-flex"
              >
                <ImageBasePath src="/images/keyboard_icon.svg" width="24" height="24" alt="keyboardBtn" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {showError ? <TextErrorMessage message={errorMessage} /> : null}
      {showKeyboard ? (
        <Draggable bounds="main" nodeRef={nodeRef}>
          <div
            ref={nodeRef}
            data-testid="virtual-keyboard"
            className={`${styles.keyboard} d-none d-md-block`}
          >
            <div className="pb-2">
              <span>{t(language.toLowerCase())}</span>
              <span
                data-testid="close-keyboard"
                className={styles.crossIcon}
                onClick={() => {
                  setShowKeyboard(false);
                }}
                aria-hidden="true"
              >
                X
              </span>
            </div>

            <Keyboard
              keyboardRef={keyBoardRef}
              onChange={onChange}
              onKeyPress={onKeyPress}
              layoutName={layoutName}
              layout={layout}
            />
          </div>
        </Draggable>
      ) : null}
    </Fragment>
  );
};

export default TextEditArea;
