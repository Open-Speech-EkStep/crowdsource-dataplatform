import { useRef } from 'react';

import { useTranslation } from 'next-i18next';
import Draggable from 'react-draggable';
import Keyboard from 'react-simple-keyboard';

import styles from './TextEditArea.module.scss';

interface VirtualKeyboardProps {
  language: string;
  keyBoardRef: Function;
  setShowKeyboard: Function;
  onChange: Function;
  onKeyPress: Function;
  layoutName: string;
  layout: Record<string, Array<string>>;
}

const VirtualKeyboard = ({
  language,
  setShowKeyboard,
  onChange,
  onKeyPress,
  layoutName,
  layout,
  keyBoardRef,
}: VirtualKeyboardProps) => {
  const { t } = useTranslation();

  const nodeRef = useRef(null);

  return (
    <Draggable bounds="main" nodeRef={nodeRef}>
      <div ref={nodeRef} data-testid="virtual-keyboard" className={`${styles.keyboard} d-none d-md-block`}>
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
  );
};

export default VirtualKeyboard;
