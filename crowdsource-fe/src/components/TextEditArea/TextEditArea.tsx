import React, { Fragment, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Form from 'react-bootstrap/Form';
import Draggable from 'react-draggable';
import Keyboard from 'react-simple-keyboard';

import Button from 'components/Button';
import { KeyboardLanguageLayout } from 'constants/Keyboard';
import { verifyLanguage } from 'utils/utils';

import styles from './TextEditArea.module.scss';
import TextErrorMessage from './TextErrorMessage';

import 'react-simple-keyboard/build/css/index.css';

interface TextEditAreaProps {
  language: string;
  initiative: string;
  setTextValue: (value: string) => void;
  textValue?: string;
  isTextareaDisabled: boolean;
}

const TextEditArea = ({
  language,
  isTextareaDisabled,
  initiative,
  setTextValue,
  textValue,
}: TextEditAreaProps) => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [layout, setLayout] = useState<any>();
  const [isUsingPhysicalKeyboard, setIsUsingPhysicalKeyboard] = useState(false);
  const [layoutName, setLayoutName] = useState<string>('default');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const nodeRef = useRef(null);
  const chromeExtension = useRef<any>(null);

  let keyboard: any;

  useEffect(() => {
    chromeExtension.current = document.getElementById('GOOGLE_INPUT_CHEXT_FLAG');
    if (!textValue) {
      setShowError(false);
    }
    setLayout(KeyboardLanguageLayout[language]);
    setInput(textValue ?? '');
  }, [language, textValue]);

  const onChange = (input: any) => {
    setIsUsingPhysicalKeyboard(false);
    setInput(input);
    const error = verifyLanguage(input, initiative, language);
    handleError(error);
  };

  const handleError = (error: any) => {
    if (error && error.type === 'language') {
      setShowError(true);
      setErrorMessage(t('typeInChosenLanguage'));
    } else if (error && error.type === 'symbol') {
      setShowError(true);
      setErrorMessage(t('specialCharacters'));
    } else {
      setTextValue(input);
      setShowError(false);
    }
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
    const error = verifyLanguage(input, initiative, language);
    handleError(error);
    setTextValue(input);
    setInput(input);
    keyboard?.setInput(input);
    if (!input) {
      setShowKeyboard(false);
    }
  };

  return (
    <Fragment>
      <div
        data-testid="TextEditArea"
        className={`
          position-relative border border-2 border-primary
          ${styles.addText} ${
          isTextareaDisabled && `${styles.addTextDisabled} border border-2 border-primary-20`
        }
          ${showError && `${styles.addTextError} border border-2 border-danger`} rounded-8  bg-light p-4
        `}
      >
        <div className={`${isTextareaDisabled && `${styles.textAreaDisabled}`}`}>
          <Form.Group controlId="textarea">
            <Form.Label className={`${styles.textareaLabel} display-6`}>
              {t('addText')} ({t(language.toLowerCase())})
            </Form.Label>
            <Form.Control
              as="textarea"
              disabled={isTextareaDisabled}
              value={input}
              onFocus={() => {
                if (!isUsingPhysicalKeyboard && !chromeExtension.current) {
                  setShowKeyboard(true);
                }
              }}
              onChange={onChangeInput}
              placeholder={t('typingPlaceholder')}
              className={`${styles.textarea} border-0 p-0 display-3`}
            />
          </Form.Group>
          <div className={`${styles.keyboardIcon} d-none  d-md-block  position-absolute`}>
            <Button variant="normal" onClick={() => setShowKeyboard(true)} className="d-flex">
              <Image src="/images/keyboard_icon.svg" width="24" height="24" alt="keyboardBtn" />
            </Button>
          </div>
        </div>
      </div>
      {showError ? <TextErrorMessage message={errorMessage} /> : null}
      {showKeyboard ? (
        <Draggable bounds="body" nodeRef={nodeRef}>
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
              keyboardRef={(r: any) => (keyboard = r)}
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
