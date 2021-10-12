import React, { useEffect, useRef, useState } from 'react';

import Form from 'react-bootstrap/Form';
import Draggable from 'react-draggable';
import Keyboard from 'react-simple-keyboard';

import IconTextButton from 'components/IconTextButton';
import { KeyboardLanguageLayout } from 'constants/Keyboard';
import { verifyLanguage } from 'utils/utils';

import styles from './TextEditArea.module.scss';
import TextErrorMessage from './TextErrorMessage';

// eslint-disable-next-line import/no-internal-modules
import 'react-simple-keyboard/build/css/index.css';

interface TextEditAreaProps {
  language: string;
  initiative: string;
  setTextValue: (value: string) => void;
  textValue?: string;
}

const TextEditArea = ({ language, initiative, setTextValue, textValue }: TextEditAreaProps) => {
  const [input, setInput] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [layout, setLayout] = useState<any>();
  const [layoutName, setLayoutName] = useState<string>('default');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const drag = useRef<any>();

  let keyboard: any;

  useEffect(() => {
    setLayout(KeyboardLanguageLayout[language]);
    setInput(textValue ?? '');
  }, [language, textValue]);

  const onChange = (input: any) => {
    setInput(input);
    const error = verifyLanguage(input, initiative, language);
    handleError(error);
  };

  const handleError = (error: any) => {
    if (error && error.type === 'language') {
      setShowError(true);
      setErrorMessage('Please type in your chosen language');
    } else if (error && error.type === 'symbol') {
      setShowError(true);
      setErrorMessage('Special characters are not allowed');
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
    <div>
      <div
        data-testid="TextEditArea"
        className={`${styles.addText} rounded-8 border border-2 border-primary bg-light p-4`}
      >
        <Form.Group controlId="textarea">
          <Form.Label className="display-6">Add Text ({language})</Form.Label>
          <Form.Control
            as="textarea"
            value={input}
            onFocus={() => {
              setShowKeyboard(true);
            }}
            onChange={onChangeInput}
            placeholder="Start typing here..."
            className={`${styles.textarea} border-0 p-0 display-3`}
          />
        </Form.Group>
        <IconTextButton
          icon="report.svg"
          textDesktop=""
          onClick={() => setShowKeyboard(true)}
          altText="keyboardBtn"
        />
      </div>
      {showError ? <TextErrorMessage message={errorMessage} /> : null}
      {showKeyboard ? (
        <Draggable ref={drag} bounds="body">
          <div data-testid="virtual-keyboard" className={styles.keyboard}>
            <span>{language}</span>
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
    </div>
  );
};

export default TextEditArea;
