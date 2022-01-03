import React from 'react';

import ImageBasePath from 'components/ImageBasePath';

interface InfoMessageProps {
  text: string;
}

const InfoMessage = ({ text }: InfoMessageProps) => {
  return (
    <div
      data-testid="InfoMessage"
      className="rounded-20 border border-1 border-primary d-flex align-items-center px-2 py-2 bg-light fst-italic text-primary "
    >
      <div className="flex-shrink-0 d-flex">
        <ImageBasePath src="/images/info_icon.svg" width="24" height="24" alt="Info Icon" />
      </div>

      <span className="ms-2">{text}</span>
    </div>
  );
};

export default InfoMessage;
